// src/components/seo/JsonLd.tsx
import { type SiteSettings } from '@/lib/settings';
import { toStr, toNumber, toInt, toArray } from '@/lib/typeSafe';

// ═══════════════════════════════════════════════════
// 📋 Types
// ═══════════════════════════════════════════════════
export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ServiceItem {
  name: string;
  description?: string;
  price?: string | number;
  image?: string;
  url?: string;
}

export interface ArticleData {
  title: string;
  description: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  category?: string;
  tags?: string[];
}

export interface ProjectData {
  title: string;
  description: string;
  image?: string;
  client?: string;
  location?: string;
  completedAt?: string;
  category?: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  text: string;
  date?: string;
}

export type PageType =
  | 'home'
  | 'about'
  | 'services'
  | 'projects'
  | 'blog'
  | 'contact'
  | 'service-detail'
  | 'project-detail'
  | 'blog-detail'
  | 'faq'
  | 'area';

export interface Props {
  settings?: SiteSettings;
  pageType?: PageType;
  pageTitle?: string;
  pageDescription?: string;
  pageUrl?: string;
  pageImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  service?: ServiceItem;
  article?: ArticleData;
  project?: ProjectData;
  reviews?: ReviewItem[];
}

// ═══════════════════════════════════════════════════
// 🛠️ Helpers
// ═══════════════════════════════════════════════════

/** تحليل JSON array بأمان */
function safeParseJsonArray<T = any>(value: unknown, fallback: T[] = []): T[] {
  if (!value) return fallback;
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean) as unknown as T[];
    }
  }
  return fallback;
}

