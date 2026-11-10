/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    // Admin uploads are served from MongoDB through /api/uploads/**; the other paths are bundled site artwork.
    localPatterns: [{ pathname: "/api/uploads/**" }, { pathname: "/images/**" }, { pathname: "/brand/**" }],
    formats: ["image/webp"],
  },
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
  // Keep old-site URLs working so search engines transfer their ranking (301 = permanent).
  // /menu, /about-us, /services and /contact keep the same paths on the new site.
  async redirects() {
    return [{ source: "/specials", destination: "/menu", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};
export default nextConfig;
