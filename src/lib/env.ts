export const env = {
  get dbConfigured() { return Boolean(process.env.MONGODB_URI); },
  get authConfigured() { return Boolean(process.env.MONGODB_URI) && (process.env.AUTH_SECRET ?? "").length >= 32; },
  /** Gmail (or any SMTP) sending: SMTP_USER + SMTP_PASS (a Google "app password"). Preferred. */
  get smtpConfigured() { return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS); },
  /** Resend API sending (fallback when SMTP is not set). */
  get resendConfigured() { return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_FROM && process.env.NOTIFY_EMAIL_TO); },
  get emailConfigured() { return this.smtpConfigured || this.resendConfigured; },
  get siteUrl() { return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""); },
};

/** Nodemailer options built from the environment. Google shows app passwords with spaces; they are removed here. */
export function smtpOptions() {
  const port = Number(process.env.SMTP_PORT || 465);
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER ?? "", pass: (process.env.SMTP_PASS ?? "").replace(/\s+/g, "") },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  };
}
