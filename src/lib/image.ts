// src/lib/image.ts
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1')
  .replace('/api/v1', '');

/**
 * ✅ الدالة الأساسية لتحويل مسار الصورة إلى رابط كامل
 * هذه هي الدالة الوحيدة التي يجب استخدامها في جميع أنحاء المشروع
 */
export function imageUrl(path: string | null | undefined, fallback?: string): string {
  if (!path) return fallback || '';

  // إذا كان رابط كامل مسبقاً
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // إزالة / الزائدة من البداية
  const cleanPath = path.replace(/^\/+/, '');

  // إذا كانت تبدأ بـ storage/ أبقها كما هي
  if (cleanPath.startsWith('storage/')) {
    return `${API_BASE}/${cleanPath}`;
  }

  // وإلا أضف storage/
  return `${API_BASE}/storage/${cleanPath}`;
}

/**
 * ✅ نفس الدالة باسم مختلف للتوافق مع الكود القديم
 */
export function buildImageUrl(path: string | null | undefined, fallback?: string): string {
  return imageUrl(path, fallback);
}

/**
 * ✅ نفس الدالة باسم مختلف للتوافق مع api.ts
 */
export function getImageUrl(path: string | null | undefined, fallback?: string): string {
  return imageUrl(path, fallback);
}

/**
 * صور placeholder حسب النوع
 */
export const placeholderImage = {
  service: '/images/placeholders/service.jpg',
  project: '/images/placeholders/project.jpg',
  blog:    '/images/placeholders/blog.jpg',
  area:    '/images/placeholders/area.jpg',
  team:    '/images/placeholders/team.jpg',
  gallery: '/images/placeholders/gallery.jpg',
  default: '/images/placeholders/default.jpg',
} as const;

export type PlaceholderType = keyof typeof placeholderImage;

/**
 * الحصول على صورة placeholder حسب النوع
 */
export function getPlaceholder(type: PlaceholderType = 'default'): string {
  return placeholderImage[type] || placeholderImage.default;
}

/**
 * التحقق من صحة رابط الصورة
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  if (url.startsWith('data:image/')) return true;
  if (url.startsWith('/storage/') || url.startsWith('/uploads/') || url.startsWith('/images/')) return true;
  return false;
}