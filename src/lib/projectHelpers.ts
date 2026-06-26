// src/lib/projectHelpers.ts

/**
 * الحصول على معلومات حالة المشروع
 */
export function getProjectStatusInfo(status?: string): {
  label: string;
  icon: string;
  color: string;
} {
  switch (status) {
    case 'completed':
      return { label: 'مكتمل', icon: '✅', color: '#10b981' };
    case 'in_progress':
      return { label: 'قيد التنفيذ', icon: '🔨', color: '#ed8936' };
    case 'planned':
      return { label: 'مخطط', icon: '📅', color: '#64748b' };
    case 'paused':
      return { label: 'متوقف مؤقتاً', icon: '⏸️', color: '#f59e0b' };
    case 'cancelled':
      return { label: 'ملغي', icon: '❌', color: '#ef4444' };
    default:
      return { label: 'نشط', icon: '🟢', color: '#3b82f6' };
  }
}

/**
 * تنسيق المساحة بالمتر المربع
 */
export function formatArea(area?: number | string | null): string {
  if (!area) return 'غير محدد';
  const num = typeof area === 'string' ? parseFloat(area) : area;
  if (isNaN(num)) return 'غير محدد';
  return `${num.toLocaleString('ar-SA')} م²`;
}
