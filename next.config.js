/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export in production
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
  },

  trailingSlash: true,

  // ⛔️ REMOVE THIS BLOCK
  // experimental: {
  //   appDir: true,
  // },

  staticPageGenerationTimeout: 120,
  distDir: '.next',
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
};

module.exports = nextConfig;
