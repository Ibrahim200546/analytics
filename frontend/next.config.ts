import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    env: {
        AUTH_URL: process.env.AUTH_URL || "https://ismi-analytics.vercel.app",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://ismi-analytics.vercel.app",
    },
    poweredByHeader: false,
    reactStrictMode: true,
    outputFileTracingRoot: path.join(__dirname),
    turbopack: {
        root: path.join(__dirname),
    },
    sassOptions: {
        silenceDeprecations: ['legacy-js-api', 'mixed-decls', 'color-functions', 'global-builtin', 'import'],
    },
    async rewrites() {
        return [
            {
                source: "/api/organization_accounts/:path*",
                destination: "/api/organization-accounts/:path*",
            },
            {
                source: "/api/organization_accounts",
                destination: "/api/organization-accounts",
            },
            {
                source: "/api/project_articles/:path*",
                destination: "/api/project-articles/:path*",
            },
            {
                source: "/api/project_articles",
                destination: "/api/project-articles",
            },
            {
                source: "/api/telegram_accounts/:path*",
                destination: "/api/telegram-accounts/:path*",
            },
            {
                source: "/api/telegram_accounts",
                destination: "/api/telegram-accounts",
            },
            {
                source: "/api/:path*.jsonld",
                destination: "/api/:path*",
            },
        ];
    },
    async headers() {
        return [{
            source: "/(.*)",
            headers: [
                {key: "X-Content-Type-Options", value: "nosniff"},
                {key: "X-Frame-Options", value: "DENY"},
                {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
                {key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()"},
                {key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains"},
            ],
        }];
    },
};

export default nextConfig;
