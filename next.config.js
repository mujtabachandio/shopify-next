/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for now as it's causing issues with dynamic routes
  // output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
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
    domains: ['cdn.shopify.com', 'img.youtube.com'],
  },
  // Enable trailing slashes for better static export compatibility
  trailingSlash: true,
  // Configure for both development and production
  experimental: {
    // Remove appDir as it's now the default in Next.js 14
  },
  // Disable static optimization for dynamic routes in development
  staticPageGenerationTimeout: 120,
  // Configure build output
  distDir: '.next',
  // Enable source maps in development
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
}

module.exports = nextConfig 