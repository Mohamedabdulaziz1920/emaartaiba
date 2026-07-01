import type { MetadataRoute } from 'next';
import { getSiteSettings, buildMediaUrl } from '@/lib/settings';

// ✅ لا يوجد أي export configuration

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  try {
    const settings = await getSiteSettings();
    
    const siteName = String(
      settings?.site_name_ar || 
      settings?.site_name || 
      ''
    );
    
    const shortName = siteName.length > 12 
      ? siteName.substring(0, 12) 
      : siteName;
    
    const description = String(
      settings?.site_description_ar || 
      settings?.site_description || 
      settings?.meta_description_ar || 
      ''
    );
    
    const themeColor = String(settings?.primary_color || '#1a365d');
    const bgColor = String(settings?.bg_color || '#ffffff');
    
    const logoUrl = settings?.site_logo 
      ? buildMediaUrl(settings.site_logo) 
      : '';
    
    const faviconUrl = settings?.site_favicon 
      ? buildMediaUrl(settings.site_favicon) 
      : '';
    
    const icons: MetadataRoute.Manifest['icons'] = [];
    
    if (logoUrl) {
      icons.push(
        {
          src: logoUrl,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: logoUrl,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        }
      );
    }
    
    if (faviconUrl) {
      icons.push({
        src: faviconUrl,
        sizes: '32x32',
        type: 'image/x-icon',
      });
    }
    
    if (icons.length === 0 && faviconUrl) {
      icons.push({
        src: faviconUrl,
        sizes: 'any',
        type: 'image/x-icon',
      });
    }

    return {
      name: siteName,
      short_name: shortName,
      description: description,
      start_url: '/',
      display: 'standalone',
      background_color: bgColor,
      theme_color: themeColor,
      orientation: 'portrait-primary',
      scope: '/',
      lang: 'ar',
      dir: 'rtl',
      icons: icons.length > 0 ? icons : undefined,
      categories: ['business'],
    };
    
  } catch (error) {
    console.error('❌ Manifest generation error:', error);
    
    return {
      name: '',
      short_name: '',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#1a365d',
    };
  }
}