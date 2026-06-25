// src/components/seo/LocalBusinessSchema.tsx
import {
  type SiteSettings,
  parseJsonField,
  type HeroStat,
} from '@/lib/settings';
import { toStr, toNumber } from '@/lib/typeSafe';

interface Props {
  settings: SiteSettings | Record<string, any>;
}

// ════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════

/** تحويل أيام العمل العربية/الإنجليزية إلى Schema.org */
const DAYS_MAP: Record<string, string> = {
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

/**
 * تحويل ساعات العمل من settings إلى Schema.org OpeningHoursSpecification
 * يرجع [] إذا لم تكن البيانات متوفرة
 */
function buildOpeningHours(
  s: Record<string, any>
): Array<{
  '@type': string;
  dayOfWeek: string[];
  opens: string;
  closes: string;
}> {
  const result: Array<{
    '@type': string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }> = [];

  // ─── أيام وساعات العمل الأساسية ──────────
  const workingDays  = toStr(s.working_days_ar  || s.working_days);
  const workingHours = toStr(s.working_hours_ar || s.working_hours);

  if (workingDays && workingHours) {
    // توقع تنسيق: "09:00-17:00" أو "09:00 - 17:00"
    const normalized = workingHours.replace(/\s/g, '');
    const timeParts  = normalized.split('-');

    if (timeParts.length === 2 && timeParts[0] && timeParts[1]) {
      const days = workingDays
        .split(',')
        .map((d: string) => DAYS_MAP[d.trim()] || d.trim())
        .filter(Boolean);

      if (days.length > 0) {
        result.push({
          '@type':     'OpeningHoursSpecification',
          dayOfWeek:   days,
          opens:       timeParts[0],
          closes:      timeParts[1],
        });
      }
    }
  }

  // ─── أيام وساعات العطلة (إن وُجدت) ───────
  const weekendDays  = toStr(s.weekend_days_ar || s.weekend_days);
  const weekendHours = toStr(s.working_hours_weekend);

  if (weekendDays && weekendHours) {
    const normalized = weekendHours.replace(/\s/g, '');
    const timeParts  = normalized.split('-');

    if (timeParts.length === 2 && timeParts[0] && timeParts[1]) {
      const days = weekendDays
        .split(',')
        .map((d: string) => DAYS_MAP[d.trim()] || d.trim())
        .filter(Boolean);

      if (days.length > 0) {
        result.push({
          '@type':   'OpeningHoursSpecification',
          dayOfWeek: days,
          opens:     timeParts[0],
          closes:    timeParts[1],
        });
      }
    }
  }

  // لا fallback - إذا لم تكن هناك بيانات نرجع []
  return result;
}

/**
 * بناء قائمة المناطق المخدومة من settings
 * يرجع [] إذا لم تكن البيانات متوفرة
 */
function buildAreaServed(s: Record<string, any>): string[] {
  // 1. من service_areas (JSON field)
  const serviceAreas = parseJsonField<string>(s.service_areas, []);
  if (serviceAreas.length > 0) return serviceAreas;

  // 2. من hero_cities
  const heroCities = toStr(s.hero_cities_ar || s.hero_cities);
  if (heroCities) {
    return heroCities.split(',').map((c: string) => c.trim()).filter(Boolean);
  }

  // 3. من city فقط
  const city = toStr(s.city_ar || s.city);
  if (city) return [city];

  // لا fallback ثابت
  return [];
}

/**
 * بناء روابط Social Media
 */
function buildSameAs(s: Record<string, any>): string[] {
  const links: string[] = [];

  const socialConfig: Array<{
    key: string;
    buildUrl: (val: string) => string;
  }> = [
    { key: 'facebook',  buildUrl: v => v.startsWith('http') ? v : `https://facebook.com/${v}` },
    { key: 'twitter',   buildUrl: v => v.startsWith('http') ? v : `https://twitter.com/${v}` },
    { key: 'instagram', buildUrl: v => v.startsWith('http') ? v : `https://instagram.com/${v}` },
    { key: 'linkedin',  buildUrl: v => v.startsWith('http') ? v : `https://linkedin.com/company/${v}` },
    { key: 'youtube',   buildUrl: v => v.startsWith('http') ? v : `https://youtube.com/@${v}` },
    { key: 'tiktok',    buildUrl: v => v.startsWith('http') ? v : `https://tiktok.com/@${v}` },
    { key: 'snapchat',  buildUrl: v => v.startsWith('http') ? v : `https://snapchat.com/add/${v}` },
    { key: 'telegram',  buildUrl: v => v.startsWith('http') ? v : `https://t.me/${v}` },
  ];

  socialConfig.forEach(({ key, buildUrl }) => {
    const val = toStr(s[key]);
    if (val) {
      try {
        links.push(buildUrl(val));
      } catch {
        // تجاهل روابط غير صالحة
      }
    }
  });

  return links;
}

/**
 * بناء قائمة الصور (بدون favicon)
 */
function buildImages(s: Record<string, any>): string[] {
  const images: string[] = [];

  const candidates = [
    s.site_logo,
    s.site_logo_dark,
    s.hero_image,
    s.og_image,
  ];

  const seen = new Set<string>();
  candidates.forEach(img => {
    const val = toStr(img);
    if (val && !seen.has(val)) {
      seen.add(val);
      images.push(val);
    }
  });

  return images;
}

/**
 * بناء إحصائيات المشروع كـ additionalProperty
 */
function buildStatsProperties(
  s: Record<string, any>
): Array<Record<string, any>> {
  const props: Array<Record<string, any>> = [];

  const statsConfig = [
    { key: 'projects_completed', name: 'Projects Completed', nameAr: 'المشاريع المنفذة' },
    { key: 'years_experience',   name: 'Years of Experience', nameAr: 'سنوات الخبرة' },
    { key: 'happy_clients',      name: 'Happy Clients',       nameAr: 'العملاء السعداء' },
    { key: 'team_members',       name: 'Team Members',        nameAr: 'أعضاء الفريق' },
  ];

  statsConfig.forEach(({ key, nameAr }) => {
    const val = toNumber(s[key]);
    if (val !== null && val > 0) {
      props.push({
        '@type': 'QuantitativeValue',
        name:    nameAr,
        value:   val,
      });
    }
  });

  // من hero_stats إذا كانت موجودة
  const heroStats = parseJsonField<HeroStat>(s.hero_stats, []);
  heroStats.forEach(stat => {
    const val = toNumber(stat.num);
    const label = toStr(stat.label);
    if (val !== null && val > 0 && label) {
      props.push({
        '@type': 'QuantitativeValue',
        name:    label,
        value:   val,
      });
    }
  });

  return props;
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

// ════════════════════════════════════════
// 🎯 Main Component
// ════════════════════════════════════════
export default function LocalBusinessSchema({ settings }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const s = settings as Record<string, any>;

  // ─── معلومات الموقع ──────────────────────────
  const siteName        = toStr(s.site_name_ar)  || toStr(s.site_name)  || '';
  const siteDescription = toStr(s.site_description_ar) || toStr(s.site_description) || '';
  const siteLogo        = toStr(s.site_logo)     || '';

  // ─── نوع النشاط التجاري (ديناميكي) ───────────
  // يمكن أن يكون: LocalBusiness, HousePainter, Plumber, Restaurant...
  const schemaType =
    toStr(s.business_schema_type) ||
    toStr(s.business_type)        ||
    'LocalBusiness';

  // ─── بيانات التواصل ───────────────────────────
  const phone          = toStr(s.phone);
  const phoneSecondary = toStr(s.phone_secondary);
  const email          = toStr(s.email);
  const emailSecondary = toStr(s.email_secondary);
  const fax            = toStr(s.fax);
  const whatsapp       = toStr(s.whatsapp);

  // ─── العنوان ──────────────────────────────────
  const address    = toStr(s.address_ar)  || toStr(s.address)  || '';
  const city       = toStr(s.city_ar)     || toStr(s.city)     || '';
  const region     = toStr(s.address_region) || toStr(s.region) || '';
  const country    = toStr(s.country_ar)  || toStr(s.country)  || '';
  const countryCode = toStr(s.country_code) || toStr(s.address_country_code) || '';
  const postalCode = toStr(s.postal_code) || '';

  // ─── الإحداثيات ────────────────────────────────
  const lat = toNumber(s.latitude)  || toNumber(s.google_maps_lat);
  const lng = toNumber(s.longitude) || toNumber(s.google_maps_lng);
  const hasCoordinates = lat !== null && lng !== null;

  // ─── التقييم والسعر ───────────────────────────
  const priceRange  = toStr(s.price_range)   || '';
  const ratingValue = toNumber(s.rating_value);
  const reviewCount = toNumber(s.review_count);

  // ─── البيانات المُجمَّعة ───────────────────────
  const openingHours = buildOpeningHours(s);
  const areaServed   = buildAreaServed(s);
  const sameAs       = buildSameAs(s);
  const images       = buildImages(s);
  const statsProps   = buildStatsProperties(s);

  // ─── Flags ────────────────────────────────────
  const hasContactInfo = !!(phone || phoneSecondary || email || whatsapp);
  const hasAddress     = !!(address || city);

  // ─── بناء contactPoints ───────────────────────
  const contactPoints: any[] = [];

  if (phone) {
    contactPoints.push(cleanSchema({
      '@type':             'ContactPoint',
      telephone:           phone,
      contactType:         'customer service',
      areaServed:          countryCode || undefined,
      availableLanguage:   ['Arabic'],
    }));
  }

  if (phoneSecondary) {
    contactPoints.push(cleanSchema({
      '@type':           'ContactPoint',
      telephone:         phoneSecondary,
      contactType:       'sales',
      areaServed:        countryCode || undefined,
      availableLanguage: ['Arabic'],
    }));
  }

  if (whatsapp) {
    contactPoints.push(cleanSchema({
      '@type':           'ContactPoint',
      telephone:         whatsapp,
      contactType:       'customer support',
      contactOption:     'WhatsApp',
      areaServed:        countryCode || undefined,
      availableLanguage: ['Arabic'],
    }));
  }

  // ─── Schema الرئيسي ───────────────────────────
  const localBusinessSchema = cleanSchema({
    '@context': 'https://schema.org',
    '@type':    schemaType,
    '@id':      `${baseUrl}/#localbusiness`,

    name:        siteName        || undefined,
    description: siteDescription || undefined,
    url:         baseUrl,

    // الصور والشعار
    ...(images.length > 0 && { image: images }),
    ...(siteLogo && { logo: siteLogo }),

    // التواصل
    ...(phone  && { telephone: phone }),
    ...(email  && { email }),

    // contactPoints (للتفاصيل)
    ...(contactPoints.length > 0 && { contactPoint: contactPoints }),

    // العنوان
    ...(hasAddress && {
      address: cleanSchema({
        '@type':           'PostalAddress',
        streetAddress:     address      || undefined,
        addressLocality:   city         || undefined,
        addressRegion:     region       || undefined,
        addressCountry:    countryCode  || country || undefined,
        postalCode:        postalCode   || undefined,
      }),
    }),

    // الإحداثيات
    ...(hasCoordinates && {
      geo: {
        '@type':    'GeoCoordinates',
        latitude:   lat,
        longitude:  lng,
      },
      hasMap: `https://maps.google.com/?q=${lat},${lng}`,
    }),

    // ساعات العمل
    ...(openingHours.length > 0 && {
      openingHoursSpecification: openingHours,
    }),

    // نطاق السعر
    ...(priceRange && { priceRange }),

    // المناطق المخدومة
    ...(areaServed.length > 0 && {
      areaServed: areaServed.map(area => ({
        '@type': 'City',
        name:    area,
      })),
    }),

    // روابط Social Media
    ...(sameAs.length > 0 && { sameAs }),

    // التقييم
    ...(ratingValue && reviewCount && {
      aggregateRating: {
        '@type':       'AggregateRating',
        ratingValue,
        reviewCount,
        bestRating:    '5',
        worstRating:   '1',
      },
    }),

    // الإحصائيات كـ additionalProperty
    ...(statsProps.length > 0 && {
      additionalProperty: statsProps,
    }),
  });

  // ─── Organization Schema (email/fax) ──────────
  // مفصول عن LocalBusiness لأن email/fax في Organization أوضح
  const organizationSchema =
    email || emailSecondary || fax
      ? cleanSchema({
          '@context': 'https://schema.org',
          '@type':    'Organization',
          '@id':      `${baseUrl}/#organization`,
          name:       siteName || undefined,

          // email الرئيسي
          ...(email && { email }),

          // email الثانوي كـ contactPoint
          ...(emailSecondary && {
            contactPoint: {
              '@type':     'ContactPoint',
              email:       emailSecondary,
              contactType: 'customer service',
            },
          }),

          // الفاكس
          ...(fax && { faxNumber: fax }),
        })
      : null;

  // ════════════════════════════════════════
  // 🎯 Render
  // ════════════════════════════════════════
  return (
    <>
      {/* LocalBusiness Schema الرئيسي */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      {/* Organization Schema (email/fax) */}
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      )}
    </>
  );
}