// src/components/seo/JsonLd.tsx
import { type SiteSettings, type HeroStat } from '@/lib/settings';
import { toStr, toNumber, toInt, toArray, toUrl } from '@/lib/typeSafe';

interface Props { 
  settings?: SiteSettings;
  /** نوع الصفحة الحالية */
  pageType?: 'home' | 'about' | 'services' | 'projects' | 'blog' | 'contact' | 'service-detail' | 'project-detail' | 'blog-detail';
  /** عنوان الصفحة (للـ WebPage Schema) */
  pageTitle?: string;
  /** وصف الصفحة */
  pageDescription?: string;
  /** مسار الصفحة الحالية */
  pageUrl?: string;
  /** صورة الصفحة */
  pageImage?: string;
  /** Breadcrumbs */
  breadcrumbs?: Array<{ name: string; url: string }>;
}

// ═══════════════════════════════════════════════════
// 🛠️ Helpers (مع typeSafe)
// ═══════════════════════════════════════════════════
function safeParseJsonArray<T = any>(value: any, fallback: T[] = []): T[] {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      // محاولة split بفواصل
      return value.split(',').map(s => s.trim()).filter(Boolean) as T[];
    }
  }
  return fallback;
}

// ═══════════════════════════════════════════════════
// ⏰ ساعات العمل
// ═══════════════════════════════════════════════════
function getOpeningHoursSpecification(settings: SiteSettings) {
  const workingDays = toStr(settings.working_days_ar || settings.working_days);
  const workingHours = toStr(settings.working_hours_ar || settings.working_hours);
  const weekendDays = toStr(settings.weekend_days_ar || settings.weekend_days);
  const weekendHours = toStr(settings.working_hours_weekend);
  
  const openingHours: any[] = [];
  
  const daysMap: Record<string, string> = {
    'الأحد': 'Sunday', 'الاثنين': 'Monday', 'الثلاثاء': 'Tuesday',
    'الأربعاء': 'Wednesday', 'الخميس': 'Thursday', 'الجمعة': 'Friday', 'السبت': 'Saturday',
    'Sunday': 'Sunday', 'Monday': 'Monday', 'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday', 'Thursday': 'Thursday', 'Friday': 'Friday', 'Saturday': 'Saturday'
  };
  
  if (workingDays && workingHours) {
    const days = workingDays.split(/[,،\s\-إلى\sto]+/).map(d => d.trim()).filter(Boolean);
    const englishDays = days.map(d => daysMap[d] || d);
    const [opens, closes] = workingHours.split(/[-–—إلى\sto]+/).map(t => t.trim());
    
    openingHours.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: englishDays,
      opens: opens || '08:00',
      closes: closes || '17:00',
    });
  }
  
  if (weekendDays && weekendHours) {
    const days = weekendDays.split(/[,،\s]+/).map(d => d.trim()).filter(Boolean);
    const englishDays = days.map(d => daysMap[d] || d);
    const [opens, closes] = weekendHours.split(/[-–—]+/).map(t => t.trim());
    
    openingHours.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: englishDays,
      opens: opens || '09:00',
      closes: closes || '13:00',
    });
  }
  
  if (openingHours.length === 0) {
    openingHours.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '17:00',
    });
  }
  
  return openingHours;
}

// ═══════════════════════════════════════════════════
// 🌍 المناطق المخدومة
// ═══════════════════════════════════════════════════
function getAreaServed(settings: SiteSettings) {
  const citiesFromSettings = toStr(settings.hero_cities_ar || settings.hero_cities);
  if (citiesFromSettings) {
    return citiesFromSettings.split(/[,،]/).map(c => ({ 
      '@type': 'City', 
      name: c.trim() 
    })).filter(c => c.name);
  }
  
  const serviceAreas = toArray<string>(settings.service_areas_ar || settings.service_areas);
  if (serviceAreas.length > 0) {
    return serviceAreas.map(c => ({ '@type': 'City', name: c }));
  }
  
  const city = toStr(settings.city_ar || settings.city);
  if (city) {
    return [{ '@type': 'City', name: city }];
  }
  
  return [
    { '@type': 'City', name: 'الرياض' },
    { '@type': 'City', name: 'جدة' },
    { '@type': 'City', name: 'الدمام' },
    { '@type': 'City', name: 'مكة المكرمة' },
    { '@type': 'City', name: 'المدينة المنورة' },
  ];
}

