import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Disable HMR cache temporarily to prevent RSC issues
    serverComponentsHmrCache: false,
    // Optimize memory usage during development
    webpackMemoryOptimizations: true,
    // Disable problematic features during development
    optimizePackageImports: ['@payloadcms/ui'],
  },
  
  // Disable logging temporarily to reduce noise
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Aggressive webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable hot reloading for specific patterns that cause issues
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/dist/**',
        ],
        aggregateTimeout: 300,
        poll: false,
      };

      // Reduce memory usage in development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            payload: {
              test: /[\\/]node_modules[\\/]@payloadcms[\\/]/,
              name: 'payload',
              priority: 10,
              chunks: 'all',
            },
          },
        },
      };

      // Disable source maps temporarily to improve performance
      config.devtool = false;
    }
    
    return config;
  },

  // Disable image optimization temporarily
  images: {
    unoptimized: true,
  },
}

export default withPayload(nextConfig, { 
  devBundleServerPackages: false,
  // Additional Payload optimizations
  configPath: './src/payload.config.ts',
})
