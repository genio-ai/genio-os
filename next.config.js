// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      br: path.resolve(__dirname, "lib/empty.js"),
    };
    return config;
  },
};

module.exports = nextConfig;
