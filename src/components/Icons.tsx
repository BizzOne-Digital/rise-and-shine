type P = { className?: string; size?: number };
const base = (size: number, className: string) => ({ width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true as const, className });

export const IconMail = ({ className = "", size = 24 }: P) => (
  <svg {...base(size, className)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IconFacebook = ({ className = "", size = 24 }: P) => (
  <svg {...base(size, className)} fill="currentColor"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" /></svg>
);
export const IconInstagram = ({ className = "", size = 24 }: P) => (
  <svg {...base(size, className)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" /></svg>
);
export const IconTikTok = ({ className = "", size = 24 }: P) => (
  <svg {...base(size, className)} fill="currentColor"><path d="M16.6 3c.3 2.3 1.7 3.8 3.9 4v2.8c-1.4 0-2.7-.4-3.9-1.2v6.2c0 3.2-2.2 5.2-5 5.2-2.9 0-5.1-2.2-5.1-5s2.2-5.1 5.2-5.1c.3 0 .6 0 .9.1v2.9c-.3-.1-.6-.2-.9-.2-1.2 0-2.2.9-2.2 2.2 0 1.2 1 2.2 2.2 2.2 1.3 0 2.2-.9 2.2-2.4V3h2.7z" /></svg>
);
