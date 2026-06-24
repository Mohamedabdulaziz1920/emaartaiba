import { type SiteSettings, settingsHelpers, parseJsonField, type HeroStat } from '@/lib/settings';

interface Props {
  settings: SiteSettings | Record<string, any>;
}

// ════════════════════════════════════════
// 🛠️ Safe Type Converters
// ════════════════════════════════════════
function toStr(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return '';
  if (Array.isArray(value)) return '';
  if (typeof value === 'object') return '';
  return String(value);
}

function toNumber(value: unknown): number | null {
  const str = toStr(value).trim();
  if (!str) return null;
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

function toBool(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return ['1', 'true', 'yes', 'on'].includes(v);
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

// دالة لتحويل ساعات العمل إلى صيغة Schema.org
function getOpeningHours(settings: SiteSettings): string[] {
  const workingDays = toStr(settings.working_days_ar || settings.working_days);
  const workingHours = toStr(settings.working_hours_ar || settings.working_hours);
  const weekendDays = toStr(settings.weekend_days_ar || settings.weekend_days);
  
  const hoursList: string[] = [];
  
  // ساعات العمل للأيام العادية
  if (workingDays && workingHours) {
    // تحويل أيام العمل إلى الإنجليزية لـ Schema.org
    const daysMap: Record<string, string> = {
      'الأحد': 'Sunday',
      'الاثنين': 'Monday',
      'الثلاثاء': 'Tuesday',
      'الأربعاء': 'Wednesday',
      'الخميس': 'Thursday',
      'الجمعة': 'Friday',
      'السبت': 'Saturday',
      'Sunday': 'Sunday',
      'Monday': 'Monday',
      'Tuesday': 'Tuesday',
      'Wednesday': 'Wednesday',
      'Thursday': 'Thursday',
      'Friday': 'Friday',
      'Saturday': 'Saturday',
    };
    
    const days = workingDays.split(',').map(d => d.trim());
    const englishDays = days.map(d => daysMap[d] || d);
    
    if (englishDays.length > 0) {
      const hoursRange = workingHours.replace(/\s/g, '');
      hoursList.push(`${englishDays.join(',')} ${hoursRange}`);
    }
  }
  
  // ساعات العمل للعطل (إذا كانت مختلفة)
  if (weekendDays && settings.working_hours_weekend) {
    const weekendHours = toStr(settings.working_hours_weekend);
    const weekendDaysMap: Record<string, string> = {
      'الجمعة': 'Friday',
      'السبت': 'Saturday',
      'Friday': 'Friday',
      'Saturday': 'Saturday',
    };
    
    const days = weekendDays.split(',').map(d => d.trim());
    const englishDays = days.map(d => weekendDaysMap[d] || d);
    
    if (englishDays.length > 0 && weekendHours) {
      const hoursRange = weekendHours.replace(/\s/g, '');
      hoursList.push(`${englishDays.join(',')} ${hoursRange}`);
    }
  }
  
  // إذا لم يتم العثور على ساعات عمل، استخدم الافتراضية
  if (hoursList.length === 0) {
    hoursList.push('Sun-Thu 08:00-17:00');
  }
  
  return hoursList;
}

// دالة للحصول على المناطق التي تغطيها الخدمة
function getAreaServed(settings: SiteSettings): string[] {
  // محاولة جلب المناطق من hero_cities
  const citiesFromSettings = toStr(settings.hero_cities_ar || settings.hero_cities);
  if (citiesFromSettings) {
    return citiesFromSettings.split(',').map(c => c.trim());
  }
  
  // محاولة جلب من إعدادات أخرى
  const citiesFromAddress = toStr(settings.city_ar || settings.city);
  if (citiesFromAddress) {
    return [citiesFromAddress];
  }
  
  // القائمة الافتراضية كآخر حل (ستُستبدل من قاعدة البيانات)
  return ['جازان', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'];
}

// دالة للحصول على روابط التواصل الاجتماعي
function getSameAs(settings: SiteSettings): string[] {
  const socialLinks: string[] = [];
  
  const socialFields = [
    'facebook', 'twitter', 'instagram', 'linkedin', 
    'youtube', 'tiktok', 'snapchat', 'telegram'
  ];
  
  socialFields.forEach(field => {
    const value = toStr(settings[field]);
    if (value && (value.startsWith('http') || value.startsWith('https'))) {
      socialLinks.push(value);
    } else if (value) {
      // إذا لم يكن رابط كامل، حاول بناء رابط
      switch (field) {
        case 'facebook':
          socialLinks.push(`https://facebook.com/${value}`);
          break;
        case 'twitter':
          socialLinks.push(`https://twitter.com/${value}`);
          break;
        case 'instagram':
          socialLinks.push(`https://instagram.com/${value}`);
          break;
        case 'linkedin':
          socialLinks.push(`https://linkedin.com/company/${value}`);
          break;
        case 'youtube':
          socialLinks.push(`https://youtube.com/@${value}`);
          break;
      }
    }
  });
  
  return socialLinks;
}

// دالة للحصول على صور العلامة التجارية
function getImages(settings: SiteSettings): string[] {
  const images: string[] = [];
  
  const logo = toStr(settings.site_logo);
  if (logo) images.push(logo);
  
  const logoDark = toStr(settings.site_logo_dark);
  if (logoDark && logoDark !== logo) images.push(logoDark);
  
  const heroImage = toStr(settings.hero_image);
  if (heroImage) images.push(heroImage);
  
  const favicon = toStr(settings.site_favicon);
  if (favicon) images.push(favicon);
  
  return images;
}

// دالة للحصول على الإحصائيات للعرض في Schema
function getStats(settings: SiteSettings): Record<string, any> | null {
  const stats = parseJsonField<HeroStat>(settings.hero_stats, []);
  
  if (stats.length === 0) return null;
  
  const knownMetrics: Record<string, { name: string; nameAr: string }> = {
    'projects_completed': { name: 'Projects Completed', nameAr: 'المشاريع المنفذة' },
    'years_experience': { name: 'Years of Experience', nameAr: 'سنوات الخبرة' },
    'happy_clients': { name: 'Happy Clients', nameAr: 'العملاء السعداء' },
    'team_members': { name: 'Team Members', nameAr: 'أعضاء الفريق' },
  };
  
  const metrics: Record<string, any> = {};
  
  // إضافة الإحصائيات من settings
  Object.entries(knownMetrics).forEach(([key, value]) => {
    const statValue = toNumber(settings[key]);
    if (statValue !== null) {
      metrics[key] = {
        '@type': 'QuantitativeValue',
        name: value.name,
        nameAr: value.nameAr,
        value: statValue,
      };
    }
  });
  
  // إضافة الإحصائيات من hero_stats
  stats.forEach(stat => {
    const num = toNumber(stat.num);
    if (num !== null) {
      metrics[`stat_${stat.label}`] = {
        '@type': 'QuantitativeValue',
        name: stat.label,
        value: num,
      };
    }
  });
  
  return Object.keys(metrics).length > 0 ? metrics : null;
}

export default function LocalBusinessSchema({ settings }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const s = settings as any;

  // ─── استخراج آمن لجميع القيم ───
  const siteName = toStr(s.site_name_ar) || toStr(s.site_name) || 'شركة البناء';
  const siteDescription = toStr(s.site_description_ar) || toStr(s.site_description) || '';
  const siteLogo = toStr(s.site_logo);
  const phone = toStr(s.phone);
  const phoneSecondary = toStr(s.phone_secondary);
  const email = toStr(s.email);
  const emailSecondary = toStr(s.email_secondary);
  const fax = toStr(s.fax);
  const whatsapp = toStr(s.whatsapp);
  
  // ─── العنوان الكامل ───
  const address = toStr(s.address_ar) || toStr(s.address);
  const city = toStr(s.city_ar) || toStr(s.city) || 'جازان';
  const region = toStr(s.region) || toStr(s.city_ar) ;
  const country = toStr(s.country_ar) || toStr(s.country) || 'السعودية';
  const postalCode = toStr(s.postal_code);

  // ─── إحداثيات الخريطة ───
  const lat = toNumber(s.latitude) || toNumber(s.google_maps_lat);
  const lng = toNumber(s.longitude) || toNumber(s.google_maps_lng);
  const hasCoordinates = lat !== null && lng !== null;
  
  // ─── التصنيف والسعر ───
  const priceRange = toStr(s.price_range) || '$$';
  const ratingValue = toNumber(s.rating_value);
  const reviewCount = toNumber(s.review_count);
  
  // ─── ساعات العمل ───
  const openingHours = getOpeningHours(settings);
  
  // ─── المناطق ───
  const areaServed = getAreaServed(settings);
  
  // ─── روابط التواصل الاجتماعي ───
  const sameAs = getSameAs(settings);
  
  // ─── الصور ───
  const images = getImages(settings);
  
  // ─── الإحصائيات ───
  const stats = getStats(settings);
  
  // ─── التحقق من وجود بيانات ───
  const hasContactInfo = !!(phone || phoneSecondary || email || emailSecondary || whatsapp);
  const hasAddress = !!(address || city);

  // ─── Schema Object الرئيسي ───
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: siteName,
    url: baseUrl,
    ...(siteDescription && { description: siteDescription }),
    ...(images.length > 0 && { image: images }),
    ...(siteLogo && { logo: siteLogo }),
    ...(hasContactInfo && {
      contactPoint: [
        ...(phone ? [{
          '@type': 'ContactPoint',
          telephone: phone,
          contactType: 'customer service',
          contactOption: 'TollFree',
          areaServed: 'SA',
          availableLanguage: ['Arabic', 'English'],
        }] : []),
        ...(phoneSecondary ? [{
          '@type': 'ContactPoint',
          telephone: phoneSecondary,
          contactType: 'sales',
          areaServed: 'SA',
          availableLanguage: ['Arabic', 'English'],
        }] : []),
        ...(whatsapp ? [{
          '@type': 'ContactPoint',
          telephone: whatsapp,
          contactType: 'customer support',
          contactOption: 'WhatsApp',
          areaServed: 'SA',
          availableLanguage: ['Arabic', 'English'],
        }] : []),
      ],
    }),
    ...(hasAddress && {
      address: {
        '@type': 'PostalAddress',
        ...(address && { streetAddress: address }),
        addressLocality: city,
        ...(region && { addressRegion: region }),
        addressCountry: country,
        ...(postalCode && { postalCode: postalCode }),
      },
    }),
    ...(hasCoordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: lat,
        longitude: lng,
      },
      hasMap: `https://maps.google.com/?q=${lat},${lng}`,
    }),
    openingHoursSpecification: openingHours.map(hours => {
      const [days, ...timeParts] = hours.split(' ');
      const timeRange = timeParts.join(' ');
      const [opens, closes] = timeRange.split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.split(','),
        opens: opens,
        closes: closes,
      };
    }),
    priceRange: priceRange,
    ...(areaServed.length > 0 && { areaServed: areaServed.map(area => ({ '@type': 'City', name: area })) }),
    ...(sameAs.length > 0 && { sameAs: sameAs }),
    ...(ratingValue && reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingValue,
        reviewCount: reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(stats && {
      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'خدمات المقاولات',
          ...(stats && { potentialAction: {
            '@type': 'MeasureAction',
            name: 'الإحصائيات',
            ...stats,
          } }),
        },
      },
    }),
  };

  // ─── Schema إضافي: نقاط الاتصال الإضافية ───
  const contactPointSchema = (email || emailSecondary || fax) ? {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: siteName,
    ...(email && { email: email }),
    ...(emailSecondary && { alternateEmail: emailSecondary }),
    ...(fax && { faxNumber: fax }),
  } : null;

  return (
    <>
      {/* Schema الرئيسي للـ LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Schema إضافي للمنظمة (للبريد الإلكتروني والفاكس) */}
      {contactPointSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPointSchema) }}
        />
      )}
    </>
  );
}