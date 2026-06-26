// frontend/src/lib/constants.ts

import { getSiteSettings } from './settings';
import { api, type NavItem as ApiNavItem } from './api';

// ═══════════════════════════════════════════════════
// 📋 Types
// ═══════════════════════════════════════════════════
export interface NavChild {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  description?: string; // ✅ إضافة
  icon?: string; // ✅ إضافة
}

export interface SiteInfo {
  name: string;
  name_ar: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  logo?: string;
  favicon?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

// ═══════════════════════════════════════════════════
// 🌐 API Base URL
// ═══════════════════════════════════════════════════
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ═══════════════════════════════════════════════════
// 🏠 قيم افتراضية (Fallback)
// ═══════════════════════════════════════════════════
export const SITE_FALLBACK: SiteInfo = {
  name: '',
  name_ar: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
};

// ✅ للتوافق مع المكونات القديمة
export const SITE = {
  name: SITE_FALLBACK.name,
  name_ar: SITE_FALLBACK.name_ar,
  phone: SITE_FALLBACK.phone,
  whatsapp: SITE_FALLBACK.whatsapp,
  email: SITE_FALLBACK.email,
  address: SITE_FALLBACK.address,
} as const;

// ═══════════════════════════════════════════════════
// 🔄 دوال لجلب البيانات الديناميكية
// ═══════════════════════════════════════════════════

/**
 * جلب معلومات الموقع من API
 */
export async function fetchSiteInfo(): Promise<SiteInfo> {
  try {
    const settings = await getSiteSettings();
    return {
      name: settings.site_name || '',
      name_ar: settings.site_name_ar || '',
      phone: settings.phone || '',
      whatsapp: settings.whatsapp || '',
      email: settings.email || '',
      address: settings.address_ar || settings.address || '',
      logo: settings.site_logo,
      favicon: settings.site_favicon,
      meta_title: settings.meta_title_ar || settings.meta_title,
      meta_description: settings.meta_description_ar || settings.meta_description,
      meta_keywords: settings.meta_keywords_ar || settings.meta_keywords,
    };
  } catch (error) {
    console.error('Error fetching site info:', error);
    return SITE_FALLBACK;
  }
}

/**
 * جلب قائمة التنقل من API
 */
export async function fetchNavigation(): Promise<NavItem[]> {
  try {
    const navItems = await api.navigation();
    if (!navItems || navItems.length === 0) {
      return getDefaultNavigation();
    }

    return navItems.map((item: ApiNavItem) => ({
      label: item.label,
      href: item.href,
      description: (item as any).description, // قد يكون موجوداً
      icon: (item as any).icon, // قد يكون موجوداً
      children: item.children?.map((child: ApiNavItem) => ({
        label: child.label,
        href: child.href,
        description: (child as any).description,
        icon: (child as any).icon,
      })),
    }));
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return getDefaultNavigation();
  }
}

/**
 * قائمة التنقل الافتراضية
 */
export function getDefaultNavigation(): NavItem[] {
  return [
    { label: 'الرئيسية', href: '/' },
    { label: 'من نحن', href: '/about' },
    { 
      label: 'خدماتنا', 
      href: '/services',
      children: [
        { label: 'مقاولات عامة', href: '/services/general-contracting' },
        { label: 'دهانات داخلية', href: '/services/interior-paints' },
        { label: 'دهانات خارجية', href: '/services/exterior-paints' },
        { label: 'ديكورات داخلية', href: '/services/interior-decoration' },
        { label: 'بديل الرخام', href: '/services/marble-alternative' },
        { label: 'ديكورات الجبس', href: '/services/gypsum-decoration' },
      ]
    },
    { label: 'مشاريعنا', href: '/projects' },
    { 
      label: 'مناطق خدمتنا', 
      href: '/areas',
      children: [
        { label: 'شمال جدة', href: '/areas/north-jeddah' },
        { label: 'جنوب جدة', href: '/areas/south-jeddah' },
        { label: 'شرق جدة', href: '/areas/east-jeddah' },
        { label: 'غرب جدة', href: '/areas/west-jeddah' },
        { label: 'وسط جدة', href: '/areas/central-jeddah' },
        { label: 'جميع المناطق', href: '/areas' },
      ]
    },
    { label: 'المدونة', href: '/blog' },
    { label: 'تواصل معنا', href: '/contact' },
  ];
}

// ============================================
// 🏭 مصنع لإنشاء كائن SITE ديناميكي
// ============================================

export async function createSiteInfo(): Promise<SiteInfo> {
  return await fetchSiteInfo();
}

let cachedSiteInfo: SiteInfo | null = null;

export async function getCachedSiteInfo(): Promise<SiteInfo> {
  if (!cachedSiteInfo) {
    cachedSiteInfo = await fetchSiteInfo();
  }
  return cachedSiteInfo;
}

export function resetCache(): void {
  cachedSiteInfo = null;
}
