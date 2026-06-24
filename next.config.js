/** @type {import('next').NextConfig} */

const nextConfig = {
  // ═══════════════════════════════════════════════════════════
  // ✅ تحسين الصور
  // ═══════════════════════════════════════════════════════════
  images: {
    // ✅ في التطوير: تعطيل التحسين للسرعة
    unoptimized: process.env.NODE_ENV === 'development',
    
    remotePatterns: [
      // ✅ النطاقات الموثوقة فقط
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
        hostname: 'images.unsplash.com',
      },
    ],

    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // ✅ تحسين: 24 ساعة كاش
    minimumCacheTTL: 86400,
    
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ التحسينات الأساسية (المدعومة في Next.js 16)
  // ═══════════════════════════════════════════════════════════
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // ✅ تحسين: وقت التحميل الزائد للصفحات الثابتة
  staticPageGenerationTimeout: 120,

  // ═══════════════════════════════════════════════════════════
  // ✅ Experimental Features (المدعومة)
  // ═══════════════════════════════════════════════════════════
  experimental: {
    // ✅ تحسين CSS
    optimizeCss: true,
    
    // ✅ تحسين استيراد الحزم
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-icons',
    ],
    
    // ✅ تحسين الذاكرة
    webpackMemoryOptimizations: true,
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ إستراتيجية التخزين المؤقت
  // ═══════════════════════════════════════════════════════════
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 ساعة
    pagesBufferLength: 5,
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ توجيهات الـ Headers
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
        ],
      },
    ];
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ إعادة التوجيه
  // ═══════════════════════════════════════════════════════════
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/category/:slug', destination: '/categories/:slug', permanent: true },
    ];
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ إعادة كتابة المسارات (Proxy للـ API)
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
  // ✅ إعدادات Turbopack (Next.js 16)
  // ═══════════════════════════════════════════════════════════
  turbopack: {
    // ✅ تحسينات Turbopack
    resolveAlias: {
      // يمكن إضافة aliases هنا إذا لزم الأمر
    },
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ إعدادات الإنتاج
  // ═══════════════════════════════════════════════════════════
  productionBrowserSourceMaps: false,

  // ═══════════════════════════════════════════════════════════
  // ✅ إعدادات TypeScript و ESLint
  // ═══════════════════════════════════════════════════════════
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;