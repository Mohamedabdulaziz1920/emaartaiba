// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/shared/FloatingButtons';
import ScrollToTop from '@/components/shared/ScrollToTop';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteSettings, buildMediaUrl } from '@/lib/settings';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SliderThemeProvider } from '@/components/providers/SliderThemeProvider';
import { api, type NavItem } from '@/lib/api';
import { Suspense } from 'react';
import { getDesignSettings } from '@/lib/colors';
import { toStr } from '@/lib/typeSafe';

export const revalidate = 300;

// ═══════════════════════════════════════════════════
// 🎨 Viewport - ديناميكي
// ═══════════════════════════════════════════════════
export async function generateViewport(): Promise<Viewport> {
  let themeColor = '#1a365d';
  
  try {
    const settings = await getSiteSettings();
    themeColor = toStr(settings?.primary_color) || themeColor;
  } catch {
    // fallback
  }

  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor,
    colorScheme: 'light',
  };
}

// ═══════════════════════════════════════════════════
// 📋 Metadata - ديناميكي 100%
// ═══════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const siteName = toStr(settings?.site_name_ar) || toStr(settings?.site_name) || '';
    const metaTitle = toStr(settings?.meta_title_ar) || toStr(settings?.meta_title) || siteName;
    const metaDescription = toStr(settings?.meta_description_ar) || 
                            toStr(settings?.meta_description) || 
                            toStr(settings?.site_description_ar) || '';
    
    const metaKeywords = toStr(settings?.meta_keywords) 
      ? settings.meta_keywords!.split(/[,،]/).map((k: string) => k.trim()).filter(Boolean)
      : [];
    
    const siteLogo = settings?.site_logo ? buildMediaUrl(settings.site_logo) : null;
    const ogImage = settings?.og_image ? buildMediaUrl(settings.og_image) : siteLogo;
    const googleVerification = toStr(settings?.google_site_verification);
    const bingVerification = toStr(settings?.bing_site_verification);
    const yandexVerification = toStr(settings?.yandex_verification);

    const allowIndex = settings?.robots_index !== false;
    const allowFollow = settings?.robots_follow !== false;

    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: metaTitle || siteName || 'Loading...',
        template: siteName ? `%s | ${siteName}` : '%s',
      },
      description: metaDescription,
      keywords: metaKeywords.length > 0 ? metaKeywords : undefined,
      
      authors: siteName ? [{ name: siteName }] : undefined,
      creator: siteName || undefined,
      publisher: siteName || undefined,
      
      robots: {
        index: allowIndex,
        follow: allowFollow,
        googleBot: {
          index: allowIndex,
          follow: allowFollow,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      },
      
      openGraph: {
        type: 'website',
        locale: 'ar_SA',
        url: baseUrl,
        siteName: siteName,
        title: toStr(settings?.og_title) || metaTitle,
        description: toStr(settings?.og_description) || metaDescription,
        images: ogImage ? [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        }] : [],
      },
      
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: ogImage ? [ogImage] : [],
        ...(toStr(settings?.twitter_handle) && {
          creator: settings.twitter_handle,
          site: settings.twitter_handle,
        }),
      },
      
      alternates: {
        canonical: baseUrl,
        languages: { 
          'ar-SA': baseUrl,
          'x-default': baseUrl,
        },
      },
      
      ...(googleVerification || bingVerification || yandexVerification ? {
        verification: {
          ...(googleVerification && { google: googleVerification }),
          ...(yandexVerification && { yandex: yandexVerification }),
          ...(bingVerification && { other: { 'msvalidate.01': bingVerification } }),
        }
      } : {}),
      
      category: toStr(settings?.business_type) || 'business',
      
      formatDetection: {
        telephone: true,
        email: true,
        address: true,
      },

      // ✅ Icons ديناميكية
      icons: settings?.site_favicon ? {
        icon: buildMediaUrl(settings.site_favicon),
        shortcut: buildMediaUrl(settings.site_favicon),
        apple: buildMediaUrl(settings.site_favicon),
      } : undefined,
    };
  } catch (error) {
    console.error('❌ Error generating metadata:', error);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return {
      metadataBase: new URL(baseUrl),
      title: 'Loading...',
      description: '',
      robots: { index: true, follow: true },
    };
  }
}

