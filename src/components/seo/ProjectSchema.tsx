// src/components/seo/ProjectSchema.tsx
import type { SiteSettings } from '@/lib/settings';
import { toStr, buildImageUrl, stripHtml } from '@/lib/typeSafe';

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

  excerpt_ar?: string | null;
  excerpt_en?: string | null;
  content_ar?: string | null;
  content_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;

  main_image?: string | null;
  cover_image?: string | null;
  thumbnail?: string | null;
  image_alt?: string | null;
  image_title?: string | null;
  gallery?: string[] | null;
  before_after_images?: BeforeAfterImage[] | null;

  video_url?: string | null;
  virtual_tour_url?: string | null;

  client_name?: string | null;
  city?: string | null;
  location_ar?: string | null;
  location_en?: string | null;
  area_sqm?: number | string | null;
  project_value?: string | null;
  duration?: string | null;
  duration_months?: number | null;

  start_date?: string | null;
  end_date?: string | null;
  completion_date?: string | null;
  created_at?: string;
  updated_at?: string;

  status?: 'planned' | 'in_progress' | 'completed' | string;
  status_label?: string;
  is_featured?: boolean;
  is_active?: boolean;
  views_count?: number;

  category?: ProjectCategory | null;
  service?: ProjectService | null;

  meta_title_ar?: string | null;
  meta_title_en?: string | null;
  meta_description_ar?: string | null;
  meta_description_en?: string | null;
  meta_keywords?: string[] | null;
}

interface Props {
  project: ProjectData;
  settings?: SiteSettings;
  relatedProjects?: Array<{
    title_ar: string;
    slug: string;
    main_image?: string | null;
  }>;
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════

function getProjectStatus(status?: string): {
  schemaStatus: string;
  label: string;
} {
  switch (status) {
    case 'completed':
      return { schemaStatus: 'Completed',  label: 'مكتمل' };
    case 'in_progress':
    case 'in-progress':
      return { schemaStatus: 'InProgress', label: 'قيد التنفيذ' };
    case 'planned':
      return { schemaStatus: 'Planned',    label: 'مخطط' };
    default:
      return { schemaStatus: 'Active',     label: 'نشط' };
  }
}

function getAreaSqm(area?: number | string | null): number | null {
  if (!area) return null;
  const num = typeof area === 'string' ? parseFloat(area) : area;
  return isNaN(num) ? null : num;
}

function toISOString(date?: string | null): string | null {
  if (!date) return null;
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

function getAllImages(project: ProjectData): string[] {
  const images: string[] = [];

  [project.main_image, project.cover_image, project.thumbnail].forEach(img => {
    if (img) {
      const url = buildImageUrl(img);
      if (url && !images.includes(url)) images.push(url);
    }
  });

  if (Array.isArray(project.gallery)) {
    project.gallery.forEach(img => {
      if (img) {
        const url = buildImageUrl(img);
        if (url && !images.includes(url)) images.push(url);
      }
    });
  }

  if (Array.isArray(project.before_after_images)) {
    project.before_after_images.forEach(pair => {
      [pair.before, pair.after].forEach(img => {
        if (img) {
          const url = buildImageUrl(img);
          if (url && !images.includes(url)) images.push(url);
        }
      });
    });
  }

  return images;
}

function getVideoEmbedUrl(url?: string | null): string | null {
  if (!url) return null;

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
}

/** حذف الحقول undefined/null/''/[] */
function cleanSchema<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== '' &&
        !(Array.isArray(v) && v.length === 0)
    )
  ) as T;
}

