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
// 🌐 API Base URL (قد لا تكون مستخدمة الآن ولكن نحتفظ بها للتوافق)
// ═══════════════════════════════════════════════════
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ═══════════════════════════════════════════════════
// 🏠 قيم افتراضية (Fallback) - تستخدم فقط إذا فشل API
// ═══════════════════════════════════════════════════
export const SITE_FALLBACK: SiteInfo = {
  name: 'البناء المتميز',
  name_ar: 'شركة البناء المتميز للمقاولات العامة',
  phone: '+966 50 000 0000',
  whatsapp: '966500000000',
  email: 'info@example.com',
  address: 'الرياض، المملكة العربية السعودية',
  meta_title: 'شركة البناء المتميز | أفضل شركة مقاولات في السعودية',
  meta_description: 'خبرة +20 سنة في الدهانات والديكورات والمقاولات',
  meta_keywords: 'مقاولات, دهانات, ديكورات, بناء, تشطيبات',
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
// 🔄 دوال لجلب البيانات الديناميكية (باستخدام النظام الموحد)
// ═══════════════════════════════════════════════════

/**
 * جلب معلومات الموقع من API (باستخدام getSiteSettings الموحد)
 */
export async function fetchSiteInfo(): Promise<SiteInfo> {
  try {
    const settings = await getSiteSettings();
    return {
      name: settings.site_name || SITE_FALLBACK.name,
      name_ar: settings.site_name_ar || SITE_FALLBACK.name_ar,
      phone: settings.phone || SITE_FALLBACK.phone,
      whatsapp: settings.whatsapp || settings.phone || SITE_FALLBACK.whatsapp,
      email: settings.email || SITE_FALLBACK.email,
      address: settings.address_ar || settings.address || SITE_FALLBACK.address,
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
 * جلب قائمة التنقل من API (باستخدام api.navigation الموحد)
 */
export async function fetchNavigation(): Promise<NavItem[]> {
  try {
    const navItems = await api.navigation();
    if (!navItems || navItems.length === 0) {
      return getDefaultNavigation();
    }

    // تحويل البيانات إلى التنسيق المطلوب
    return navItems.map((item: ApiNavItem) => ({
      label: item.label,
      href: item.href,
      children: item.children?.map((child: ApiNavItem) => ({
        label: child.label,
        href: child.href,
        description: child.description,
        icon: child.icon,
      })),
    }));
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return getDefaultNavigation();
  }
}

/**
 * قائمة التنقل الافتراضية (عند فشل API)
 */
export function getDefaultNavigation(): NavItem[] {
  return [
    { label: 'الرئيسية', href: '/' },
    { label: 'من نحن', href: '/about' },
    { 
      label: 'خدماتنا', 
      href: '/services',
      children: [
        { label: 'مقاولات عامة', href: '/services/general-contracting', description: 'جميع أعمال المقاولات العامة', icon: '🏗️' },
        { label: 'دهانات داخلية', href: '/services/interior-paints', description: 'أحدث تقنيات الدهانات الداخلية', icon: '🎨' },
        { label: 'دهانات خارجية', href: '/services/exterior-paints', description: 'دهانات مقاومة للعوامل الجوية', icon: '🏠' },
        { label: 'ديكورات داخلية', href: '/services/interior-decoration', description: 'تصاميم عصرية وفاخرة', icon: '✨' },
        { label: 'بديل الرخام', href: '/services/marble-alternative', description: 'حلول اقتصادية وفاخرة', icon: '💎' },
        { label: 'ديكورات الجبس', href: '/services/gypsum-decoration', description: 'أعمال الجبس بأشكال مميزة', icon: '🏛️' },
      ]
    },
    { label: 'مشاريعنا', href: '/projects' },
    { 
      label: 'مناطق خدمتنا', 
      href: '/areas',
      children: [
        { label: 'شمال جدة', href: '/areas/north-jeddah', icon: '📍' },
        { label: 'جنوب جدة', href: '/areas/south-jeddah', icon: '📍' },
        { label: 'شرق جدة', href: '/areas/east-jeddah', icon: '📍' },
        { label: 'غرب جدة', href: '/areas/west-jeddah', icon: '📍' },
        { label: 'وسط جدة', href: '/areas/central-jeddah', icon: '📍' },
        { label: 'جميع المناطق', href: '/areas', icon: '🗺️' },
      ]
    },
    { label: 'المدونة', href: '/blog' },
    { label: 'تواصل معنا', href: '/contact' },
  ];
}

// ============================================
// 🏭 مصنع لإنشاء كائن SITE ديناميكي (للتوافق)
// ============================================

// للاستخدام في Server Components (async)
export async function createSiteInfo(): Promise<SiteInfo> {
  return await fetchSiteInfo();
}

// للاستخدام في Client Components
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