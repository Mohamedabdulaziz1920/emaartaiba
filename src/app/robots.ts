// src/app/robots.ts
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ═══════════════════════════════════════════════════
// 📋 المسارات المسموحة (Public Routes)
// ═══════════════════════════════════════════════════
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/about/',
  '/services',
  '/services/',
  '/projects',
  '/projects/',
  '/blog',
  '/blog/',
  '/categories',
  '/categories/',
  '/tags',
  '/tags/',
  '/areas',
  '/areas/',
  '/gallery',
  '/gallery/',
  '/partners',
  '/partners/',
  '/testimonials',
  '/testimonials/',
  '/contact',
  '/contact/',
  '/faq',
  '/faq/',
  '/privacy',
  '/privacy/',
  '/terms',
  '/terms/',
];

// ═══════════════════════════════════════════════════
// 🚫 المسارات الممنوعة (Private Routes)
// ═══════════════════════════════════════════════════
const PRIVATE_PATHS = [
  '/api/',
  '/admin/',
  '/_next/',
  '/private/',
  '/dashboard/',
  '/profile/',
  '/auth/',
  '/login',
  '/logout',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/cart',
  '/checkout',
  '/payment',
  '/debug',                    // ✨ صفحة debug
  '/_vercel',
  '/static/private/',
];

// ═══════════════════════════════════════════════════
// 🔍 المسارات الممنوعة مع Query Parameters
// ═══════════════════════════════════════════════════
const QUERY_DISALLOWED = [
  '/*?sort=*',
  '/*?filter=*',
  '/*?per_page=*',
  '/*?limit=*',
  '/*?offset=*',
  '/*?utm_*',
  '/*?ref=*',
  '/*?source=*',
  '/*?session=*',
  '/*?token=*',
  '/search?*',
  '/*?preview=*',
];

// ═══════════════════════════════════════════════════
// 🤖 روبوتات الذكاء الاصطناعي (محظورة)
// ═══════════════════════════════════════════════════
const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'CCBot',
  'Google-Extended',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Applebot-Extended',
  'Amazonbot',
  'Bytespider',
  'PerplexityBot',
  'YouBot',
  'cohere-ai',
  'Diffbot',
  'FacebookBot',
  'ImagesiftBot',
  'meta-externalagent',
  'Meta-ExternalAgent',
  'AI2Bot',
];

// ═══════════════════════════════════════════════════
// 📱 روبوتات التواصل الاجتماعي
// ═══════════════════════════════════════════════════
const SOCIAL_BOTS = [
  'facebookexternalhit',
  'Facebookbot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'Slackbot',
  'Slackbot-LinkExpanding',
  'Discordbot',
  'Pinterestbot',
  'Pinterest',
  'redditbot',
  'Instagram',
  'TikTok',
  'TikTokBot',
  'Snapchat',
];

// ═══════════════════════════════════════════════════
// ⚡ أدوات اختبار الأداء (مسموحة)
// ═══════════════════════════════════════════════════
const PERFORMANCE_TOOLS = [
  'Google-InspectionTool',
  'Google-Schema-Validator',
  'Google-PageSpeed-Insights',
  'GTmetrix',
  'Lighthouse',
  'WebPageTest',
  'Chrome-Lighthouse',
];

// ═══════════════════════════════════════════════════
// 🤖 محركات البحث الرئيسية
// ═══════════════════════════════════════════════════
const SEARCH_ENGINES_FULL_ACCESS = [
  'Googlebot',
  'Googlebot-Mobile',
  'Bingbot',
  'msnbot',
  'Yandex',
  'YandexBot',
  'DuckDuckBot',
  'Applebot',
  'Slurp',                     // Yahoo
  'Baiduspider',
  'PetalBot',                  // Huawei
  'Sogou',
  'Exabot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ═══════════════════════════════════════════════════
      // 🌐 القاعدة العامة (افتراضي لكل bot غير محدد)
      // ═══════════════════════════════════════════════════
      {
        userAgent: '*',
        allow: PUBLIC_PATHS,
        disallow: [...PRIVATE_PATHS, ...QUERY_DISALLOWED],
        crawlDelay: 1,
      },
      
      // ═══════════════════════════════════════════════════
      // 🔍 محركات البحث الرئيسية (وصول كامل)
      // ═══════════════════════════════════════════════════
      {
        userAgent: SEARCH_ENGINES_FULL_ACCESS,
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      
      // ═══════════════════════════════════════════════════
      // 🖼️ Googlebot-Image - لزحف الصور
      // ═══════════════════════════════════════════════════
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/',
          '/storage/',
          '/_next/image',
          '/images/',
          '/uploads/',
          '/static/',
        ],
        disallow: ['/admin/', '/private/'],
      },
      
      // ═══════════════════════════════════════════════════
      // 📰 Googlebot-News - للأخبار والمدونة
      // ═══════════════════════════════════════════════════
      {
        userAgent: 'Googlebot-News',
        allow: ['/blog/', '/blog'],
        disallow: ['/services/', '/projects/', '/gallery/'],
      },
      
      // ═══════════════════════════════════════════════════
      // 🎬 Googlebot-Video - للفيديوهات
      // ═══════════════════════════════════════════════════
      {
        userAgent: 'Googlebot-Video',
        allow: ['/gallery/', '/projects/', '/services/'],
        disallow: ['/admin/'],
      },
      
      // ═══════════════════════════════════════════════════
      // ⚡ أدوات اختبار الأداء (وصول كامل)
      // ═══════════════════════════════════════════════════
      {
        userAgent: PERFORMANCE_TOOLS,
        allow: '/',
      },
      
      // ═══════════════════════════════════════════════════
      // 📱 روبوتات التواصل الاجتماعي (وصول كامل)
      // ═══════════════════════════════════════════════════
      {
        userAgent: SOCIAL_BOTS,
        allow: '/',
      },
      
      // ═══════════════════════════════════════════════════
      // 💰 AdsBot - روبوتات الإعلانات
      // ═══════════════════════════════════════════════════
      {
        userAgent: ['AdsBot-Google', 'AdsBot-Google-Mobile', 'Mediapartners-Google'],
        allow: '/',
        disallow: ['/admin/', '/private/', '/auth/'],
      },
      
      // ═══════════════════════════════════════════════════
      // 🚫 حظر روبوتات الذكاء الاصطناعي
      // ═══════════════════════════════════════════════════
      {
        userAgent: AI_BOTS,
        disallow: '/',
      },
      
      // ═══════════════════════════════════════════════════
      // 🚫 حظر روبوتات السبام والاختراق المعروفة
      // ═══════════════════════════════════════════════════
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'Linguee Bot',
          'spbot',
        ],
        crawlDelay: 10,
        disallow: ['/admin/', '/api/'],
      },
    ],
    
    // ═══════════════════════════════════════════════════
    // 🗺️ Sitemap
    // ═══════════════════════════════════════════════════
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
    ],
    
    // ═══════════════════════════════════════════════════
    // 🏠 Host
    // ═══════════════════════════════════════════════════
    host: BASE_URL,
  };
}

export const revalidate = 86400; // 24 ساعة