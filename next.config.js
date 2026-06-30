/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
  basePath: '',
  assetPrefix: '',
};

module.exports = nextConfig;
