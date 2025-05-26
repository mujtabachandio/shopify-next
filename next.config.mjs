/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['cdn.shopify.com', 'shopify.com'],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
