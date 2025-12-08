/** @type {import('next').NextConfig} */
const nextConfig = {
  // WARNING: This allows images from any source. For a production app with known image sources, it's better to specify each hostname individually.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}
 
export default nextConfig;