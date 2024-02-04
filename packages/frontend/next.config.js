/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['ellty-images.s3.amazonaws.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
}
module.exports = nextConfig

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: false,
// })
// module.exports = withBundleAnalyzer({})
