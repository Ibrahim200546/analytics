import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    outputFileTracingRoot: path.join(__dirname),
    turbopack: {
        root: path.join(__dirname),
    },
    sassOptions: {
        silenceDeprecations: ['legacy-js-api', 'mixed-decls', 'color-functions', 'global-builtin', 'import'],
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
