// src/components/seo/SchemaOrg.tsx
/**
 * SchemaOrg - Wrapper بسيط لـ JsonLd + Breadcrumbs التلقائية
 *
 * ⚠️ الاستخدام الصحيح:
 * - صفحات عامة: الرئيسية، من نحن، تواصل، سياسة الخصوصية
 *
 * ❌ لا تستخدم لـ:
 * - صفحات المدونة  → استخدم BlogSchema مباشرة
 * - صفحات الخدمات → استخدم ServiceSchema مباشرة
 * - صفحات المشاريع → استخدم ProjectSchema مباشرة
 */
import { JsonLd } from './JsonLd';
import type { SiteSettings } from '@/lib/settings';
import { toStr } from '@/lib/typeSafe';

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════
type SchemaType =
  | 'WebSite'
  | 'Organization'
  | 'LocalBusiness'
  | 'Article'
  | 'Service'
  | 'Project';

type JsonLdPageType =
  | 'home'
  | 'about'
  | 'contact'
  | 'blog-list'
  | 'blog-detail'
  | 'service-list'
  | 'service-detail'
  | 'project-list'
  | 'project-detail'
  | 'faq'
  | 'area';

interface ArticleData {
  title?: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  tags?: string[];
}

interface ServiceData {
  name: string;
  description: string;
}

