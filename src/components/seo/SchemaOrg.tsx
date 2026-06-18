// src/components/seo/SchemaOrg.tsx
import { JsonLd } from './JsonLd';
import type { SiteSettings } from '@/lib/settings';

interface Props {
  settings: SiteSettings;
  type?: 'WebSite' | 'Organization' | 'LocalBusiness' | 'Article' | 'Service' | 'Project';
  pathname?: string;
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;
  
  articleData?: {
    title?: string;
    description?: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    tags?: string[];
  };
  serviceData?: {
    name: string;
    description: string;
    provider: string;
  };
  projectData?: {
    name: string;
    description: string;
    image?: string;
    location?: string;
    status?: string;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ═══════════════════════════════════════════════════
// 🍞 توليد Breadcrumbs من المسار
// ═══════════════════════════════════════════════════
function generateBreadcrumbs(pathname: string): { name: string; url: string }[] {
  const paths = pathname.split('/').filter(Boolean);
  if (paths.length === 0) return [];
  
  const breadcrumbs: { name: string; url: string }[] = [
    { name: 'الرئيسية', url: '/' },
  ];
  
  const translations: Record<string, string> = {
    'blog': 'المدونة',
    'services': 'خدماتنا',
    'projects': 'مشاريعنا',
    'areas': 'مناطق خدمتنا',
    'contact': 'تواصل معنا',
    'about': 'من نحن',
    'gallery': 'معرض الصور',
    'faq': 'الأسئلة الشائعة',
    'categories': 'التصنيفات',
    'tags': 'الوسوم',
    'partners': 'شركاؤنا',
    'testimonials': 'آراء العملاء',
    'privacy': 'سياسة الخصوصية',
    'terms': 'الشروط والأحكام',
  };
  
  let currentPath = '';
  for (const segment of paths) {
    currentPath += `/${segment}`;
    let name = decodeURIComponent(segment).replace(/-/g, ' ');
    if (translations[segment.toLowerCase()]) {
      name = translations[segment.toLowerCase()];
    }
    breadcrumbs.push({
      name,
      url: currentPath,
    });
  }
  
  return breadcrumbs;
}

// ═══════════════════════════════════════════════════
// 📰 Article Schema
// ═══════════════════════════════════════════════════
function buildArticleSchema(
  articleData: Props['articleData'],
  baseUrl: string,
  pathname: string,
  siteName: string
) {
  if (!articleData) return null;
  
  const currentUrl = `${baseUrl}${pathname}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${currentUrl}#article`,
    headline: articleData.title,
    description: articleData.description,
    image: articleData.image,
    datePublished: articleData.datePublished,
    dateModified: articleData.dateModified || articleData.datePublished,
    author: {
      '@type': articleData.author ? 'Person' : 'Organization',
      name: articleData.author || siteName,
    },
    publisher: { '@id': `${baseUrl}/#organization` },
    ...(articleData.tags && articleData.tags.length > 0 && {
      keywords: articleData.tags.join(', '),
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
    inLanguage: 'ar-SA',
  };
}

// ═══════════════════════════════════════════════════
// 🛠️ Service Schema (مبسّط)
// ═══════════════════════════════════════════════════
function buildServiceSchema(
  serviceData: Props['serviceData'],
  baseUrl: string,
  pathname: string,
  siteName: string
) {
  if (!serviceData) return null;
  
  const currentUrl = `${baseUrl}${pathname}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${currentUrl}#service`,
    name: serviceData.name,
    description: serviceData.description,
    provider: { '@id': `${baseUrl}/#organization` },
    serviceType: serviceData.name,
    areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
    inLanguage: 'ar-SA',
  };
}

// ═══════════════════════════════════════════════════
// 🏢 Project Schema
// ═══════════════════════════════════════════════════
function buildProjectSchema(
  projectData: Props['projectData'],
  baseUrl: string,
  pathname: string
) {
  if (!projectData) return null;
  
  const currentUrl = `${baseUrl}${pathname}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${currentUrl}#project`,
    name: projectData.name,
    description: projectData.description,
    ...(projectData.image && { image: projectData.image }),
    ...(projectData.location && {
      contentLocation: {
        '@type': 'Place',
        name: projectData.location,
      },
    }),
    ...(projectData.status && {
      creativeWorkStatus: projectData.status === 'completed' ? 'Completed' : 'InProgress',
    }),
    creator: { '@id': `${baseUrl}/#organization` },
    inLanguage: 'ar-SA',
  };
}

// ═══════════════════════════════════════════════════
// 🏗️ MAIN SchemaOrg Component
// ═══════════════════════════════════════════════════
export default function SchemaOrg({
  settings,
  type = 'WebSite',
  pathname = '/',
  pageTitle,
  pageDescription,
  pageImage,
  articleData,
  serviceData,
  projectData,
}: Props) {
  const siteName = settings?.site_name_ar || settings?.site_name || 'شركة البناء المتميز';
  
  // توليد Breadcrumbs تلقائياً من pathname
  const breadcrumbs = generateBreadcrumbs(pathname);
  
  // تحديد pageType بناءً على type
  const pageTypeMap: Record<string, any> = {
    'Article': 'blog-detail',
    'Service': 'service-detail',
    'Project': 'project-detail',
    'WebSite': 'home',
    'Organization': 'home',
    'LocalBusiness': 'home',
  };
  
  // بناء الـ Schemas الإضافية
  const articleSchema = buildArticleSchema(articleData, BASE_URL, pathname, siteName);
  const serviceSchema = buildServiceSchema(serviceData, BASE_URL, pathname, siteName);
  const projectSchema = buildProjectSchema(projectData, BASE_URL, pathname);
  
  const additionalSchemas = [articleSchema, serviceSchema, projectSchema].filter(Boolean);

  return (
    <>
      {/* الـ Schemas الأساسية + Breadcrumbs (من JsonLd) */}
      <JsonLd
        settings={settings}
        pageType={pageTypeMap[type] || 'home'}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        pageUrl={pathname}
        pageImage={pageImage}
        breadcrumbs={breadcrumbs.length > 1 ? breadcrumbs : undefined}
      />
      
      {/* الـ Schemas الإضافية (Article, Service, Project) */}
      {additionalSchemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}