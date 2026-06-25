// src/app/areas/[city]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { toStr, toArray } from '@/lib/typeSafe';
import { getImageUrl } from '@/lib/image';

export const revalidate = 3600;

interface Props {
  params: Promise<{ city: string }>;
}

interface AreaData {
  id: number;
  name_ar: string;
  name_en?: string | null;
  slug: string;
  description_ar?: string | null;
  description_en?: string | null;
  image?: string | null;
  region_ar?: string | null;
  region_en?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  office_address_ar?: string | null;
  office_address_en?: string | null;
  office_phone?: string | null;
  meta_title_ar?: string | null;
  meta_description_ar?: string | null;
}

function toFloat(value: unknown): number | null {
  const str = toStr(value);
  if (!str) return null;
  const num = parseFloat(str);
  return Number.isNaN(num) ? null : num;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;

  const [settings, areaRaw] = await Promise.all([
    getSiteSettings(),
    api.area(city).catch(() => null),
  ]);

  const area = areaRaw as AreaData | null;

  if (!area) {
    return generateSEO({
      settings,
      title: 'المنطقة غير موجودة',
      description: 'عذراً، المنطقة التي تبحث عنها غير موجودة.',
      noindex: true,
    });
  }

  const siteName =
    toStr(settings?.site_name_ar) ||
    toStr(settings?.site_name) ||
    '';

  const title =
    toStr(area.meta_title_ar) ||
    (siteName ? `${siteName} في ${area.name_ar}` : area.name_ar);

  const description =
    toStr(area.meta_description_ar) ||
    toStr(area.description_ar) ||
    (siteName ? `تعرف على خدمات ${siteName} في ${area.name_ar}.` : area.name_ar);

  const image = area.image ? getImageUrl(area.image) : undefined;

  return generateSEO({
    settings,
    type: 'website',
    title,
    description,
    image,
    url: `/areas/${city}`,
  });
}

export async function generateStaticParams() {
  try {
    const areas = await api.areas().catch(() => []);
    return (Array.isArray(areas) ? areas : [])
      .filter((area: any) => area?.slug)
      .map((area: any) => ({ city: area.slug }));
  } catch {
    return [];
  }
}

