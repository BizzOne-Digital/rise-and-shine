/* Checks the Gmail SMTP login without sending anything:  npm run test-smtp
 * Add --send to also send one clearly labelled test email to NOTIFY_EMAIL_TO (or to SMTP_USER). */
import { config } from "dotenv";
import nodemailer from "nodemailer";
config({ path: ".env.local" });
config();
import { smtpOptions } from "../src/lib/env";

async function main() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) { console.error("SMTP_USER and SMTP_PASS are not set."); process.exit(1); }
  const t = nodemailer.createTransport(smtpOptions());
  await t.verify();
  console.log(`SMTP login OK for ${process.env.SMTP_USER} via ${smtpOptions().host}:${smtpOptions().port}`);
  if (process.argv.includes("--send")) {
    const to = process.env.NOTIFY_EMAIL_TO || process.env.SMTP_USER;
    await t.sendMail({ from: `"Rise N' Shine Website" <${process.env.SMTP_USER}>`, to, subject: "Website email test (you can ignore this)", text: "If you can read this, website form emails will reach this inbox." });
    console.log(`Test email sent to ${to}`);
  }
}
main().catch((e) => { console.error("SMTP check FAILED:", e.message); process.exit(1); });
