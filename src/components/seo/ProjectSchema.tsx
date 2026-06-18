// src/components/seo/ProjectSchema.tsx
import type { SiteSettings } from '@/lib/settings';
import { toStr, toNumber, toInt, buildImageUrl, stripHtml } from '@/lib/typeSafe';

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════
interface ProjectCategory {
  id?: number;
  name_ar: string;
  name_en?: string;
  slug?: string;
}

interface ProjectService {
  id?: number;
  title_ar: string;
  title_en?: string;
  slug?: string;
}

interface BeforeAfterImage {
  before?: string | null;
  after?: string | null;
  title?: string | null;
}

interface ProjectData {
  id?: number;
  title_ar: string;
  title_en?: string | null;
  slug: string;
  
  // الأوصاف
  excerpt_ar?: string | null;
  excerpt_en?: string | null;
  content_ar?: string | null;
  content_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  
  // الصور
  main_image?: string | null;
  cover_image?: string | null;
  thumbnail?: string | null;
  image_alt?: string | null;
  image_title?: string | null;
  gallery?: string[] | null;
  before_after_images?: BeforeAfterImage[] | null;
  
  // الفيديو والجولة
  video_url?: string | null;
  virtual_tour_url?: string | null;
  
  // معلومات المشروع
  client_name?: string | null;
  city?: string | null;
  location_ar?: string | null;
  location_en?: string | null;
  area_sqm?: number | string | null;
  project_value?: string | null;
  duration?: string | null;
  duration_months?: number | null;
  
  // التواريخ
  start_date?: string | null;
  end_date?: string | null;
  completion_date?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // الحالة
  status?: 'planned' | 'in_progress' | 'completed' | string;
  status_label?: string;
  is_featured?: boolean;
  is_active?: boolean;
  views_count?: number;
  
  // العلاقات
  category?: ProjectCategory | null;
  service?: ProjectService | null;
  
  // SEO
  meta_title_ar?: string | null;
  meta_title_en?: string | null;
  meta_description_ar?: string | null;
  meta_description_en?: string | null;
  meta_keywords?: string[] | null;
}

