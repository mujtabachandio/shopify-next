/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Configure for both development and production
  experimental: {
    // Remove appDir as it's now the default in Next.js 14
  },
  // Disable static optimization for dynamic routes
  staticPageGenerationTimeout: 120,
  // Configure build output
  distDir: '.next',
  // Enable source maps in development
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
}

module.exports = nextConfig 