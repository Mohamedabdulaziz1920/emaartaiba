/**
 * ════════════════════════════════════════════════
 * 🛡️ Type-Safe Conversion Utilities
 * ════════════════════════════════════════════════
 * يحل مشاكل SiteSettings union types المعقّدة
 * مثل: string | string[] | HeroStat[] | boolean | undefined
 */

export function toStr(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return '';
  if (Array.isArray(value)) return '';
  if (typeof value === 'object') return '';
  return String(value);
}

export function toNumber(value: unknown, fallback = 0): number {
  const str = toStr(value).trim();
  if (!str) return fallback;
  const num = parseFloat(str);
  return isNaN(num) ? fallback : num;
}

export function toInt(value: unknown, fallback = 0): number {
  const str = toStr(value).trim();
  if (!str) return fallback;
  const num = parseInt(str, 10);
  return isNaN(num) ? fallback : num;
}

export function toBool(value: unknown, fallback = false): boolean {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on', 'نعم'].includes(v)) return true;
    if (['false', '0', 'no', 'off', 'لا', ''].includes(v)) return false;
  }
  if (typeof value === 'number') return value !== 0;
  return fallback;
}

export function toArray<T = string>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    if (!value.trim()) return [];
    // محاولة parse كـ JSON أولاً
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch { /* ignore */ }
    // إذا فشل، اعتبره مفصولاً بفواصل
    return value.split(',').map(s => s.trim()).filter(Boolean) as T[];
  }
  return [];
}

export function toUrl(value: unknown, fallback = ''): string {
  const str = toStr(value).trim();
  if (!str) return fallback;
  if (str.startsWith('http://') || str.startsWith('https://')) return str;
  if (str.startsWith('//')) return `https:${str}`;
  if (str.startsWith('/')) return str;
  return `https://${str}`;
}

export function toEmail(value: unknown): string {
  const str = toStr(value).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str) ? str : '';
}

export function toPhone(value: unknown): string {
  const str = toStr(value).trim();
  return str.replace(/[^\d+]/g, '');
}

export function toPhoneIntl(value: unknown, defaultCountryCode = '966'): string {
  let phone = toPhone(value);
  if (!phone) return '';
  if (phone.startsWith('+')) return phone;
  if (phone.startsWith('00')) return `+${phone.slice(2)}`;
  if (phone.startsWith('0')) return `+${defaultCountryCode}${phone.slice(1)}`;
  if (!phone.startsWith(defaultCountryCode)) return `+${defaultCountryCode}${phone}`;
  return `+${phone}`;
}

/**
 * تنظيف HTML من النص
 */
export function stripHtml(html?: unknown, maxLength?: number): string {
  const str = toStr(html);
  if (!str) return '';
  const clean = str
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
  if (maxLength && clean.length > maxLength) {
    return clean.substring(0, maxLength).trim() + '...';
  }
  return clean;
}

/**
 * بناء URL آمن لصورة
 */
export function buildImageUrl(path?: unknown): string {
  const str = toStr(path);
  if (!str) return '';
  if (str.startsWith('http://') || str.startsWith('https://')) return str;
  if (str.startsWith('data:') || str.startsWith('blob:')) return str;

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL ||
                  process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ||
                  'http://localhost:8000';
  const clean = str.replace(/^\/+/, '');
  if (clean.startsWith('storage/')) return `${backend}/${clean}`;
  return `${backend}/storage/${clean}`;
}

/**
 * استخراج قيمة من كائن مع fallback متعدد
 */
export function getValue(
  obj: any,
  keys: string | string[],
  fallback = ''
): string {
  if (!obj) return fallback;
  const keyArray = Array.isArray(keys) ? keys : [keys];
  for (const key of keyArray) {
    const val = toStr(obj[key]);
    if (val) return val;
  }
  return fallback;
}

/**
 * نسخ آمن لكائن
 */
export function safeObject<T extends Record<string, any>>(value: unknown, fallback: T): T {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  return value as T;
}
/**
 * تحويل null إلى undefined (مفيد للـ Metadata و Schemas)
 * لأن Next.js Metadata لا يقبل null
 */
export function toUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}