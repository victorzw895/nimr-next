/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.kitsu.io',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
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