// ═══════════════════════════════════════════════════
// 🛠️ Helper: جلب القوائم
// ═══════════════════════════════════════════════════
async function fetchNavigationWithSections(): Promise<{ 
  mainNav: NavItem[], 
  footerNav: NavItem[], 
  socialLinks: NavItem[] 
}> {
  try {
    const response = await api.navigation();
    const data = response as any;
    let navItems: NavItem[] = [];
    
    if (Array.isArray(data)) {
      navItems = data;
    } else if (data && typeof data === 'object') {
      if (data.data && Array.isArray(data.data)) navItems = data.data;
      else if (data.items && Array.isArray(data.items)) navItems = data.items;
      else if (data.navigation && Array.isArray(data.navigation)) navItems = data.navigation;
    }
    
    if (navItems.length > 0) {
      let mainNav = navItems.filter(item => 
        !item.href?.includes('facebook') && 
        !item.href?.includes('twitter') && 
        !item.href?.includes('instagram') &&
        !item.href?.includes('footer')
      );
      
      mainNav = mainNav.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      
      const footerNav = navItems.filter(item => 
        item.href?.includes('footer') || 
        item.label === 'سياسة الخصوصية' || 
        item.label === 'الشروط والأحكام'
      );
      
      const socialLinks = navItems.filter(item => 
        item.href?.includes('facebook') || 
        item.href?.includes('twitter') || 
        item.href?.includes('instagram') ||
        item.href?.includes('linkedin') ||
        item.href?.includes('youtube')
      );
      
      return {
        mainNav: mainNav.length > 0 ? mainNav : getDefaultNavigationWithSections().mainNav,
        footerNav: footerNav.length > 0 ? footerNav : getDefaultNavigationWithSections().footerNav,
        socialLinks: socialLinks.length > 0 ? socialLinks : getDefaultNavigationWithSections().socialLinks,
      };
    }
    
    return getDefaultNavigationWithSections();
  } catch (error) {
    console.error('❌ Error fetching navigation:', error);
    return getDefaultNavigationWithSections();
  }
}

function getDefaultNavigationWithSections() {
  return {
    mainNav: [
      { id: 1, label: 'الرئيسية', href: '/', is_active: true, sort_order: 1, children: [] },
      { id: 2, label: 'عن الشركة', href: '/about', is_active: true, sort_order: 2, children: [] },
      { id: 3, label: 'خدماتنا', href: '/services', is_active: true, sort_order: 3, children: [] },
      { id: 4, label: 'مشاريعنا', href: '/projects', is_active: true, sort_order: 4, children: [] },
      { id: 5, label: 'المدونة', href: '/blog', is_active: true, sort_order: 5, children: [] },
      { id: 6, label: 'التصنيفات', href: '/categories', is_active: true, sort_order: 6, children: [] },
      { id: 7, label: 'الوسوم', href: '/tags', is_active: true, sort_order: 7, children: [] },
      { id: 8, label: 'اتصل بنا', href: '/contact', is_active: true, sort_order: 8, children: [] },
    ],
    footerNav: [
      { id: 101, label: 'الرئيسية', href: '/', is_active: true, sort_order: 1, children: [] },
      { id: 102, label: 'عن الشركة', href: '/about', is_active: true, sort_order: 2, children: [] },
      { id: 103, label: 'خدماتنا', href: '/services', is_active: true, sort_order: 3, children: [] },
      { id: 104, label: 'مشاريعنا', href: '/projects', is_active: true, sort_order: 4, children: [] },
      { id: 105, label: 'المدونة', href: '/blog', is_active: true, sort_order: 5, children: [] },
      { id: 106, label: 'اتصل بنا', href: '/contact', is_active: true, sort_order: 6, children: [] },
      { id: 107, label: 'سياسة الخصوصية', href: '/privacy', is_active: true, sort_order: 7, children: [] },
      { id: 108, label: 'الشروط والأحكام', href: '/terms', is_active: true, sort_order: 8, children: [] },
    ],
    socialLinks: [],
  };
}

