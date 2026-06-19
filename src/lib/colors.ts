// src/lib/colors.ts
import { API_BASE } from './constants';

// ═══════════════════════════════════════════════════════════════════
// 🎨 تعريف الواجهات (Interfaces)
// ═══════════════════════════════════════════════════════════════════

export interface DesignSettings {
  // 🎨 الألوان الأساسية
  primary_color: string;
  primary_dark: string;
  primary_light: string;
  secondary_color: string;
  secondary_dark: string;
  secondary_light: string;
  accent_color: string;
  warning_color: string;
  danger_color: string;
  info_color: string;
  
  // 🖼️ الخلفيات
  bg_light: string;
  bg_dark: string;
  bg_card: string;
  bg_header: string;
  bg_footer: string;
  bg_hero: string;
  
  // 📝 النصوص
  text_dark: string;
  text_light: string;
  text_muted: string;
  text_link: string;
  
  // 🔘 الأزرار
  buttons: {
    primary: { bg: string; text: string; hover: string };
    secondary: { bg: string; text: string; hover: string };
  };
  
  // 📦 البطاقات
  cards: {
    border_radius: number;
    shadow: string;
    border_color: string;
    hover_effect: boolean;
  };
  
  // ✨ التأثيرات
  effects: {
    transition_duration: string;
    btn_border_radius: number;
    btn_padding_y: number;
    btn_padding_x: number;
    input_border_radius: number;
    input_border_color: string;
    input_focus_color: string;
  };
  
  // 📌 الهيدر والفوتر
  header: {
    bg: string;
    text: string;
    link: string;
    link_hover: string;
  };
  footer: {
    bg: string;
    text: string;
  };
  
  // 📱 الاستجابة
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  container_width: number;
  
  // 🎮 السلايدر
  slider: {
    autoplay: boolean;
    autoplay_delay: number;
  };
  
  // 📝 الخطوط
  typography: {
    font_family: string;
    font_family_headings: string;
    font_size_base: number;
    font_size_h1: number;
    font_size_h2: number;
    font_size_h3: number;
  };
}

// قالب التصميم
export interface DesignTemplate {
  name: string;
  description: string;
  icon: string;
  color: string;
  values: Partial<DesignSettings>;
}

// إحصائيات التصميم
export interface DesignStats {
  last_updated: string;
  has_custom_font: boolean;
  has_custom_colors: boolean;
  contrast_score: number;
}

// نتيجة فحص التصميم
export interface DesignValidation {
  success: boolean;
  issues: string[];
  warnings: string[];
  contrast_ratio: number | null;
}

// استجابة API العامة
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// للتوافق مع الكود القديم (اختياري)
export interface SiteColors {
  id?: number;
  primary_color: string;
  primary_dark: string;
  primary_light: string;
  secondary_color: string;
  secondary_dark: string;
  secondary_light: string;
  bg_light: string;
  bg_dark: string;
  bg_card: string;
  text_dark: string;
  text_light: string;
  text_muted: string;
  text_link: string;
  success_color?: string;
  warning_color?: string;
  error_color?: string;
  info_color?: string;
  btn_primary_bg: string;
  btn_primary_text: string;
  btn_primary_hover: string;
  btn_secondary_bg: string;
  btn_secondary_text: string;
  btn_secondary_hover: string;
  header_bg: string;
  header_text: string;
  footer_bg: string;
  footer_text: string;
}

// ═══════════════════════════════════════════════════════════════════
// 📦 القيم الافتراضية - الذهبي الملكي
// ═══════════════════════════════════════════════════════════════════

export const DEFAULT_COLORS: SiteColors = {
  id: 1,
  primary_color: '#1a365d',
  primary_dark: '#0f1729',
  primary_light: '#2b6cb0',
  secondary_color: '#D4AF37',
  secondary_dark: '#B8960F',
  secondary_light: '#F3E5AB',
  bg_light: '#f8faff',
  bg_dark: '#0f1729',
  bg_card: '#ffffff',
  text_dark: '#0f172a',
  text_light: '#ffffff',
  text_muted: '#64748b',
  text_link: '#D4AF37',
  success_color: '#10b981',
  warning_color: '#f59e0b',
  error_color: '#ef4444',
  info_color: '#3b82f6',
  btn_primary_bg: '#D4AF37',
  btn_primary_text: '#0f172a',
  btn_primary_hover: '#B8960F',
  btn_secondary_bg: '#1f2937',
  btn_secondary_text: '#ffffff',
  btn_secondary_hover: '#374151',
  header_bg: '#0f1729',
  header_text: '#ffffff',
  footer_bg: '#0f1729',
  footer_text: '#cbd5e0',
};

