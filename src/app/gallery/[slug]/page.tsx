// src/app/gallery/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { toStr, extractArray } from '@/lib/typeSafe';
import { getImageUrl } from '@/lib/image';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSiteSettings();

  const galleryItems = await api.galleryImages().catch(() => []);
  const gallery = extractArray(galleryItems).find((g: any) => g.slug === slug);

  if (!gallery) {
    return generateSEO({
      settings,
      title: 'المعرض غير موجود',
      noindex: true,
    });
  }

  return generateSEO({
    settings,
    type: 'website',
    title: toStr(gallery.meta_title_ar) || gallery.title_ar || 'معرض الصور',
    description: toStr(gallery.meta_description_ar) || gallery.description_ar || '',
    url: `/gallery/${slug}`,
    image: getImageUrl(gallery.image) || undefined,
  });
}

export default async function GalleryPage({ params }: Props) {
  const { slug } = await params;

  const [settings, galleryItems] = await Promise.all([
    getSiteSettings(),
    api.galleryImages().catch(() => []),
  ]);

  const gallery = extractArray(galleryItems).find((g: any) => g.slug === slug);
  if (!gallery) notFound();

  const breadcrumbs = buildBreadcrumb(
    { name: 'معرض الصور', url: '/gallery' },
    { name: gallery.title_ar || 'تفاصيل المعرض', url: `/gallery/${slug}` }
  );

  const imageUrl = getImageUrl(gallery.image);
  const galleryImages = extractArray(gallery.gallery || []).map((img: string) => getImageUrl(img));

  return (
    <>
      <JsonLd
        settings={settings}
        pageType="blog" // ✅ استخدام نوع مدعوم
        pageTitle={gallery.title_ar || 'معرض الصور'}
        pageDescription={gallery.description_ar || ''}
        pageUrl={`/gallery/${slug}`}
        pageImage={imageUrl || undefined}
        breadcrumbs={breadcrumbs}
      />

      <section className="gallery-hero">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <div className="gallery-hero-content">
            <h1 className="gallery-title">{gallery.title_ar || 'معرض الصور'}</h1>
            {gallery.description_ar && (
              <p className="gallery-desc">{gallery.description_ar}</p>
            )}
          </div>
        </div>
      </section>

      <section className="gallery-content">
        <div className="container-custom">
          {galleryImages.length > 0 ? (
            <div className="gallery-grid">
              {galleryImages.map((img: string, index: number) => (
                <div key={index} className="gallery-item">
                  <Image
                    src={img}
                    alt={`${gallery.title_ar || 'صورة'} ${index + 1}`}
                    width={400}
                    height={300}
                    className="gallery-image"
                    unoptimized={img.includes('localhost')}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">لا توجد صور في هذا المعرض</div>
          )}
        </div>
      </section>

      <style>{`
        .gallery-hero {
          background: linear-gradient(135deg, #0f1729, #1a365d);
          color: white;
          padding: 3rem 0 4rem;
        }
        .gallery-hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .gallery-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .gallery-desc {
          color: #cbd5e0;
          font-size: 1.125rem;
        }
        .gallery-content {
          padding: 3rem 0;
          background: #f8faff;
          min-height: 60vh;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .gallery-item {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          transition: all 0.3s;
          aspect-ratio: 4/3;
        }
        .gallery-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .empty-state {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 1rem;
          color: #64748b;
        }
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
        }
      `}</style>
    </>
  );
}
