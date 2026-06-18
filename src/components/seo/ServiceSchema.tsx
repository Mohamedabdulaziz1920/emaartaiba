// src/components/seo/ServiceSchema.tsx
import type { SiteSettings } from '@/lib/settings';
import { toStr, toNumber, toInt, toArray, buildImageUrl, stripHtml } from '@/lib/typeSafe';

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════
interface ServiceCategory {
  id?: number;
  name_ar: string;
  name_en?: string;
  slug?: string;
}

interface ServiceTag {
  id?: number;
  name_ar: string;
  name_en?: string;
  slug?: string;
}

interface ServiceData {
  id?: number;
  title_ar: string;
  title_en?: string | null;
  slug: string;
  
  // الأوصاف
  excerpt_ar?: string | null;
  excerpt_en?: string | null;
  content_ar?: string | null;
  content_en?: string | null;
  
  // الصور
  icon?: string | null;
  image?: string | null;
  image_url?: string | null;
  background_image?: string | null;
  background_image_url?: string | null;
  og_image?: string | null;
  og_image_url?: string | null;
  gallery?: string[] | null;
  gallery_images?: string[] | null;
  
  // الفيديو
  video_url?: string | null;
  embed_video_url?: string | null;
  
  // التصنيف
  category?: ServiceCategory | null;
  tags?: ServiceTag[];
  
  // السعر والمدة
  price_from?: number | string | null;
  price_to?: number | string | null;
  price_unit?: string | null;
  duration?: string | null;
  
  // الحالة
  is_featured?: boolean;
  is_active?: boolean;
  views_count?: number;
  
  // SEO
  meta_title_ar?: string | null;
  meta_title_en?: string | null;
  meta_description_ar?: string | null;
  meta_description_en?: string | null;
  meta_keywords?: string[] | null;
  
  // التواريخ
  created_at?: string;
  updated_at?: string;
}