const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  primary_color: '#1a365d',
  primary_dark: '#0f1729',
  primary_light: '#2b6cb0',
  secondary_color: '#D4AF37',
  secondary_dark: '#B8960F',
  secondary_light: '#F3E5AB',
  accent_color: '#FFD700',
  warning_color: '#f59e0b',
  danger_color: '#ef4444',
  info_color: '#3b82f6',
  bg_light: '#f8faff',
  bg_dark: '#0f1729',
  bg_card: '#ffffff',
  bg_header: '#0f1729',
  bg_footer: '#0f1729',
  bg_hero: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
  text_dark: '#0f172a',
  text_light: '#ffffff',
  text_muted: '#64748b',
  text_link: '#D4AF37',
  buttons: {
    primary: { bg: '#D4AF37', text: '#0f172a', hover: '#B8960F' },
    secondary: { bg: '#1f2937', text: '#ffffff', hover: '#374151' },
  },
  cards: {
    border_radius: 16,
    shadow: '0 4px 20px rgba(0,0,0,0.08)',
    border_color: '#e2e8f0',
    hover_effect: true,
  },
  effects: {
    transition_duration: '0.3s',
    btn_border_radius: 12,
    btn_padding_y: 12,
    btn_padding_x: 24,
    input_border_radius: 8,
    input_border_color: '#e2e8f0',
    input_focus_color: '#D4AF37',
  },
  header: {
    bg: '#0f1729',
    text: '#ffffff',
    link: '#cbd5e0',
    link_hover: '#D4AF37',
  },
  footer: {
    bg: '#0f1729',
    text: '#cbd5e0',
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
  },
  container_width: 1400,
  slider: {
    autoplay: true,
    autoplay_delay: 5000,
  },
  typography: {
    font_family: 'Cairo',
    font_family_headings: 'Cairo',
    font_size_base: 16,
    font_size_h1: 48,
    font_size_h2: 36,
    font_size_h3: 24,
  },
};

// ═══════════════════════════════════════════════════════════════════
// 🌐 جلب الإعدادات من الـ API - ✅ مع `next: { revalidate }`
// ═══════════════════════════════════════════════════════════════════

// دالة مساعدة لبناء URL صحيح
function getDesignSettingsUrl(): string {
  // إذا كان API_BASE ينتهي بـ /api/v1، نضيف فقط /design-settings
  // إذا كان API_BASE لا ينتهي بـ /api/v1، نضيف /api/v1/design-settings
  if (API_BASE.endsWith('/api/v1')) {
    return `${API_BASE}/design-settings`;
  }
  if (API_BASE.endsWith('/api')) {
    return `${API_BASE}/v1/design-settings`;
  }
  return `${API_BASE}/design-settings`;
}

