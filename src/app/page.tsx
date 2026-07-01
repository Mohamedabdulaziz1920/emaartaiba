// frontend/src/app/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';

// 🎯 SEO
import { generateSEO } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getDesignSettings } from '@/lib/colors';
import { getSiteSettings } from '@/lib/settings';

// 🧩 Components
import HeroSlider from '@/components/home/HeroSlider';
import StatsCounter from '@/components/home/StatsCounter';
import ServicesGrid from '@/components/home/ServicesGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import ProcessSteps from '@/components/home/ProcessSteps';
import GallerySection from '@/components/home/GallerySection';
import Testimonials from '@/components/home/Testimonials';
import FAQAccordion from '@/components/home/FAQAccordion';
import Partners from '@/components/home/Partners';
import LatestBlog from '@/components/home/LatestBlog';
import CTASection from '@/components/home/CTASection';
import CategoriesSection from '@/components/home/CategoriesSection';

// ════════════════════════════════════════════════
// ⚙️ Config
// ════════════════════════════════════════════════
export const revalidate = 300; // 5 دقائق

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface HomePageData {
  settings: any;
  designSettings: any;
  heroSlides: any[];
  services: any[];
  projects: any[];
  testimonials: any[];
  partners: any[];
  blogs: any[];
  faqs: FAQItem[];
}

// ════════════════════════════════════════════════
// 🛠️ Helpers - محسّنة
// ════════════════════════════════════════════════

/**
 * ✅ استخراج المصفوفة من أي شكل response
 */
function extractArray<T = any>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  
  // Nested data structures
  if (raw.data) {
    if (Array.isArray(raw.data)) return raw.data;
    if (raw.data.data && Array.isArray(raw.data.data)) return raw.data.data;
  }
  
  if (raw.items && Array.isArray(raw.items)) return raw.items;
  if (raw.results && Array.isArray(raw.results)) return raw.results;
  
  return [];
}

/**
 * ✅ تطبيع عنصر FAQ - id رقم دائماً
 */
function normalizeFaqItem(item: any, index: number): FAQItem | null {
  if (!item || typeof item !== 'object') return null;
  
  const question = 
    item.question || 
    item.question_ar || 
    item.title || 
    item.title_ar || 
    '';
  
  const answer = 
    item.answer || 
    item.answer_ar || 
    item.content || 
    item.content_ar || 
    item.description || 
    item.description_ar ||
    '';
  
  // ✅ لا نُرجع عنصر بدون سؤال
  if (!question.trim()) return null;
  
  // ✅ تحويل ID لرقم دائماً
  const rawId = item.id ?? item._id ?? (index + 1);
  const numericId = typeof rawId === 'number' 
    ? rawId 
    : parseInt(String(rawId), 10) || (index + 1);
  
  return {
    id: numericId,
    question: question.trim(),
    answer: answer.trim(),
  };
}

/**
 * ✅ تطبيع قائمة FAQs
 */
function normalizeFaqs(rawData: any): FAQItem[] {
  const items = extractArray(rawData);
  return items
    .map((item, i) => normalizeFaqItem(item, i))
    .filter((item): item is FAQItem => item !== null);
}

/**
 * ✅ استخراج بيانات المشاريع (تدعم أشكال متعددة)
 */
function extractProjects(result: PromiseSettledResult<any>): any[] {
  if (result.status !== 'fulfilled') return [];
  
  const value = result.value;
  if (!value) return [];
  
  // { success: true, data: [] }
  if (value.data && Array.isArray(value.data)) return value.data;
  
  // Direct array
  if (Array.isArray(value)) return value;
  
  // Nested
  return extractArray(value);
}

// ════════════════════════════════════════════════
// 🎨 Skeletons - محسّنة
// ════════════════════════════════════════════════

/**
 * Skeleton عام للأقسام
 */
