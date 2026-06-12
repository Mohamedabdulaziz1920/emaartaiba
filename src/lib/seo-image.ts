// src/lib/seo-image.ts
import type { SiteSettings } from './settings';
import { toStr } from './typeSafe';

/**
 * أنواع الصور المدعومة
 */
export type ImageType = 'service' | 'project' | 'blog' | 'gallery' | 'logo' | 'general';

/**
 * خيارات توليد النص البديل (Alt Text)
 */
export interface AltTextOptions {
  title?: string;
  type?: ImageType;
  city?: string;
  category?: string;
  index?: number;
  isFeatured?: boolean;
  clientName?: string;
  location?: string;
  year?: string;
  settings?: SiteSettings;  // ✨ جديد - لاسم الموقع الديناميكي
  customBrand?: string;     // ✨ جديد - اسم مخصص
}

/**
 * ترجمات أنواع الصور
 */
const typeTranslations: Record<ImageType, string> = {
  service: 'خدمة',
  project: 'مشروع',
  blog: 'مقال',
  gallery: 'معرض صور',
  logo: 'شعار',
  general: 'صورة',
};

/**
 * استخراج اسم الموقع من الإعدادات
 */
function getSiteBrand(settings?: SiteSettings, customBrand?: string): string {
  if (customBrand) return customBrand;
  if (!settings) return 'شركة البناء المتميز';
  
  return toStr(settings.site_name_ar) || 
         toStr(settings.site_name) || 
         'شركة البناء المتميز';
}

/**
 * توليد نص بديل (Alt Text) محسن لتحسين SEO
 * 
 * @example
 * generateAltText({ 
 *   title: 'بناء فيلا', 
 *   type: 'project', 
 *   city: 'جدة', 
 *   index: 0,
 *   settings // ← الإعدادات الديناميكية
 * })
 * // => "مشروع: بناء فيلا في جدة - صورة 1 | شركة البناء المتميز"
 */