export async function getSiteColors(): Promise<SiteColors> {
  try {
    const url = getDesignSettingsUrl();
    // ✅ استخدام next: { revalidate } بدلاً من cache: 'no-store'
  const response = await fetch(url, {
  next: { revalidate: 60 },
  headers: { 'Accept': 'application/json' },
});
    
    if (!response.ok) {
      console.warn('Design settings API returned non-OK status:', response.status);
      return DEFAULT_COLORS;
    }
    
    const json = await response.json() as ApiResponse<any>;
    
    if (!json.success) {
      console.warn('Design settings API returned error:', json.message || 'Unknown error');
      return DEFAULT_COLORS;
    }
    
    const data = json.data;
    
    const convertedColors: SiteColors = {
      ...DEFAULT_COLORS,
      primary_color: data?.primary_color || DEFAULT_COLORS.primary_color,
      primary_dark: data?.primary_dark || DEFAULT_COLORS.primary_dark,
      primary_light: data?.primary_light || DEFAULT_COLORS.primary_light,
      secondary_color: data?.secondary_color || DEFAULT_COLORS.secondary_color,
      secondary_dark: data?.secondary_dark || DEFAULT_COLORS.secondary_dark,
      secondary_light: data?.secondary_light || DEFAULT_COLORS.secondary_light,
      bg_light: data?.bg_light || DEFAULT_COLORS.bg_light,
      bg_dark: data?.bg_dark || DEFAULT_COLORS.bg_dark,
      bg_card: data?.bg_card || DEFAULT_COLORS.bg_card,
      text_dark: data?.text_dark || DEFAULT_COLORS.text_dark,
      text_light: data?.text_light || DEFAULT_COLORS.text_light,
      text_muted: data?.text_muted || DEFAULT_COLORS.text_muted,
      text_link: data?.text_link || DEFAULT_COLORS.text_link,
      warning_color: data?.warning_color || DEFAULT_COLORS.warning_color,
      info_color: data?.info_color || DEFAULT_COLORS.info_color,
      btn_primary_bg: data?.buttons?.primary?.bg || data?.btn_primary_bg || DEFAULT_COLORS.btn_primary_bg,
      btn_primary_text: data?.buttons?.primary?.text || data?.btn_primary_text || DEFAULT_COLORS.btn_primary_text,
      btn_primary_hover: data?.buttons?.primary?.hover || data?.btn_primary_hover || DEFAULT_COLORS.btn_primary_hover,
      btn_secondary_bg: data?.buttons?.secondary?.bg || data?.btn_secondary_bg || DEFAULT_COLORS.btn_secondary_bg,
      btn_secondary_text: data?.buttons?.secondary?.text || data?.btn_secondary_text || DEFAULT_COLORS.btn_secondary_text,
      btn_secondary_hover: data?.buttons?.secondary?.hover || data?.btn_secondary_hover || DEFAULT_COLORS.btn_secondary_hover,
      header_bg: data?.header?.bg || data?.header_bg || DEFAULT_COLORS.header_bg,
      header_text: data?.header?.text || data?.header_text || DEFAULT_COLORS.header_text,
      footer_bg: data?.footer?.bg || data?.footer_bg || DEFAULT_COLORS.footer_bg,
      footer_text: data?.footer?.text || data?.footer_text || DEFAULT_COLORS.footer_text,
    };
    
    return convertedColors;
  } catch (error) {
    console.error('Failed to fetch design settings:', error);
    return DEFAULT_COLORS;
  }
}

export async function getDesignSettings(): Promise<DesignSettings> {
  try {
    const url = getDesignSettingsUrl();
    // ✅ استخدام next: { revalidate } بدلاً من cache: 'no-store'
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('Design settings API returned non-OK status:', response.status);
      return DEFAULT_DESIGN_SETTINGS;
    }
    
    const json = await response.json() as ApiResponse<DesignSettings>;
    
    if (!json.success) {
      console.warn('Design settings API returned error:', json.message || 'Unknown error');
      return DEFAULT_DESIGN_SETTINGS;
    }
    
    return json.data || DEFAULT_DESIGN_SETTINGS;
  } catch (error) {
    console.error('Failed to fetch design settings:', error);
    return DEFAULT_DESIGN_SETTINGS;
  }
}

// ═══════════════════════════════════════════════════════════════════
// ✨ ميزات جديدة
// ═══════════════════════════════════════════════════════════════════

/**
 * جلب قوالب التصميم الجاهزة
 */
export async function getDesignTemplates(): Promise<Record<string, DesignTemplate>> {
  try {
    const url = `${getDesignSettingsUrl()}/templates`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('Templates API returned non-OK status:', response.status);
      return {};
    }
    
    const json = await response.json() as ApiResponse<Record<string, DesignTemplate>>;
    
    if (json.success) {
      return json.data || {};
    }
    
    return {};
  } catch (error) {
    console.error('Failed to fetch design templates:', error);
    return {};
  }
}

/**
 * تطبيق قالب تصميم محدد
 */
export async function applyDesignTemplate(templateKey: string): Promise<DesignSettings | null> {
  try {
    const url = `${getDesignSettingsUrl()}/apply-template`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ template: templateKey }),
    });
    
    if (!response.ok) {
      console.warn('Apply template API returned non-OK status:', response.status);
      return null;
    }
    
    const json = await response.json() as ApiResponse<DesignSettings>;
    
    if (json.success) {
      console.log(`✅ Template "${templateKey}" applied successfully`);
      return json.data || null;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to apply template:', error);
    return null;
  }
}