interface Props {
  service: ServiceData;
  settings?: SiteSettings;
  /** الخدمات المرتبطة لتحسين Internal Linking */
  relatedServices?: Array<{
    title_ar: string;
    slug: string;
    image_url?: string | null;
    excerpt_ar?: string | null;
  }>;
  /** الأسئلة الشائعة الخاصة بهذه الخدمة (اختياري) */
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════

/**
 * استخراج جميع صور الخدمة
 */
function getAllImages(service: ServiceData): string[] {
  const images: string[] = [];
  
  // الصور الأساسية
  const primaryImages = [
    service.image_url,
    service.image,
    service.background_image_url,
    service.background_image,
    service.og_image_url,
    service.og_image,
  ];
  
  primaryImages.forEach(img => {
    if (img) {
      const url = buildImageUrl(img);
      if (url && !images.includes(url)) images.push(url);
    }
  });
  
  // المعرض
  const gallery = service.gallery || service.gallery_images || [];
  if (Array.isArray(gallery)) {
    gallery.forEach(img => {
      if (img) {
        const url = buildImageUrl(img);
        if (url && !images.includes(url)) images.push(url);
      }
    });
  }
  
  return images;
}

/**
 * تحويل المدة إلى ISO 8601 Duration
 */
function parseDuration(duration?: string | null): string | undefined {
  if (!duration) return undefined;
  
  const num = parseInt(duration, 10);
  if (isNaN(num)) return undefined;
  
  if (duration.includes('ساعة') || duration.includes('hour')) return `PT${num}H`;
  if (duration.includes('يوم') || duration.includes('day')) return `P${num}D`;
  if (duration.includes('أسبوع') || duration.includes('week')) return `P${num}W`;
  if (duration.includes('شهر') || duration.includes('month')) return `P${num}M`;
  if (duration.includes('سنة') || duration.includes('year')) return `P${num}Y`;
  
  return undefined;
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

/**
 * استخراج المناطق المخدومة من Settings
 */
function getServiceAreas(settings?: SiteSettings): Array<{ '@type': string; name: string }> {
  const fromSettings = toArray<string>(
    settings?.service_areas_ar || 
    settings?.service_areas ||
    settings?.hero_cities_ar ||
    settings?.hero_cities
  );
  
  if (fromSettings.length > 0) {
    return fromSettings.map(area => ({ '@type': 'City', name: area }));
  }
  
  // قائمة افتراضية
  return [
    { '@type': 'City', name: 'الرياض' },
    { '@type': 'City', name: 'جدة' },
    { '@type': 'City', name: 'الدمام' },
    { '@type': 'City', name: 'مكة المكرمة' },
    { '@type': 'City', name: 'المدينة المنورة' },
    { '@type': 'City', name: 'الخبر' },
    { '@type': 'City', name: 'الطائف' },
    { '@type': 'City', name: 'تبوك' },
  ];
}

/**
 * استخراج روابط السوشيال
 */
function getSocialLinks(settings?: SiteSettings): string[] {
  const links: string[] = [];
  const fields = ['facebook', 'facebook_url', 'twitter', 'twitter_url', 
                  'instagram', 'instagram_url', 'linkedin', 'linkedin_url',
                  'youtube', 'youtube_url'];
  
  fields.forEach(field => {
    const val = toStr(settings?.[field]);
    if (val && (val.startsWith('http://') || val.startsWith('https://'))) {
      if (!links.includes(val)) links.push(val);
    }
  });
  
  return links;
}

/**
 * تحديد نوع الخدمة من الفئة
 */
function getServiceType(category?: ServiceCategory | null): string {
  if (!category?.name_ar) return 'مقاولات عامة';
  return category.name_ar;
}

// ════════════════════════════════════════════════
// 🎯 Main Component
// ════════════════════════════════════════════════
export default function ServiceSchema({ 
  service, 
  settings = {},
  relatedServices = [],
  faqs = [],
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/services/${service.slug}`;
  
  // ─── معلومات الموقع ───
  const siteName = toStr(settings.site_name_ar) || 
                   toStr(settings.site_name) || 
                   'شركة البناء المتميز';
  
  const siteLogo = buildImageUrl(settings.site_logo) || `${baseUrl}/logo.png`;
  const phone = toStr(settings.phone) || '+966500000000';
  const email = toStr(settings.email) || 'info@example.com';
  const priceRange = toStr(settings.price_range) || '$$-$$$';
  
  // ─── البيانات الأساسية ───
  const title = toStr(service.title_ar) || 'خدمة';
  const titleEn = toStr(service.title_en);
  const description = toStr(service.meta_description_ar) ||
                      toStr(service.excerpt_ar) || 
                      stripHtml(service.content_ar, 200) ||
                      `خدمة ${title}`;
  
  // ─── الصور ───
  const allImages = getAllImages(service);
  const mainImageUrl = allImages[0] || siteLogo;
  
  // ─── السعر ───
  const priceFrom = toNumber(service.price_from, 0);
  const priceTo = toNumber(service.price_to, 0);
  
  // ─── المدة ───
  const isoDuration = parseDuration(service.duration);
  
  // ─── الفيديو ───
  const videoEmbedUrl = getVideoEmbedUrl(service.embed_video_url || service.video_url);
  
  // ─── المناطق ───
  const serviceAreas = getServiceAreas(settings);
  
  // ─── السوشيال ───
  const socialLinks = getSocialLinks(settings);
  
  // ─── التقييمات ───
  const ratingValue = toNumber(settings.rating_value, 4.9);
  const reviewCount = toInt(settings.review_count, 100);
  
  // ─── الكلمات المفتاحية ───
  const keywordsArray = [
    service.title_ar,
    service.category?.name_ar,
    ...(service.tags || []).map(t => toStr(t.name_ar)),
    'مقاولات',
    'بناء',
    'تشطيبات',
    service.is_featured ? 'خدمة مميزة' : null,
  ].filter(Boolean) as string[];
  
  const metaKeywords = Array.isArray(service.meta_keywords) ? service.meta_keywords : [];
  const allKeywords = [...new Set([...keywordsArray, ...metaKeywords])];
  
  // ─── التواريخ ───
  const createdDate = service.created_at ? new Date(service.created_at).toISOString() : new Date().toISOString();
  const modifiedDate = service.updated_at ? new Date(service.updated_at).toISOString() : createdDate;

  // ═══════════════════════════════════════════════════
  // 1️⃣ Service Schema (الرئيسي - شامل)
  // ═══════════════════════════════════════════════════
  const serviceSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    
    // البيانات الأساسية
    name: title,
    ...(titleEn && { alternateName: titleEn }),
    description,
    url,
    inLanguage: 'ar-SA',
    serviceType: getServiceType(service.category),
    
    // التواريخ
    dateCreated: createdDate,
    dateModified: modifiedDate,
    
    // مقدم الخدمة (Reference to Organization)
    provider: {
      '@type': 'GeneralContractor',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
      url: baseUrl,
      telephone: phone,
      email: email,
      ...(siteLogo && {
        logo: {
          '@type': 'ImageObject',
          url: siteLogo,
          width: 600,
          height: 600,
        },
      }),
      priceRange,
      address: {
        '@type': 'PostalAddress',
        addressCountry: toStr(settings.country_code) || 'SA',
        addressRegion: toStr(settings.region_ar) || 'منطقة الرياض',
        addressLocality: toStr(settings.city_ar) || 'الرياض',
      },
      ...(socialLinks.length > 0 && { sameAs: socialLinks }),
    },
    
    // المنطقة المخدومة
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'المملكة العربية السعودية',
      containsPlace: serviceAreas,
    },
    
    // الفئة
    ...(service.category && {
      category: service.category.name_ar,
      isRelatedTo: {
        '@type': 'Service',
        name: service.category.name_ar,
        ...(service.category.slug && {
          url: `${baseUrl}/services?category=${service.category.slug}`,
        }),
      },
    }),
    
    // الصور
    ...(allImages.length > 0 && {
      image: allImages.map((img, i) => ({
        '@type': 'ImageObject',
        url: img,
        width: i === 0 ? 1200 : 800,
        height: i === 0 ? 800 : 600,
        caption: i === 0 ? title : `${title} - صورة ${i + 1}`,
        inLanguage: 'ar-SA',
        ...(i === 0 && { representativeOfPage: true }),
      })),
    }),
    
    // العروض والسعر
    ...(priceFrom > 0 && {
      offers: {
        '@type': priceTo > 0 ? 'AggregateOffer' : 'Offer',
        ...(priceTo > 0 ? {
          lowPrice: priceFrom,
          highPrice: priceTo,
          offerCount: 1,
        } : {
          price: priceFrom,
        }),
        priceCurrency: 'SAR',
        ...(service.price_unit && {
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: priceFrom,
            priceCurrency: 'SAR',
            unitText: service.price_unit,
          },
        }),
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        availableDeliveryMethod: 'https://schema.org/OnSitePickup',
        seller: { '@id': `${baseUrl}/#organization` },
        areaServed: {
          '@type': 'Country',
          name: 'SA',
        },
        eligibleRegion: serviceAreas,
      },
    }),
    
