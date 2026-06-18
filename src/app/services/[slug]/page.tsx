// frontend/src/app/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import ServiceSchema from '@/components/seo/ServiceSchema';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { toStr, toArray } from '@/lib/typeSafe';

// 🧩 Client Components
import ServiceDetailClient from './ServiceDetailClient';

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════
interface Service {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  excerpt: string;
  excerpt_ar: string;
  content: string;
  content_ar: string;
  icon: string | null;
  icon_html?: string;
  image_url: string | null;
  background_image_url: string | null;
  og_image_url: string | null;
  gallery: string[];
  video_url: string | null;
  embed_video_url: string | null;
  is_featured: boolean;
  sort_order: number;
  category: { id: number; name_ar: string; slug: string } | null;
  tags: Array<{ id: number; name_ar: string; slug: string }>;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  canonical_url?: string | null;
  robots?: string;
  views_count?: number;
  url?: string;
}

// ════════════════════════════════════════════════
// 🛠️ Helper: جلب الخدمة
// ════════════════════════════════════════════════
async function fetchService(slug: string): Promise<Service | null> {
  try {
    const response: any = await api.service(slug);
    
    if (!response) return null;
    
    // إذا كانت الاستجابة { success: true, data: {...} }
    if (response.success === true && response.data) {
      return response.data;
    }
    
    // إذا كانت الاستجابة كائن مباشر
    if (response.id) {
      return response as Service;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error fetching service:', error);
    return null;
  }
}

// ════════════════════════════════════════════════
// 📝 generateMetadata - SEO ديناميكي
// ════════════════════════════════════════════════
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  
  const [settings, service] = await Promise.all([
    getSiteSettings(),
    fetchService(slug),
  ]);
  
  if (!service) {
    return generateSEO({
      settings,
      title: 'الخدمة غير موجودة',
      noindex: true,
    });
  }
  
  const title = toStr(service.meta_title) || toStr(service.title_ar) || toStr(service.title);
  const description = toStr(service.meta_description) || toStr(service.excerpt_ar) || toStr(service.excerpt);
  const image = toStr(service.og_image_url) || toStr(service.image_url);
  const keywords = toArray<string>(service.meta_keywords);
  
  return generateSEO({
    settings,
    type: 'website',
    title,
    description,
    keywords,
    image,
    url: `/services/${slug}`,
    canonical: service.canonical_url || undefined,
    noindex: service.robots?.includes('noindex'),
    nofollow: service.robots?.includes('nofollow'),
  });
}

// ════════════════════════════════════════════════
// 🖥️ Main Page Component (Server)
// ════════════════════════════════════════════════
export default async function ServicePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  const { slug } = await Promise.resolve(params);
  
  // ─── جلب البيانات بالتوازي ───
  const [settings, service, relatedServices] = await Promise.all([
    getSiteSettings(),
    fetchService(slug),
    api.relatedServices(slug).catch(() => []),
  ]);
  
  // ─── 404 إذا الخدمة غير موجودة ───
  if (!service) {
    notFound();
  }
  
  // ─── Breadcrumbs ───
  const breadcrumbs = buildBreadcrumb(
    { name: 'الخدمات', url: '/services' },
    { name: service.title_ar || service.title, url: `/services/${slug}` }
  );
  
  // ─── الصفحة ───
  return (
    <>
      {/* ═══════════════════════════════════════
          🎯 JSON-LD Schemas (Server-Side)
          ═══════════════════════════════════════ */}
      
      {/* Organization + WebSite + WebPage + Breadcrumbs */}
      <JsonLd 
        settings={settings}
        pageType="service-detail"
        pageTitle={service.title_ar || service.title}
        pageDescription={service.excerpt_ar || service.excerpt}
        pageUrl={`/services/${slug}`}
        pageImage={service.image_url || undefined}
        breadcrumbs={breadcrumbs}
      />
      
      {/* Service Schema المتخصص */}
      <ServiceSchema service={service} settings={settings} />
      
      {/* ═══════════════════════════════════════
          🎨 محتوى الصفحة (Client Component)
          ═══════════════════════════════════════ */}
      <ServiceDetailClient 
        service={service}
        relatedServices={extractArray(relatedServices)}
        settings={settings}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}

// ════════════════════════════════════════════════
// 🛠️ Helper
// ════════════════════════════════════════════════
function extractArray<T = any>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
  return [];
}

// ISR
export const revalidate = 60;

// Static generation للروابط الشهيرة (اختياري)
export async function generateStaticParams() {
  try {
    const services = await api.featuredServices();
    const list = extractArray<Service>(services);
    return list.slice(0, 20).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}