export default async function AreaPage({ params }: Props) {
  const { city } = await params;

  const [settings, areaRaw] = await Promise.all([
    getSiteSettings(),
    api.area(city).catch(() => null),
  ]);

  const area = areaRaw as AreaData | null;
  if (!area) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName =
    toStr(settings?.site_name_ar) ||
    toStr(settings?.site_name) ||
    '';

  const description =
    toStr(area.description_ar) ||
    (siteName ? `صفحة خدمات ${siteName} في ${area.name_ar}.` : area.name_ar);

  const areaImage = area.image ? getImageUrl(area.image) : undefined;

  const breadcrumbs = buildBreadcrumb(
    { name: 'مناطق الخدمة', url: '/areas' },
    { name: area.name_ar, url: `/areas/${city}` }
  );

  const lat = toFloat(area.latitude);
  const lng = toFloat(area.longitude);
  const hasGeo = lat !== null && lng !== null;

  const phone =
    toStr(area.office_phone) ||
    toStr(settings?.phone) ||
    '';

  const whatsapp =
    toStr(settings?.whatsapp) ||
    '';

  const mainServices = toArray<string>(
    (settings as any)?.main_services_ar || (settings as any)?.main_services
  );

  const placeSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${baseUrl}/areas/${city}#place`,
    name: area.name_ar,
    url: `${baseUrl}/areas/${city}`,
    inLanguage: 'ar-SA',
  };

  if (description) placeSchema.description = description;
  if (areaImage) placeSchema.image = areaImage;
  if (area.region_ar) {
    placeSchema.containedInPlace = {
      '@type': 'AdministrativeArea',
      name: area.region_ar,
    };
  }
  if (hasGeo) {
    placeSchema.geo = {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    };
  }

  const serviceSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/areas/${city}#service`,
    name: siteName ? `${siteName} - ${area.name_ar}` : area.name_ar,
    provider: { '@id': `${baseUrl}/#organization` },
    areaServed: { '@id': `${baseUrl}/areas/${city}#place` },
    url: `${baseUrl}/areas/${city}`,
  };

  if (description) serviceSchema.description = description;

  return (
    <>
      <JsonLd
        settings={settings}
        pageType="area"
        pageTitle={area.name_ar}
        pageDescription={description}
        pageUrl={`/areas/${city}`}
        pageImage={areaImage}
        breadcrumbs={breadcrumbs}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section
        style={{
          background: areaImage
            ? `linear-gradient(rgba(15,23,41,.82), rgba(26,54,93,.82)), url(${areaImage}) center/cover no-repeat`
            : 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
          color: 'white',
          padding: '3rem 0 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumb items={breadcrumbs} variant="dark" />

          <div style={{ maxWidth: '760px' }}>
            <span
              className="section-badge"
              style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}
            >
              📍 منطقة الخدمة
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 5vw, 3.3rem)',
                fontWeight: 900,
                margin: '1rem 0',
              }}
            >
              {area.name_ar}
            </h1>

            {area.region_ar && (
              <p style={{ color: '#90cdf4', fontSize: '1rem', marginBottom: '0.75rem' }}>
                {area.region_ar}
              </p>
            )}

            {description && (
              <p
                style={{
                  color: '#cbd5e0',
                  fontSize: '1.0625rem',
                  lineHeight: 1.9,
                  maxWidth: '46rem',
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff" />
          </svg>
        </div>
      </section>

      <section className="section-padding" style={{ background: '#f8faff' }}>
        <div className="container-custom">
          <div
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: '1fr',
            }}
            className="area-grid"
          >
            <div
              style={{
                background: 'white',
                borderRadius: '1.5rem',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <h2
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '1rem',
                }}
              >
                خدماتنا في {area.name_ar}
              </h2>

              <p
                style={{
                  color: '#475569',
                  lineHeight: 1.9,
                  marginBottom: '1.5rem',
                }}
              >
                {siteName
                  ? `يقدم ${siteName} خدماته في ${area.name_ar} مع التركيز على الجودة وسهولة التواصل وسرعة الاستجابة.`
                  : `نقدم خدماتنا في ${area.name_ar} مع التركيز على الجودة وسهولة التواصل وسرعة الاستجابة.`}
              </p>

              {mainServices.length > 0 && (
                <>
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '0.75rem',
                    }}
                  >
                    أبرز الخدمات
                  </h3>

                  <ul
                    style={{
                      paddingRight: '1.2rem',
                      color: '#475569',
                      lineHeight: 2,
                      margin: 0,
                    }}
                  >
                    {mainServices.slice(0, 8).map((service, index) => (
                      <li key={`${service}-${index}`}>{service}</li>
                    ))}
                  </ul>
                </>
              )}

              {hasGeo && (
                <div style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.95rem' }}>
                  الإحداثيات: {lat}, {lng}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: '1.5rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '1rem',
                  }}
                >
                  معلومات المنطقة
                </h3>

                <div style={{ display: 'grid', gap: '0.75rem', color: '#475569' }}>
                  <div><strong>الاسم:</strong> {area.name_ar}</div>
                  {area.region_ar && <div><strong>المنطقة:</strong> {area.region_ar}</div>}
                  {area.office_address_ar && (
                    <div><strong>العنوان:</strong> {area.office_address_ar}</div>
                  )}
                  {phone && (
                    <div><strong>الهاتف:</strong> {phone}</div>
                  )}
                </div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, #1a365d, #2b6cb0)',
                  color: 'white',
                  borderRadius: '1.5rem',
                  padding: '1.75rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                  }}
                >
                  تواصل معنا
                </h3>

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    style={{
                      color: '#fbd38d',
                      textDecoration: 'none',
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    📞 {phone}
                  </a>
                )}

                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#c6f6d5',
                      textDecoration: 'none',
                      display: 'block',
                      marginBottom: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    💬 واتساب
                  </a>
                )}

                <Link
                  href="/contact"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', display: 'inline-flex' }}
                >
                  إرسال طلب
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .area-grid {
              grid-template-columns: 2fr 1fr !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}