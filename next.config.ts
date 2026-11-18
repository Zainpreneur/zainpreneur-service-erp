import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  images: { domains: ['placeholder.com'] },
  experimental: { agentUpgrade: 'security' },
};

export default nextConfig;