function SectionSkeleton({ 
  height = '400px',
  variant = 'light'
}: { 
  height?: string;
  variant?: 'light' | 'dark';
}) {
  const bgGradient = variant === 'dark' 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #f8faff 0%, #ffffff 50%, #f8faff 100%)';
  
  const shimmerColor = variant === 'dark'
    ? 'rgba(212, 175, 55, 0.08)'
    : 'rgba(212, 175, 55, 0.05)';

  return (
    <div className="hp-skeleton" style={{ minHeight: height }}>
      <div className="hp-shimmer" />
      <style>{`
        .hp-skeleton {
          width: 100%;
          background: ${bgGradient};
          position: relative;
          overflow: hidden;
          contain: layout style paint;
        }
        .hp-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg, 
            transparent 0%, 
            ${shimmerColor} 50%, 
            transparent 100%
          );
          background-size: 200% 100%;
          animation: hp-skeleton-shimmer 1.8s ease-in-out infinite;
        }
        @keyframes hp-skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hp-shimmer { animation: none; }
        }
      `}</style>
    </div>
  );
}

/**
 * Skeleton خاص بالـ Hero
 */
function HeroSkeleton() {
  return <SectionSkeleton height="80vh" variant="dark" />;
}

// ════════════════════════════════════════════════
// 📝 generateMetadata
// ════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    return generateSEO({ 
      settings, 
      type: 'website', 
      url: '/' 
    });
  } catch (error) {
    console.error('❌ Homepage metadata error:', error);
    return generateSEO({ 
      type: 'website', 
      url: '/' 
    });
  }
}

// ════════════════════════════════════════════════
// 🚀 Data Fetching
// ════════════════════════════════════════════════
async function fetchHomePageData(): Promise<HomePageData> {
  const [
    settingsResult,
    designSettingsResult,
    heroSlidesResult,
    servicesResult,
    projectsResult,
    testimonialsResult,
    partnersResult,
    blogsResult,
    faqsResult,
  ] = await Promise.allSettled([
    getSiteSettings(),
    getDesignSettings(),
    api.heroSlides(),
    api.featuredServices(),
    api.featuredProjects(),
    api.testimonials(),
    api.partners(),
    api.latestBlogs(),
    api.faqs?.() ?? Promise.resolve(null),
  ]);

  // ─── استخراج البيانات بأمان ─────────────────────
  const settings = settingsResult.status === 'fulfilled' 
    ? settingsResult.value 
    : {};

  const designSettings = designSettingsResult.status === 'fulfilled' 
    ? designSettingsResult.value 
    : null;

  const heroSlides = heroSlidesResult.status === 'fulfilled' 
    ? extractArray(heroSlidesResult.value) 
    : [];
  
  const services = servicesResult.status === 'fulfilled' 
    ? extractArray(servicesResult.value) 
    : [];
  
  const testimonials = testimonialsResult.status === 'fulfilled' 
    ? extractArray(testimonialsResult.value) 
    : [];
  
  const partners = partnersResult.status === 'fulfilled' 
    ? extractArray(partnersResult.value) 
    : [];
  
  const blogs = blogsResult.status === 'fulfilled' 
    ? extractArray(blogsResult.value) 
    : [];

  const projects = extractProjects(projectsResult);

  const faqs = normalizeFaqs(
    faqsResult.status === 'fulfilled' ? faqsResult.value : null
  );

  // ─── Debug في التطوير فقط ─────────────────────
  if (process.env.NODE_ENV === 'development') {
    logDataStatus({
      settings: settingsResult,
      heroSlides: heroSlidesResult,
      services: servicesResult,
      projects: projectsResult,
      testimonials: testimonialsResult,
      partners: partnersResult,
      blogs: blogsResult,
      faqs: faqsResult,
    }, {
      slides: heroSlides.length,
      services: services.length,
      projects: projects.length,
      testimonials: testimonials.length,
      partners: partners.length,
      blogs: blogs.length,
      faqs: faqs.length,
    });
  }

  return {
    settings,
    designSettings,
    heroSlides,
    services,
    projects,
    testimonials,
    partners,
    blogs,
    faqs,
  };
}

// ════════════════════════════════════════════════
// 🐛 Debug Logger (Development Only)
// ════════════════════════════════════════════════
function logDataStatus(
  results: Record<string, PromiseSettledResult<any>>,
  counts: Record<string, number>
) {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║   🏠 HOMEPAGE DATA STATUS                 ║');
  console.log('╠═══════════════════════════════════════════╣');
  
  Object.entries(counts).forEach(([key, value]) => {
    const icon = getIconForKey(key);
    const label = `${icon} ${key.charAt(0).toUpperCase() + key.slice(1)}:`;
    console.log(`║ ${label.padEnd(20)} ${String(value).padEnd(18)} ║`);
  });
  
  console.log('╚═══════════════════════════════════════════╝\n');

  // ✅ اعرض الأخطاء فقط
  Object.entries(results).forEach(([name, result]) => {
    if (result.status === 'rejected') {
      const reason = (result as PromiseRejectedResult).reason;
      console.error(`❌ ${name} failed:`, reason?.message || reason);
    }
  });
}

