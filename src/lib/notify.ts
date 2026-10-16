import "server-only";
import { env } from "./env";

/** Sends an internal notification via Resend if configured. Returns true only when the provider accepted it. */
export async function notifyStaff(subject: string, lines: string[]): Promise<boolean> {
  if (!env.emailConfigured) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_EMAIL_FROM,
        to: [process.env.NOTIFY_EMAIL_TO],
        subject,
        text: lines.join("\n"),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
