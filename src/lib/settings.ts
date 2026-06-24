import { api } from './api';

// ═══════════════════════════════════════════════════════════════
// 🎯 SiteSettings - النسخة المحسّنة
// ═══════════════════════════════════════════════════════════════

export interface SiteSettings {
  // ═══════════════════════════════════════
  // 🏢 Site Info
  // ═══════════════════════════════════════
  site_name?:           string;
  site_name_ar?:        string;
  site_name_en?:        string;
  site_tagline?:        string;
  site_tagline_ar?:     string;
  site_tagline_en?:     string;
  site_description?:    string;
  site_description_ar?: string;
  site_description_en?: string;
  site_logo?:           string;
  site_logo_dark?:      string;
  site_favicon?:        string;
  site_icon?:           string;
  site_url?:            string;

  // ═══════════════════════════════════════
  // 📞 Contact
  // ═══════════════════════════════════════
  phone?:               string;
  phone_secondary?:     string;
  whatsapp?:            string;
  whatsapp_secondary?:  string;
  email?:               string;
  email_secondary?:     string;
  fax?:                 string;
  // 📊 Stats
  engineers_count?:     string;  // ✅ إضافة
  google_tag_manager?:       string;  // ✅ إضافة (للتوافق مع Backend)

  // ═══════════════════════════════════════
  // 📍 Address
  // ═══════════════════════════════════════
  address?:             string;
  address_ar?:          string;
  address_en?:          string;
  city?:                string;
  city_ar?:             string;
  city_en?:             string;
  region?:              string;
  region_ar?:           string;
  region_en?:           string;
  country?:             string;
  country_ar?:          string;
  country_en?:          string;
  country_code?:        string;  // SA, AE, etc.
  postal_code?:         string;
  latitude?:            string;
  longitude?:           string;
  google_maps_lat?:     string;
  google_maps_lng?:     string;
  google_maps_url?:     string;
  google_maps_embed?:   string;

  // ═══════════════════════════════════════
  // ⏰ Working Hours
  // ═══════════════════════════════════════
  working_hours?:           string;
  working_hours_ar?:        string;
  working_days?:            string;
  working_days_ar?:         string;
  weekend_days?:            string;
  weekend_days_ar?:         string;
  working_hours_weekend?:   string;
  show_top_bar?:            string | boolean;

  // ═══════════════════════════════════════
  // 🌐 Social Media
  // ═══════════════════════════════════════
  facebook?:         string;
  facebook_url?:     string;
  twitter?:          string;
  twitter_url?:      string;
  twitter_handle?:   string;  // @username
  instagram?:        string;
  instagram_url?:    string;
  linkedin?:         string;
  linkedin_url?:     string;
  youtube?:          string;
  youtube_url?:      string;
  tiktok?:           string;
  tiktok_url?:       string;
  snapchat?:         string;
  telegram?:         string;
  pinterest?:        string;
  pinterest_url?:    string;

  // ═══════════════════════════════════════
  // 🔍 SEO & Meta
  // ═══════════════════════════════════════
  meta_title?:               string;
  meta_title_ar?:            string;
  meta_title_en?:            string;
  meta_description?:         string;
  meta_description_ar?:      string;
  meta_description_en?:      string;
  meta_keywords?:            string;
  meta_keywords_ar?:         string;
  meta_keywords_en?:         string;
  meta_image?:               string;  // OG image
  og_title?:                 string;
  og_title_ar?:              string;
  og_description?:           string;
  og_description_ar?:        string;
  og_image?:                 string;
  og_image_width?:           string;
  og_image_height?:          string;
  
  // Tracking & Verification
  google_analytics_id?:      string;
  google_tag_manager_id?:    string;
  google_site_verification?: string;
  bing_site_verification?:   string;
  yandex_verification?:      string;
  facebook_pixel_id?:        string;
  facebook_app_id?:          string;
  hotjar_id?:                string;

  // ═══════════════════════════════════════
  // ⭐ Ratings & Reviews
  // ═══════════════════════════════════════
  rating_value?:        string;  // 4.9
  review_count?:        string;  // 528
  best_rating?:         string;  // 5
  worst_rating?:        string;  // 1
  price_range?:         string;  // $$ or $$-$$$

  // ═══════════════════════════════════════
  // 📊 Stats
  // ═══════════════════════════════════════
  projects_completed?:  string;
  years_experience?:    string;
  happy_clients?:       string;
  team_members?:        string;

