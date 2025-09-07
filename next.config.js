/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // خَلّيه يتجاهل أخطاء TypeScript أثناء الـ build
    ignoreBuildErrors: true,
  },
  eslint: {
    // وتجاهل فحوصات ESLint أثناء الـ build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