interface Props {
  project: ProjectData;
  settings?: SiteSettings;
  /** المشاريع المشابهة لتحسين Internal Linking */
  relatedProjects?: Array<{ 
    title_ar: string; 
    slug: string; 
    main_image?: string | null;
  }>;
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════

/**
 * تحويل status إلى Schema.org status
 */
function getProjectStatus(status?: string): {
  schemaStatus: string;
  label: string;
} {
  switch (status) {
    case 'completed':
      return { schemaStatus: 'Completed', label: 'مكتمل' };
    case 'in_progress':
    case 'in-progress':
      return { schemaStatus: 'InProgress', label: 'قيد التنفيذ' };
    case 'planned':
      return { schemaStatus: 'Planned', label: 'مخطط' };
    default:
      return { schemaStatus: 'Active', label: 'نشط' };
  }
}

/**
 * استخراج المساحة كرقم
 */
function getAreaSqm(area?: number | string | null): number | null {
  if (!area) return null;
  const num = typeof area === 'string' ? parseFloat(area) : area;
  return isNaN(num) ? null : num;
}

/**
 * تحويل التاريخ بأمان
 */
function toISOString(date?: string | null): string | null {
  if (!date) return null;
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

/**
 * استخراج جميع الصور (مع معالجة URL)
 */
function getAllImages(project: ProjectData): string[] {
  const images: string[] = [];
  
  // الصور الأساسية
  [project.main_image, project.cover_image, project.thumbnail].forEach(img => {
    if (img) {
      const url = buildImageUrl(img);
      if (url && !images.includes(url)) images.push(url);
    }
  });
  
  // المعرض
  if (Array.isArray(project.gallery)) {
    project.gallery.forEach(img => {
      if (img) {
        const url = buildImageUrl(img);
        if (url && !images.includes(url)) images.push(url);
      }
    });
  }
  
  // صور قبل/بعد
  if (Array.isArray(project.before_after_images)) {
    project.before_after_images.forEach(pair => {
      if (pair.before) {
        const url = buildImageUrl(pair.before);
        if (url && !images.includes(url)) images.push(url);
      }
      if (pair.after) {
        const url = buildImageUrl(pair.after);
        if (url && !images.includes(url)) images.push(url);
      }
    });
  }
  
  return images;
}

/**
 * استخراج الفئة الرئيسية للمشروع (Schema.org)
 */
function getProjectMainType(category?: ProjectCategory | null): string[] {
  const baseTypes = ['CreativeWork', 'Project'];
  
  if (!category?.name_ar) return baseTypes;
  
  const categoryName = category.name_ar.toLowerCase();
  
  // إضافة أنواع متخصصة حسب الفئة
  if (categoryName.includes('فيلا') || categoryName.includes('سكني')) {
    return [...baseTypes, 'House'];
  }
  if (categoryName.includes('مبنى') || categoryName.includes('برج') || categoryName.includes('عمارة')) {
    return [...baseTypes, 'Building'];
  }
  if (categoryName.includes('تجاري') || categoryName.includes('مكتب')) {
    return [...baseTypes, 'OfficeBuilding'];
  }
  
  return baseTypes;
}

/**
 * استخراج Embed URL للفيديو
 */
function getVideoEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  
  return url;
}

// ════════════════════════════════════════════════
// 🎯 Main Component
// ════════════════════════════════════════════════
export default function ProjectSchema({ 
  project, 
  settings = {},
  relatedProjects = [],
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/projects/${project.slug}`;
  
  // ─── معلومات الموقع ───
  const siteName = toStr(settings.site_name_ar) || 
                   toStr(settings.site_name) || 
                   'شركة البناء المتميز';
  const siteLogo = buildImageUrl(settings.site_logo);
  
  // ─── البيانات الأساسية ───
  const title = toStr(project.title_ar) || 'مشروع';
  const titleEn = toStr(project.title_en);
  const description = toStr(project.meta_description_ar) || 
                      toStr(project.excerpt_ar) || 
                      stripHtml(project.description_ar, 200) ||
                      stripHtml(project.content_ar, 200) ||
                      `مشروع ${title}`;
  
  // ─── الصور ───
  const allImages = getAllImages(project);
  const mainImageUrl = allImages[0] || siteLogo;
  
  // ─── الحالة ───
  const { schemaStatus, label: statusLabel } = getProjectStatus(project.status);
  
  // ─── المساحة ───
  const areaSqm = getAreaSqm(project.area_sqm);
  
  // ─── التواريخ ───
  const startDate = toISOString(project.start_date);
  const endDate = toISOString(project.end_date || project.completion_date);
  const completionDate = toISOString(project.completion_date);
  const createdDate = toISOString(project.created_at) || completionDate || new Date().toISOString();
  const modifiedDate = toISOString(project.updated_at) || createdDate;
  
  // ─── الكلمات المفتاحية ───
  const keywordsArray = [
    project.title_ar,
    project.category?.name_ar,
    project.city,
    project.service?.title_ar,
    'مقاولات',
    'بناء',
    'تشطيبات',
    project.is_featured ? 'مشروع مميز' : null,
    statusLabel,
  ].filter(Boolean) as string[];
  
  const metaKeywords = Array.isArray(project.meta_keywords) 
    ? project.meta_keywords 
    : [];
  
  const allKeywords = [...new Set([...keywordsArray, ...metaKeywords])];
  
  // ─── الفيديو ───
  const videoEmbedUrl = getVideoEmbedUrl(project.video_url);
  
  // ─── أنواع Schema ───
  const projectTypes = getProjectMainType(project.category);

  // ═══════════════════════════════════════════════════
  // 1️⃣ Project Schema (الرئيسي - شامل)
  // ═══════════════════════════════════════════════════
  const projectSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': projectTypes,
    '@id': `${url}#project`,
    
    // البيانات الأساسية
    name: title,
    ...(titleEn && { alternateName: titleEn }),
    description,
    url,
    inLanguage: 'ar-SA',
    
    // التواريخ
    dateCreated: createdDate,
    datePublished: createdDate,
    dateModified: modifiedDate,
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    
    // المنشئ
    creator: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
      url: baseUrl,
      ...(siteLogo && { logo: siteLogo }),
    },
    
    // المقاول
    contractor: {
      '@type': 'GeneralContractor',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
    },
    
    // الناشر
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
    },
    