  // ═══════════════════════════════════════
  // 🎯 Header Texts
  // ═══════════════════════════════════════
  cta_button_text?:           string;
  cta_button_text_ar?:        string;
  search_placeholder?:        string;
  search_placeholder_ar?:     string;
  search_button_text?:        string;
  search_button_text_ar?:     string;
  call_button_text?:          string;
  call_button_text_ar?:       string;
  whatsapp_button_text?:      string;
  whatsapp_button_text_ar?:   string;
  whatsapp_subtext?:          string;
  whatsapp_subtext_ar?:       string;
  mobile_menu_title?:         string;
  mobile_menu_title_ar?:      string;
  mobile_menu_subtitle?:      string;
  mobile_menu_subtitle_ar?:   string;

  // ═══════════════════════════════════════
  // 🎬 Hero Section
  // ═══════════════════════════════════════
  hero_title?:           string;
  hero_title_ar?:        string;
  hero_title_line1?:     string;
  hero_title_line1_ar?:  string;
  hero_title_line2?:     string;
  hero_title_line2_ar?:  string;
  hero_subtitle?:        string;
  hero_subtitle_ar?:     string;
  hero_description?:     string;
  hero_description_ar?:  string;
  hero_desc_highlight?:  string;
  hero_desc_highlight_ar?: string;
  hero_cities?:          string;
  hero_cities_ar?:       string;
  hero_badge_text?:      string;
  hero_badge_text_ar?:   string;
  hero_image?:           string;
  hero_video?:           string;

  hero_call_btn?:        string;
  hero_call_btn_ar?:     string;
  hero_whatsapp_btn?:    string;
  hero_whatsapp_btn_ar?: string;
  hero_whatsapp_sub?:    string;
  hero_whatsapp_sub_ar?: string;
  hero_inquire_btn?:     string;
  hero_inquire_btn_ar?:  string;
  whatsapp_default_message?:    string;
  whatsapp_default_message_ar?: string;

  trust_items?:    string | string[];
  trust_items_ar?: string | string[];
  hero_stats?:     string | HeroStat[];

  // ═══════════════════════════════════════
  // 🏢 Business Info (للـ Schema)
  // ═══════════════════════════════════════
  business_type?:           string;  // GeneralContractor, etc.
  founding_date?:           string;
  founder_name?:            string;
  number_of_employees?:     string;
  legal_name?:              string;
  legal_name_ar?:           string;
  tax_id?:                  string;
  vat_number?:              string;
  commercial_registration?: string;
  
  // المناطق المخدومة
  service_areas?:           string | string[];
  service_areas_ar?:        string | string[];
  
  // الخدمات الرئيسية
  main_services?:           string | string[];
  main_services_ar?:        string | string[];

  // ═══════════════════════════════════════
  // 📝 Footer
  // ═══════════════════════════════════════
  footer_text?:           string;
  footer_text_ar?:        string;
  footer_description?:    string;
  footer_description_ar?: string;
  copyright_text?:        string;
  copyright_text_ar?:     string;
  footer_logo?:           string;

  // ═══════════════════════════════════════
  // 🎨 Theme
  // ═══════════════════════════════════════
  primary_color?:    string;
  secondary_color?:  string;
  accent_color?:     string;
  font_family?:      string;
  font_family_ar?:   string;

  // ═══════════════════════════════════════
  // 🔧 Index Signature
  // ═══════════════════════════════════════
  [key: string]: string | string[] | HeroStat[] | boolean | undefined;
}

// ═══════════════════════════════════════════════════════════════
// 🎯 Types (معرفة مرة واحدة فقط)
// ═══════════════════════════════════════════════════════════════

export interface HeroStat {
  num:    string;
  label:  string;
  icon?:  string;
  color?: string;
}

export interface TrustItem {
  text:  string;
  icon?: string;
}

// ═══════════════════════════════════════════════════════════════
// 🚀 Data Fetching
// ═══════════════════════════════════════════════════════════════

/**
 * جلب كل إعدادات الموقع (Server-side أو Client-side)
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const result = await api.settings();
    return (result?.data || {}) as SiteSettings;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return {};
  }
}

/**
 * ✅ جلب إعدادات التصميم والألوان - مع revalidate بدلاً من no-store
 */