/** حذف الحقول الفارغة من object */
function clean<T extends Record<string, any>>(obj: T): T {
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

// ═══════════════════════════════════════════════════
// ⏰ ساعات العمل
// ═══════════════════════════════════════════════════
function getOpeningHoursSpecification(settings: SiteSettings) {
  const workingDays  = toStr(settings.working_days_ar  || settings.working_days);
  const workingHours = toStr(settings.working_hours_ar || settings.working_hours);
  const weekendDays  = toStr(settings.weekend_days_ar  || settings.weekend_days);
  const weekendHours = toStr(settings.working_hours_weekend);

  const openingHours: any[] = [];

  const daysMap: Record<string, string> = {
    'الأحد':    'Sunday',
    'الاثنين':  'Monday',
    'الثلاثاء': 'Tuesday',
    'الأربعاء': 'Wednesday',
    'الخميس':   'Thursday',
    'الجمعة':   'Friday',
    'السبت':    'Saturday',
    Sunday:     'Sunday',
    Monday:     'Monday',
    Tuesday:    'Tuesday',
    Wednesday:  'Wednesday',
    Thursday:   'Thursday',
    Friday:     'Friday',
    Saturday:   'Saturday',
  };

  // ─── أيام العمل الأساسية ──────────────────────
  if (workingDays && workingHours) {
    const days = workingDays
      .split(/[,،\s\-إلى\sto]+/)
      .map(d => d.trim())
      .filter(Boolean);
    const englishDays = days
      .map(d => daysMap[d] || d)
      .filter(Boolean);

    const parts  = workingHours.split(/[-–—إلى\sto]+/).map(t => t.trim());
    const opens  = parts[0];
    const closes = parts[1];

    // ✅ لا fallback - فقط إذا كانت البيانات مكتملة
    if (englishDays.length > 0 && opens && closes) {
      openingHours.push({
        '@type':     'OpeningHoursSpecification',
        dayOfWeek:   englishDays,
        opens,
        closes,
      });
    }
  }

  // ─── أيام العطلة ──────────────────────────────
  if (weekendDays && weekendHours) {
    const days = weekendDays
      .split(/[,،\s]+/)
      .map(d => d.trim())
      .filter(Boolean);
    const englishDays = days
      .map(d => daysMap[d] || d)
      .filter(Boolean);

    const parts  = weekendHours.split(/[-–—]+/).map(t => t.trim());
    const opens  = parts[0];
    const closes = parts[1];

    // ✅ لا fallback
    if (englishDays.length > 0 && opens && closes) {
      openingHours.push({
        '@type':   'OpeningHoursSpecification',
        dayOfWeek: englishDays,
        opens,
        closes,
      });
    }
  }

  return openingHours;
}

// ═══════════════════════════════════════════════════
// 🌍 المناطق المخدومة
// ═══════════════════════════════════════════════════
function getAreaServed(settings: SiteSettings) {
  // 1. من hero_cities
  const citiesFromSettings = toStr(
    settings.hero_cities_ar || settings.hero_cities
  );
  if (citiesFromSettings) {
    return citiesFromSettings
      .split(/[,،·]/)
      .map(c => ({ '@type': 'City', name: c.trim() }))
      .filter(c => c.name);
  }

  // 2. من service_areas
  const serviceAreas = toArray<string>(
    settings.service_areas_ar || settings.service_areas
  );
  if (serviceAreas.length > 0) {
    return serviceAreas.map(c => ({ '@type': 'City', name: c }));
  }

  // 3. من city فقط
  const city = toStr(settings.city_ar || settings.city);
  if (city) {
    return [{ '@type': 'City', name: city }];
  }

  return [];
}

// ═══════════════════════════════════════════════════
// 🛠️ كتالوج الخدمات
// ═══════════════════════════════════════════════════
function getServicesCatalog(settings: SiteSettings) {
  const services = safeParseJsonArray<any>(
    settings.services_catalog ||
    settings.main_services_ar ||
    settings.main_services,
    []
  );

  if (services.length === 0) return [];

  return services.map((service: any) => {
    if (typeof service === 'string') {
      return {
        '@type':      'Offer',
        itemOffered:  { '@type': 'Service', name: service },
      };
    }
    return {
      '@type': 'Offer',
      itemOffered: clean({
        '@type':      'Service',
        name:         service.name_ar  || service.name  ||
                      service.title_ar || service.title || '',
        description:  service.description || undefined,
      }),
    };
  });
}

// ═══════════════════════════════════════════════════
// ⭐ التقييم
// ═══════════════════════════════════════════════════
function getAggregateRating(settings: SiteSettings) {
  const ratingValue = toNumber(settings.rating_value, 0);
  const reviewCount = toInt(settings.review_count,    0);

  if (ratingValue > 0 && reviewCount > 0) {
    return {
      '@type':      'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating:   toNumber(settings.best_rating,  5),
      worstRating:  toNumber(settings.worst_rating, 1),
    };
  }

  return undefined;
}

// ═══════════════════════════════════════════════════
// 🌐 روابط التواصل الاجتماعي
// ═══════════════════════════════════════════════════
function getSameAs(settings: SiteSettings): string[] {
  const socialLinks: string[] = [];

  const socialFields = [
    'facebook',   'facebook_url',
    'twitter',    'twitter_url',
    'instagram',  'instagram_url',
    'linkedin',   'linkedin_url',
    'youtube',    'youtube_url',
    'tiktok',     'tiktok_url',
    'snapchat',   'telegram',
    'pinterest',  'pinterest_url',
  ];

  socialFields.forEach(field => {
    const value = toStr((settings as any)[field]);
    if (value && value.startsWith('http') && !socialLinks.includes(value)) {
      socialLinks.push(value);
    }
  });

  return socialLinks;
}

// ═══════════════════════════════════════════════════
// 📞 نقاط الاتصال
// ═══════════════════════════════════════════════════
function getContactPoints(settings: SiteSettings) {
  const contactPoints: any[] = [];

  // ✅ لا fallback ثابت لـ countryCode
  const countryCode =
    toStr(settings.country_code) ||
    toStr((settings as any).address_country_code) ||
    '';

  const phone = toStr(settings.phone);
  if (phone) {
    contactPoints.push(clean({
      '@type':           'ContactPoint',
      telephone:         phone,
      contactType:       'customer service',
      areaServed:        countryCode || undefined,
      availableLanguage: ['Arabic'],
    }));
  }

  const whatsapp = toStr(settings.whatsapp);
  if (whatsapp) {
    contactPoints.push(clean({
      '@type':           'ContactPoint',
      telephone:         whatsapp,
      contactType:       'sales',
      contactOption:     'WhatsApp',
      areaServed:        countryCode || undefined,
      availableLanguage: ['Arabic'],
    }));
  }

  const email = toStr(settings.email);
  if (email) {
    contactPoints.push(clean({
      '@type':           'ContactPoint',
      email,
      contactType:       'customer support',
      areaServed:        countryCode || undefined,
      availableLanguage: ['Arabic'],
    }));
  }

  return contactPoints;
}

// ═══════════════════════════════════════════════════
// 🍞 Breadcrumb Schema
// ═══════════════════════════════════════════════════
function buildBreadcrumbSchema(
  breadcrumbs: BreadcrumbItem[],
  baseUrl: string
) {
  const items = breadcrumbs?.length > 0 ? breadcrumbs : [];

  // أضف الرئيسية تلقائياً إذا لم تكن الأولى
  const startsWithHome =
    items[0]?.url === '/' || items[0]?.url === `${baseUrl}/`;

  const finalItems =
    items.length > 0 && !startsWithHome
      ? [{ name: 'الرئيسية', url: '/' }, ...items]
      : items;

  if (finalItems.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: finalItems.map((item, index) => ({
      '@type':    'ListItem',
      position:   index + 1,
      name:       item.name,
      item:       item.url.startsWith('http')
                    ? item.url
                    : `${baseUrl}${item.url}`,
    })),
  };
}

// ═══════════════════════════════════════════════════
// ❓ FAQ Schema
// ═══════════════════════════════════════════════════
function buildFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name:    faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    faq.answer,
      },
    })),
  };
}

