import { api } from './api';
import { unstable_cache } from 'next/cache';

// ═══════════════════════════════════════════════════════════════
// 🎯 Types
// ═══════════════════════════════════════════════════════════════

export interface HeroStat {
  num: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface TrustItem {
  text: string;
  icon?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ServiceArea {
  name_ar: string;
  name_en?: string;
  slug?: string;
}

export interface PaymentMethod {
  name: string;
  icon?: string;
}

export interface BusinessCredential {
  name: string;
  issuer?: string;
  year?: string;
  url?: string;
}

// ═══════════════════════════════════════════════════════════════
// 🎯 SiteSettings - النسخة النهائية
// ═══════════════════════════════════════════════════════════════

export interface SiteSettings {
  // ═══════════════════════════════════════
  // 🏢 Site Info
  // ═══════════════════════════════════════
  site_name?: string;
  site_name_ar?: string;
  site_name_en?: string;
  site_tagline?: string;
  site_tagline_ar?: string;
  site_tagline_en?: string;
  site_description?: string;
  site_description_ar?: string;
  site_description_en?: string;
  site_logo?: string;
  site_logo_dark?: string;
  site_favicon?: string;
  site_icon?: string;
  site_url?: string;

  // ═══════════════════════════════════════
  // 📞 Contact
  // ═══════════════════════════════════════
  phone?: string;
  phone_secondary?: string;
  whatsapp?: string;
  whatsapp_secondary?: string;
  email?: string;
  email_secondary?: string;
  fax?: string;

  // ═══════════════════════════════════════
  // 📍 Address
  // ═══════════════════════════════════════
  address?: string;
  address_ar?: string;
  address_en?: string;
  city?: string;
  city_ar?: string;
  city_en?: string;
  region?: string;
  region_ar?: string;
  region_en?: string;
  country?: string;
  country_ar?: string;
  country_en?: string;
  country_code?: string;
  postal_code?: string;
  latitude?: string;
  longitude?: string;
  google_maps_lat?: string;
  google_maps_lng?: string;
  google_maps_url?: string;
  google_maps_embed?: string;

  // ═══════════════════════════════════════
  // ⏰ Working Hours
  // ═══════════════════════════════════════
  working_hours?: string;
  working_hours_ar?: string;
  working_days?: string;
  working_days_ar?: string;
  weekend_days?: string;
  weekend_days_ar?: string;
  working_hours_weekend?: string;
  show_top_bar?: string | boolean;

  // ═══════════════════════════════════════
  // 🌐 Social Media
  // ═══════════════════════════════════════
  facebook?: string;
  facebook_url?: string;
  twitter?: string;
  twitter_url?: string;
  twitter_handle?: string;
  instagram?: string;
  instagram_url?: string;
  linkedin?: string;
  linkedin_url?: string;
  youtube?: string;
  youtube_url?: string;
  tiktok?: string;
  tiktok_url?: string;
  snapchat?: string;
  telegram?: string;
  pinterest?: string;
  pinterest_url?: string;

  // ═══════════════════════════════════════
  // 🔍 SEO & Meta
  // ═══════════════════════════════════════
  meta_title?: string;
  meta_title_ar?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_ar?: string;
  meta_description_en?: string;
  meta_keywords?: string;
  meta_keywords_ar?: string;
  meta_keywords_en?: string;
  meta_image?: string;
  og_title?: string;
  og_title_ar?: string;
  og_description?: string;
  og_description_ar?: string;
  og_image?: string;
  og_image_width?: string;
  og_image_height?: string;
  
  // Tracking & Verification
  google_analytics_id?: string;
  google_tag_manager?: string;
  google_tag_manager_id?: string;
  google_site_verification?: string;
  bing_site_verification?: string;
  yandex_verification?: string;
  facebook_pixel_id?: string;
  facebook_app_id?: string;
  hotjar_id?: string;

  // ═══════════════════════════════════════
  // 🚀 Advanced SEO
  // ═══════════════════════════════════════
  robots_index?: boolean | string;
  robots_follow?: boolean | string;
  canonical_url?: string;
  hreflang_default?: string;
  allow_ai_search?: boolean | string;
  allow_ai_training?: boolean | string;
  ai_description?: string;
  ai_keywords?: string;

  // ═══════════════════════════════════════
  // ⭐ Ratings & Reviews
  // ═══════════════════════════════════════
  rating_value?: string;
  review_count?: string;
  best_rating?: string;
  worst_rating?: string;
  price_range?: string;

  // ═══════════════════════════════════════
  // 📊 Stats
  // ═══════════════════════════════════════
  projects_completed?: string;
  years_experience?: string;
  happy_clients?: string;
  team_members?: string;
  engineers_count?: string;

  // ═══════════════════════════════════════
  // 🎯 Header Texts
  // ═══════════════════════════════════════
  cta_button_text?: string;
  cta_button_text_ar?: string;
  search_placeholder?: string;
  search_placeholder_ar?: string;
  search_button_text?: string;
  search_button_text_ar?: string;
  call_button_text?: string;
  call_button_text_ar?: string;
  whatsapp_button_text?: string;
  whatsapp_button_text_ar?: string;
  whatsapp_subtext?: string;
  whatsapp_subtext_ar?: string;
  mobile_menu_title?: string;
  mobile_menu_title_ar?: string;
  mobile_menu_subtitle?: string;
  mobile_menu_subtitle_ar?: string;

  // ═══════════════════════════════════════
  // 🎬 Hero Section
  // ═══════════════════════════════════════
  hero_title?: string;
  hero_title_ar?: string;
  hero_title_line1?: string;
  hero_title_line1_ar?: string;
  hero_title_line2?: string;
  hero_title_line2_ar?: string;
  hero_subtitle?: string;
  hero_subtitle_ar?: string;
  hero_description?: string;
  hero_description_ar?: string;
  hero_desc_highlight?: string;
  hero_desc_highlight_ar?: string;
  hero_cities?: string;
  hero_cities_ar?: string;
  hero_badge_text?: string;
  hero_badge_text_ar?: string;
  hero_image?: string;
  hero_video?: string;

  hero_call_btn?: string;
  hero_call_btn_ar?: string;
  hero_whatsapp_btn?: string;
  hero_whatsapp_btn_ar?: string;
  hero_whatsapp_sub?: string;
  hero_whatsapp_sub_ar?: string;
  hero_inquire_btn?: string;
  hero_inquire_btn_ar?: string;
  whatsapp_default_message?: string;
  whatsapp_default_message_ar?: string;

  trust_items?: string | string[];
  trust_items_ar?: string | string[];
  trust_badges?: string | string[];
  trust_badges_ar?: string | string[];
  hero_stats?: string | HeroStat[];

  // ═══════════════════════════════════════
  // 🏢 Business Info (للـ Schema)
  // ═══════════════════════════════════════
  business_type?: string;
  founding_date?: string;
  founder_name?: string;
  number_of_employees?: string;
  legal_name?: string;
  legal_name_ar?: string;
  tax_id?: string;
  vat_number?: string;
  commercial_registration?: string;
  
  service_areas?: string | string[];
  service_areas_ar?: string | string[];
  main_services?: string | string[];
  main_services_ar?: string | string[];
  payment_methods?: string | PaymentMethod[];
  accepted_currencies?: string;
  credentials?: string | BusinessCredential[];
  certifications?: string | BusinessCredential[];
  faq_items?: string | FAQItem[];

  // ═══════════════════════════════════════
  // 📝 Footer
  // ═══════════════════════════════════════
  footer_text?: string;
  footer_text_ar?: string;
  footer_description?: string;
  footer_description_ar?: string;
  copyright_text?: string;
  copyright_text_ar?: string;
  footer_logo?: string;

  // ═══════════════════════════════════════
  // 🎨 Theme
  // ═══════════════════════════════════════
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_family?: string;
  font_family_ar?: string;

  // ═══════════════════════════════════════
  // 🔧 Index Signature
  // ═══════════════════════════════════════
  [key: string]: string | string[] | HeroStat[] | FAQItem[] | PaymentMethod[] | BusinessCredential[] | boolean | undefined;
}

// ═══════════════════════════════════════════════════════════════
// 🚀 Data Fetching - مع Cache
// ═══════════════════════════════════════════════════════════════

/**
 * 🎯 جلب الإعدادات مع Cache احترافي
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const result = await api.settings();
      return (result?.data || {}) as SiteSettings;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      return {};
    }
  },
  ['site-settings'],
  {
    revalidate: 300, // 5 دقائق
    tags: ['settings'],
  }
);

/**
 * 🎨 جلب إعدادات التصميم مع Cache
 */
export const getDesignSettings = unstable_cache(
  async (): Promise<any> => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_BASE}/design-settings`, {
        next: { revalidate: 300 },
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        console.warn('Design settings API returned non-OK status:', response.status);
        return null;
      }
      
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Failed to fetch design settings:', error);
      return null;
    }
  },
  ['design-settings'],
  {
    revalidate: 300,
    tags: ['design'],
  }
);

/**
 * 💾 تحديث إعدادات (mass update)
 */
export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<boolean> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Failed to update settings:', error);
    return false;
  }
}

/**
 * 💾 تحديث إعداد واحد
 */
export async function updateSingleSetting(key: string, value: string): Promise<boolean> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const response = await fetch(`${API_BASE}/settings/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error(`Failed to update setting ${key}:`, error);
    return false;
  }
}

