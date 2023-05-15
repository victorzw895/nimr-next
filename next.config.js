/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.kitsu.io',
      }
    ]
  },
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true
    },
  }
}

module.exports = nextConfig
