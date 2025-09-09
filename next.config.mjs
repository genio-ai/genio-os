/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: false }, // عطّل app/ مؤقتًا
  reactStrictMode: true,
  images: { unoptimized: true },
};
export default nextConfig;
