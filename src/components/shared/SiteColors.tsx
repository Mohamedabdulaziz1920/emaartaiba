import { API_BASE } from '@/lib/constants';

// Server Component - يعمل على السيرفر
export default async function SiteColors() {
  let colors: Record<string, string> = {};

  try {
    const res = await fetch(`${API_BASE}/site-colors`, {
      next: { revalidate: 60 }, // إعادة التحقق كل دقيقة
    });
    
    if (res.ok) {
      const json = await res.json();
      colors = json.data || {};
    }
  } catch (error) {
    console.error('Failed to fetch site colors:', error);
  }

  // إذا لم تنجح، استخدم الألوان الافتراضية
  const cssVars = `
    :root {
      --primary-color: ${colors.primary_color || '#1a365d'};
      --primary-dark: ${colors.primary_dark || '#0f1729'};
      --primary-light: ${colors.primary_light || '#2b6cb0'};
      
      --secondary-color: ${colors.secondary_color || '#ed8936'};
      --secondary-dark: ${colors.secondary_dark || '#dd6b20'};
      --secondary-light: ${colors.secondary_light || '#fbd38d'};
      
      --bg-light: ${colors.bg_light || '#f8faff'};
      --bg-dark: ${colors.bg_dark || '#0f1729'};
      --bg-card: ${colors.bg_card || '#ffffff'};
      
      --text-dark: ${colors.text_dark || '#0f172a'};
      --text-light: ${colors.text_light || '#ffffff'};
      --text-muted: ${colors.text_muted || '#64748b'};
      --text-link: ${colors.text_link || '#1a365d'};
      
      --btn-primary-bg: ${colors.btn_primary_bg || '#ed8936'};
      --btn-primary-text: ${colors.btn_primary_text || '#ffffff'};
      --btn-primary-hover: ${colors.btn_primary_hover || '#dd6b20'};
      
      --btn-secondary-bg: ${colors.btn_secondary_bg || '#1f2937'};
      --btn-secondary-text: ${colors.btn_secondary_text || '#ffffff'};
      --btn-secondary-hover: ${colors.btn_secondary_hover || '#374151'};
      
      --header-bg: ${colors.header_bg || 'rgba(15, 23, 41, 0.95)'};
      --header-text: ${colors.header_text || '#ffffff'};
      
      --footer-bg: ${colors.footer_bg || '#0f1729'};
      --footer-text: ${colors.footer_text || '#cbd5e0'};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: cssVars }} />;
}