export async function getDesignSettings(): Promise<any> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    // ✅ استخدام next: { revalidate } بدلاً من cache: 'no-store'
    const response = await fetch(`${API_BASE}/design-settings`, {
      next: { revalidate: 60 },  // ← إعادة التحقق كل 60 ثانية
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
}


/**
 * تحديث إعدادات الموقع (mass update)
 * @param data - الكائن الذي يحتوي على الإعدادات المراد تحديثها
 * @returns boolean - نجاح أو فشل العملية
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
 * تحديث إعداد واحد فقط
 * @param key - مفتاح الإعداد
 * @param value - القيمة الجديدة
 * @returns boolean - نجاح أو فشل العملية
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
 * جلب إعداد واحد بمفتاحه
 */
export async function getSetting(
  key: string,
  fallback: string = ''
): Promise<string> {
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
 * تحويل قيمة JSON من قاعدة البيانات إلى Array بأمان
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
 * تحويل قيمة Boolean من قاعدة البيانات
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
 * بناء URL كامل للصور من قاعدة البيانات
 */
export function buildMediaUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const clean = path.replace(/^\/+/, '');

  if (clean.startsWith('storage/')) return `${backend}/${clean}`;
  return `${backend}/storage/${clean}`;
}

// ═══════════════════════════════════════════════════════════════
// 🎯 Settings Helpers Object
// ═══════════════════════════════════════════════════════════════

export const settingsHelpers = {
  // ─────────── روابط اتصال ───────────

  /**
   * رابط الاتصال الهاتفي
   */
  phoneLink: (phone?: string): string => {
    if (!phone) return '#';
    return `tel:${phone.replace(/\s+/g, '')}`;
  },

  /**
   * رابط واتساب (مع رسالة افتراضية اختيارية)
   */
  whatsappLink: (
    whatsapp?: string,
    message: string = 'مرحباً، أود الاستفسار'
  ): string => {
    if (!whatsapp) return '#';
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if (!cleanNumber) return '#';
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  },

  /**
   * رابط البريد الإلكتروني
   */
  emailLink: (email?: string, subject: string = ''): string => {
    if (!email) return '#';
    return `mailto:${email}${
      subject ? `?subject=${encodeURIComponent(subject)}` : ''
    }`;
  },

  /**
   * رابط Google Maps
   */
  mapLink: (lat?: string, lng?: string, address?: string): string => {
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    if (address) {
      return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    }
    return '#';
  },

  // ─────────── النصوص الديناميكية ───────────

  /**
   * اسم الموقع (عربي أولوية ثم إنجليزي)
   */
  siteName: (settings: SiteSettings): string => {
    return (
      settings.site_name_ar ||
      settings.site_name ||
      settingsHelpers.defaults.site_name_ar
    );
  },

  /**
   * شعار الموقع (Tagline)
   */
  siteTagline: (settings: SiteSettings): string => {
    return settings.site_tagline_ar || settings.site_tagline || '';
  },

  /**
   * العنوان الكامل (مع المدينة والدولة)
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
   * ساعات العمل الكاملة (الأيام + الساعات)
   */
  workingTime: (settings: SiteSettings): string => {
    const days =
      settings.working_days_ar ||
      settings.working_days ||
      settingsHelpers.defaults.working_days;
    const hours =
      settings.working_hours_ar ||
      settings.working_hours ||
      settingsHelpers.defaults.working_hours;
    if (days && hours) return `${days} | ${hours}`;
    return days || hours || '';
  },

  // ─────────── معالجة الصور ───────────

  /**
   * URL كامل للشعار
   */
  logoUrl: (settings: SiteSettings): string => {
    return buildMediaUrl(settings.site_logo);
  },

  /**
   * URL كامل للأيقونة المفضلة
   */
  faviconUrl: (settings: SiteSettings): string => {
    return buildMediaUrl(settings.site_favicon);
  },

  // ─────────── النصوص الديناميكية ───────────

  /**
   * استخراج نص ديناميكي مع fallback متعدد
   */
  getText: (
    settings: SiteSettings,
    keys: string[],
    fallback: string = ''
  ): string => {
    for (const key of keys) {
      const value = settings[key];
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }
    return fallback;
  },

  // ─────────── Trust Items & Stats ───────────

  /**
   * جلب قائمة Trust Items (مع تحويل JSON)
   */
  getTrustItems: (settings: SiteSettings): string[] => {
    const items = parseJsonField<string>(
      settings.trust_items_ar || settings.trust_items,
      []
    );
    return items.length > 0 ? items : [];
  },

  /**
   * جلب قائمة Hero Stats (مع تحويل JSON)
   */
  getHeroStats: (settings: SiteSettings): HeroStat[] => {
    return parseJsonField<HeroStat>(settings.hero_stats, []);
  },

  // ─────────── Boolean Helpers ───────────

  /**
   * هل يجب إظهار TopBar؟
   */
  shouldShowTopBar: (settings: SiteSettings): boolean => {
    return parseBoolField(settings.show_top_bar, true);
  },

  // ─────────── Default Fallback Values ───────────

  defaults: {
    site_name: 'الموقع',
    site_name_ar: 'شركة البناء المتميز للمقاولات العامة',
    site_tagline_ar: 'للمقاولات العامة',
    site_icon: '🏗️',
    phone: '+966 50 000 0000',
    whatsapp: '966500000000',
    email: 'info@example.com',
    address_ar: 'جازان، المملكة العربية السعودية',
    working_hours: '8:00 ص - 5:00 م',
    working_days: 'الأحد - الخميس',
    cta_button_text: 'اتصل بنا',
    search_placeholder: 'ابحث في الموقع...',
    search_button_text: 'بحث',
    call_button_text: 'اتصل الآن',
    whatsapp_button_text: 'واتساب',
    whatsapp_subtext: 'تواصل معنا',
    whatsapp_default_message: 'مرحباً، أود الاستفسار عن خدماتكم',
  } as const,
};

// ═══════════════════════════════════════════════════════════════
// 🎯 Type-safe Getters للحقول المُعقّدة
// ═══════════════════════════════════════════════════════════════

/**
 * Hook-style: استخراج كل بيانات الهيدر المطلوبة
 */
export function getHeaderData(settings: SiteSettings) {
  return {
    siteName: settingsHelpers.siteName(settings),
    siteTagline: settingsHelpers.siteTagline(settings),
    siteLogo: settingsHelpers.logoUrl(settings),
    siteIcon: settings.site_icon || settingsHelpers.defaults.site_icon,
    phone: settings.phone || '',
    whatsapp: settings.whatsapp || settings.phone || '',
    ctaButtonText:
      settings.cta_button_text_ar ||
      settings.cta_button_text ||
      settingsHelpers.defaults.cta_button_text,
    searchPlaceholder:
      settings.search_placeholder_ar ||
      settings.search_placeholder ||
      settingsHelpers.defaults.search_placeholder,
    searchButtonText:
      settings.search_button_text_ar ||
      settings.search_button_text ||
      settingsHelpers.defaults.search_button_text,
    callButtonText:
      settings.call_button_text_ar ||
      settings.call_button_text ||
      settingsHelpers.defaults.call_button_text,
    whatsappButtonText:
      settings.whatsapp_button_text_ar ||
      settings.whatsapp_button_text ||
      settingsHelpers.defaults.whatsapp_button_text,
    whatsappSubtext:
      settings.whatsapp_subtext_ar ||
      settings.whatsapp_subtext ||
      settingsHelpers.defaults.whatsapp_subtext,
    mobileMenuTitle:
      settings.mobile_menu_title_ar ||
      settings.mobile_menu_title ||
      settingsHelpers.siteName(settings),
    mobileMenuSubtitle:
      settings.mobile_menu_subtitle_ar ||
      settings.mobile_menu_subtitle ||
      settingsHelpers.siteTagline(settings),
  };
}

/**
 * Hook-style: استخراج كل بيانات TopBar
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
 * Hook-style: استخراج كل بيانات Hero
 */
export function getHeroData(settings: SiteSettings) {
  return {
    badgeText:
      settings.hero_badge_text_ar ||
      settings.hero_badge_text ||
      `أفضل شركة في ${new Date().getFullYear()}`,
    titleLine1:
      settings.hero_title_line1_ar ||
      settings.hero_title_line1 ||
      settings.hero_title_ar ||
      settings.hero_title ||
      '',
    titleLine2:
      settings.hero_title_line2_ar || settings.hero_title_line2 || '',
    description:
      settings.hero_description_ar || settings.hero_description || '',
    descHighlight:
      settings.hero_desc_highlight_ar || settings.hero_desc_highlight || '',
    cities: settings.hero_cities_ar || settings.hero_cities || '',
    callBtn:
      settings.hero_call_btn_ar ||
      settings.hero_call_btn ||
      settingsHelpers.defaults.call_button_text,
    whatsappBtn:
      settings.hero_whatsapp_btn_ar ||
      settings.hero_whatsapp_btn ||
      settingsHelpers.defaults.whatsapp_button_text,
    whatsappSub:
      settings.hero_whatsapp_sub_ar ||
      settings.hero_whatsapp_sub ||
      'تواصل فوري',
    inquireBtn:
      settings.hero_inquire_btn_ar ||
      settings.hero_inquire_btn ||
      'استفسر الآن',
    whatsappMessage:
      settings.whatsapp_default_message_ar ||
      settings.whatsapp_default_message ||
      settingsHelpers.defaults.whatsapp_default_message,
    trustItems: settingsHelpers.getTrustItems(settings),
    stats: settingsHelpers.getHeroStats(settings),
    heroImage: buildMediaUrl(settings.hero_image),
    heroVideo: settings.hero_video || '',
  };
}