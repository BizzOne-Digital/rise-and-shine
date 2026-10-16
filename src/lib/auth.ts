import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { AdminUser } from "./models";
import { env } from "./env";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session";

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
  }
}

export type AdminSession = { id: string; email: string; name: string };

export async function setSessionCookie(userId: string) {
  const token = await signSession(userId);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Verifies the signed cookie AND that the admin still exists and is active (revocable sessions). */
export async function getAdmin(): Promise<AdminSession | null> {
  if (!env.authConfigured) return null;
  const id = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!id) return null;
  try {
    await connectDB();
    const u = await AdminUser.findById(id).select("email name active").lean();
    if (!u || !u.active) return null;
    return { id, email: u.email, name: u.name || u.email };
  } catch {
    return null;
  }
}

/** For server actions and route handlers: throws if the caller is not an authenticated admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const a = await getAdmin();
  if (!a) throw new UnauthorizedError();
  return a;
}

/** For admin pages: redirects to the login screen. */
export async function requirePageAdmin(): Promise<AdminSession> {
  const a = await getAdmin();
  if (!a) redirect("/admin/login");
  return a;
}