    // التقييم
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: toNumber(settings.best_rating, 5),
      worstRating: toNumber(settings.worst_rating, 1),
    },
    
    // الكلمات المفتاحية
    keywords: allKeywords.join(', '),
    
    // المدة
    ...(isoDuration && {
      timeRequired: isoDuration,
    }),
    
    // المعلومات الإضافية
    additionalProperty: [
      ...(service.duration ? [{
        '@type': 'PropertyValue',
        name: 'مدة التنفيذ',
        value: service.duration,
      }] : []),
      ...(service.is_featured ? [{
        '@type': 'PropertyValue',
        name: 'خدمة مميزة',
        value: 'نعم',
      }] : []),
    ],
    
    // إحصائيات
    ...(service.views_count && service.views_count > 0 && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'ViewAction' },
        userInteractionCount: service.views_count,
      },
    }),
    
    // الجمهور المستهدف
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
    
    // مميز؟
    ...(service.is_featured && {
      additionalType: 'https://schema.org/FeaturedItem',
    }),
  };

  // إزالة الحقول الفارغة
  Object.keys(serviceSchema).forEach(key => {
    if (serviceSchema[key] === undefined || 
        serviceSchema[key] === null ||
        (Array.isArray(serviceSchema[key]) && serviceSchema[key].length === 0)) {
      delete serviceSchema[key];
    }
  });

  // ═══════════════════════════════════════════════════
  // 2️⃣ Product Schema (للظهور في Google Shopping)
  // ═══════════════════════════════════════════════════
  const productSchema = priceFrom > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: title,
    description,
    image: allImages.slice(0, 5),
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'SAR',
      price: priceFrom,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${baseUrl}/#organization` },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  } : null;

  // ═══════════════════════════════════════════════════
  // 3️⃣ Image Object Schema (الصورة الرئيسية)
  // ═══════════════════════════════════════════════════
  const mainImageSchema = mainImageUrl ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${url}#main-image`,
    url: mainImageUrl,
    contentUrl: mainImageUrl,
    name: title,
    caption: title,
    description,
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
  // 4️⃣ Image Gallery Schema (للمعرض)
  // ═══════════════════════════════════════════════════
  const galleryImages = allImages.slice(0, 10);
  const imageGallerySchema = galleryImages.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${url}#gallery`,
    name: `معرض صور ${title}`,
    description: `صور تفصيلية لخدمة ${title}`,
    url,
    inLanguage: 'ar-SA',
    image: galleryImages.map((img, i) => ({
      '@type': 'ImageObject',
      url: img,
      caption: i === 0 ? title : `${title} - صورة ${i + 1}`,
      width: 1200,
      height: 800,
    })),
  } : null;

  // ═══════════════════════════════════════════════════
  // 5️⃣ Video Schema (للفيديو)
  // ═══════════════════════════════════════════════════
  const videoSchema = videoEmbedUrl ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${url}#video`,
    name: `فيديو خدمة: ${title}`,
    description: `شاهد فيديو تفصيلي عن خدمة ${title}`,
    thumbnailUrl: mainImageUrl,
    uploadDate: createdDate,
    contentUrl: service.video_url,
    embedUrl: videoEmbedUrl,
    inLanguage: 'ar-SA',
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
    },
  } : null;

  // ═══════════════════════════════════════════════════
  // 6️⃣ FAQ Schema (إذا كانت موجودة)
  // ═══════════════════════════════════════════════════
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  } : null;

  // ═══════════════════════════════════════════════════
  // 7️⃣ Related Services Schema (ItemList)
  // ═══════════════════════════════════════════════════
  const relatedServicesSchema = relatedServices.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#related`,
    name: 'خدمات مشابهة',
    description: `خدمات أخرى من نفس فئة ${title}`,
    itemListElement: relatedServices.slice(0, 5).map((rel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${baseUrl}/services/${rel.slug}`,
        url: `${baseUrl}/services/${rel.slug}`,
        name: rel.title_ar,
        ...(rel.excerpt_ar && { description: stripHtml(rel.excerpt_ar, 100) }),
        ...(rel.image_url && {
          image: buildImageUrl(rel.image_url),
        }),
      },
    })),
  } : null;

  // ═══════════════════════════════════════════════════
  // 8️⃣ HowTo Schema (للخدمات التي لها خطوات)
  // ═══════════════════════════════════════════════════
  const howToSchema = service.content_ar ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: `كيف نقدم خدمة ${title}`,
    description: stripHtml(service.content_ar, 300),
    image: mainImageUrl,
    ...(isoDuration && { totalTime: isoDuration }),
    ...(priceFrom > 0 && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'SAR',
        value: priceFrom,
      },
    }),
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'الاستشارة المجانية',
        text: 'تواصل معنا للحصول على استشارة مجانية وتقييم احتياجاتك',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'دراسة المشروع',
        text: 'يقوم فريقنا بدراسة المشروع وتقديم عرض سعر مفصل',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'التنفيذ',
        text: 'بدء العمل بأعلى معايير الجودة والاحترافية',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'التسليم والمتابعة',
        text: 'تسليم المشروع مع ضمان شامل ومتابعة دورية',
      },
    ],
  } : null;

  // ═══════════════════════════════════════════════════
  // 🎯 Render All Schemas
  // ═══════════════════════════════════════════════════
  return (
    <>
      {/* Service Schema (الرئيسي) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      {/* Product Schema (للسعر) */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      
      {/* Image Object Schema */}
      {mainImageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(mainImageSchema) }}
        />
      )}
      
      {/* Image Gallery Schema */}
      {imageGallerySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
        />
      )}
      
      {/* Video Schema */}
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      
      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      {/* Related Services Schema */}
      {relatedServicesSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedServicesSchema) }}
        />
      )}
      
      {/* HowTo Schema */}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  );
}