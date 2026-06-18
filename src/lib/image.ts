const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1')
  .replace('/api/v1', '');

/**
 * يحول مسار الصورة إلى رابط كامل
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
 * صور placeholder حسب النوع
 */
export const placeholderImage = {
  service: '/images/placeholders/service.jpg',
  project: '/images/placeholders/project.jpg',
  blog:    '/images/placeholders/blog.jpg',
  area:    '/images/placeholders/area.jpg',
  team:    '/images/placeholders/team.jpg',
};
