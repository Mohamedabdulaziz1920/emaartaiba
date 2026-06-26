// src/lib/seo/metadata.ts
import type { Metadata } from 'next';
import type { SiteSettings } from '../settings';
import { toStr, toArray, buildImageUrl } from '../typeSafe';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface BaseMetaProps {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  settings?: SiteSettings;
}

interface ArticleMetaProps extends BaseMetaProps {
  type: 'article';
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

type SEOProps = BaseMetaProps | ArticleMetaProps;

/**
 * ════════════════════════════════════════════════
 * 🎯 generateSEO - النسخة الموحدة الاحترافية
 * ════════════════════════════════════════════════
 */
export function generateSEO(props: SEOProps): Metadata {
  const { settings } = props;
  
  // ━━━ Site Info ━━━
  const siteName = toStr(settings?.site_name_ar) || 
                   toStr(settings?.site_name) || 
                   '';
  
  const siteDescription = toStr(settings?.site_description_ar) ||
                          toStr(settings?.site_description) ||
                          toStr(settings?.meta_description_ar) ||
                          toStr(settings?.meta_description) ||
                          '';
  
  const siteLogo = buildImageUrl(settings?.site_logo);
  const ogImage = buildImageUrl(settings?.og_image || settings?.meta_image);
  
  // ━━━ URLs ━━━
  const url = props.canonical 
    ? (props.canonical.startsWith('http') ? props.canonical : `${BASE_URL}${props.canonical}`)
    : props.url 
      ? (props.url.startsWith('http') ? props.url : `${BASE_URL}${props.url}`)
      : BASE_URL;
  
  // ━━━ Title ━━━
  const title = props.title 
    ? `${props.title} | ${siteName}`
    : toStr(settings?.meta_title_ar) || toStr(settings?.meta_title) || siteName;
  
  // ━━━ Description ━━━
  const description = props.description || siteDescription;
  
  // ━━━ Image ━━━
  const image = buildImageUrl(props.image) || ogImage || siteLogo;
  
  // ━━━ Keywords ━━━
  const settingsKeywords = toArray<string>(
    settings?.meta_keywords_ar || settings?.meta_keywords
  );
  const propsKeywords = toArray<string>(props.keywords);
  const keywords = [...new Set([...settingsKeywords, ...propsKeywords])].filter(Boolean);
  
  // ━━━ Robots ━━━
  const robots: Metadata['robots'] = {
    index: !props.noindex,
    follow: !props.nofollow,
    googleBot: {
      index: !props.noindex,
      follow: !props.nofollow,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
  
  // ━━━ Twitter Handle ━━━
  const twitterHandle = toStr(settings?.twitter_handle);
  const formattedHandle = twitterHandle 
    ? (twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`)
    : undefined;
  
  // ━━━ Open Graph ━━━
  const baseOpenGraph: NonNullable<Metadata['openGraph']> = {
    type: props.type === 'article' ? 'article' : 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url,
    siteName,
    title,
    description,
    images: image
      ? [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/jpeg',
          },
        ]
      : [],
  };

  let openGraph: NonNullable<Metadata['openGraph']> = { ...baseOpenGraph };

  // Article-specific
  if (props.type === 'article' && 'publishedAt' in props) {
    openGraph = {
      ...openGraph,
      type: 'article',
      publishedTime: props.publishedAt,
      modifiedTime: props.modifiedAt || props.publishedAt,
      authors: props.author ? [props.author] : [siteName],
      section: props.section,
      tags: props.tags,
    };
  }
  
  // ━━━ Twitter ━━━
  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
    images: image ? [image] : [],
    ...(formattedHandle && {
      site: formattedHandle,
      creator: formattedHandle,
    }),
  };
  
  // ━━━ Geo Tags ━━━
  const other: Record<string, string> = {};
  
  const city = toStr(settings?.city_ar || settings?.city);
  const region = toStr(settings?.region_ar || settings?.region);
  const country = toStr(settings?.country_code) || 'SA';
  const lat = toStr(settings?.latitude || settings?.google_maps_lat);
  const lng = toStr(settings?.longitude || settings?.google_maps_lng);
  
  if (city) other['geo.placename'] = city;
  if (region) {
    const regionCode = region.charAt(0).toUpperCase() + region.slice(1);
    other['geo.region'] = `${country}-${regionCode}`;
  } else {
    other['geo.region'] = country;
  }
  
  if (lat && lng) {
    other['geo.position'] = `${lat};${lng}`;
    other['ICBM'] = `${lat}, ${lng}`;
  }
  
  // Apple Mobile
  other['apple-mobile-web-app-capable'] = 'yes';
  other['apple-mobile-web-app-status-bar-style'] = 'black-translucent';
  other['format-detection'] = 'telephone=yes';
  
  // Facebook App ID
  const facebookAppId = toStr(settings?.facebook_app_id);
  if (facebookAppId) other['fb:app_id'] = facebookAppId;
  
  // ━━━ Verification ━━━
  const verification: Metadata['verification'] = {};
  const googleVerification = toStr(settings?.google_site_verification);
  const bingVerification = toStr(settings?.bing_site_verification);
  const yandexVerification = toStr(settings?.yandex_verification);
  
  if (googleVerification) verification.google = googleVerification;
  if (yandexVerification) verification.yandex = yandexVerification;
  if (bingVerification) {
    verification.other = { 'msvalidate.01': bingVerification };
  }
  
  // ━━━ Build Final Metadata ━━━
  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: [{ 
      name: (props.type === 'article' && 'author' in props && props.author) ? props.author : siteName 
    }],
    creator: siteName,
    publisher: siteName,
    robots,
    alternates: {
      canonical: url,
      languages: {
        'ar-SA': url,
        'x-default': url,
      },
    },
    openGraph,
    twitter,
    other,
    verification: Object.keys(verification).length > 0 ? verification : undefined,
    category: 'construction',
    classification: 'Business',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: true,
    },
  };
}

/**
 * ✅ Helper: بناء breadcrumbs بسهولة
 */
export function buildBreadcrumb(...items: Array<{ name: string; url: string }>) {
  return [{ name: 'الرئيسية', url: '/' }, ...items];
}

/**
 * ✅ Helper: بناء عنوان الصفحة
 */
export function buildPageTitle(pageTitle: string, settings?: SiteSettings): string {
  const siteName = toStr(settings?.site_name_ar) || 
                   toStr(settings?.site_name) || 
                   '';
  return siteName ? `${pageTitle} | ${siteName}` : pageTitle;
}