// ═══════════════════════════════════════════════════
// 🛠️ كتالوج الخدمات
// ═══════════════════════════════════════════════════
function getServicesCatalog(settings: SiteSettings) {
  const services = safeParseJsonArray<any>(
    settings.services_catalog || settings.main_services || settings.featured_services,
    []
  );
  
  if (services.length > 0) {
    return services.map(service => {
      if (typeof service === 'string') {
        return {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service },
        };
      }
      return {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name_ar || service.name || service.title_ar || service.title,
          ...(service.description && { description: service.description }),
        },
      };
    });
  }
  
  return [];
}

// ═══════════════════════════════════════════════════
// ⭐ التقييم
// ═══════════════════════════════════════════════════
function getAggregateRating(settings: SiteSettings) {
  const ratingValue = toNumber(settings.rating_value, 0);
  const reviewCount = toInt(settings.review_count, 0);
  const happyClients = toInt(settings.happy_clients, 0);
  
  if (ratingValue > 0 && reviewCount > 0) {
    return {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      reviewCount: reviewCount,
      bestRating: toNumber(settings.best_rating, 5),
      worstRating: toNumber(settings.worst_rating, 1),
    };
  }
  
  if (ratingValue > 0 && happyClients > 0) {
    return {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      reviewCount: happyClients,
      bestRating: 5,
      worstRating: 1,
    };
  }
  
  return undefined;
}

// ═══════════════════════════════════════════════════
// 🌐 روابط التواصل
// ═══════════════════════════════════════════════════
function getSameAs(settings: SiteSettings): string[] {
  const socialLinks: string[] = [];
  
  const socialMap: Record<string, (val: string) => string> = {
    facebook: (v) => v.startsWith('http') ? v : `https://facebook.com/${v}`,
    facebook_url: (v) => v,
    twitter: (v) => v.startsWith('http') ? v : `https://twitter.com/${v.replace('@', '')}`,
    twitter_url: (v) => v,
    instagram: (v) => v.startsWith('http') ? v : `https://instagram.com/${v}`,
    instagram_url: (v) => v,
    linkedin: (v) => v.startsWith('http') ? v : `https://linkedin.com/company/${v}`,
    linkedin_url: (v) => v,
    youtube: (v) => v.startsWith('http') ? v : `https://youtube.com/@${v}`,
    youtube_url: (v) => v,
    tiktok: (v) => v.startsWith('http') ? v : `https://tiktok.com/@${v}`,
    tiktok_url: (v) => v,
    snapchat: (v) => v.startsWith('http') ? v : `https://snapchat.com/add/${v}`,
    telegram: (v) => v.startsWith('http') ? v : `https://t.me/${v}`,
    pinterest: (v) => v.startsWith('http') ? v : `https://pinterest.com/${v}`,
    pinterest_url: (v) => v,
  };
  
  Object.entries(socialMap).forEach(([field, builder]) => {
    const value = toStr(settings[field]);
    if (value) {
      const url = builder(value);
      if (url && !socialLinks.includes(url)) {
        socialLinks.push(url);
      }
    }
  });
  
  return socialLinks;
}

// ═══════════════════════════════════════════════════
// 📞 نقاط الاتصال
// ═══════════════════════════════════════════════════
function getContactPoints(settings: SiteSettings) {
  const contactPoints: any[] = [];
  
  const phone = toStr(settings.phone);
  if (phone) {
    contactPoints.push({
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'customer service',
      areaServed: toStr(settings.country_code) || 'SA',
      availableLanguage: ['Arabic', 'English'],
    });
  }
  
  const phoneSecondary = toStr(settings.phone_secondary);
  if (phoneSecondary) {
    contactPoints.push({
      '@type': 'ContactPoint',
      telephone: phoneSecondary,
      contactType: 'sales',
      areaServed: toStr(settings.country_code) || 'SA',
      availableLanguage: ['Arabic', 'English'],
    });
  }
  
  const whatsapp = toStr(settings.whatsapp);
  if (whatsapp) {
    contactPoints.push({
      '@type': 'ContactPoint',
      telephone: whatsapp,
      contactType: 'sales',
      areaServed: toStr(settings.country_code) || 'SA',
      availableLanguage: ['Arabic', 'English'],
      contactOption: 'TollFree',
    });
  }
  
  const email = toStr(settings.email);
  if (email) {
    contactPoints.push({
      '@type': 'ContactPoint',
      email: email,
      contactType: 'customer support',
      areaServed: toStr(settings.country_code) || 'SA',
      availableLanguage: ['Arabic', 'English'],
    });
  }
  
  return contactPoints;
}

