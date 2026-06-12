'use client';

import { useEffect, useState } from 'react';
import { getSiteColors, SiteColors } from '@/lib/colors';

export function useColors() {
  const [colors, setColors] = useState<SiteColors | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const data = await getSiteColors();
        setColors(data);
        
        // تطبيق CSS Variables على :root
        const root = document.documentElement;
        root.style.setProperty('--color-primary', data.primary_color || '#1a365d');
        root.style.setProperty('--color-primary-dark', data.primary_dark || '#0f1729');
        root.style.setProperty('--color-primary-light', data.primary_light || '#2b6cb0');
        root.style.setProperty('--color-secondary', data.secondary_color || '#ed8936');
        root.style.setProperty('--color-secondary-dark', data.secondary_dark || '#dd6b20');
        root.style.setProperty('--color-secondary-light', data.secondary_light || '#fbd38d');
        root.style.setProperty('--color-bg-light', data.bg_light || '#f8faff');
        root.style.setProperty('--color-bg-dark', data.bg_dark || '#0f1729');
        root.style.setProperty('--color-bg-card', data.bg_card || '#ffffff');
        root.style.setProperty('--color-text-dark', data.text_dark || '#0f172a');
        root.style.setProperty('--color-text-light', data.text_light || '#ffffff');
        root.style.setProperty('--color-text-muted', data.text_muted || '#64748b');
        root.style.setProperty('--color-text-link', data.text_link || '#1a365d');
        root.style.setProperty('--color-success', data.success_color || '#10b981');
        root.style.setProperty('--color-warning', data.warning_color || '#f59e0b');
        root.style.setProperty('--color-error', data.error_color || '#ef4444');
        root.style.setProperty('--color-info', data.info_color || '#3b82f6');
        root.style.setProperty('--btn-primary-bg', data.btn_primary_bg || '#ed8936');
        root.style.setProperty('--btn-primary-text', data.btn_primary_text || '#ffffff');
        root.style.setProperty('--btn-primary-hover', data.btn_primary_hover || '#dd6b20');
        root.style.setProperty('--btn-secondary-bg', data.btn_secondary_bg || '#1f2937');
        root.style.setProperty('--btn-secondary-text', data.btn_secondary_text || '#ffffff');
        root.style.setProperty('--btn-secondary-hover', data.btn_secondary_hover || '#374151');
        root.style.setProperty('--header-bg', data.header_bg || 'rgba(15, 23, 41, 0.95)');
        root.style.setProperty('--header-text', data.header_text || '#ffffff');
        root.style.setProperty('--footer-bg', data.footer_bg || '#0f1729');
        root.style.setProperty('--footer-text', data.footer_text || '#cbd5e0');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load colors');
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  return { colors, loading, error };
}
