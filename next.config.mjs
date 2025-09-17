/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { unoptimized: true },
      transpilePackages: ['@rainbow-me/rainbowkit', 'wagmi'],
};

export default nextConfig;
