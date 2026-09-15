/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/500',
        destination: '/error-500',
      },
    ];
  },
};

module.exports = nextConfig;