// ═══════════════════════════════════════════════════
// 🛠️ Service Schema
// ═══════════════════════════════════════════════════
function buildServiceSchema(
  service: ServiceItem,
  settings: SiteSettings,
  baseUrl: string
) {
  if (!service) return null;

  const siteName =
    toStr(settings.site_name_ar) || toStr(settings.site_name) || '';

  return clean({
    '@context':   'https://schema.org',
    '@type':      'Service',
    name:         service.name,
    description:  service.description || undefined,
    image:        service.image       || undefined,
    url: service.url
      ? service.url.startsWith('http')
        ? service.url
        : `${baseUrl}${service.url}`
      : undefined,
    provider: clean({
      '@type': 'LocalBusiness',
      '@id':   `${baseUrl}/#organization`,
      name:    siteName || undefined,
    }),
    areaServed: getAreaServed(settings),
    ...(service.price && {
      offers: {
        '@type':         'Offer',
        price:           service.price,
        priceCurrency:   'SAR',
      },
    }),
  });
}

// ═══════════════════════════════════════════════════
// 📰 Article Schema
// ═══════════════════════════════════════════════════
function buildArticleSchema(
  article: ArticleData,
  settings: SiteSettings,
  baseUrl: string,
  pageUrl: string
) {
  if (!article) return null;

  const siteName =
    toStr(settings.site_name_ar) || toStr(settings.site_name) || '';
  const logoUrl = toStr(settings.site_logo);

  return clean({
    '@context':   'https://schema.org',
    '@type':      'Article',
    headline:     article.title,
    description:  article.description,

    ...(article.image && {
      image: {
        '@type':  'ImageObject',
        url:      article.image,
        width:    1200,
        height:   630,
      },
    }),

    datePublished: article.publishedAt || new Date().toISOString(),
    dateModified:  article.modifiedAt  ||
                   article.publishedAt ||
                   new Date().toISOString(),

    // ✅ Person إذا كان هناك مؤلف، Organization إذا لم يكن
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@type': 'Organization', '@id': `${baseUrl}/#organization` },

    publisher: clean({
      '@type': 'Organization',
      '@id':   `${baseUrl}/#organization`,
      name:    siteName || undefined,
      ...(logoUrl && {
        logo: { '@type': 'ImageObject', url: logoUrl },
      }),
    }),

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   pageUrl,
    },

    ...(article.category && { articleSection: article.category }),
    ...(article.tags?.length && { keywords: article.tags.join(', ') }),
    inLanguage: 'ar-SA',
  });
}

