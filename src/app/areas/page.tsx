// src/app/areas/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { getImageUrl } from '@/lib/image';
import { toStr } from '@/lib/typeSafe';

export const revalidate = 3600;

interface AreaItem {
  id: number;
  name_ar: string;
  slug: string;
  region_ar?: string | null;
  description_ar?: string | null;
  image?: string | null;
}

const AREA_GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#30cfd0,#330867)',
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return generateSEO({
    settings,
    type: 'website',
    title: 'مناطق الخدمة',
    description:
      toStr(settings?.site_description_ar) ||
      toStr(settings?.site_description) ||
      'استعرض المناطق التي نقدم فيها خدماتنا.',
    url: '/areas',
  });
}

export default async function AreasPage() {
  const [settings, rawAreas] = await Promise.all([
    getSiteSettings(),
    api.areas().catch(() => []),
  ]);

  const areas = Array.isArray(rawAreas) ? (rawAreas as AreaItem[]) : [];

  const breadcrumbs = buildBreadcrumb(
    { name: 'مناطق الخدمة', url: '/areas' }
  );

  const siteName =
    toStr(settings?.site_name_ar) ||
    toStr(settings?.site_name) ||
    '';

  const pageDescription =
    toStr(settings?.site_description_ar) ||
    toStr(settings?.site_description) ||
    'استعرض المناطق التي نقدم فيها خدماتنا.';

  return (
    <>
      <JsonLd
        settings={settings}
        pageType="area"
        pageTitle="مناطق الخدمة"
        pageDescription={pageDescription}
        pageUrl="/areas"
        breadcrumbs={breadcrumbs}
      />

      <section
        style={{
          background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
          color: 'white',
          padding: '3rem 0 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumb items={breadcrumbs} variant="dark" />

          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
            <span
              className="section-badge"
              style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}
            >
              📍 مناطق الخدمة
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 5vw, 3.3rem)',
                fontWeight: 900,
                margin: '1rem 0',
              }}
            >
              نخدم <span className="text-gradient-orange">عدة مناطق</span>
            </h1>

            <p
              style={{
                color: '#cbd5e0',
                fontSize: '1.0625rem',
                lineHeight: 1.9,
                margin: '0 auto',
                maxWidth: '42rem',
              }}
            >
              {siteName
                ? `استعرض المناطق التي يقدم فيها ${siteName} خدماته.`
                : 'استعرض المناطق التي نقدم فيها خدماتنا.'}
            </p>
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
          {areas.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {areas.map((area, i) => {
                const imageUrl = area.image ? getImageUrl(area.image) : '';
                return (
                  <Link
                    key={area.id}
                    href={`/areas/${area.slug}`}
                    className="card-pro"
                    style={{
                      background: 'white',
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                      textDecoration: 'none',
                      border: '1px solid #e8edf5',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      style={{
                        height: '11rem',
                        background: imageUrl
                          ? `linear-gradient(rgba(15,23,42,0.35), rgba(15,23,42,0.35)), url(${imageUrl}) center/cover no-repeat`
                          : AREA_GRADIENTS[i % AREA_GRADIENTS.length],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {!imageUrl && <span style={{ fontSize: '4rem' }}>📍</span>}
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                      <h2
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {area.name_ar}
                      </h2>

                      {area.region_ar && (
                        <p
                          style={{
                            color: '#64748b',
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem',
                          }}
                        >
                          {area.region_ar}
                        </p>
                      )}

                      {area.description_ar && (
                        <p
                          style={{
                            color: '#64748b',
                            fontSize: '0.875rem',
                            lineHeight: 1.7,
                            marginBottom: '1rem',
                          }}
                        >
                          {area.description_ar}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#1a365d',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid #f1f5f9',
                        }}
                      >
                        عرض الصفحة ←
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                background: 'white',
                borderRadius: '1.25rem',
                padding: '2rem',
                textAlign: 'center',
                color: '#64748b',
              }}
            >
              لا توجد مناطق مضافة حالياً.
            </div>
          )}
        </div>
      </section>
    </>
  );
}