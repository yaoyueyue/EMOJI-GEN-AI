/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  },
  images: {
    domains: ['replicate.delivery'],
  },
  reactStrictMode: true,
}

module.exports = nextConfig 