export function generateAltText(options: AltTextOptions): string {
  const { 
    title, 
    type = 'general', 
    city, 
    category, 
    index, 
    isFeatured, 
    clientName, 
    location, 
    year,
    settings,
    customBrand,
  } = options;

  const parts: string[] = [];
  const brand = getSiteBrand(settings, customBrand);

  // 1. النوع مع العنوان
  const typeLabel = typeTranslations[type];
  if (title) {
    parts.push(`${typeLabel}: ${title}`);
  } else if (type !== 'general') {
    parts.push(typeLabel);
  }

  // 2. اسم العميل (للمشاريع)
  if (clientName && type === 'project') {
    parts.push(`لصالح ${clientName}`);
  }

  // 3. الموقع
  if (city) {
    parts.push(`في ${city}`);
  } else if (location) {
    parts.push(`في ${location}`);
  }

  // 4. السنة
  if (year) {
    parts.push(`- ${year}`);
  }

  // 5. التصنيف
  if (category) {
    parts.push(`(قسم: ${category})`);
  }

  // 6. رقم الصورة
  if (typeof index === 'number' && index >= 0) {
    parts.push(`صورة ${index + 1}`);
  }

  // 7. شعار مميز
  if (isFeatured) {
    parts.push('⭐ مميزة');
  }

  // 8. العلامة التجارية الديناميكية
  parts.push(`| ${brand}`);

  // تنظيف النص من أي فراغات زائدة
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * توليد عنوان الصورة (Title attribute)
 */
export function generateImageTitle(
  title: string, 
  type?: ImageType,
  settings?: SiteSettings
): string {
  const typeLabel = type ? typeTranslations[type] : 'صورة';
  const brand = getSiteBrand(settings);
  return `${typeLabel}: ${title} - ${brand}`;
}

/**
 * أحجام الصور المدعومة
 */
export const imageSizes = {
  thumbnail: { width: 300, height: 200, label: 'مصغرة' },
  card: { width: 600, height: 400, label: 'بطاقة' },
  featured: { width: 1200, height: 630, label: 'مميزة (OG)' },
  full: { width: 1920, height: 1080, label: 'كاملة' },
  avatar: { width: 100, height: 100, label: 'صورة شخصية' },
  square: { width: 400, height: 400, label: 'مربعة' },
  hero: { width: 1920, height: 800, label: 'هيرو' },           // ✨ جديد
  banner: { width: 1600, height: 400, label: 'بانر' },         // ✨ جديد
  mobile: { width: 768, height: 512, label: 'موبايل' },        // ✨ جديد
} as const;

export type ImageSize = keyof typeof imageSizes;

/**
 * الحصول على أبعاد الصورة حسب الحجم المطلوب
 */
export function getImageDimensions(size: ImageSize): { width: number; height: number; label: string } {
  return imageSizes[size];
}

/**
 * توليد رابط الصورة بالحجم المطلوب
 */
export function getResizedImageUrl(url: string, size: ImageSize): string {
  if (!url) return '';
  
  if (url.includes('/storage/') || url.includes('/uploads/')) {
    const dimensions = imageSizes[size];
    return `${url}?w=${dimensions.width}&h=${dimensions.height}&fit=crop`;
  }
  
  return url;
}

/**
 * توليد srcset للصور المتجاوبة
 */
export function generateSrcSet(
  url: string, 
  sizes: ImageSize[] = ['thumbnail', 'card', 'featured']
): string {
  if (!url) return '';
  
  const srcSetParts = sizes.map(size => {
    const resizedUrl = getResizedImageUrl(url, size);
    const dimensions = imageSizes[size];
    return `${resizedUrl} ${dimensions.width}w`;
  });
  
  return srcSetParts.join(', ');
}

/**
 * توليد جميع أحجام الصورة دفعة واحدة
 */
export interface ImageResponsiveSet {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
  title: string;
}

export function generateResponsiveImageSet(
  url: string,
  altOptions: AltTextOptions,
  prioritySizes: ImageSize[] = ['thumbnail', 'card', 'featured']
): ImageResponsiveSet {
  const alt = generateAltText(altOptions);
  const title = altOptions.title 
    ? generateImageTitle(altOptions.title, altOptions.type, altOptions.settings) 
    : '';
  const dimensions = imageSizes.featured;
  
  return {
    src: getResizedImageUrl(url, 'featured'),
    srcSet: generateSrcSet(url, prioritySizes),
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    width: dimensions.width,
    height: dimensions.height,
    alt,
    title,
  };
}

/**
 * التحقق من صحة رابط الصورة
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  if (url.startsWith('data:image/')) return true;
  if (url.startsWith('/storage/') || url.startsWith('/uploads/') || url.startsWith('/images/')) return true;
  
  return false;
}

/**
 * الحصول على رابط احتياطي للصورة (Placeholder)
 */
export function getPlaceholderImage(
  width: number = 600, 
  height: number = 400, 
  text?: string,
  bgColor: string = 'f59e0b',
  textColor: string = 'white'
): string {
  const defaultText = text ? encodeURIComponent(text) : 'صورة';
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${defaultText}`;
}

/**
 * إنشاء نص بديل تلقائي من البيانات المتاحة (نسخة مبسّطة)
 */
export function autoGenerateAltText(
  title: string, 
  type: ImageType, 
  additionalInfo?: string,
  settings?: SiteSettings
): string {
  const typeText = typeTranslations[type];
  const infoText = additionalInfo ? ` - ${additionalInfo}` : '';
  const brand = getSiteBrand(settings);
  
  return `${typeText}: ${title}${infoText} | ${brand}`;
}

/**
 * ✨ جديد: توليد Open Graph Image URL
 */
export function getOgImageUrl(
  image?: string | null,
  settings?: SiteSettings
): string {
  // أولوية: الصورة المُمررة → meta_image → site_logo → placeholder
  if (image && isValidImageUrl(image)) {
    return getResizedImageUrl(image, 'featured');
  }
  
  if (settings) {
    const metaImage = toStr(settings.meta_image || settings.og_image);
    if (metaImage && isValidImageUrl(metaImage)) {
      return metaImage;
    }
    
    const logo = toStr(settings.site_logo);
    if (logo && isValidImageUrl(logo)) {
      return logo;
    }
  }
  
  const brand = getSiteBrand(settings);
  return getPlaceholderImage(1200, 630, brand);
}

/**
 * ✨ جديد: توليد Twitter Image URL
 */
export function getTwitterImageUrl(
  image?: string | null,
  settings?: SiteSettings
): string {
  return getOgImageUrl(image, settings);
}

/**
 * ✨ جديد: استخراج alt text من البيانات الخام
 */
export function extractAltText(
  item: any,
  type: ImageType = 'general',
  settings?: SiteSettings,
  index?: number
): string {
  if (!item) {
    return generateAltText({ type, settings });
  }
  
  const title = toStr(
    item.title_ar || 
    item.title || 
    item.name_ar || 
    item.name || 
    item.alt
  );
  
  const city = toStr(item.city || item.location_ar || item.location);
  const category = toStr(item.category?.name_ar || item.category?.name);
  const clientName = toStr(item.client_name);
  const year = item.created_at ? new Date(item.created_at).getFullYear().toString() : undefined;
  
  return generateAltText({
    title,
    type,
    city: city || undefined,
    category: category || undefined,
    clientName: clientName || undefined,
    year,
    index,
    isFeatured: Boolean(item.is_featured),
    settings,
  });
}