// ═══════════════════════════════════════════════════
// 🎨 توليد CSS Variables كاملة
// ═══════════════════════════════════════════════════
function generateCSSVariablesFromSettings(settings: any): string {
  if (!settings) return '';
  
  const getRgbFromHex = (hex: string): string => {
    if (!hex) return '0, 0, 0';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
  };
  
  const primaryRgb = getRgbFromHex(settings.primary_color || '#1a365d');
  const secondaryRgb = getRgbFromHex(settings.secondary_color || '#D4AF37');
  const accentRgb = getRgbFromHex(settings.accent_color || '#FFD700');
  
  // ✅ استخراج الخطوط من الإعدادات
  const fontFamily = settings.typography?.font_family || 'Cairo';
  const fontFamilyHeadings = settings.typography?.font_family_headings || fontFamily;
  const fontSizeBase = settings.typography?.font_size_base || 16;
  const fontSizeH1 = settings.typography?.font_size_h1 || 48;
  const fontSizeH2 = settings.typography?.font_size_h2 || 36;
  const fontSizeH3 = settings.typography?.font_size_h3 || 24;
  
  return `
    --color-primary: ${settings.primary_color || '#1a365d'};
    --color-primary-dark: ${settings.primary_dark || '#0f1729'};
    --color-primary-light: ${settings.primary_light || '#2b6cb0'};
    --color-secondary: ${settings.secondary_color || '#D4AF37'};
    --color-secondary-dark: ${settings.secondary_dark || '#B8960F'};
    --color-secondary-light: ${settings.secondary_light || '#F3E5AB'};
    --color-accent: ${settings.accent_color || '#FFD700'};
    --color-warning: ${settings.warning_color || '#f59e0b'};
    --color-danger: ${settings.danger_color || '#ef4444'};
    --color-info: ${settings.info_color || '#3b82f6'};
    --color-bg-light: ${settings.bg_light || '#f8faff'};
    --color-bg-dark: ${settings.bg_dark || '#0f1729'};
    --color-bg-card: ${settings.bg_card || '#ffffff'};
    --color-text-dark: ${settings.text_dark || '#0f172a'};
    --color-text-light: ${settings.text_light || '#ffffff'};
    --color-text-muted: ${settings.text_muted || '#64748b'};
    --color-primary-rgb: ${primaryRgb};
    --color-secondary-rgb: ${secondaryRgb};
    --color-accent-rgb: ${accentRgb};
    --font-family: '${fontFamily}', sans-serif;
    --font-family-headings: '${fontFamilyHeadings}', sans-serif;
    --font-size-base: ${fontSizeBase}px;
    --font-size-h1: ${fontSizeH1}px;
    --font-size-h2: ${fontSizeH2}px;
    --font-size-h3: ${fontSizeH3}px;
  `;
}

// ═══════════════════════════════════════════════════
// 🔤 بناء رابط Google Fonts ديناميكياً
// ═══════════════════════════════════════════════════
function buildGoogleFontsUrl(fontFamily: string, fontHeadings?: string): string {
  const fonts = new Set<string>();
  
  if (fontFamily) fonts.add(fontFamily);
  if (fontHeadings && fontHeadings !== fontFamily) fonts.add(fontHeadings);
  
  if (fonts.size === 0) fonts.add('Cairo');
  
  const fontQueries = Array.from(fonts).map(font => {
    const cleanName = font.replace(/\s+/g, '+');
    return `family=${cleanName}:wght@400;500;600;700;800;900`;
  });
  
  return `https://fonts.googleapis.com/css2?${fontQueries.join('&')}&display=swap`;
}