/**
 * 🔍 جلب إعداد واحد
 */
export async function getSetting(key: string, fallback: string = ''): Promise<string> {
  try {
    const settings = await getSiteSettings();
    const value = settings[key];
    if (typeof value === 'string') return value || fallback;
    return fallback;
  } catch {
    return fallback;
  }
}

// ═══════════════════════════════════════════════════════════════
// 🛠️ Helpers
// ═══════════════════════════════════════════════════════════════

/**
 * تحويل قيمة JSON إلى Array
 */
export function parseJsonField<T = any>(
  value: string | T[] | undefined | null,
  fallback: T[] = []
): T[] {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/**
 * تحويل قيمة Boolean
 */
export function parseBoolField(
  value: string | boolean | undefined | null,
  fallback: boolean = true
): boolean {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(v)) return true;
    if (['0', 'false', 'no', 'off', ''].includes(v)) return false;
  }
  return fallback;
}

/**
 * 🖼️ بناء URL كامل للصور
 */
export function buildMediaUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 
                  process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ||
                  'http://localhost:8000';
  const clean = path.replace(/^\/+/, '');

  if (clean.startsWith('storage/')) return `${backend}/${clean}`;
  return `${backend}/storage/${clean}`;
}

// ═══════════════════════════════════════════════════════════════
// 📞 Contact Helpers
// ═══════════════════════════════════════════════════════════════

