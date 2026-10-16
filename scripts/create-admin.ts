/* Creates the first admin user. There is no public registration and no default credentials.
 *   npm run create-admin                       (prompts for email + password; password input is hidden)
 *   ADMIN_EMAIL=you@x.com ADMIN_PASSWORD=... npm run create-admin
 *   npm run create-admin -- --reset            (replace the password of an existing admin) */
import { config } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";
config({ path: ".env.local" });
config();
import { connectDB } from "../src/lib/db";
import { AdminUser } from "../src/lib/models";
import { emailSchema, passwordPolicy } from "../src/lib/validation";

function ask(q: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rl as any)._writeToOutput = (s: string) => { if (s.includes(q)) process.stdout.write(s); };
    }
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(a); });
  });
}

async function main() {
  if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set."); process.exit(1); }
  const reset = process.argv.includes("--reset");
  const emailRaw = process.env.ADMIN_EMAIL || (await ask("Admin email: "));
  const email = emailSchema.safeParse(emailRaw);
  if (!email.success) { console.error("That is not a valid email address."); process.exit(1); }
  const pw = process.env.ADMIN_PASSWORD || (await ask("Password (min 12 chars): ", true));
  const ok = passwordPolicy.safeParse(pw);
  if (!ok.success) { console.error(ok.error.issues[0].message); process.exit(1); }

  await connectDB();
  const existing = await AdminUser.findOne({ email: email.data });
  if (existing && !reset) { console.error("An admin with that email already exists. Use --reset to change the password."); process.exit(1); }
  const passwordHash = await bcrypt.hash(pw, 12);
  if (existing) {
    existing.passwordHash = passwordHash; existing.failedLogins = 0; existing.lockedUntil = undefined; existing.active = true;
    await existing.save();
    console.log(`Password reset for ${email.data}.`);
  } else {
    await AdminUser.create({ email: email.data, passwordHash, role: "admin", active: true });
    console.log(`Admin created: ${email.data}. Sign in at /admin/login.`);
  }
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
