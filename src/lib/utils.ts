import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * دالة لدمج الأصناف (Classes) في Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تنسيق الأرقام بطريقة موحدة لتجنب مشكلة Hydration
 * تحويل الرقم إلى نص عادي بدون تنسيق خاص
 */
export function formatNumber(num: number): string {
  if (isNaN(num)) return '0';
  return num.toString();
}

/**
 * تنسيق الأرقام باللغة العربية
 * مثال: 1234 -> ١٢٣٤
 */
export function formatNumberArabic(num: number): string {
  if (isNaN(num)) return '٠';
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicNumbers[parseInt(d)]);
}

/**
 * تنسيق التاريخ باللغة العربية
 */
export function formatDate(date: string | Date, locale: string = 'ar-SA'): string {
  try {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * تنسيق الوقت باللغة العربية
 */
export function formatDateTime(date: string | Date, locale: string = 'ar-SA'): string {
  try {
    return new Date(date).toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * اختصار النص إلى طول محدد
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * إزالة HTML tags من النص
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * حساب وقت القراءة بالدقائق
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content) return 1;
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * توليد slug من النص
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * نسخ النص إلى الحافظة
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * الحصول على رابط الصورة من المسار
 */
export function getImageUrl(image: string | null | undefined): string {
  if (!image) return '';
  
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  if (image.startsWith('/storage')) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${backendUrl}${image}`;
  }
  
  if (image.startsWith('storage/')) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${backendUrl}/${image}`;
  }
  
  if (image.startsWith('blogs/')) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${backendUrl}/storage/${image}`;
  }
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return `${backendUrl}/storage/${image.replace(/^\/+/, '')}`;
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * التحقق من صحة رقم الهاتف السعودي
 */
export function isValidSaudiPhone(phone: string): boolean {
  const phoneRegex = /^(05|5)([0-9]{8})$/;
  return phoneRegex.test(phone);
}

/**
 * تحويل الأرقام العربية إلى إنجليزية
 */
export function arabicToEnglishNumbers(str: string): string {
  const arabicNumbers: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  return str.replace(/[٠-٩]/g, (d) => arabicNumbers[d]);
}

/**
 * تحويل الأرقام الإنجليزية إلى عربية
 */
export function englishToArabicNumbers(num: number): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicNumbers[parseInt(d)]);
}