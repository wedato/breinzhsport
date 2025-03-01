/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: "http://localhost:3001",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.nike.com",
      },
      {
        protocol: "https",
        hostname: "assets.adidas.com",
      },
      {
        protocol: "https",
        hostname: "www.basketusa.com",
      },
      {
        protocol: "https",
        hostname: "www.wilson.com",
      },
      {
        protocol: "https",
        hostname: "www.foot.fr",
      },
      {
        protocol: "https",
        hostname: "contents.mediadecathlon.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