// ═══════════════════════════════════════════════════
// 🎓 الشهادات
// ═══════════════════════════════════════════════════
function getCredentials(settings: SiteSettings) {
  const credentials = safeParseJsonArray<any>(
    settings.credentials || settings.certifications,
    []
  );
  
  if (credentials.length > 0) {
    return credentials.map(cred => {
      if (typeof cred === 'string') {
        return {
          '@type': 'EducationalOccupationalCredential',
          name: cred,
        };
      }
      return {
        '@type': 'EducationalOccupationalCredential',
        name: cred.name_ar || cred.name,
        ...(cred.issuer && { recognizedBy: { '@type': 'Organization', name: cred.issuer } }),
        ...(cred.year && { dateCreated: cred.year }),
      };
    });
  }
  
  return undefined;
}

// ═══════════════════════════════════════════════════
// 📊 الإحصائيات
// ═══════════════════════════════════════════════════
function getStatistics(settings: SiteSettings) {
  const stats: Record<string, any> = {};
  
  const projectsCompleted = toInt(settings.projects_completed, 0);
  if (projectsCompleted > 0) {
    stats.numberOfProjects = projectsCompleted;
  }
  
  const yearsExperience = toInt(settings.years_experience, 0);
  if (yearsExperience > 0) {
    stats.yearsInBusiness = yearsExperience;
  }
  
  const teamMembers = toInt(settings.team_members, 0);
  if (teamMembers > 0) {
    stats.numberOfEmployees = {
      '@type': 'QuantitativeValue',
      value: teamMembers,
    };
  }
  
  const happyClients = toInt(settings.happy_clients, 0);
  if (happyClients > 0) {
    stats.numberOfClients = happyClients;
  }
  
  return Object.keys(stats).length > 0 ? stats : null;
}

// ═══════════════════════════════════════════════════
// 🍞 Breadcrumb Schema
// ═══════════════════════════════════════════════════
function buildBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  baseUrl: string
) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

// ═══════════════════════════════════════════════════
// 📄 WebPage Schema للصفحة الحالية
// ═══════════════════════════════════════════════════
function buildWebPageSchema(
  props: Props,
  baseUrl: string,
  siteName: string
) {
  if (!props.pageType || props.pageType === 'home') return null;
  
  const pageUrl = props.pageUrl 
    ? (props.pageUrl.startsWith('http') ? props.pageUrl : `${baseUrl}${props.pageUrl}`)
    : baseUrl;
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: props.pageTitle || siteName,
    description: props.pageDescription || '',
    inLanguage: 'ar-SA',
    isPartOf: { '@id': `${baseUrl}/#website` },
    about: { '@id': `${baseUrl}/#organization` },
  };
  
  if (props.pageImage) {
    schema.primaryImageOfPage = {
      '@type': 'ImageObject',
      url: props.pageImage,
    };
  }
  
  return schema;
}