/**
 * 📱 تنسيق رقم الهاتف الدولي
 */
export function formatPhoneInternational(phone?: string, defaultCountry: string = '966'): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('00')) return '+' + cleaned.slice(2);
  if (cleaned.startsWith('0')) return '+' + defaultCountry + cleaned.slice(1);
  if (!cleaned.startsWith(defaultCountry)) return '+' + defaultCountry + cleaned;
  
  return '+' + cleaned;
}

// ═══════════════════════════════════════════════════════════════
// 🩺 Health Check & Validation
// ═══════════════════════════════════════════════════════════════

export interface SeoHealthReport {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  recommendations: string[];
}

/**
 * 🩺 فحص صحة السيو
 */
export function checkSeoHealth(settings: SiteSettings): SeoHealthReport {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // 1. اسم الموقع
  if (!settings.site_name_ar && !settings.site_name) {
    issues.push('اسم الموقع مفقود');
    score -= 15;
  }

  // 2. Meta Title
  const metaTitle = settings.meta_title_ar || settings.meta_title;
  if (!metaTitle) {
    issues.push('عنوان السيو (Meta Title) مفقود');
    score -= 15;
  } else if (metaTitle.length < 30) {
    recommendations.push('Meta Title قصير جداً (يفضل 50-60 حرف)');
    score -= 5;
  } else if (metaTitle.length > 60) {
    recommendations.push('Meta Title طويل (سيُقطع في نتائج البحث)');
    score -= 3;
  }

  // 3. Meta Description
  const metaDesc = settings.meta_description_ar || settings.meta_description;
  if (!metaDesc) {
    issues.push('وصف السيو (Meta Description) مفقود');
    score -= 15;
  } else if (metaDesc.length < 120) {
    recommendations.push('Meta Description قصير (يفضل 150-160 حرف)');
    score -= 5;
  } else if (metaDesc.length > 160) {
    recommendations.push('Meta Description طويل');
    score -= 3;
  }

  // 4. Keywords
  if (!settings.meta_keywords) {
    recommendations.push('الكلمات المفتاحية مفقودة');
    score -= 5;
  }

  // 5. OG Image
  if (!settings.og_image && !settings.site_logo) {
    issues.push('صورة المشاركة (OG Image) مفقودة');
    score -= 10;
  }

  // 6. Phone
  if (!settings.phone) {
    issues.push('رقم الهاتف مفقود');
    score -= 10;
  }

  // 7. Address
  if (!settings.address_ar && !settings.address) {
    issues.push('العنوان مفقود');
    score -= 10;
  }

  // 8. Geo coordinates
  if (!settings.google_maps_lat || !settings.google_maps_lng) {
    recommendations.push('الإحداثيات الجغرافية مفقودة (مهم للسيو المحلي)');
    score -= 5;
  }

  // 9. Google verification
  if (!settings.google_site_verification) {
    recommendations.push('Google Site Verification غير مضاف');
    score -= 3;
  }

  // 10. Analytics
  if (!settings.google_analytics_id) {
    recommendations.push('Google Analytics غير مضاف');
    score -= 3;
  }

  // تحديد المستوى
  let level: SeoHealthReport['level'];
  if (score >= 90) level = 'excellent';
  else if (score >= 75) level = 'good';
  else if (score >= 50) level = 'fair';
  else level = 'poor';

  return {
    score: Math.max(0, score),
    level,
    issues,
    recommendations,
  };
}

