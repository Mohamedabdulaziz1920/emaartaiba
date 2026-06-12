import type { SiteSettings } from '../settings';
import { toStr, toNumber, toInt, toArray, toUrl, buildImageUrl, stripHtml } from '../typeSafe';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * بناء URL كامل من path
 */
export function buildFullUrl(path?: string): string {
  if (!path) return BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

/**
 * استخراج اسم الموقع
 */
export function getSiteName(settings?: SiteSettings): string {
  if (!settings) return 'شركة البناء المتميز';
  return toStr(settings.site_name_ar) || 
         toStr(settings.site_name) || 
         'شركة البناء المتميز';
}

/**
 * استخراج وصف الموقع
 */
export function getSiteDescription(settings?: SiteSettings): string {
  if (!settings) return '';
  return toStr(settings.meta_description_ar) ||
         toStr(settings.meta_description) ||
         toStr(settings.site_description_ar) ||
         toStr(settings.site_description) ||
         '';
}

/**
 * استخراج شعار الموقع
 */
export function getSiteLogo(settings?: SiteSettings): string {
  if (!settings) return '';
  return buildImageUrl(settings.site_logo);
}

/**
 * استخراج معلومات الاتصال
 */
export function getContactInfo(settings?: SiteSettings) {
  if (!settings) return { phone: '', email: '', whatsapp: '' };
  return {
    phone: toStr(settings.phone),
    email: toStr(settings.email),
    whatsapp: toStr(settings.whatsapp),
  };
}

/**
 * استخراج العنوان الكامل
 */
export function getFullAddress(settings?: SiteSettings) {
  if (!settings) return null;
  
  const street = toStr(settings.address_ar) || toStr(settings.address);
  const city = toStr(settings.city_ar) || toStr(settings.city) || 'الرياض';
  const region = toStr(settings.region_ar) || toStr(settings.region) || 'منطقة الرياض';
  const country = toStr(settings.country_code) || 'SA';
  const postalCode = toStr(settings.postal_code);
  
  return {
    streetAddress: street || undefined,
    addressLocality: city,
    addressRegion: region,
    postalCode: postalCode || undefined,
    addressCountry: country,
  };
}

/**
 * استخراج الإحداثيات
 */
export function getGeoCoordinates(settings?: SiteSettings) {
  if (!settings) return null;
  
  const lat = toNumber(settings.google_maps_lat || settings.latitude, NaN);
  const lng = toNumber(settings.google_maps_lng || settings.longitude, NaN);
  
  if (isNaN(lat) || isNaN(lng)) return null;
  return { latitude: lat, longitude: lng };
}

/**
 * استخراج روابط السوشيال ميديا
 */
export function getSocialLinks(settings?: SiteSettings): string[] {
  if (!settings) return [];
  
  const links: string[] = [];
  const socialKeys = [
    'facebook', 'facebook_url',
    'twitter', 'twitter_url',
    'instagram', 'instagram_url',
    'linkedin', 'linkedin_url',
    'youtube', 'youtube_url',
    'tiktok', 'tiktok_url',
    'pinterest', 'pinterest_url',
  ];
  
  socialKeys.forEach(key => {
    const url = toUrl(settings[key]);
    if (url && !links.includes(url)) links.push(url);
  });
  
  return links;
}

/**
 * استخراج التقييمات
 */
export function getRatings(settings?: SiteSettings) {
  return {
    ratingValue: toNumber(settings?.rating_value, 4.9),
    reviewCount: toInt(settings?.review_count, 100),
    bestRating: toNumber(settings?.best_rating, 5),
    worstRating: toNumber(settings?.worst_rating, 1),
  };
}

/**
 * استخراج المناطق المخدومة
 */
export function getServiceAreas(settings?: SiteSettings): string[] {
  if (!settings) return ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'];
  
  const areas = toArray<string>(settings.service_areas_ar || settings.service_areas);
  if (areas.length > 0) return areas;
  
  return ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'];
}

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

export { BASE_URL, stripHtml, toStr, toNumber, toInt, toArray, buildImageUrl };