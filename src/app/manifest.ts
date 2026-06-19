// src/app/manifest.ts
import type { MetadataRoute } from 'next';
import { getSiteSettings, buildMediaUrl } from '@/lib/settings';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  
  const siteName = settings?.site_name_ar || settings?.site_name || 'البناء المتميز';
  const siteDescription = settings?.site_description_ar || settings?.site_description || 'شركة مقاولات عامة رائدة في السعودية';
  const themeColor = settings?.primary_color || '#1a365d';
  const favicon = settings?.site_favicon ? buildMediaUrl(settings.site_favicon) : null;
  
  return {
    name: siteName,
    short_name: siteName.length > 12 ? siteName.substring(0, 12) + '...' : siteName,
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: themeColor,
    orientation: 'portrait-primary',
    lang: 'ar',
    dir: 'rtl',
    categories: ['business', 'construction'],
    icons: [
      {
        src: favicon || '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: favicon || '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: favicon || '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'خدماتنا',
        url: '/services',
        icons: [{ src: '/icons/services.png', sizes: '96x96' }],
      },
      {
        name: 'مشاريعنا',
        url: '/projects',
        icons: [{ src: '/icons/projects.png', sizes: '96x96' }],
      },
      {
        name: 'تواصل معنا',
        url: '/contact',
        icons: [{ src: '/icons/contact.png', sizes: '96x96' }],
      },
    ],
  };
}