// ═══════════════════════════════════════════════════════════════
// 🎯 Settings Helpers Object
// ═══════════════════════════════════════════════════════════════

export const settingsHelpers = {
  /**
   * 📞 رابط الاتصال
   */
  phoneLink: (phone?: string): string => {
    if (!phone) return '#';
    return `tel:${formatPhoneInternational(phone)}`;
  },

  /**
   * 💬 رابط واتساب
   */
  whatsappLink: (whatsapp?: string, message: string = ''): string => {
    if (!whatsapp) return '#';
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if (!cleanNumber) return '#';
    const finalMessage = message || 'مرحباً، أود الاستفسار';
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMessage)}`;
  },

  /**
   * 📧 رابط البريد
   */
  emailLink: (email?: string, subject: string = ''): string => {
    if (!email) return '#';
    return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  },

  /**
   * 🗺️ رابط Google Maps
   */
  mapLink: (lat?: string, lng?: string, address?: string): string => {
    if (lat && lng) return `https://www.google.com/maps?q=${lat},${lng}`;
    if (address) return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    return '#';
  },

  /**
   * 🏢 اسم الموقع
   */
  siteName: (settings: SiteSettings): string => {
    return settings.site_name_ar || settings.site_name || '';
  },

  /**
   * 📝 الشعار التعريفي
   */
  siteTagline: (settings: SiteSettings): string => {
    return settings.site_tagline_ar || settings.site_tagline || '';
  },

  /**
   * 📍 العنوان الكامل
   */
  fullAddress: (settings: SiteSettings): string => {
    const parts = [
      settings.address_ar || settings.address,
      settings.city_ar || settings.city,
      settings.country_ar || settings.country,
    ].filter(Boolean);
    return parts.join('، ');
  },

  /**
   * ⏰ ساعات العمل
   */
  workingTime: (settings: SiteSettings): string => {
    const days = settings.working_days_ar || settings.working_days || '';
    const hours = settings.working_hours_ar || settings.working_hours || '';
    if (days && hours) return `${days} | ${hours}`;
    return days || hours || '';
  },

  /**
   * 🖼️ URL الشعار
   */
  logoUrl: (settings: SiteSettings): string => {
    return buildMediaUrl(settings.site_logo);
  },

  /**
   * 🖼️ URL الأيقونة
   */
  faviconUrl: (settings: SiteSettings): string => {
    return buildMediaUrl(settings.site_favicon);
  },

  /**
   * 📝 استخراج نص ديناميكي
   */
  getText: (settings: SiteSettings, keys: string[], fallback: string = ''): string => {
    for (const key of keys) {
      const value = settings[key];
      if (typeof value === 'string' && value.trim()) return value;
    }
    return fallback;
  },

  /**
   * ✅ Trust Items
   */
  getTrustItems: (settings: SiteSettings): string[] => {
    return parseJsonField<string>(settings.trust_items_ar || settings.trust_items, []);
  },

  /**
   * 📊 Hero Stats
   */
  getHeroStats: (settings: SiteSettings): HeroStat[] => {
    return parseJsonField<HeroStat>(settings.hero_stats, []);
  },

  /**
   * ❓ FAQ Items
   */
  getFAQItems: (settings: SiteSettings): FAQItem[] => {
    return parseJsonField<FAQItem>(settings.faq_items, []);
  },

  /**
   * 🌍 Service Areas
   */
  getServiceAreas: (settings: SiteSettings): string[] => {
    return parseJsonField<string>(settings.service_areas_ar || settings.service_areas, []);
  },

  /**
   * 🛠️ Main Services
   */
  getMainServices: (settings: SiteSettings): string[] => {
    return parseJsonField<string>(settings.main_services_ar || settings.main_services, []);
  },

  /**
   * 🎯 Boolean Helpers
   */
  shouldShowTopBar: (settings: SiteSettings): boolean => {
    return parseBoolField(settings.show_top_bar, true);
  },

  allowAiSearch: (settings: SiteSettings): boolean => {
    return parseBoolField(settings.allow_ai_search, true);
  },

  allowAiTraining: (settings: SiteSettings): boolean => {
    return parseBoolField(settings.allow_ai_training, false);
  },

  /**
   * 🏢 Business Type Display
   */
  getBusinessTypeLabel: (settings: SiteSettings): string => {
    const type = settings.business_type;
    const labels: Record<string, string> = {
      'LocalBusiness': 'نشاط محلي',
      'HousePainter': 'معلم دهانات',
      'GeneralContractor': 'مقاول عام',
      'HomeAndConstructionBusiness': 'إنشاءات',
      'Plumber': 'سباك',
      'Electrician': 'كهربائي',
      'RoofingContractor': 'مقاول أسقف',
      'MovingCompany': 'شركة نقل',
      'CleaningService': 'خدمة تنظيف',
      'ProfessionalService': 'خدمة احترافية',
      'Restaurant': 'مطعم',
      'Store': 'متجر',
      'RealEstateAgent': 'عقارات',
      'AutoRepair': 'صيانة سيارات',
    };
    return labels[type || ''] || 'نشاط محلي';
  },
   /**
   * 🎯 Defaults للتوافق مع الكود القديم
   */
  defaults: {
    site_name: '',
    site_name_ar: '',
    site_tagline_ar: '',
    site_icon: '🏢',
    phone: '',
    whatsapp: '',
    email: '',
    address_ar: '',
    working_hours: '',
    working_days: '',
    cta_button_text: 'تواصل معنا',
    search_placeholder: 'ابحث...',
    search_button_text: 'بحث',
    call_button_text: 'اتصل الآن',
    whatsapp_button_text: 'واتساب',
    whatsapp_subtext: 'تواصل معنا',
    whatsapp_default_message: 'مرحباً، أود الاستفسار عن خدماتكم',
  } as const,
};