// ═══════════════════════════════════════════════════
// 🏗️ Project Schema
// ═══════════════════════════════════════════════════
function buildProjectSchema(
  project: ProjectData,
  settings: SiteSettings,
  baseUrl: string
) {
  if (!project) return null;

  const siteName =
    toStr(settings.site_name_ar) || toStr(settings.site_name) || '';

  return clean({
    '@context':   'https://schema.org',
    '@type':      'CreativeWork',
    name:         project.title,
    description:  project.description,
    image:        project.image       || undefined,
    dateCreated:  project.completedAt || undefined,

    creator: clean({
      '@type': 'Organization',
      '@id':   `${baseUrl}/#organization`,
      name:    siteName || undefined,
    }),

    ...(project.location && {
      locationCreated: {
        '@type': 'Place',
        name:    project.location,
      },
    }),

    // ✅ funder أدق من sponsor للعميل
    ...(project.client && {
      funder: {
        '@type': 'Person',
        name:    project.client,
      },
    }),
  });
}

// ═══════════════════════════════════════════════════
// ⭐ Reviews Schema
// ═══════════════════════════════════════════════════
function buildReviewsSchema(
  reviews: ReviewItem[],
  baseUrl: string
) {
  if (!reviews || reviews.length === 0) return null;

  return reviews.map(review =>
    clean({
      '@context': 'https://schema.org',
      '@type':    'Review',
      itemReviewed: {
        '@id': `${baseUrl}/#organization`,
      },
      author: {
        '@type': 'Person',
        name:    review.author,
      },
      reviewRating: {
        '@type':       'Rating',
        ratingValue:   review.rating,
        bestRating:    5,
        worstRating:   1,
      },
      reviewBody:    review.text,
      datePublished: review.date || undefined,
    })
  );
}

// ═══════════════════════════════════════════════════
// 📄 WebPage Schema
// ═══════════════════════════════════════════════════
function buildWebPageSchema(
  props: Pick<Props, 'pageType' | 'pageTitle' | 'pageDescription' | 'pageUrl' | 'pageImage'>,
  baseUrl: string,
  siteName: string
) {
  if (!props.pageType || props.pageType === 'home') return null;

  const pageUrl = props.pageUrl
    ? props.pageUrl.startsWith('http')
      ? props.pageUrl
      : `${baseUrl}${props.pageUrl}`
    : baseUrl;

  return clean({
    '@context':  'https://schema.org',
    '@type':     'WebPage',
    '@id':       `${pageUrl}#webpage`,
    url:         pageUrl,
    name:        props.pageTitle       || siteName || undefined,
    // ✅ لا نرسل string فارغ
    description: props.pageDescription || undefined,
    inLanguage:  'ar-SA',
    isPartOf:    { '@id': `${baseUrl}/#website` },
    about:       { '@id': `${baseUrl}/#organization` },
    ...(props.pageImage && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url:     props.pageImage,
      },
    }),
  });
}

