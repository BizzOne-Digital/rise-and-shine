import "server-only";
import { env } from "./env";

export type MailAttachment = { filename: string; content: Buffer };

/** Emails the team via Resend. Returns true only when the provider accepted it (never claims delivery otherwise). */
export async function notifyStaff(
  subject: string,
  lines: string[],
  opts: { replyTo?: string; attachments?: MailAttachment[] } = {},
): Promise<boolean> {
  if (!env.emailConfigured) {
    console.error("[notifyStaff] Email is not configured (RESEND_API_KEY, NOTIFY_EMAIL_FROM, NOTIFY_EMAIL_TO). Nothing was emailed.");
    return false;
  }
  try {
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
  } catch (e) {
    console.error("[notifyStaff] Email request failed:", (e as Error).message);
    return false;
  }
}