// ═══════════════════════════════════════════════════════════════
// 🎯 Type-safe Data Getters
// ═══════════════════════════════════════════════════════════════

/**
 * 🎨 بيانات الهيدر
 */
export function getHeaderData(settings: SiteSettings) {
  return {
    siteName: settingsHelpers.siteName(settings),
    siteTagline: settingsHelpers.siteTagline(settings),
    siteLogo: settingsHelpers.logoUrl(settings),
    siteIcon: settings.site_icon || '',
    phone: settings.phone || '',
    whatsapp: settings.whatsapp || settings.phone || '',
    ctaButtonText: settingsHelpers.getText(settings, [
      'cta_button_text_ar', 'cta_button_text'
    ], 'تواصل معنا'),
    searchPlaceholder: settingsHelpers.getText(settings, [
      'search_placeholder_ar', 'search_placeholder'
    ], 'ابحث...'),
    searchButtonText: settingsHelpers.getText(settings, [
      'search_button_text_ar', 'search_button_text'
    ], 'بحث'),
    callButtonText: settingsHelpers.getText(settings, [
      'call_button_text_ar', 'call_button_text'
    ], 'اتصل الآن'),
    whatsappButtonText: settingsHelpers.getText(settings, [
      'whatsapp_button_text_ar', 'whatsapp_button_text'
    ], 'واتساب'),
    whatsappSubtext: settingsHelpers.getText(settings, [
      'whatsapp_subtext_ar', 'whatsapp_subtext'
    ], 'تواصل معنا'),
    mobileMenuTitle: settingsHelpers.getText(settings, [
      'mobile_menu_title_ar', 'mobile_menu_title'
    ], settingsHelpers.siteName(settings)),
    mobileMenuSubtitle: settingsHelpers.getText(settings, [
      'mobile_menu_subtitle_ar', 'mobile_menu_subtitle'
    ], settingsHelpers.siteTagline(settings)),
  };
}

