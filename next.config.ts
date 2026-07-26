/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://medi-store-back-end-three.vercel.app/api/:path*', // Your backend URL
      },
    ];
  },
};

export default nextConfig;
