import path from 'node:path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@salaam/domain'],
  poweredByHeader: false,
  // Self-contained server bundle for the Docker image (infra/docker/web.Dockerfile).
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default config;