/**
 * فحص صحة التصميم الحالي
 */
export async function validateDesignSettings(): Promise<DesignValidation | null> {
  try {
    const url = `${getDesignSettingsUrl()}/validate`;
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('Validate API returned non-OK status:', response.status);
      return null;
    }
    
    const json = await response.json() as ApiResponse<{ issues: string[]; warnings: string[]; contrast_ratio: number | null }>;
    
    return {
      success: json.success,
      issues: json.data?.issues || [],
      warnings: json.data?.warnings || [],
      contrast_ratio: json.data?.contrast_ratio || null,
    };
  } catch (error) {
    console.error('Failed to validate design:', error);
    return null;
  }
}

/**
 * جلب إحصائيات التصميم
 */
export async function getDesignStats(): Promise<DesignStats | null> {
  try {
    const url = `${getDesignSettingsUrl()}/stats`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('Stats API returned non-OK status:', response.status);
      return null;
    }
    
    const json = await response.json() as ApiResponse<DesignStats>;
    
    if (json.success) {
      return json.data || null;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch design stats:', error);
    return null;
  }
}

/**
 * إعادة تعيين إعدادات التصميم إلى القيم الافتراضية
 */
export async function resetDesignSettings(): Promise<DesignSettings | null> {
  try {
    const url = `${getDesignSettingsUrl()}/reset`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('Reset API returned non-OK status:', response.status);
      return null;
    }
    
    const json = await response.json() as ApiResponse<DesignSettings>;
    
    if (json.success) {
      console.log('✅ Design settings reset to default');
      return json.data || null;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to reset design settings:', error);
    return null;
  }
}

/**
 * جلب CSS variables كـ string
 */
export async function getDesignCSSVariables(): Promise<string | null> {
  try {
    const url = `${getDesignSettingsUrl()}/css`;
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      console.warn('CSS API returned non-OK status:', response.status);
      return null;
    }
    
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch CSS variables:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// 🎨 تطبيق الألوان على جذر المستند
// ═══════════════════════════════════════════════════════════════════

export function applyColorsToRoot(colors: SiteColors) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  const mappings: Record<string, string | undefined> = {
    '--color-primary': colors.primary_color,
    '--color-primary-dark': colors.primary_dark,
    '--color-primary-light': colors.primary_light,
    '--color-secondary': colors.secondary_color,
    '--color-secondary-dark': colors.secondary_dark,
    '--color-secondary-light': colors.secondary_light,
    '--color-bg-light': colors.bg_light,
    '--color-bg-dark': colors.bg_dark,
    '--color-bg-card': colors.bg_card,
    '--color-text-dark': colors.text_dark,
    '--color-text-light': colors.text_light,
    '--color-text-muted': colors.text_muted,
    '--color-text-link': colors.text_link,
    '--color-success': colors.success_color,
    '--color-warning': colors.warning_color,
    '--color-error': colors.error_color,
    '--color-info': colors.info_color,
    '--btn-primary-bg': colors.btn_primary_bg,
    '--btn-primary-text': colors.btn_primary_text,
    '--btn-primary-hover': colors.btn_primary_hover,
    '--btn-secondary-bg': colors.btn_secondary_bg,
    '--btn-secondary-text': colors.btn_secondary_text,
    '--btn-secondary-hover': colors.btn_secondary_hover,
    '--header-bg': colors.header_bg,
    '--header-text': colors.header_text,
    '--footer-bg': colors.footer_bg,
    '--footer-text': colors.footer_text,
  };
  
  Object.entries(mappings).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(key, value);
    }
  });
}

