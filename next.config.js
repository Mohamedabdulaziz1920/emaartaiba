/** @type {import('next').NextConfig} */

const nextConfig = {
  // ═══════════════════════════════════════════════════════════
  // ✅ تحسين الصور
  // ═══════════════════════════════════════════════════════════
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api.lamsataljarj.com',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api.lamsataljarj.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lamsataljarj.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lamsataljarj.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],

    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ التحسينات الأساسية
  // ═══════════════════════════════════════════════════════════
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  staticPageGenerationTimeout: 180,

  // ═══════════════════════════════════════════════════════════
  // ✅ Experimental Features
  // ═══════════════════════════════════════════════════════════
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-icons',
      'react-icons',
    ],
    webpackMemoryOptimizations: true,
    optimisticClientCache: true,
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ إستراتيجية التخزين المؤقت
  // ═══════════════════════════════════════════════════════════
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ Headers
  // ═══════════════════════════════════════════════════════════
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
          { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ Redirects
  // ═══════════════════════════════════════════════════════════
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/category/:slug', destination: '/categories/:slug', permanent: true },
      { source: '/service/:slug', destination: '/services/:slug', permanent: true },
      { source: '/project/:slug', destination: '/projects/:slug', permanent: true },
    ];
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ Rewrites
  // ═══════════════════════════════════════════════════════════
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ Turbopack
  // ═══════════════════════════════════════════════════════════
  turbopack: {
    resolveAlias: {},
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ Production
  // ═══════════════════════════════════════════════════════════
  productionBrowserSourceMaps: false,

  // ═══════════════════════════════════════════════════════════
  // ✅ Compiler
  // ═══════════════════════════════════════════════════════════
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ TypeScript
  // ═══════════════════════════════════════════════════════════
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;