// ════════════════════════════════════════════════
// 🎯 Main Component
// ════════════════════════════════════════════════
export default function ProjectSchema({
  project,
  settings = {},
  relatedProjects = [],
}: Props) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/projects/${project.slug}`;

  // ─── معلومات الموقع ────────────────────────────
  const siteName =
    toStr(settings.site_name_ar) ||
    toStr(settings.site_name)    ||
    '';

  const siteLogo   = buildImageUrl(settings.site_logo) || '';
  
  // business_type من settings لتحديد نوع المنشأة
  const businessType = toStr(settings.business_type) || 'Organization';

  // ─── البيانات الجغرافية من settings ───────────
  const country =
    toStr(settings.address_country) ||
    toStr(settings.country)          ||
    '';

  const countryCode =
    toStr(settings.address_country_code) ||
    toStr(settings.country_code)          ||
    '';

  const region =
    toStr(settings.address_region) ||
    toStr(settings.region)          ||
    '';

  // ─── البيانات الأساسية ─────────────────────────
  const title = toStr(project.title_ar) || toStr(project.title_en) || '';
  const titleEn = toStr(project.title_en) || '';

  const description =
    toStr(project.meta_description_ar) ||
    toStr(project.excerpt_ar)          ||
    stripHtml(project.description_ar, 200) ||
    stripHtml(project.content_ar, 200)     ||
    title ||
    '';

  // ─── الصور ────────────────────────────────────
  const allImages   = getAllImages(project);
  const mainImageUrl = allImages[0] || siteLogo || '';

  // ─── الحالة ───────────────────────────────────
  const { schemaStatus, label: statusLabel } = getProjectStatus(project.status);

  // ─── المساحة ──────────────────────────────────
  const areaSqm = getAreaSqm(project.area_sqm);

  // ─── التواريخ ─────────────────────────────────
  const startDate      = toISOString(project.start_date);
  const endDate        = toISOString(project.end_date || project.completion_date);
  const createdDate    = toISOString(project.created_at)  || new Date().toISOString();
  const modifiedDate   = toISOString(project.updated_at)  || createdDate;

  // ─── الكلمات المفتاحية (ديناميكية فقط) ────────
  const metaKeywords = Array.isArray(project.meta_keywords)
    ? project.meta_keywords.map(k => toStr(k)).filter(Boolean)
    : [];

  const dynamicKeywords = [
    project.title_ar,
    project.category?.name_ar,
    project.service?.title_ar,
    project.city,
    project.is_featured ? 'مشروع مميز' : null,
    statusLabel !== 'نشط' ? statusLabel : null,
  ].filter(Boolean) as string[];

  const allKeywords = [...new Set([...dynamicKeywords, ...metaKeywords])];

  // ─── الفيديو ──────────────────────────────────
  const videoEmbedUrl = getVideoEmbedUrl(project.video_url);

  // ─── additionalProperty (محسّن بدون تكرار) ────
  const additionalProps: any[] = [];

  if (project.duration) {
    additionalProps.push({
      '@type': 'PropertyValue',
      name:    'مدة التنفيذ',
      value:   project.duration,
    });
  }

  if (project.duration_months) {
    additionalProps.push({
      '@type':    'PropertyValue',
      name:       'المدة بالأشهر',
      value:      project.duration_months,
      unitText:   'شهر',
    });
  }

  if (areaSqm) {
    additionalProps.push({
      '@type':    'PropertyValue',
      name:       'المساحة',
      value:      areaSqm,
      unitCode:   'MTK',
      unitText:   'متر مربع',
    });
  }

  if (project.is_featured) {
    additionalProps.push({
      '@type': 'PropertyValue',
      name:    'مشروع مميز',
      value:   true,
    });
  }

  // ═══════════════════════════════════════════════
  // 1️⃣ Project Schema (الرئيسي)
  // ═══════════════════════════════════════════════
  const projectSchema = cleanSchema({
    '@context':  'https://schema.org',
    '@type':     'CreativeWork',
    '@id':       `${url}#project`,

    name:         title      || undefined,
    alternateName: titleEn   || undefined,
    description:  description || undefined,
    url,
    inLanguage:   'ar-SA',

    // أنواع إضافية
    additionalType: ['https://schema.org/Project'],

    // التواريخ
    dateCreated:   createdDate,
    datePublished: createdDate,
    dateModified:  modifiedDate,
    ...(startDate && { startDate }),
    ...(endDate   && { endDate }),

    // المنشئ والمنفذ
    creator: cleanSchema({
      '@type': 'Organization',
      '@id':   `${baseUrl}/#organization`,
      name:    siteName || undefined,
      url:     baseUrl,
      logo:    siteLogo || undefined,
    }),

    // المنفذ - ديناميكي حسب business_type
    ...(businessType && {
      contributor: {
        '@type': businessType,
        '@id':   `${baseUrl}/#organization`,
        name:    siteName || undefined,
      },
    }),

    // الناشر
    publisher: cleanSchema({
      '@type': 'Organization',
      '@id':   `${baseUrl}/#organization`,
      name:    siteName || undefined,
      url:     baseUrl,
    }),

    // الصور
    ...(allImages.length > 0 && {
      image: allImages.map((img, i) => ({
        '@type':   'ImageObject',
        url:       img,
        caption:   i === 0 ? title : `${title} - صورة ${i + 1}`,
        inLanguage: 'ar-SA',
        ...(i === 0 && { representativeOfPage: true }),
      })),
    }),

    // الموقع الجغرافي
    ...((project.city || project.location_ar) && {
      locationCreated: cleanSchema({
        '@type': 'Place',
        name:    toStr(project.location_ar) || toStr(project.city) || undefined,
        address: cleanSchema({
          '@type':           'PostalAddress',
          addressLocality:   toStr(project.city)  || undefined,
          addressRegion:     region                || undefined,
          addressCountry:    countryCode           || undefined,
        }),
      }),
      contentLocation: cleanSchema({
        '@type': 'Place',
        name:    toStr(project.location_ar) || toStr(project.city) || undefined,
        address: cleanSchema({
          '@type':         'PostalAddress',
          addressLocality: toStr(project.city) || undefined,
          addressCountry:  countryCode         || undefined,
        }),
      }),
    }),

    // التصنيف
    ...(project.category?.name_ar && {
      about: cleanSchema({
        '@type': 'Thing',
        name:    project.category.name_ar,
        ...(project.category.slug && {
          url: `${baseUrl}/projects?category=${project.category.slug}`,
        }),
      }),
    }),

    // الخدمة المرتبطة
    ...(project.service?.slug && {
      isPartOf: cleanSchema({
        '@type': 'Service',
        '@id':   `${baseUrl}/services/${project.service.slug}`,
        name:    project.service.title_ar || undefined,
        url:     `${baseUrl}/services/${project.service.slug}`,
      }),
    }),

    // الحالة
    creativeWorkStatus: schemaStatus,

    // القيمة المالية
    ...(project.project_value && {
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type':         'PriceSpecification',
          price:           project.project_value,
          priceCurrency:   'SAR',
        },
      },
    }),

    // الخصائص الإضافية
    ...(additionalProps.length > 0 && {
      additionalProperty: additionalProps,
    }),

    // العميل (funder أدق من sponsor)
    ...(project.client_name && {
      funder: {
        '@type': 'Person',
        name:    project.client_name,
      },
    }),

    // الكلمات المفتاحية
    ...(allKeywords.length > 0 && {
      keywords: allKeywords.join(', '),
    }),

    // الإحصائيات
    ...(project.views_count && project.views_count > 0 && {
      interactionStatistic: {
        '@type':                'InteractionCounter',
        interactionType:        { '@type': 'ViewAction' },
        userInteractionCount:   project.views_count,
      },
    }),

    // الجمهور (ديناميكي من settings)
    ...((country || region) && {
      audience: cleanSchema({
        '@type': 'Audience',
        geographicArea: cleanSchema({
          '@type': 'AdministrativeArea',
          name:    country || region || undefined,
        }),
      }),
    }),

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   url,
    },
  });

  // ═══════════════════════════════════════════════
  // 2️⃣ ImageGallery Schema (محسّن - بدون تكرار)
  // ═══════════════════════════════════════════════
  const galleryImages = allImages.slice(0, 10);

  const imageGallerySchema =
    galleryImages.length > 1
      ? {
          '@context':  'https://schema.org',
          '@type':     'ImageGallery',
          '@id':       `${url}#gallery`,
          name:        title ? `معرض صور ${title}` : 'معرض الصور',
          description: title ? `صور تفصيلية لـ ${title}` : '',
          url,
          inLanguage:  'ar-SA',
          image: galleryImages.map((img, i) => ({
            '@type':   'ImageObject',
            url:       img,
            caption:   i === 0 ? title : `${title} - صورة ${i + 1}`,
          })),
        }
      : null;

  // ═══════════════════════════════════════════════
  // 3️⃣ Featured Image Schema
  // ═══════════════════════════════════════════════
  const mainImageSchema =
    mainImageUrl
      ? cleanSchema({
          '@context':           'https://schema.org',
          '@type':              'ImageObject',
          '@id':                `${url}#main-image`,
          url:                  mainImageUrl,
          contentUrl:           mainImageUrl,
          name:                 toStr(project.image_title) || title || undefined,
          caption:              toStr(project.image_title) || title || undefined,
          description:          toStr(project.image_alt)   || description || undefined,
          inLanguage:           'ar-SA',
          representativeOfPage: true,
          author:               { '@id': `${baseUrl}/#organization` },
          copyrightHolder:      { '@id': `${baseUrl}/#organization` },
          creditText:           siteName || undefined,
        })
      : null;

  // ═══════════════════════════════════════════════
  // 4️⃣ VideoObject Schema
  // ═══════════════════════════════════════════════
  const videoSchema =
    videoEmbedUrl
      ? cleanSchema({
          '@context':    'https://schema.org',
          '@type':       'VideoObject',
          '@id':         `${url}#video`,
          name:          title ? `فيديو: ${title}` : 'فيديو المشروع',
          description:   description || undefined,
          thumbnailUrl:  mainImageUrl || undefined,
          uploadDate:    createdDate,
          contentUrl:    project.video_url || undefined,
          embedUrl:      videoEmbedUrl,
          inLanguage:    'ar-SA',
          publisher: cleanSchema({
            '@type': 'Organization',
            '@id':   `${baseUrl}/#organization`,
            name:    siteName || undefined,
          }),
        })
      : null;

  // ═══════════════════════════════════════════════
  // 5️⃣ Virtual Tour Schema (محسّن)
  // ═══════════════════════════════════════════════
  const virtualTourSchema =
    project.virtual_tour_url
      ? {
          '@context':     'https://schema.org',
          '@type':        'WebPage',
          '@id':          `${url}#virtual-tour`,
          name:           title ? `جولة افتراضية - ${title}` : 'جولة افتراضية',
          description:    title ? `جولة افتراضية 360° لـ ${title}` : '',
          url:            project.virtual_tour_url,
          additionalType: 'https://schema.org/VirtualLocation',
        }
      : null;

  // ═══════════════════════════════════════════════
  // 6️⃣ Related Projects Schema
  // ═══════════════════════════════════════════════
  const relatedProjectsSchema =
    relatedProjects.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type':    'ItemList',
          '@id':      `${url}#related`,
          name:       'مشاريع مشابهة',
          itemListElement: relatedProjects
            .slice(0, 5)
            .map((rel, index) =>
              cleanSchema({
                '@type':    'ListItem',
                position:   index + 1,
                item: cleanSchema({
                  '@type':   'CreativeWork',
                  '@id':     `${baseUrl}/projects/${rel.slug}`,
                  url:       `${baseUrl}/projects/${rel.slug}`,
                  name:      rel.title_ar,
                  image: rel.main_image
                    ? buildImageUrl(rel.main_image) || undefined
                    : undefined,
                }),
              })
            ),
        }
      : null;

  // ═══════════════════════════════════════════════
  // 🎯 Render
  // ═══════════════════════════════════════════════
  return (
    <>
      {/* 1. Main Project Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema),
        }}
      />

      {/* 2. Image Gallery */}
      {imageGallerySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(imageGallerySchema),
          }}
        />
      )}

      {/* 3. Featured Image */}
      {mainImageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(mainImageSchema),
          }}
        />
      )}

      {/* 4. Video */}
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(videoSchema),
          }}
        />
      )}

      {/* 5. Virtual Tour */}
      {virtualTourSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(virtualTourSchema),
          }}
        />
      )}

      {/* 6. Related Projects */}
      {relatedProjectsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(relatedProjectsSchema),
          }}
        />
      )}
    </>
  );
}