// ═══════════════════════════════════════════════════
// 🏗️ MAIN COMPONENT
// ═══════════════════════════════════════════════════
export function JsonLd({
  settings = {},
  pageType  = 'home',
  pageTitle,
  pageDescription,
  pageUrl,
  pageImage,
  breadcrumbs,
  faqs,
  service,
  article,
  project,
  reviews,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // ─── معلومات أساسية ───────────────────────────
  const siteName =
    toStr(settings.site_name_ar) || toStr(settings.site_name) || '';

  const siteDescription =
    toStr(settings.site_description_ar) ||
    toStr(settings.site_description)    ||
    toStr(settings.meta_description_ar) ||
    '';

  // ─── الإحداثيات ───────────────────────────────
  // ✅ null بدلاً من 0 لتجنب خلط إحداثيات حقيقية
// ✅ الصحيح - يتوافق مع toNumber signature
const lat = toStr(settings.latitude)        || toStr(settings.google_maps_lat);
const lng = toStr(settings.longitude)       || toStr(settings.google_maps_lng);
const latNum = lat ? parseFloat(lat) : NaN;
const lngNum = lng ? parseFloat(lng) : NaN;
const hasCoordinates = !isNaN(latNum) && !isNaN(lngNum) &&
                       latNum !== 0   && lngNum !== 0;

  // ─── نوع النشاط التجاري ────────────────────────
  // ✅ type واحد بدلاً من Array لتجنب التكرار
  const businessType = toStr(settings.business_type) || 'LocalBusiness';

  // ─── معلومات إضافية ───────────────────────────
  const foundingDate = toStr(settings.founding_date);
  const siteLogo     = toStr(settings.site_logo);

  // ✅ قيم ديناميكية - بدون fallbacks ثابتة
  const priceRange         = toStr(settings.price_range)         || '';
  const currenciesAccepted = toStr((settings as any).currencies_accepted) || '';
  const paymentAccepted    = toStr((settings as any).payment_accepted)    || '';

  // ─── العنوان البريدي ──────────────────────────
  // ✅ لا fallback ثابت لـ addressCountry
  const addressCountry =
    toStr(settings.country_code) ||
    toStr((settings as any).address_country_code) ||
    '';

  const address = clean({
    '@type': 'PostalAddress',
    streetAddress:   toStr(settings.address_ar || settings.address) || undefined,
    addressLocality: toStr(settings.city_ar    || settings.city)    || undefined,
    addressRegion:   toStr((settings as any).region_ar || settings.region) || undefined,
    addressCountry:  addressCountry || undefined,
    postalCode:      toStr(settings.postal_code) || undefined,
  });

  // ─── البيانات الديناميكية ─────────────────────
  const openingHoursSpecification = getOpeningHoursSpecification(settings);
  const areaServed                = getAreaServed(settings);
  const servicesCatalog           = getServicesCatalog(settings);
  const aggregateRating           = getAggregateRating(settings);
  const sameAs                    = getSameAs(settings);
  const contactPoints             = getContactPoints(settings);

  // ─── SearchAction (مشروط) ─────────────────────
  const hasSearchPage =
    toStr((settings as any).has_search_page) === '1' ||
    String((settings as any).has_search) === 'true';

  // ═══════════════════════════════════════════════
  // 1️⃣ Organization Schema
  // ═══════════════════════════════════════════════
  const organizationSchema: Record<string, any> = clean({
    '@context':  'https://schema.org',
    '@type':     businessType,        // ✅ type واحد
    '@id':       `${baseUrl}/#organization`,
    name:        siteName        || undefined,
    description: siteDescription || undefined,
    url:         baseUrl,

    legalName: toStr(
      (settings as any).legal_name_ar || (settings as any).legal_name
    ) || undefined,

    alternateName: toStr(settings.site_name_en) || undefined,

    ...(siteLogo && {
      logo: {
        '@type':  'ImageObject',
        url:      siteLogo,
        width:    600,
        height:   600,
      },
      image: siteLogo,
    }),

    telephone: toStr(settings.phone) || undefined,
    email:     toStr(settings.email) || undefined,
    faxNumber: toStr(settings.fax)   || undefined,

    foundingDate: foundingDate || undefined,

    ...(toStr((settings as any).founder_name) && {
      founder: {
        '@type': 'Person',
        name:    toStr((settings as any).founder_name),
      },
    }),

    ...(toInt(settings.team_members, 0) > 0 && {
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value:   toInt(settings.team_members, 0),
      },
    }),

    taxID:  toStr((settings as any).tax_id)     || undefined,
    vatID:  toStr((settings as any).vat_number) || undefined,

    // ✅ مشروطة - ليست ثابتة
    priceRange:          priceRange         || undefined,
    currenciesAccepted:  currenciesAccepted || undefined,
    paymentAccepted:     paymentAccepted    || undefined,

    address,

    ...(hasCoordinates && {
      geo: {
        '@type':    'GeoCoordinates',
        latitude:   lat,
        longitude:  lng,
      },
      hasMap: `https://www.google.com/maps?q=${lat},${lng}`,
    }),

    ...(openingHoursSpecification.length > 0 && { openingHoursSpecification }),
    ...(contactPoints.length > 0             && { contactPoint: contactPoints }),
    ...(sameAs.length > 0                    && { sameAs }),
    ...(areaServed.length > 0                && { areaServed }),
    ...(aggregateRating                      && { aggregateRating }),

    ...(servicesCatalog.length > 0 && {
      hasOfferCatalog: {
        '@type':         'OfferCatalog',
        name:            siteName ? `خدمات ${siteName}` : 'كتالوج الخدمات',
        itemListElement: servicesCatalog,
      },
    }),
  });

  // ═══════════════════════════════════════════════
  // 2️⃣ WebSite Schema
  // ═══════════════════════════════════════════════
  const websiteSchema = clean({
    '@context':      'https://schema.org',
    '@type':         'WebSite',
    '@id':           `${baseUrl}/#website`,
    url:             baseUrl,
    name:            siteName        || undefined,
    description:     siteDescription || undefined,
    inLanguage:      'ar-SA',
    publisher:       { '@id': `${baseUrl}/#organization` },
    copyrightYear:   new Date().getFullYear(),
    copyrightHolder: { '@id': `${baseUrl}/#organization` },

    // ✅ SearchAction فقط إذا كانت صفحة البحث موجودة
    ...(hasSearchPage && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type':     'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  });

  // ═══════════════════════════════════════════════
  // 3️⃣ بناء كل الـ Schemas
  // ═══════════════════════════════════════════════
  const fullPageUrl = pageUrl
    ? pageUrl.startsWith('http')
      ? pageUrl
      : `${baseUrl}${pageUrl}`
    : baseUrl;

  const webPageSchema    = buildWebPageSchema(
    { pageType, pageTitle, pageDescription, pageUrl, pageImage },
    baseUrl,
    siteName
  );
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs || [], baseUrl);
  const faqSchema        = buildFAQSchema(faqs || []);
  const serviceSchema    = service ? buildServiceSchema(service, settings, baseUrl) : null;
  const articleSchema    = article ? buildArticleSchema(article, settings, baseUrl, fullPageUrl) : null;
  const projectSchema    = project ? buildProjectSchema(project, settings, baseUrl) : null;
  const reviewsSchemas   = reviews ? buildReviewsSchema(reviews, baseUrl) : null;

  // ═══════════════════════════════════════════════
  // 🎨 Render
  // ═══════════════════════════════════════════════
  return (
    <>
      {/* 1. Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* 2. WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* 3. WebPage (للصفحات الفرعية) */}
      {webPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}

      {/* 4. Breadcrumbs */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      {/* 5. FAQ */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* 6. Service */}
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}

      {/* 7. Article */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      {/* 8. Project */}
      {projectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
        />
      )}

      {/* 9. Reviews */}
      {reviewsSchemas &&
        reviewsSchemas.map((reviewSchema, index) => (
          <script
            key={`review-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
          />
        ))}
    </>
  );
}

export default JsonLd;