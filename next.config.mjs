/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { unoptimized: true },
    transpilePackages: ['@rainbow-me/rainbowkit', 'wagmi'],
    eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
