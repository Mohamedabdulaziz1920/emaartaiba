// src/app/manifest.ts
import type { MetadataRoute } from 'next';
import { getSiteSettings }    from '@/lib/settings';
import { buildImageUrl, toStr } from '@/lib/typeSafe';

export const revalidate = 86400; // ✅ 24 ساعة

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();

  // ✅ لا defaults خاصة بنشاط
  const siteName        = toStr(settings?.site_name_ar)        ||
                          toStr(settings?.site_name)           ||
                          '';
  const siteDescription = toStr(settings?.site_description_ar) ||
                          toStr(settings?.site_description)    ||
                          '';
  const themeColor      = toStr(settings?.primary_color)        || '#1a365d';

  // ✅ short_name من settings أو أول كلمة
  const shortName = toStr((settings as any)?.site_short_name) ||
                    siteName.split(' ')[0]                     ||
                    siteName.substring(0, 12)                  ||
                    '';

  // ✅ كل icon من مصدره الصحيح
  const faviconUrl = buildImageUrl(settings?.site_favicon) || '/favicon.ico';
  const icon192Url = buildImageUrl((settings as any)?.icon_192) || '/icons/icon-192x192.png';
  const icon512Url = buildImageUrl((settings as any)?.icon_512) || '/icons/icon-512x512.png';

  // ✅ categories من settings أو محايدة
  const categoriesRaw = toStr((settings as any)?.app_categories);
  const categories = categoriesRaw
    ? categoriesRaw.split(',').map(c => c.trim()).filter(Boolean)
    : ['business'];

  return {
    name:             siteName        || undefined,
    short_name:       shortName       || undefined,
    description:      siteDescription || undefined,
    start_url:        '/',
    display:          'standalone',
    background_color: '#ffffff',
    theme_color:      themeColor,
    orientation:      'portrait-primary',
    lang:             'ar',
    dir:              'rtl',
    categories,

    icons: [
      {
        src:   faviconUrl,
        sizes: 'any',
        type:  'image/x-icon',
      },
      {
        src:     icon192Url,
        sizes:   '192x192',
        type:    'image/png',
        purpose: 'maskable',
      },
      {
        src:     icon512Url,
        sizes:   '512x512',
        type:    'image/png',
        purpose: 'maskable',
      },
    ],

    // ✅ shortcuts من settings إذا وُجدت، وإلا shortcuts عامة
    shortcuts: buildShortcuts(settings),
  };
}

// ════════════════════════════════════════════════
// 🛠️ Helper: بناء shortcuts ديناميكي
// ════════════════════════════════════════════════
function buildShortcuts(settings: any): MetadataRoute.Manifest['shortcuts'] {
  // إذا كان في settings shortcuts مخصصة
  const customShortcuts = (settings as any)?.pwa_shortcuts;
  if (customShortcuts && Array.isArray(customShortcuts)) {
    return customShortcuts;
  }

  // shortcuts افتراضية عامة (مناسبة لأي موقع خدمات)
  const shortcuts: MetadataRoute.Manifest['shortcuts'] = [];

  // أضف فقط الصفحات التي يمكن تخمين وجودها
  const contactPage = toStr((settings as any)?.contact_page_url) || '/contact';
  shortcuts.push({
    name: 'تواصل معنا',
    url:  contactPage,
    icons: [{ src: '/icons/contact.png', sizes: '96x96' }],
  });

  // صفحة الخدمات (إذا كان النشاط يقدم خدمات - من settings)
  if (toStr(settings?.site_name_ar) || toStr(settings?.site_name)) {
    shortcuts.push({
      name: 'خدماتنا',
      url:  '/services',
      icons: [{ src: '/icons/services.png', sizes: '96x96' }],
    });
  }

  return shortcuts;
}