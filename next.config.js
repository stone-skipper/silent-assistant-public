/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      "encrypted-tbn3.gstatic.com",
      "encrypted-tbn2.gstatic.com",
      "encrypted-tbn1.gstatic.com",
      "encrypted-tbn0.gstatic.com",
      "replicate.delivery",
      "*",
    ],
  },
};

module.exports = nextConfig;
