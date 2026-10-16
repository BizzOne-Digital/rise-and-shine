export const env = {
  get dbConfigured() { return Boolean(process.env.MONGODB_URI); },
  get authConfigured() { return Boolean(process.env.MONGODB_URI) && (process.env.AUTH_SECRET ?? "").length >= 32; },
  get emailConfigured() { return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_FROM && process.env.NOTIFY_EMAIL_TO); },
  get siteUrl() { return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""); },
};