    // الصور
    ...(allImages.length > 0 && {
      image: allImages.map((img, i) => ({
        '@type': 'ImageObject',
        url: img,
        width: 1200,
        height: 800,
        caption: i === 0 ? title : `${title} - صورة ${i + 1}`,
        inLanguage: 'ar-SA',
        ...(i === 0 && { representativeOfPage: true }),
      })),
    }),
    
    // الموقع
    ...((project.city || project.location_ar) && {
      locationCreated: {
        '@type': 'Place',
        name: toStr(project.location_ar) || toStr(project.city) || 'المملكة العربية السعودية',
        address: {
          '@type': 'PostalAddress',
          ...(project.city && { addressLocality: project.city }),
          addressCountry: 'SA',
          addressRegion: 'المملكة العربية السعودية',
        },
      },
      contentLocation: {
        '@type': 'Place',
        name: toStr(project.location_ar) || toStr(project.city) || '',
        address: {
          '@type': 'PostalAddress',
          ...(project.city && { addressLocality: project.city }),
          addressCountry: 'SA',
        },
      },
    }),
    
    // الفئة والموضوع
    about: {
      '@type': 'Thing',
      name: toStr(project.category?.name_ar) || 'مشروع بناء',
      ...(project.category?.slug && {
        url: `${baseUrl}/projects?category=${project.category.slug}`,
      }),
    },
    
    // الخدمة المرتبطة
    ...(project.service && {
      isPartOf: {
        '@type': 'Service',
        '@id': `${baseUrl}/services/${project.service.slug}`,
        name: project.service.title_ar,
        url: `${baseUrl}/services/${project.service.slug}`,
      },
    }),
    
    // الحالة
    creativeWorkStatus: schemaStatus,
    
    // المساحة
    ...(areaSqm && {
      spatialCoverage: {
        '@type': 'Place',
        name: `مساحة ${areaSqm} متر مربع`,
        additionalProperty: {
          '@type': 'PropertyValue',
          name: 'المساحة',
          value: areaSqm,
          unitCode: 'MTK', // متر مربع
          unitText: 'متر مربع',
        },
      },
    }),
    
