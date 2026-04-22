/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    api: {
      allowRouteHandlerImports: true,
    },
  },
};

module.exports = nextConfig;

