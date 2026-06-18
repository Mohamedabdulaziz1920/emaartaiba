import type { SiteSettings } from '../settings';

export type SchemaType = 
  | 'WebSite' 
  | 'WebPage' 
  | 'Organization' 
  | 'LocalBusiness' 
  | 'GeneralContractor'
  | 'Service'
  | 'Product'
  | 'Article'
  | 'BlogPosting'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'ImageObject'
  | 'VideoObject'
  | 'Review'
  | 'AggregateRating';

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

export interface BreadcrumbItem {
  name: string;
  url: string;
}

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
    addressCountry: string;
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