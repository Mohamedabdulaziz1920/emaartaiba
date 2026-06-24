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
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { getDesignSettings } from '@/lib/colors';

const geist = Geist({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#F59E0B',
  colorScheme: 'light',
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const siteName = settings?.site_name_ar || settings?.site_name || 'البناء المتميز';
    const metaTitle = settings?.meta_title_ar || settings?.meta_title || siteName;
    const metaDescription = settings?.meta_description_ar || settings?.meta_description || 
      'أفضل شركة مقاولات عامة في السعودية - خبرة +20 سنة';
    const metaKeywords = settings?.meta_keywords ? 
      settings.meta_keywords.split(',').map((k: string) => k.trim()) : 
      ['شركة مقاولات', 'مقاولات عامة', 'بناء فلل', 'مقاول بناء', 'تشطيبات'];
    const siteLogo = settings?.site_logo ? buildMediaUrl(settings.site_logo) : null;
    const googleVerification = settings?.google_site_verification || null;

    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: metaTitle,
        template: `%s | ${siteName}`,
      },
      description: metaDescription,
      keywords: metaKeywords,
      authors: [{ name: siteName }],
      creator: siteName,
      publisher: siteName,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
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
        title: metaTitle,
        description: metaDescription,
        images: siteLogo ? [{
          url: siteLogo,
          width: 1200,
          height: 630,
          alt: siteName,
        }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: siteName,
        description: metaDescription,
        images: siteLogo ? [siteLogo] : [],
      },
      alternates: {
        canonical: '/',
        languages: { 'ar-SA': '/' },
      },
      verification: googleVerification ? { google: googleVerification } : undefined,
      category: 'construction',
    };
  } catch (error) {
    console.error('❌ Error generating metadata:', error);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: 'شركة البناء المتميز | شركة مقاولات عامة في السعودية',
        template: '%s | شركة البناء المتميز',
      },
      description: 'أفضل شركة مقاولات عامة في السعودية - خبرة +20 سنة',
      robots: { index: true, follow: true },
    };
  }
}

// ============================================
// 🛠️ Helper Functions
// ============================================

async function fetchNavigationWithSections(): Promise<{ mainNav: NavItem[], footerNav: NavItem[], socialLinks: NavItem[] }> {
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
      else if (data.success === true && data.data && Array.isArray(data.data)) navItems = data.data;
    }
    
    if (navItems.length > 0) {
      const hasCategories = navItems.some(item => item.label === 'التصنيفات' || item.href === '/categories');
      const hasTags = navItems.some(item => item.label === 'الوسوم' || item.href === '/tags');
      
      let mainNav = navItems.filter(item => 
        !item.href?.includes('facebook') && 
        !item.href?.includes('twitter') && 
        !item.href?.includes('instagram') &&
        !item.href?.includes('footer')
      );
      
      if (!hasCategories) {
        mainNav.push({ 
          id: 999, 
          label: 'التصنيفات', 
          href: '/categories', 
          is_active: true, 
          sort_order: 99,
          children: []
        });
      }
      
      if (!hasTags) {
        mainNav.push({ 
          id: 998, 
          label: 'الوسوم', 
          href: '/tags', 
          is_active: true, 
          sort_order: 100,
          children: []
        });
      }
      
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

function getDefaultNavigationWithSections(): { mainNav: NavItem[], footerNav: NavItem[], socialLinks: NavItem[] } {
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
    socialLinks: [
      { id: 201, label: 'فيسبوك', href: 'https://facebook.com', is_active: true, sort_order: 1, children: [] },
      { id: 202, label: 'تويتر', href: 'https://twitter.com', is_active: true, sort_order: 2, children: [] },
      { id: 203, label: 'انستغرام', href: 'https://instagram.com', is_active: true, sort_order: 3, children: [] },
      { id: 204, label: 'لينكد إن', href: 'https://linkedin.com', is_active: true, sort_order: 4, children: [] },
      { id: 205, label: 'يوتيوب', href: 'https://youtube.com', is_active: true, sort_order: 5, children: [] },
    ],
  };
}

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
  
  const fontFamily = settings.typography?.font_family || settings.font_family || 'Cairo';
  const fontFamilyHeadings = settings.typography?.font_family_headings || settings.font_family_headings || 'Cairo';
  const fontSizeBase = settings.typography?.font_size_base || settings.font_size_base || 16;
  const fontSizeH1 = settings.typography?.font_size_h1 || settings.font_size_h1 || 48;
  const fontSizeH2 = settings.typography?.font_size_h2 || settings.font_size_h2 || 36;
  const fontSizeH3 = settings.typography?.font_size_h3 || settings.font_size_h3 || 24;
  
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

// ============================================
// 🖥️ Root Layout Component
// ============================================
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, navigationSections, designSettings, services] = await Promise.all([
    getSiteSettings(),
    fetchNavigationWithSections(),
    getDesignSettings(),
    api.featuredServices().catch(() => []),
  ]);

  const sortedNavigation = [...navigationSections.mainNav].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const cssVariables = generateCSSVariablesFromSettings(designSettings);
  
  const fontFamily = designSettings?.typography?.font_family || 
                     settings?.font_family || 
                     'Cairo';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const favicon = settings?.site_favicon ? buildMediaUrl(settings.site_favicon) : null;
  const siteLogo = settings?.site_logo ? buildMediaUrl(settings.site_logo) : null;
  const logoUrl = siteLogo || '/logo.png';

  const hasAnalytics = !!settings?.google_analytics_id;
  const hasGTM = !!settings?.google_tag_manager;

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <JsonLd settings={settings} />
        
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        <meta name="geo.region" content="SA" />
        <meta name="geo.placename" content="Saudi Arabia" />
        <meta name="geo.position" content={settings?.google_maps_lat ? `${settings.google_maps_lat};${settings.google_maps_lng || '46.6753'}` : '24.7136;46.6753'} />
        <meta name="ICBM" content={settings?.google_maps_lat ? `${settings.google_maps_lat}, ${settings.google_maps_lng || '46.6753'}` : '24.7136, 46.6753'} />
        
        <meta name="author" content={settings?.site_name_ar || 'البناء المتميز'} />
        <meta name="publisher" content={settings?.site_name_ar || 'البناء المتميز'} />
        
        <link rel="canonical" href={baseUrl} />
        <link rel="alternate" href={baseUrl} hrefLang="ar" />
        <link rel="alternate" href={baseUrl} hrefLang="x-default" />
        
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {logoUrl && (
          <link rel="preload" as="image" href={logoUrl} fetchPriority="high" />
        )}
        
        <link rel="icon" href={favicon || '/favicon.ico'} sizes="any" />
        {favicon && <link rel="apple-touch-icon" href={favicon} />}
        
        <link rel="manifest" href="/manifest.json" />
        
        <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVariables} }` }} />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            .header-loading { height: 80px; background: #f8faff; }
            .content-loading { 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 70vh;
              color: #64748b;
              font-size: 1.2rem;
            }
            @media (max-width: 640px) {
              .header-loading { height: 68px; }
            }
          `
        }} />
      </head>
      <body suppressHydrationWarning>
        {/* ✅ جميع الـ Scripts في نهاية body قبل إغلاقه */}

        <SliderThemeProvider>
          <ThemeProvider>
            <Suspense fallback={<div className="header-loading" />}>
              <Header settings={settings} navigation={sortedNavigation} />
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

        {/* ✅ Google Tag Manager - في نهاية body */}
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

        {/* ✅ Google Analytics - في نهاية body */}
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
      </body>
    </html>
  );
}

export const revalidate = 60;