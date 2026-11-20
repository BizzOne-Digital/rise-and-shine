import "server-only";
import nodemailer from "nodemailer";
import { env, smtpOptions } from "./env";

export type MailAttachment = { filename: string; content: Buffer };
type Opts = { replyTo?: string; attachments?: MailAttachment[] };

async function sendViaSmtp(subject: string, lines: string[], opts: Opts): Promise<boolean> {
  const user = process.env.SMTP_USER as string;
  const to = process.env.NOTIFY_EMAIL_TO || user;
  const transporter = nodemailer.createTransport(smtpOptions());
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Rise N' Shine Website" <${user}>`,
    to,
    subject,
    text: lines.join("\n"),
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
  });
  return true;
}

async function sendViaResend(subject: string, lines: string[], opts: Opts): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_EMAIL_FROM,
      to: [process.env.NOTIFY_EMAIL_TO],
      subject,
      text: lines.join("\n"),
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      ...(opts.attachments?.length ? { attachments: opts.attachments.map((a) => ({ filename: a.filename, content: a.content.toString("base64") })) } : {}),
    }),
  });
  if (!res.ok) console.error("[notifyStaff] Resend rejected the email:", res.status, (await res.text()).slice(0, 300));
  return res.ok;
}

/** Emails the team. Uses SMTP (Gmail app password) when configured, otherwise Resend.
 *  Returns true only when the provider accepted the message, so a form never claims delivery it did not make. */
export async function notifyStaff(subject: string, lines: string[], opts: Opts = {}): Promise<boolean> {
  if (!env.emailConfigured) {
    console.error("[notifyStaff] Email is not configured (set SMTP_USER and SMTP_PASS). Nothing was emailed.");
    return false;
  }
  try {
    return env.smtpConfigured ? await sendViaSmtp(subject, lines, opts) : await sendViaResend(subject, lines, opts);
  } catch (e) {
    console.error("[notifyStaff] Email failed:", (e as Error).message);
    return false;
  }
}
