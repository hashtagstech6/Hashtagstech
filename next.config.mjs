/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel Image Optimization configuration
  images: {
    // Allow images from Sanity CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '**.sanity.asset',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // Allow other HTTPS images (fallback)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Image formats to use
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
