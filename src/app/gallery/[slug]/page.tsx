// src/app/gallery/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 🎯 SEO - النظام الموحد
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { getSiteSettings } from '@/lib/settings';

// 🧩 Client Component
import GalleryDetailClient from './GalleryDetailClient';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { toStr } from '@/lib/typeSafe';
import { getImageUrl } from '@/lib/image';

// ════════════════════════════════════════════════
// 🎯 Types - متوافقة مع Laravel API
// ════════════════════════════════════════════════
interface GalleryImage {
  id: string;
  title: string;
  image: string;
}

interface GalleryData {
  id: number;
  title_ar: string;
  slug: string;
  description_ar: string | null;
  category: string | null;
  image: string | null;
  gallery_images: string[] | null;
  is_active: boolean;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  images: GalleryImage[];
  total_images: number;
}

// ════════════════════════════════════════════════
// 🛠️ Helper: تحويل بيانات API إلى صيغة العرض
// ════════════════════════════════════════════════
function transformGalleryData(data: any): GalleryData {
  const galleryImages = Array.isArray(data.gallery_images) ? data.gallery_images : [];
  
  const images: GalleryImage[] = [];
  
  if (data.image) {
    images.push({
      id: 'main',
      title: data.title_ar || 'الصورة الرئيسية',
      image: getImageUrl(data.image),
    });
  }
  
  galleryImages.forEach((img: string, index: number) => {
    if (img) {
      images.push({
        id: `img-${index + 1}`,
        title: `${data.title_ar} - صورة ${index + 1}`,
        image: getImageUrl(img),
      });
    }
  });

  return {
    ...data,
    images,
    total_images: images.length,
  };
}

// ════════════════════════════════════════════════
// 🛠️ Helper: جلب المعرض بواسطة Slug (محلي فقط)
// ════════════════════════════════════════════════
async function getGalleryBySlug(slug: string): Promise<any | null> {
  try {
    // ✅ استخدام api.galleries() لجلب جميع المعارض ثم البحث
    const galleries = await api.galleries();
    const gallery = galleries.find((g: any) => g.slug === slug);
    return gallery || null;
  } catch (error) {
    console.error(`Error fetching gallery by slug ${slug}:`, error);
    return null;
  }
}

// ════════════════════════════════════════════════
// 📝 SEO Metadata - النظام الموحد
// ════════════════════════════════════════════════
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, gallery] = await Promise.all([
    getSiteSettings(),
    getGalleryBySlug(slug),
  ]);

  if (!gallery) {
    return generateSEO({
      settings,
      title: 'المعرض غير موجود',
      description: 'عذراً، المعرض الذي تبحث عنه غير متوفر',
      noindex: true,
    });
  }

  const title = toStr(gallery.title_ar) || 'معرض الصور';
  const description = toStr(gallery.description_ar) || `معرض صور ${title}`;
  const image = gallery.image ? getImageUrl(gallery.image) : undefined;

  return generateSEO({
    settings,
    type: 'website',
    title,
    description,
    keywords: ['معرض صور', 'صور', 'معرض', 'مشاريع', 'بناء', title],
    url: `/gallery/${slug}`,
    image,
  });
}

// ════════════════════════════════════════════════
// ⚡ ISR - إعادة التحقق كل ساعة
// ════════════════════════════════════════════════
export const revalidate = 3600;

// ════════════════════════════════════════════════
// 🖥️ الصفحة الرئيسية (Server Component)
// ════════════════════════════════════════════════
export default async function GalleryDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // ─── جلب البيانات بالتوازي ───
  const [settings, galleryRaw] = await Promise.all([
    getSiteSettings(),
    getGalleryBySlug(slug),
  ]);

  if (!galleryRaw) {
    notFound();
  }

  // ─── تحويل البيانات إلى صيغة العرض ───
  const gallery = transformGalleryData(galleryRaw);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lamsataljarj.com';

  // ─── Breadcrumbs ───
  const breadcrumbs = buildBreadcrumb(
    { name: 'المعرض', url: '/gallery' },
    { name: gallery.title_ar, url: `/gallery/${slug}` }
  );

  // ─── الصورة الرئيسية ───
  const mainImage = gallery.image ? getImageUrl(gallery.image) : undefined;

  // ─── Image Gallery Schema ───
  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${siteUrl}/gallery/${slug}#gallery`,
    name: gallery.title_ar,
    description: gallery.description_ar || `معرض صور ${gallery.title_ar}`,
    inLanguage: 'ar-SA',
    image: gallery.images.map((img: GalleryImage) => ({
      '@type': 'ImageObject',
      url: img.image,
      name: img.title || gallery.title_ar,
      caption: img.title || gallery.title_ar,
      contentUrl: img.image,
    })),
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          🎯 JSON-LD Schemas (Server-Side)
          ═══════════════════════════════════════ */}
      <JsonLd 
        settings={settings}
        pageType="about"
        pageTitle={gallery.title_ar}
        pageDescription={gallery.description_ar || `معرض صور ${gallery.title_ar}`}
        pageUrl={`/gallery/${slug}`}
        pageImage={mainImage}
        breadcrumbs={breadcrumbs}
      />
      
      {/* ImageGallery Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      
      {/* Breadcrumb Component */}
      <Breadcrumb items={breadcrumbs} variant="dark" />
      
      {/* Client Component للتفاعل */}
      <GalleryDetailClient gallery={gallery} />
    </>
  );
}