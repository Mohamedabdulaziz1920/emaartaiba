import type { Metadata } from 'next';
import type { SiteSettings } from './settings';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  alternateLanguages?: Record<string, string>;
}

/**
 * إنشاء Metadata احترافي لأي صفحة
 */
export function generateSEO(config: SEOConfig, settings?: SiteSettings): Metadata {
  const siteName = settings?.site_name_ar || 'البناء المتميز';
  const url = config.canonical || (config.url ? `${BASE}${config.url}` : BASE);

  const title = config.title || settings?.meta_title_ar || siteName;
  const description = config.description || settings?.meta_description_ar || '';
  const image = config.image || settings?.site_logo;

  // معالجة الكلمات المفتاحية
  let keywords: string[] = [];
  if (settings?.meta_keywords) {
    keywords = settings.meta_keywords.split(',').map(k => k.trim());
  }
  if (config.keywords) {
    const configKeywords = Array.isArray(config.keywords)
      ? config.keywords
      : config.keywords.split(',').map(k => k.trim());
    keywords = [...keywords, ...configKeywords];
  }
  keywords = [...new Set(keywords)];

  // إعدادات الروبوتات
  const robots: Metadata['robots'] = {
    index: !config.noindex,
    follow: !config.nofollow,
  };

  if (!config.noindex) {
    robots.googleBot = {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    };
  }

  // بناء Open Graph (بدون خاصية type)
  const openGraph: Metadata['openGraph'] = {
    locale: 'ar_SA',
    url: url,
    siteName: siteName,
    title: title,
    description: description,
    images: image ? [{
      url: image,
      width: config.imageWidth || 1200,
      height: config.imageHeight || 630,
      alt: title,
    }] : [],
  };

  // بناء Twitter Card
  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: image ? [image] : [],
  };

  // بناء الروابط البديلة
  const alternates: Metadata['alternates'] = {
    canonical: url,
    languages: {
      'ar-SA': url,
      ...config.alternateLanguages,
    },
  };

  // إعدادات إضافية
  const other: Record<string, string> = {};

  // إضافة معلومات الموقع الجغرافي
  if (settings?.city) {
    other['geo.region'] = 'SA';
    other['geo.placename'] = settings.city;
  }

  if (settings?.google_maps_lat && settings?.google_maps_lng) {
    other['geo.position'] = `${settings.google_maps_lat};${settings.google_maps_lng}`;
  }

  // إضافة معلومات المقال (Article) كـ meta other (لأن openGraph لا يدعمها مباشرة)
  if (config.type === 'article') {
    if (config.publishedAt) other['article:published_time'] = config.publishedAt;
    if (config.modifiedAt) other['article:modified_time'] = config.modifiedAt;
    if (config.author) other['article:author'] = config.author;
    if (config.section) other['article:section'] = config.section;
    if (config.tags && config.tags.length > 0) {
      other['article:tag'] = config.tags.join(',');
    }
  }

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: config.author || siteName }],
    creator: siteName,
    publisher: siteName,
    robots,
    alternates,
    openGraph,
    twitter,
    other,
  };
}

/**
 * Breadcrumb Helper - بناء breadcrumbs بسهولة
 */
export function buildBreadcrumb(...items: Array<{ name: string; url: string }>) {
  const breadcrumbs = [
    { name: 'الرئيسية', url: '/' },
    ...items,
  ];
  
  // ✅ إزالة التكرارات فقط، لا تحذف العناصر
  const unique = breadcrumbs.filter((item, index, self) => 
    item && item.name && item.url && self.findIndex(i => i.url === item.url) === index
  );
  
  // ✅ دائماً نعيد على الأقل عنصر واحد
  return unique.length > 0 ? unique : [{ name: 'الرئيسية', url: '/' }];
}

/**
 * دالة لتوليد عنوان الصفحة
 */
export function buildPageTitle(pageTitle: string, settings?: SiteSettings): string {
  const siteName = settings?.site_name_ar || 'البناء المتميز';
  return `${pageTitle} | ${siteName}`;
}

/**
 * دالة لتوليد وصف الصفحة
 */
export function buildPageDescription(description: string, defaultDescription?: string): string {
  if (description && description.length > 0) return description;
  return defaultDescription || 'شركة مقاولات عامة رائدة في المملكة العربية السعودية';
}
