/**
 * @file next.config.js
 * Next.js configuration for this project.
 */

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['f.prxu.org']
  },
  experimental: {
    images: {
      layoutRaw: true
    }
  },
  async rewrites() {
    return [
      {
        source: '/e',
        destination: '/embed'
      }
    ];
  },
  webpack(config) {
    const newConfig = {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@components': path.join(__dirname, 'components'),
          '@config': path.join(__dirname, 'config'),
          '@contexts': path.join(__dirname, 'contexts'),
          '@interfaces': path.join(__dirname, 'interfaces'),
          '@lib': path.join(__dirname, 'lib'),
          '@states': path.join(__dirname, 'states'),
          '@svg': path.join(__dirname, 'assets', 'svg'),
          '@theme': path.join(__dirname, 'theme')
        }
      }
    };

    newConfig.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return newConfig;
  }
};

module.exports = nextConfig;
