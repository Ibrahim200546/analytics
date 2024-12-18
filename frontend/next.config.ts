import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    sassOptions: {
        silenceDeprecations: ['legacy-js-api', 'mixed-decls', 'color-functions', 'global-builtin', 'import'],
    }
};

export default nextConfig;