export function applyDesignSettingsToRoot(settings: DesignSettings) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // الألوان الأساسية
  root.style.setProperty('--color-primary', settings.primary_color);
  root.style.setProperty('--color-primary-dark', settings.primary_dark);
  root.style.setProperty('--color-primary-light', settings.primary_light);
  root.style.setProperty('--color-secondary', settings.secondary_color);
  root.style.setProperty('--color-secondary-dark', settings.secondary_dark);
  root.style.setProperty('--color-secondary-light', settings.secondary_light);
  root.style.setProperty('--color-accent', settings.accent_color);
  root.style.setProperty('--color-warning', settings.warning_color);
  root.style.setProperty('--color-danger', settings.danger_color);
  root.style.setProperty('--color-info', settings.info_color);
  
  // الخلفيات
  root.style.setProperty('--color-bg-light', settings.bg_light);
  root.style.setProperty('--color-bg-dark', settings.bg_dark);
  root.style.setProperty('--color-bg-card', settings.bg_card);
  root.style.setProperty('--color-bg-header', settings.bg_header);
  root.style.setProperty('--color-bg-footer', settings.bg_footer);
  root.style.setProperty('--color-bg-hero', settings.bg_hero);
  
  // النصوص
  root.style.setProperty('--color-text-dark', settings.text_dark);
  root.style.setProperty('--color-text-light', settings.text_light);
  root.style.setProperty('--color-text-muted', settings.text_muted);
  root.style.setProperty('--color-text-link', settings.text_link);
  
  // الأزرار
  root.style.setProperty('--btn-primary-bg', settings.buttons.primary.bg);
  root.style.setProperty('--btn-primary-text', settings.buttons.primary.text);
  root.style.setProperty('--btn-primary-hover', settings.buttons.primary.hover);
  root.style.setProperty('--btn-secondary-bg', settings.buttons.secondary.bg);
  root.style.setProperty('--btn-secondary-text', settings.buttons.secondary.text);
  root.style.setProperty('--btn-secondary-hover', settings.buttons.secondary.hover);
  
  // البطاقات
  root.style.setProperty('--card-border-radius', `${settings.cards.border_radius}px`);
  root.style.setProperty('--card-shadow', settings.cards.shadow);
  root.style.setProperty('--card-border-color', settings.cards.border_color);
  
  // التأثيرات
  root.style.setProperty('--transition-duration', settings.effects.transition_duration);
  root.style.setProperty('--btn-border-radius', `${settings.effects.btn_border_radius}px`);
  root.style.setProperty('--btn-padding-y', `${settings.effects.btn_padding_y}px`);
  root.style.setProperty('--btn-padding-x', `${settings.effects.btn_padding_x}px`);
  root.style.setProperty('--input-border-radius', `${settings.effects.input_border_radius}px`);
  root.style.setProperty('--input-border-color', settings.effects.input_border_color);
  root.style.setProperty('--input-focus-color', settings.effects.input_focus_color);
  
  // الهيدر والفوتر
  root.style.setProperty('--header-bg', settings.header.bg);
  root.style.setProperty('--header-text', settings.header.text);
  root.style.setProperty('--header-link', settings.header.link);
  root.style.setProperty('--header-link-hover', settings.header.link_hover);
  root.style.setProperty('--footer-bg', settings.footer.bg);
  root.style.setProperty('--footer-text', settings.footer.text);
  
  // الاستجابة
  root.style.setProperty('--breakpoint-mobile', `${settings.breakpoints.mobile}px`);
  root.style.setProperty('--breakpoint-tablet', `${settings.breakpoints.tablet}px`);
  root.style.setProperty('--breakpoint-desktop', `${settings.breakpoints.desktop}px`);
  root.style.setProperty('--container-width', `${settings.container_width}px`);
  
  // السلايدر
  root.style.setProperty('--slider-autoplay-delay', `${settings.slider.autoplay_delay}ms`);
  root.style.setProperty('--slider-autoplay', settings.slider.autoplay ? '1' : '0');
  
  // الخطوط
  root.style.setProperty('--font-family', `'${settings.typography.font_family}', sans-serif`);
  root.style.setProperty('--font-family-headings', `'${settings.typography.font_family_headings}', sans-serif`);
  root.style.setProperty('--font-size-base', `${settings.typography.font_size_base}px`);
  root.style.setProperty('--font-size-h1', `${settings.typography.font_size_h1}px`);
  root.style.setProperty('--font-size-h2', `${settings.typography.font_size_h2}px`);
  root.style.setProperty('--font-size-h3', `${settings.typography.font_size_h3}px`);
}

// ═══════════════════════════════════════════════════════════════════
// 🔄 دالة مساعدة لتهيئة النظام بالكامل
// ═══════════════════════════════════════════════════════════════════

export async function initializeDesignSystem() {
  const settings = await getDesignSettings();
  applyDesignSettingsToRoot(settings);
  return settings;
}