const {i18n} = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
    profiler: true,
    i18n,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/main',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
