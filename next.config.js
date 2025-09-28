// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/", destination: "/index", permanent: false },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      br: path.resolve(__dirname, "lib/empty.js"), // stub for any "br" import
    };
    return config;
  },
};

module.exports = nextConfig;
