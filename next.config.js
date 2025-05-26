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
      }
    ],
  },
  // Enable trailing slashes for better static export compatibility
  trailingSlash: true,
  // Configure for both development and production
  experimental: {
    appDir: true,
  },
  // Disable static optimization for dynamic routes in development
  staticPageGenerationTimeout: 120,
  // Configure build output
  distDir: '.next',
  // Enable source maps in development
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
}

module.exports = nextConfig 