// ═══════════════════════════════════════════════════
// 🏗️ MAIN COMPONENT
// ═══════════════════════════════════════════════════
export function JsonLd({ 
  settings = {},
  pageType = 'home',
  pageTitle,
  pageDescription,
  pageUrl,
  pageImage,
  breadcrumbs,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = toStr(settings.site_name_ar) || toStr(settings.site_name) || 'شركة البناء المتميز';
  const siteDescription = toStr(settings.site_description_ar) || 
                          toStr(settings.site_description) || 
                          toStr(settings.meta_description_ar) ||
                          'شركة مقاولات عامة رائدة في المملكة العربية السعودية';
  
  // إحداثيات
  const lat = toNumber(settings.latitude || settings.google_maps_lat, 0);
  const lng = toNumber(settings.longitude || settings.google_maps_lng, 0);
  const hasCoordinates = lat !== 0 && lng !== 0;
  
  // معلومات أساسية
  const foundingDate = toStr(settings.founding_date);
  const priceRange = toStr(settings.price_range) || '$$';
  const siteLogo = toStr(settings.site_logo);
  
  // بيانات ديناميكية
  const openingHoursSpecification = getOpeningHoursSpecification(settings);
  const areaServed = getAreaServed(settings);
  const servicesCatalog = getServicesCatalog(settings);
  const aggregateRating = getAggregateRating(settings);
  const sameAs = getSameAs(settings);
  const credentials = getCredentials(settings);
  const contactPoints = getContactPoints(settings);
  const statistics = getStatistics(settings);
  
  // العنوان
  const address = {
    '@type': 'PostalAddress',
    ...(toStr(settings.address_ar || settings.address) && { 
      streetAddress: toStr(settings.address_ar || settings.address) 
    }),
    addressLocality: toStr(settings.city_ar || settings.city) || 'الرياض',
    addressRegion: toStr(settings.region_ar || settings.region) || 'منطقة الرياض',
    addressCountry: toStr(settings.country_code) || 'SA',
    ...(toStr(settings.postal_code) && { postalCode: toStr(settings.postal_code) }),
  };

  // ═══════════════════════════════════════════════════
  // 1️⃣ Organization Schema
  // ═══════════════════════════════════════════════════
  const organizationSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'GeneralContractor', 'LocalBusiness'],
    '@id': `${baseUrl}/#organization`,
    name: siteName,
    ...(toStr(settings.legal_name_ar || settings.legal_name) && { 
      legalName: toStr(settings.legal_name_ar || settings.legal_name) 
    }),
    ...(toStr(settings.site_name_en) && { alternateName: toStr(settings.site_name_en) }),
    description: siteDescription,
    url: baseUrl,
    
    // Logo
    ...(siteLogo && {
      logo: {
        '@type': 'ImageObject',
        url: siteLogo,
        width: 600,
        height: 600,
      },
      image: siteLogo,
    }),
    
    // Contact
    ...(toStr(settings.phone) && { telephone: toStr(settings.phone) }),
    ...(toStr(settings.email) && { email: toStr(settings.email) }),
    ...(toStr(settings.fax) && { faxNumber: toStr(settings.fax) }),
    
    // Business Info
    ...(foundingDate && { foundingDate }),
    ...(foundingDate && { foundingLocation: 'المملكة العربية السعودية' }),
    ...(toStr(settings.founder_name) && {
      founder: { '@type': 'Person', name: toStr(settings.founder_name) }
    }),
    ...(toInt(settings.team_members, 0) > 0 && {
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: toInt(settings.team_members, 0),
      }
    }),
    ...(toStr(settings.tax_id) && { taxID: toStr(settings.tax_id) }),
    ...(toStr(settings.vat_number) && { vatID: toStr(settings.vat_number) }),
    
    // Pricing
    priceRange,
    currenciesAccepted: 'SAR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    
    // Address
    address,
    
    // Coordinates
    ...(hasCoordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: lat,
        longitude: lng,
      },
      hasMap: `https://www.google.com/maps?q=${lat},${lng}`,
    }),
    
    // Hours
    openingHoursSpecification,
    
    // Contact Points
    ...(contactPoints.length > 0 && { contactPoint: contactPoints }),
    
    // Social Links
    ...(sameAs.length > 0 && { sameAs }),
    
    // Service Areas
    areaServed,
    
    // Rating
    ...(aggregateRating && { aggregateRating }),
    
    // Services Catalog
    ...(servicesCatalog.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'خدمات المقاولات',
        itemListElement: servicesCatalog,
      },
    }),
    
    // Credentials
    ...(credentials && { hasCredential: credentials }),
    
    // Statistics
    ...(statistics && statistics),
  };

  // ═══════════════════════════════════════════════════
  // 2️⃣ WebSite Schema
  // ═══════════════════════════════════════════════════
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: siteName,
    description: siteDescription,
    inLanguage: 'ar-SA',
    publisher: { '@id': `${baseUrl}/#organization` },
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: { '@id': `${baseUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // ═══════════════════════════════════════════════════
  // 3️⃣ WebPage Schema (للصفحات الفرعية)
  // ═══════════════════════════════════════════════════
  const webPageSchema = buildWebPageSchema({ pageType, pageTitle, pageDescription, pageUrl, pageImage }, baseUrl, siteName);

  // ═══════════════════════════════════════════════════
  // 4️⃣ Breadcrumb Schema
  // ═══════════════════════════════════════════════════
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs || [], baseUrl);

  return (
    <>
      {/* Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* WebPage (للصفحات الفرعية فقط) */}
      {webPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}
      
      {/* Breadcrumbs */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}

// Export افتراضي للتوافق
export default JsonLd;