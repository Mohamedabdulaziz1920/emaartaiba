// src/lib/seo/helpers.ts
import type { SiteSettings } from '../settings';
import {
  toStr,
  toNumber,
  toInt,
  toArray,
  buildImageUrl,
  stripHtml,
} from '../typeSafe';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ════════════════════════════════════════════════
// 🔗 URL Helpers
// ════════════════════════════════════════════════

/**
 * بناء URL كامل من path
 */
export function buildFullUrl(path?: string): string {
  if (!path) return BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

// ════════════════════════════════════════════════
// 🏢 Site Info Helpers
// ════════════════════════════════════════════════

/**
 * استخراج اسم الموقع - فارغ إذا لم يُضبط
 */
export function getSiteName(settings?: SiteSettings): string {
  if (!settings) return '';
  return (
    toStr(settings.site_name_ar) ||
    toStr(settings.site_name)    ||
    ''
  );
}

/**
 * استخراج وصف الموقع
 */
export function getSiteDescription(settings?: SiteSettings): string {
  if (!settings) return '';
  return (
    toStr(settings.meta_description_ar)  ||
    toStr(settings.meta_description)     ||
    toStr(settings.site_description_ar)  ||
    toStr(settings.site_description)     ||
    ''
  );
}

/**
 * استخراج شعار الموقع
 */
export function getSiteLogo(settings?: SiteSettings): string {
  if (!settings) return '';
  return buildImageUrl(settings.site_logo) || '';
}

// ════════════════════════════════════════════════
// 📞 Contact Helpers
// ════════════════════════════════════════════════

/**
 * استخراج معلومات الاتصال
 */
export function getContactInfo(settings?: SiteSettings) {
  if (!settings) return { phone: '', email: '', whatsapp: '' };
  return {
    phone:     toStr(settings.phone),
    email:     toStr(settings.email),
    whatsapp:  toStr(settings.whatsapp),
  };
}

// ════════════════════════════════════════════════
// 📍 Address & Geo Helpers
// ════════════════════════════════════════════════

/**
 * استخراج العنوان الكامل
 * يرجع null إذا لم تكن هناك بيانات
 */
export function getFullAddress(settings?: SiteSettings) {
  if (!settings) return null;

  const street     = toStr(settings.address_ar)  || toStr(settings.address)  || '';
  const city       = toStr(settings.city_ar)      || toStr(settings.city)     || '';
  const region     = toStr((settings as any).region_ar) || toStr(settings.region) || '';
  // ✅ لا fallback ثابت لـ country
  const country    = toStr(settings.country_code) ||
                     toStr((settings as any).address_country_code) ||
                     '';
  const postalCode = toStr(settings.postal_code)  || '';

  // لا نُرجع شيئاً إذا لم تكن هناك بيانات أساسية
  if (!city && !street && !country) return null;

  return {
    streetAddress:   street     || undefined,
    addressLocality: city       || undefined,
    addressRegion:   region     || undefined,
    postalCode:      postalCode || undefined,
    addressCountry:  country    || undefined,
  };
}

/**
 * استخراج الإحداثيات
 * يرجع null إذا لم تكن صالحة
 */
export function getGeoCoordinates(settings?: SiteSettings) {
  if (!settings) return null;

  // ✅ استخدام toStr ثم parseFloat لتجنب مشكلة toNumber + NaN
  const latStr = toStr(settings.google_maps_lat || settings.latitude);
  const lngStr = toStr(settings.google_maps_lng || settings.longitude);

  const lat = latStr ? parseFloat(latStr) : NaN;
  const lng = lngStr ? parseFloat(lngStr) : NaN;

  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

  return { latitude: lat, longitude: lng };
}

// ════════════════════════════════════════════════
// 🌐 Social & Links Helpers
// ════════════════════════════════════════════════

/**
 * استخراج روابط السوشيال ميديا (روابط كاملة فقط)
 */
export function getSocialLinks(settings?: SiteSettings): string[] {
  if (!settings) return [];

  const links: string[] = [];
  const socialKeys = [
    'facebook',   'facebook_url',
    'twitter',    'twitter_url',
    'instagram',  'instagram_url',
    'linkedin',   'linkedin_url',
    'youtube',    'youtube_url',
    'tiktok',     'tiktok_url',
    'pinterest',  'pinterest_url',
    'snapchat',   'telegram',
  ];

  socialKeys.forEach(key => {
    // ✅ نقبل فقط روابط كاملة تبدأ بـ http
    const val = toStr((settings as any)[key]);
    if (val && val.startsWith('http') && !links.includes(val)) {
      links.push(val);
    }
  });

  return links;
}

// ════════════════════════════════════════════════
// ⭐ Rating Helpers
// ════════════════════════════════════════════════

/**
 * استخراج التقييمات
 * يرجع null إذا لم تكن هناك بيانات حقيقية
 * ✅ لا fallback وهمية
 */
export function getRatings(settings?: SiteSettings) {
  const ratingValue = toNumber(settings?.rating_value, 0);
  const reviewCount = toInt(settings?.review_count,    0);

  // لا نُرجع تقييمات وهمية
  if (ratingValue <= 0 || reviewCount <= 0) return null;

  return {
    ratingValue,
    reviewCount,
    bestRating:  toNumber(settings?.best_rating,  5),
    worstRating: toNumber(settings?.worst_rating, 1),
  };
}

// ════════════════════════════════════════════════
// 🗺️ Service Areas Helpers
// ════════════════════════════════════════════════

/**
 * استخراج المناطق المخدومة
 * يرجع [] إذا لم تكن هناك بيانات
 * ✅ لا قائمة مدن ثابتة
 */
export function getServiceAreas(settings?: SiteSettings): string[] {
  if (!settings) return [];

  // 1. من service_areas مباشرة
  const areas = toArray<string>(
    settings.service_areas_ar || settings.service_areas
  );
  if (areas.length > 0) return areas;

  // 2. من hero_cities
  const heroCities = toStr(
    (settings as any).hero_cities_ar || (settings as any).hero_cities
  );
  if (heroCities) {
    return heroCities
      .split(/[,،·]/)
      .map((c: string) => c.trim())
      .filter(Boolean);
  }

  // 3. من city فقط
  const city = toStr(settings.city_ar || settings.city);
  if (city) return [city];

  // ✅ لا fallback ثابت
  return [];
}

// ════════════════════════════════════════════════
// 🔑 Keywords Helpers
// ════════════════════════════════════════════════

/**
 * استخراج الكلمات المفتاحية
 */
export function getKeywords(
  settings?: SiteSettings,
  additionalKeywords: string[] = []
): string[] {
  const fromSettings = toArray<string>(
    settings?.meta_keywords_ar || settings?.meta_keywords
  );
  const all = [...fromSettings, ...additionalKeywords];
  return [...new Set(all.filter(Boolean))];
}

// ════════════════════════════════════════════════
// 🧹 Schema Helpers
// ════════════════════════════════════════════════

/**
 * تنظيف الكائن من القيم الفارغة (للـ JSON-LD)
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];
    if (value === null || value === undefined || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'object' && !Array.isArray(value)) {
      const cleanedNested = cleanObject(value);
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key] = cleanedNested as any;
      }
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

// ════════════════════════════════════════════════
// 📦 Re-exports
// ════════════════════════════════════════════════
export {
  BASE_URL,
  stripHtml,
  toStr,
  toNumber,
  toInt,
  toArray,
  buildImageUrl,
};