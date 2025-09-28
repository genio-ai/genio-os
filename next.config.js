/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/index",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