function getIconForKey(key: string): string {
  const icons: Record<string, string> = {
    slides: '📊',
    services: '🛠️',
    projects: '🏢',
    testimonials: '💬',
    partners: '🤝',
    blogs: '📰',
    faqs: '❓',
    settings: '⚙️',
    heroSlides: '🎬',
  };
  return icons[key] || '📌';
}

// ════════════════════════════════════════════════
// 🖥️ Main Page Component
// ════════════════════════════════════════════════
export default async function HomePage() {
  const data = await fetchHomePageData();
  
  const {
    settings,
    designSettings,
    heroSlides,
    services,
    projects,
    testimonials,
    partners,
    blogs,
    faqs,
  } = data;

  // ─── إعدادات السلايدر ─────────────────────────
  const sliderAutoplay = designSettings?.slider?.autoplay ?? true;
  const sliderAutoplayDelay = designSettings?.slider?.autoplay_delay ?? 5000;

  return (
    <>
      {/* ═══════════════════════════════════
          🔍 SEO & Structured Data
          ═══════════════════════════════════ */}
      <JsonLd settings={settings} pageType="home" />

      {/* ═══════════════════════════════════
          🎬 Hero Slider - دائماً يعرض
          ═══════════════════════════════════ */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider
          slides={heroSlides}
          settings={settings}
          autoplay={sliderAutoplay}
          autoplayDelay={sliderAutoplayDelay}
        />
      </Suspense>

      {/* ═══════════════════════════════════
          📊 Stats Counter - دائماً يعرض
          ═══════════════════════════════════ */}
      <Suspense fallback={<SectionSkeleton height="250px" />}>
        <StatsCounter settings={settings} />
      </Suspense>

      {/* ═══════════════════════════════════
          📂 Categories - دائماً يعرض
          ═══════════════════════════════════ */}
      <Suspense fallback={<SectionSkeleton height="350px" />}>
        <CategoriesSection />
      </Suspense>

      {/* ═══════════════════════════════════
          🛠️ Services - يعرض عند وجود بيانات
          ═══════════════════════════════════ */}
      {services.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <ServicesGrid services={services} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════
          ⭐ Why Choose Us - دائماً يعرض
          ═══════════════════════════════════ */}
      <WhyChooseUs />

      {/* ═══════════════════════════════════
          🏢 Featured Projects - يعرض عند وجود بيانات
          ═══════════════════════════════════ */}
      {projects.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <FeaturedProjects projects={projects} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════
          📋 Process Steps - دائماً يعرض
          ═══════════════════════════════════ */}
      <ProcessSteps />

      {/* ═══════════════════════════════════
          🖼️ Gallery - دائماً يعرض
          ═══════════════════════════════════ */}
      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <GallerySection />
      </Suspense>

      {/* ═══════════════════════════════════
          💬 Testimonials - يعرض عند وجود بيانات
          ═══════════════════════════════════ */}
      {testimonials.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <Testimonials 
            featured={false} 
            limit={12}
          />
        </Suspense>
      )}

      {/* ═══════════════════════════════════
          ❓ FAQ - يعرض عند وجود بيانات
          ═══════════════════════════════════ */}
      {faqs.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <FAQAccordion faqs={faqs} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════
          🤝 Partners - يعرض عند وجود بيانات
          ═══════════════════════════════════ */}
      {partners.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="300px" />}>
          <Partners
            partners={partners}
            autoplayInterval={sliderAutoplayDelay}
          />
        </Suspense>
      )}

      {/* ═══════════════════════════════════
          📰 Latest Blog - يعرض عند وجود بيانات
          ═══════════════════════════════════ */}
      {blogs.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <LatestBlog blogs={blogs} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════
          📢 CTA Section - دائماً يعرض
          ═══════════════════════════════════ */}
      <CTASection />
    </>
  );
}