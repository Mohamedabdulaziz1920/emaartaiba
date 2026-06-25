// src/lib/seo/types.ts
import type { SiteSettings } from '../settings';

// ════════════════════════════════════════════════
// 📋 Schema Types
// ════════════════════════════════════════════════

/**
 * أنواع Schema.org المدعومة
 * ✅ بدون GeneralContractor (يأتي من settings.business_type)
 */
export type SchemaType =
  | 'WebSite'
  | 'WebPage'
  | 'Organization'
  | 'LocalBusiness'
  | 'Service'
  | 'Product'
  | 'Article'
  | 'BlogPosting'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'ImageObject'
  | 'VideoObject'
  | 'Review'
  | 'AggregateRating'
  | 'CreativeWork'
  | 'ItemList';

// ════════════════════════════════════════════════
// 🎯 SEO Props
// ════════════════════════════════════════════════

export interface BaseSeoProps {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  image?: string;
  url?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  settings?: SiteSettings;
}

export interface ArticleSeoProps extends BaseSeoProps {
  type: 'article';
  publishedAt: string;
  modifiedAt?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface WebpageSeoProps extends BaseSeoProps {
  type?: 'website';
}

export type SeoProps = ArticleSeoProps | WebpageSeoProps;

// ════════════════════════════════════════════════
// 🍞 Breadcrumb
// ════════════════════════════════════════════════

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ════════════════════════════════════════════════
// 🏢 Organization Data
// ════════════════════════════════════════════════

export interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string; // ✅ optional - لا افتراض لدولة
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  sameAs?: string[];
  foundingDate?: string;
  founder?: string;
  numberOfEmployees?: string;
  legalName?: string;
}