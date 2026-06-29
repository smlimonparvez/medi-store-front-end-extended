/** @type {import('next').NextConfig} */
const nextConfig = {
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
