"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { env } from "@/lib/env";
import { AdminUser } from "@/lib/models";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth";
import { clientKey, rateLimit } from "@/lib/ratelimit";
import { loginSchema } from "@/lib/validation";

type State = { error?: string; email?: string };

// Lazily-built hash so unknown emails cost the same time as wrong passwords.
let dummy: string | undefined;
const dummyHash = () => (dummy ??= bcrypt.hashSync("not-a-real-password", 12));
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60_000;
const GENERIC = "Incorrect email or password.";

export async function login(_p: State, fd: FormData): Promise<State> {
  if (!env.authConfigured) return { error: "Admin sign-in is not configured on this server.", email: String(fd.get("email") ?? "") };
  const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { error: GENERIC, email: String(fd.get("email") ?? "") };
  try {
    const who = await clientKey();
    if (!(await rateLimit("login-ip", who, 10, 900)).ok) return { error: "Too many attempts. Please wait 15 minutes.", email: String(fd.get("email") ?? "") };
    await connectDB();
    const user = await AdminUser.findOne({ email: parsed.data.email });
    const locked = user?.lockedUntil && user.lockedUntil.getTime() > Date.now();
    const match = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? dummyHash());
    if (!user || !user.active || locked || !match) {
      if (user && !locked) {
        user.failedLogins += 1;
        if (user.failedLogins >= MAX_FAILS) { user.lockedUntil = new Date(Date.now() + LOCK_MS); user.failedLogins = 0; }
        await user.save();
      }
      return { error: locked ? "This account is temporarily locked. Try again in 15 minutes." : GENERIC, email: String(fd.get("email") ?? "") };
    }
    user.failedLogins = 0; user.lockedUntil = undefined; user.lastLoginAt = new Date();
    await user.save();
    await setSessionCookie(String(user._id));
  } catch (e) {
    console.error("[login]", (e as Error).message);
    return { error: "Sign-in is unavailable right now. Please try again shortly.", email: String(fd.get("email") ?? "") };
  }
  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/admin/login");
}