// ═══════════════════════════════════════════════════
// 🖥️ Root Layout Component
// ═══════════════════════════════════════════════════
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, navigationSections, designSettings, services] = await Promise.all([
    getSiteSettings(),
    fetchNavigationWithSections(),
    getDesignSettings(),
    api.featuredServices().catch(() => []),
  ]);

  const cssVariables = generateCSSVariablesFromSettings(designSettings);
  
  // ✅ الشعار والأيقونة ديناميكية
  const favicon = settings?.site_favicon ? buildMediaUrl(settings.site_favicon) : null;
  const siteLogo = settings?.site_logo ? buildMediaUrl(settings.site_logo) : null;

  // ✅ الخطوط ديناميكية
  const fontFamily = designSettings?.typography?.font_family || 'Cairo';
  const fontFamilyHeadings = designSettings?.typography?.font_family_headings || fontFamily;
  const googleFontsUrl = buildGoogleFontsUrl(fontFamily, fontFamilyHeadings);

  const latStr = toStr(settings?.google_maps_lat || settings?.latitude);
  const lngStr = toStr(settings?.google_maps_lng || settings?.longitude);
  const lat    = latStr ? parseFloat(latStr) : NaN;
  const lng    = lngStr ? parseFloat(lngStr) : NaN;
  const hasGeo = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  
  const countryCode = toStr(settings?.country_code) ||
                    toStr((settings as any)?.address_country_code) ||
                    '';
  const regionName = toStr(settings?.region_ar) || toStr(settings?.region) || toStr(settings?.country_ar) || '';

  const hasAnalytics = !!toStr(settings?.google_analytics_id);
  const hasGTM = !!toStr(settings?.google_tag_manager);
  const siteName = toStr(settings?.site_name_ar) || toStr(settings?.site_name) || '';

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <JsonLd settings={settings} />
        
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {siteName && <meta name="apple-mobile-web-app-title" content={siteName} />}
        
        {countryCode && (
          <meta name="geo.region" content={countryCode} />
        )}
        {regionName && (
          <meta name="geo.placename" content={regionName} />
        )}
        {hasGeo && (
          <>
            <meta name="geo.position" content={`${lat};${lng}`} />
            <meta name="ICBM"         content={`${lat}, ${lng}`} />
          </>
        )}
        
        {/* ═══════════════════════════════════════════
            🌐 DNS Prefetch & Preconnect
            ═══════════════════════════════════════════ */}
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ═══════════════════════════════════════════
            🔤 تحميل الخطوط ديناميكياً من Google Fonts
            ═══════════════════════════════════════════ */}
        <link 
          rel="stylesheet" 
          href={googleFontsUrl}
          key="google-fonts-dynamic"
        />
        
        {/* ═══════════════════════════════════════════
            🖼️ Preload الشعار الديناميكي
            ═══════════════════════════════════════════ */}
        {siteLogo && (
          <link rel="preload" as="image" href={siteLogo} fetchPriority="high" />
        )}
        
        {/* ═══════════════════════════════════════════
            🎯 Favicon الديناميكي
            ═══════════════════════════════════════════ */}
        <link rel="icon" href={favicon || '/favicon.ico'} sizes="any" />
        {favicon && (
          <>
            <link rel="apple-touch-icon" href={favicon} />
            <link rel="shortcut icon" href={favicon} />
          </>
        )}
        
        <link rel="manifest" href="/manifest.json" />
        
        {/* ═══════════════════════════════════════════
            🎨 CSS Variables الديناميكية
            ═══════════════════════════════════════════ */}
        <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVariables} }` }} />
        
        {/* ═══════════════════════════════════════════
            🖌️ تطبيق الخط على كل العناصر
            ═══════════════════════════════════════════ */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              font-family: var(--font-family, '${fontFamily}', sans-serif);
            }
            body {
              font-family: var(--font-family, '${fontFamily}', sans-serif) !important;
              font-size: var(--font-size-base, 16px);
            }
            h1, h2, h3, h4, h5, h6 {
              font-family: var(--font-family-headings, '${fontFamilyHeadings}', sans-serif) !important;
            }
            h1 { font-size: var(--font-size-h1, 48px); }
            h2 { font-size: var(--font-size-h2, 36px); }
            h3 { font-size: var(--font-size-h3, 24px); }
            
            /* استثناء الأيقونات */
            svg, [class*="heroicon"], [class*="icon"] {
              font-family: inherit;
            }
            
            /* Loading States */
            .header-loading { 
              height: 80px; 
              background: var(--color-bg-light, #f8faff); 
            }
            .content-loading { 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 70vh;
              color: var(--color-text-muted, #64748b);
              font-size: 1.2rem;
              font-family: var(--font-family, '${fontFamily}', sans-serif);
            }
            @media (max-width: 640px) {
              .header-loading { height: 68px; }
            }
          `
        }} />

        {/* ═══════════════════════════════════════════
            ✅ Google Ads Conversion
            ═══════════════════════════════════════════ */}
        <Script
          id="google-ads-conversion-function"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'conversion', {
                    'send_to': 'AW-18278947108/9fk7CJSbqcccEKSyioxE',
                    'event_callback': callback
                  });
                }
                return false;
              }
            `,
          }}
        />
      </head>
      
      <body 
        suppressHydrationWarning
        style={{
          fontFamily: `'${fontFamily}', sans-serif`,
        }}
      >
        <SliderThemeProvider>
          <ThemeProvider>
            <Suspense fallback={<div className="header-loading" />}>
              <Header settings={settings} navigation={navigationSections.mainNav} />
            </Suspense>
            
            <main style={{ minHeight: '70vh' }}>
              <Suspense fallback={<div className="content-loading">جاري التحميل...</div>}>
                {children}
              </Suspense>
            </main>
            
            <Footer 
              settings={settings} 
              navigation={navigationSections.footerNav}
              services={services}
            />
            
            <FloatingButtons settings={settings} />
            <ScrollToTop />
          </ThemeProvider>
        </SliderThemeProvider>

        {/* ═══════════════════════════════════════════
            📊 Google Tag Manager
            ═══════════════════════════════════════════ */}
        {hasGTM && (
          <Script
            id="gtm-body"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${settings.google_tag_manager}');
              `,
            }}
          />
        )}

        {/* ═══════════════════════════════════════════
            📊 Google Analytics
            ═══════════════════════════════════════════ */}
        {hasAnalytics && (
          <>
            <Script
              id="gtag"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
            />
            <Script
              id="gtag-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.google_analytics_id}', { 
                    send_page_view: false,
                    cookie_flags: 'SameSite=None;Secure'
                  });
                `,
              }}
            />
          </>
        )}

        {/* ═══════════════════════════════════════════
            📊 Facebook Pixel
            ═══════════════════════════════════════════ */}
        {toStr(settings?.facebook_pixel_id) && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${settings.facebook_pixel_id}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        {/* ═══════════════════════════════════════════
            🔥 Hotjar
            ═══════════════════════════════════════════ */}
        {toStr(settings?.hotjar_id) && (
          <Script
            id="hotjar"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${settings.hotjar_id},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}