interface ProjectData {
  name: string;
  description: string;
  image?: string;
  location?: string;
  status?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface Props {
  settings: SiteSettings;

  /** نوع الـ Schema - يحدد pageType لـ JsonLd */
  type?: SchemaType;

  /** المسار الحالي - لبناء Breadcrumbs تلقائياً إذا لم تُمرَّر يدوياً */
  pathname?: string;

  /** Breadcrumbs يدوية (أولوية على التلقائية) */
  breadcrumbs?: BreadcrumbItem[];

  /** بيانات الصفحة الحالية */
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;

  /**
   * بيانات المقال - للصفحات البسيطة فقط
   * للصفحات الكاملة: استخدم BlogSchema مباشرة
   */
  articleData?: ArticleData;

  /**
   * بيانات الخدمة - للصفحات البسيطة فقط
   * للصفحات الكاملة: استخدم ServiceSchema مباشرة
   */
  serviceData?: ServiceData;

  /**
   * بيانات المشروع - للصفحات البسيطة فقط
   * للصفحات الكاملة: استخدم ProjectSchema مباشرة
   */
  projectData?: ProjectData;
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════

/**
 * ترجمة segments المعروفة في المسار
 */
const PATH_TRANSLATIONS: Record<string, string> = {
  blog:         'المدونة',
  services:     'خدماتنا',
  projects:     'مشاريعنا',
  areas:        'مناطق خدمتنا',
  contact:      'تواصل معنا',
  about:        'من نحن',
  gallery:      'معرض الصور',
  faq:          'الأسئلة الشائعة',
  categories:   'التصنيفات',
  tags:         'الوسوم',
  partners:     'شركاؤنا',
  testimonials: 'آراء العملاء',
  privacy:      'سياسة الخصوصية',
  terms:        'الشروط والأحكام',
  search:       'البحث',
  404:          'الصفحة غير موجودة',
};

/**
 * تحويل SchemaType إلى JsonLd pageType
 */
const TYPE_TO_PAGE_TYPE: Record<SchemaType, JsonLdPageType> = {
  WebSite:       'home',
  Organization:  'about',
  LocalBusiness: 'contact',
  Article:       'blog-detail',
  Service:       'service-detail',
  Project:       'project-detail',
};

/**
 * بناء Breadcrumbs من pathname
 * يُستخدم فقط إذا لم تُمرَّر breadcrumbs يدوياً
 */
function buildBreadcrumbsFromPath(
  pathname: string
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  const items: BreadcrumbItem[] = [
    { name: 'الرئيسية', url: baseUrl + '/' },
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const translated = PATH_TRANSLATIONS[segment.toLowerCase()];

    // للـ slugs الديناميكية: نستخدم decodeURIComponent مع replace
    const name = translated ||
      decodeURIComponent(segment)
        .replace(/-/g, ' ')
        .replace(/_/g, ' ');

    items.push({ name, url: baseUrl + currentPath });
  }

  return items;
}

/**
 * بناء Article Schema مبسّط
 * ⚠️ للصفحات البسيطة فقط - استخدم BlogSchema للصفحات الكاملة
 */
function buildSimpleArticleSchema(
  articleData: ArticleData,
  baseUrl: string,
  pathname: string,
  siteName: string,
  country: string
): Record<string, any> {
  const currentUrl = `${baseUrl}${pathname}`;

  const schema: Record<string, any> = {
    '@context':  'https://schema.org',
    '@type':     'Article',
    '@id':       `${currentUrl}#article`,
    inLanguage:  'ar-SA',

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   currentUrl,
    },

    publisher: { '@id': `${baseUrl}/#organization` },
  };

  if (articleData.title)         schema.headline      = articleData.title;
  if (articleData.description)   schema.description   = articleData.description;
  if (articleData.image)         schema.image         = articleData.image;
  if (articleData.datePublished) schema.datePublished = articleData.datePublished;
  if (articleData.dateModified)  schema.dateModified  = articleData.dateModified
                                                     || articleData.datePublished;

  schema.author = articleData.author
    ? { '@type': 'Person', name: articleData.author }
    : { '@type': 'Organization', '@id': `${baseUrl}/#organization` };

  if (articleData.tags?.length) {
    schema.keywords = articleData.tags.join(', ');
  }

  return schema;
}

/**
 * بناء Service Schema مبسّط
 * ⚠️ للصفحات البسيطة فقط - استخدم ServiceSchema للصفحات الكاملة
 */
function buildSimpleServiceSchema(
  serviceData: ServiceData,
  baseUrl: string,
  pathname: string,
  country: string
): Record<string, any> {
  const currentUrl = `${baseUrl}${pathname}`;

  const schema: Record<string, any> = {
    '@context':   'https://schema.org',
    '@type':      'Service',
    '@id':        `${currentUrl}#service`,
    name:         serviceData.name,
    description:  serviceData.description,
    serviceType:  serviceData.name,
    provider:     { '@id': `${baseUrl}/#organization` },
    inLanguage:   'ar-SA',
  };

  // ديناميكي من settings
  if (country) {
    schema.areaServed = {
      '@type': 'Country',
      name:    country,
    };
  }

  return schema;
}

/**
 * بناء Project Schema مبسّط
 * ⚠️ للصفحات البسيطة فقط - استخدم ProjectSchema للصفحات الكاملة
 */
function buildSimpleProjectSchema(
  projectData: ProjectData,
  baseUrl: string,
  pathname: string
): Record<string, any> {
  const currentUrl = `${baseUrl}${pathname}`;

  const schema: Record<string, any> = {
    '@context':  'https://schema.org',
    '@type':     'CreativeWork',
    '@id':       `${currentUrl}#project`,
    name:        projectData.name,
    description: projectData.description,
    creator:     { '@id': `${baseUrl}/#organization` },
    inLanguage:  'ar-SA',
  };

  if (projectData.image) {
    schema.image = projectData.image;
  }

  if (projectData.location) {
    schema.contentLocation = {
      '@type': 'Place',
      name:    projectData.location,
    };
  }

  if (projectData.status) {
    const statusMap: Record<string, string> = {
      completed:   'Completed',
      in_progress: 'InProgress',
      in_progress2: 'InProgress',
      planned:     'Planned',
    };
    schema.creativeWorkStatus =
      statusMap[projectData.status] || 'Active';
  }

  return schema;
}

// ════════════════════════════════════════════════
// 🎯 Main Component
// ════════════════════════════════════════════════
export default function SchemaOrg({
  settings,
  type = 'WebSite',
  pathname = '/',
  breadcrumbs: manualBreadcrumbs,
  pageTitle,
  pageDescription,
  pageImage,
  articleData,
  serviceData,
  projectData,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // ─── معلومات الموقع ────────────────────────
  const siteName = toStr(settings?.site_name_ar) ||
                   toStr(settings?.site_name)     ||
                   '';

  const country  = toStr(settings?.country_ar)   ||
                   toStr(settings?.country)       ||
                   '';

  // ─── Breadcrumbs ──────────────────────────
  // الأولوية: يدوية > تلقائية من pathname
  const autoBreadcrumbs = buildBreadcrumbsFromPath(pathname);
  const breadcrumbs     = manualBreadcrumbs ?? 
                          (autoBreadcrumbs.length > 1 ? autoBreadcrumbs : undefined);

  // ─── pageType لـ JsonLd ───────────────────
 // ✅ بعد - cast صريح
const pageType = (TYPE_TO_PAGE_TYPE[type] ?? 'home') as 
  | 'home' | 'about' | 'contact' 
  | 'blog' | 'blog-detail' 
  | 'services' | 'service-detail'
  | 'projects' | 'project-detail'
  | 'faq' | 'area';
  // ─── Schemas الإضافية ─────────────────────
  const additionalSchemas: Record<string, any>[] = [];

  if (articleData) {
    additionalSchemas.push(
      buildSimpleArticleSchema(
        articleData,
        baseUrl,
        pathname,
        siteName,
        country
      )
    );
  }

  if (serviceData) {
    additionalSchemas.push(
      buildSimpleServiceSchema(
        serviceData,
        baseUrl,
        pathname,
        country
      )
    );
  }

  if (projectData) {
    additionalSchemas.push(
      buildSimpleProjectSchema(
        projectData,
        baseUrl,
        pathname
      )
    );
  }

  // ════════════════════════════════════════
  // 🎯 Render
  // ════════════════════════════════════════
  return (
    <>
      {/*
        JsonLd: يتولى الـ Schemas الأساسية:
        - Organization
        - WebSite + SearchAction
        - LocalBusiness
        - BreadcrumbList
      */}
      <JsonLd
        settings={settings}
        pageType={pageType}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        pageUrl={pathname}
        pageImage={pageImage}
        breadcrumbs={breadcrumbs}
      />

      {/* Schemas الإضافية (Article/Service/Project) */}
      {additionalSchemas.map((schema) => (
        <script
          key={schema['@id'] || schema['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}