import { API_BASE } from '@/lib/constants';

async function getColors(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_BASE}/site-colors`, {
      cache: 'no-store',
    });

    if (!res.ok) return {};

    const json = await res.json();
    return json.data || {};
  } catch (error) {
    console.error('Failed to fetch site colors:', error);
    return {};
  }
}

export default async function DynamicColors() {
  const colors = await getColors();

  const cssVars = `
    :root {
      --color-primary: ${colors.primary_color || '#1a365d'};
      --color-primary-dark: ${colors.primary_dark || '#0f1729'};
      --color-primary-light: ${colors.primary_light || '#2b6cb0'};
      --color-secondary: ${colors.secondary_color || '#ed8936'};
      --color-secondary-dark: ${colors.secondary_dark || '#dd6b20'};
      --color-secondary-light: ${colors.secondary_light || '#fbd38d'};
      
      --color-bg-light: ${colors.bg_light || '#f8faff'};
      --color-bg-dark: ${colors.bg_dark || '#0f1729'};
      --color-bg-card: ${colors.bg_card || '#ffffff'};
      
      --color-text-dark: ${colors.text_dark || '#0f172a'};
      --color-text-light: ${colors.text_light || '#ffffff'};
      --color-text-muted: ${colors.text_muted || '#64748b'};
      --color-text-link: ${colors.text_link || '#1a365d'};
      
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