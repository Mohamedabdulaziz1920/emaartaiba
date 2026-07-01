// src/app/robots.ts
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ═══════════════════════════════════════════════════
// 📋 المسارات المسموحة
// ═══════════════════════════════════════════════════
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/blog',
  '/categories',
  '/tags',
  '/areas',
  '/gallery',
  '/partners',
  '/testimonials',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
];

// ═══════════════════════════════════════════════════
// 🚫 المسارات الممنوعة
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
  '/debug',
  '/_vercel',
  '/static/private/',
];

// ═══════════════════════════════════════════════════
// 🔍 Query Parameters الممنوعة
// ═══════════════════════════════════════════════════
const QUERY_DISALLOWED = [
  '/*?sort=',
  '/*?filter=',
  '/*?per_page=',
  '/*?limit=',
  '/*?offset=',
  '/*?utm_',
  '/*?ref=',
  '/*?source=',
  '/*?session=',
  '/*?token=',
  '/search',
  '/*?preview=',
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
// ⚡ أدوات اختبار الأداء
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
// 🔍 محركات البحث الرئيسية
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
  'Slurp',
  'Baiduspider',
  'PetalBot',
  'Sogou',
  'Exabot',
];

// ═══════════════════════════════════════════════════
// 🤖 Main Robots Function
// ═══════════════════════════════════════════════════
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ═══ القاعدة العامة ═══
      {
        userAgent: '*',
        allow: PUBLIC_PATHS,
        disallow: [...PRIVATE_PATHS, ...QUERY_DISALLOWED],
        crawlDelay: 1,
      },

      // ═══ محركات البحث الرئيسية ═══
      {
        userAgent: SEARCH_ENGINES_FULL_ACCESS,
        allow: '/',
        disallow: PRIVATE_PATHS,
      },

      // ═══ Googlebot-Image ═══
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/storage/', '/_next/image', '/images/', '/uploads/', '/static/'],
        disallow: ['/admin/', '/private/'],
      },

      // ═══ Googlebot-News ═══
      {
        userAgent: 'Googlebot-News',
        allow: ['/blog/', '/blog'],
        disallow: ['/services/', '/projects/', '/gallery/'],
      },

      // ═══ Googlebot-Video ═══
      {
        userAgent: 'Googlebot-Video',
        allow: ['/gallery/', '/projects/', '/services/'],
        disallow: ['/admin/'],
      },

      // ═══ أدوات الأداء ═══
      {
        userAgent: PERFORMANCE_TOOLS,
        allow: '/',
      },

      // ═══ Social Bots ═══
      {
        userAgent: SOCIAL_BOTS,
        allow: '/',
      },

      // ═══ AdsBot ═══
      {
        userAgent: ['AdsBot-Google', 'AdsBot-Google-Mobile', 'Mediapartners-Google'],
        allow: '/',
        disallow: ['/admin/', '/private/', '/auth/'],
      },

      // ═══ AI Bots - محظورة ═══
      {
        userAgent: AI_BOTS,
        disallow: '/',
      },

      // ═══ SEO Tools - إبطاء فقط ═══
      {
        userAgent: ['SemrushBot', 'AhrefsBot', 'MJ12bot', 'DotBot', 'BLEXBot', 'Linguee Bot', 'spbot'],
        crawlDelay: 10,
        disallow: ['/admin/', '/api/'],
      },
    ],

    sitemap: [`${BASE_URL}/sitemap.xml`],
    host: BASE_URL,
  };
}