/**
 * 📊 بيانات TopBar
 */
export function getTopBarData(settings: SiteSettings) {
  return {
    show: settingsHelpers.shouldShowTopBar(settings),
    phone: settings.phone || '',
    email: settings.email || '',
    address: settings.address_ar || settings.address || '',
    workingTime: settingsHelpers.workingTime(settings),
  };
}

/**
 * 🎬 بيانات Hero
 */
export function getHeroData(settings: SiteSettings) {
  return {
    badgeText: settingsHelpers.getText(settings, [
      'hero_badge_text_ar', 'hero_badge_text'
    ], ''),
    titleLine1: settingsHelpers.getText(settings, [
      'hero_title_line1_ar', 'hero_title_line1', 'hero_title_ar', 'hero_title'
    ], ''),
    titleLine2: settingsHelpers.getText(settings, [
      'hero_title_line2_ar', 'hero_title_line2'
    ], ''),
    description: settingsHelpers.getText(settings, [
      'hero_description_ar', 'hero_description'
    ], ''),
    descHighlight: settingsHelpers.getText(settings, [
      'hero_desc_highlight_ar', 'hero_desc_highlight'
    ], ''),
    cities: settingsHelpers.getText(settings, [
      'hero_cities_ar', 'hero_cities'
    ], ''),
    callBtn: settingsHelpers.getText(settings, [
      'hero_call_btn_ar', 'hero_call_btn'
    ], 'اتصل الآن'),
    whatsappBtn: settingsHelpers.getText(settings, [
      'hero_whatsapp_btn_ar', 'hero_whatsapp_btn'
    ], 'واتساب'),
    whatsappSub: settingsHelpers.getText(settings, [
      'hero_whatsapp_sub_ar', 'hero_whatsapp_sub'
    ], 'تواصل فوري'),
    inquireBtn: settingsHelpers.getText(settings, [
      'hero_inquire_btn_ar', 'hero_inquire_btn'
    ], 'استفسر الآن'),
    whatsappMessage: settingsHelpers.getText(settings, [
      'whatsapp_default_message_ar', 'whatsapp_default_message'
    ], 'مرحباً، أود الاستفسار'),
    trustItems: settingsHelpers.getTrustItems(settings),
    stats: settingsHelpers.getHeroStats(settings),
    heroImage: buildMediaUrl(settings.hero_image),
    heroVideo: settings.hero_video || '',
  };
}

/**
 * 📞 بيانات Contact
 */
export function getContactData(settings: SiteSettings) {
  return {
    phone: settings.phone || '',
    phoneSecondary: settings.phone_secondary || '',
    whatsapp: settings.whatsapp || '',
    email: settings.email || '',
    address: settingsHelpers.fullAddress(settings),
    workingTime: settingsHelpers.workingTime(settings),
    mapLink: settingsHelpers.mapLink(
      settings.google_maps_lat || settings.latitude,
      settings.google_maps_lng || settings.longitude,
      settings.address_ar || settings.address
    ),
    phoneLink: settingsHelpers.phoneLink(settings.phone),
    whatsappLink: settingsHelpers.whatsappLink(
      settings.whatsapp,
      settings.whatsapp_default_message_ar || settings.whatsapp_default_message
    ),
    emailLink: settingsHelpers.emailLink(settings.email),
  };
}

/**
 * 🌐 بيانات Social Media
 */
export function getSocialMediaLinks(settings: SiteSettings) {
  const social: Record<string, string> = {};
  
  if (settings.facebook) social.facebook = settings.facebook;
  if (settings.instagram) social.instagram = settings.instagram;
  if (settings.twitter) social.twitter = settings.twitter;
  if (settings.youtube) social.youtube = settings.youtube;
  if (settings.tiktok) social.tiktok = settings.tiktok;
  if (settings.snapchat) social.snapchat = settings.snapchat;
  if (settings.linkedin) social.linkedin = settings.linkedin;
  if (settings.telegram) social.telegram = settings.telegram;
  if (settings.pinterest) social.pinterest = settings.pinterest;
  
  return social;
}