    // قيمة المشروع
    ...(project.project_value && {
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: project.project_value,
          priceCurrency: 'SAR',
        },
      },
    }),
    
    // المدة
    ...(project.duration && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'مدة التنفيذ',
          value: project.duration,
        },
        ...(project.duration_months ? [{
          '@type': 'PropertyValue',
          name: 'المدة بالأشهر',
          value: project.duration_months,
          unitText: 'شهر',
        }] : []),
        ...(areaSqm ? [{
          '@type': 'PropertyValue',
          name: 'المساحة',
          value: areaSqm,
          unitText: 'متر مربع',
        }] : []),
      ],
    }),
    
    // العميل
    ...(project.client_name && {
      sponsor: {
        '@type': 'Person',
        name: project.client_name,
      },
    }),
    
    // الكلمات المفتاحية
    keywords: allKeywords.join(', '),
    
    // إحصائيات
    ...(project.views_count && project.views_count > 0 && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'ViewAction' },
        userInteractionCount: project.views_count,
      },
    }),
    
    // مميز؟
    ...(project.is_featured && {
      additionalType: 'https://schema.org/FeaturedItem',
    }),
    
    // الجمهور
    audience: {
      '@type': 'Audience',
      audienceType: 'العملاء المهتمون بخدمات المقاولات والبناء',
      geographicArea: {
        '@type': 'Country',
        name: 'المملكة العربية السعودية',
      },
    },
    
    // الصفحة الرئيسية
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  // إزالة الحقول الفارغة
  Object.keys(projectSchema).forEach(key => {
    if (projectSchema[key] === undefined || projectSchema[key] === null) {
      delete projectSchema[key];
    }
  });

  // ═══════════════════════════════════════════════════
  // 2️⃣ ImageGallery Schema (للمعرض)
  // ═══════════════════════════════════════════════════
  const galleryImages = allImages.slice(0, 10); // أول 10 صور
  const imageGallerySchema = galleryImages.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${url}#gallery`,
    name: `معرض صور ${title}`,
    description: `صور تفصيلية لمشروع ${title}`,
    url: url,
    inLanguage: 'ar-SA',
    image: galleryImages.map((img, i) => ({
      '@type': 'ImageObject',
      url: img,
      caption: i === 0 ? title : `${title} - صورة ${i + 1}`,
      width: 1200,
      height: 800,
    })),
    associatedMedia: galleryImages.map((img, i) => ({
      '@type': 'ImageObject',
      url: img,
      caption: i === 0 ? title : `${title} - صورة ${i + 1}`,
    })),
  } : null;

  // ═══════════════════════════════════════════════════
  // 3️⃣ VideoObject Schema (للفيديو)
  // ═══════════════════════════════════════════════════
  const videoSchema = videoEmbedUrl ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${url}#video`,
    name: `فيديو مشروع: ${title}`,
    description: `شاهد فيديو تفصيلي عن مشروع ${title}`,
    thumbnailUrl: mainImageUrl,
    uploadDate: createdDate,
    contentUrl: project.video_url,
    embedUrl: videoEmbedUrl,
    inLanguage: 'ar-SA',
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
    },
  } : null;

  // ═══════════════════════════════════════════════════
  // 4️⃣ Virtual Tour Schema (الجولة الافتراضية)
  // ═══════════════════════════════════════════════════
  const virtualTourSchema = project.virtual_tour_url ? {
    '@context': 'https://schema.org',
    '@type': 'VirtualLocation',
    '@id': `${url}#virtual-tour`,
    name: `جولة افتراضية - ${title}`,
    description: `جولة افتراضية 360° داخل مشروع ${title}`,
    url: project.virtual_tour_url,
  } : null;

  // ═══════════════════════════════════════════════════
  // 5️⃣ Featured Image Schema
  // ═══════════════════════════════════════════════════
  const mainImageSchema = mainImageUrl ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${url}#main-image`,
    url: mainImageUrl,
    contentUrl: mainImageUrl,
    name: title,
    caption: project.image_title || title,
    description: project.image_alt || description,
    inLanguage: 'ar-SA',
    representativeOfPage: true,
    width: 1200,
    height: 800,
    author: { '@id': `${baseUrl}/#organization` },
    copyrightHolder: { '@id': `${baseUrl}/#organization` },
    creditText: siteName,
    license: `${baseUrl}/terms`,
  } : null;

  // ═══════════════════════════════════════════════════
  // 6️⃣ Related Projects Schema (ItemList)
  // ═══════════════════════════════════════════════════
  const relatedProjectsSchema = relatedProjects.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#related`,
    name: 'مشاريع مشابهة',
    description: `مشاريع أخرى من نفس فئة ${title}`,
    itemListElement: relatedProjects.slice(0, 5).map((rel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        '@id': `${baseUrl}/projects/${rel.slug}`,
        url: `${baseUrl}/projects/${rel.slug}`,
        name: rel.title_ar,
        ...(rel.main_image && {
          image: buildImageUrl(rel.main_image),
        }),
      },
    })),
  } : null;

  // ═══════════════════════════════════════════════════
  // 🎯 Render All Schemas
  // ═══════════════════════════════════════════════════
  return (
    <>
      {/* Main Project Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      
      {/* Image Gallery Schema */}
      {imageGallerySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
        />
      )}
      
      {/* Featured Image Schema */}
      {mainImageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(mainImageSchema) }}
        />
      )}
      
      {/* Video Schema */}
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      
      {/* Virtual Tour Schema */}
      {virtualTourSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(virtualTourSchema) }}
        />
      )}
      
      {/* Related Projects Schema */}
      {relatedProjectsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedProjectsSchema) }}
        />
      )}
    </>
  );
}