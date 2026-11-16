import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@salaam/domain'],
  poweredByHeader: false,
};

export default config;
