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
import HeroSlider        from '@/components/home/HeroSlider';
import StatsCounter      from '@/components/home/StatsCounter';
import ServicesGrid      from '@/components/home/ServicesGrid';
import WhyChooseUs       from '@/components/home/WhyChooseUs';
import FeaturedProjects  from '@/components/home/FeaturedProjects';
import ProcessSteps      from '@/components/home/ProcessSteps';
import GallerySection    from '@/components/home/GallerySection';
import Testimonials      from '@/components/home/Testimonials';
import FAQAccordion      from '@/components/home/FAQAccordion';
import Partners          from '@/components/home/Partners';
import LatestBlog        from '@/components/home/LatestBlog';
import CTASection        from '@/components/home/CTASection';
import CategoriesSection from '@/components/home/CategoriesSection';

// ════════════════════════════════════════════════
// 🛠️ Helper Functions
// ════════════════════════════════════════════════

/**
 * استخراج مصفوفة من البيانات (تدعم عدة صيغ)
 */
function extractArray<T = any>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
  if (raw.items && Array.isArray(raw.items)) return raw.items;
  if (raw.results && Array.isArray(raw.results)) return raw.results;
  return [];
}

/**
 * تطبيع بيانات الأسئلة الشائعة
 */
function normalizeFaqItem(item: any): any | null {
  if (!item) return null;
  return {
    id: item.id || item._id || Math.random(),
    question: item.question || item.question_ar || item.title || item.title_ar || '',
    answer: item.answer || item.answer_ar || item.content || item.content_ar || item.description || '',
  };
}

function normalizeFaqs(rawData: any): any[] {
  const items = extractArray(rawData);
  return items
    .map((item: any) => normalizeFaqItem(item))
    .filter((item): item is any => item !== null && !!item.question);
}

// ════════════════════════════════════════════════
// 🎨 Loading Skeletons
// ════════════════════════════════════════════════
function SectionSkeleton({ height = '400px' }: { height?: string }) {
  return (
    <div className="hp-skeleton" style={{ minHeight: height }}>
      <div className="hp-shimmer" />
      <style>{`
        .hp-skeleton {
          width: 100%;
          background: linear-gradient(135deg, #f8faff 0%, #ffffff 50%, #f8faff 100%);
          position: relative;
          overflow: hidden;
        }
        .hp-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(237, 137, 54, 0.05) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: hp-skel 1.8s ease-in-out infinite;
        }
        @keyframes hp-skel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="hp-hero-skeleton">
      <div className="hp-hero-shimmer" />
      <style>{`
        .hp-hero-skeleton {
          min-height: 80vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          position: relative;
          overflow: hidden;
        }
        .hp-hero-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(237, 137, 54, 0.1) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: hp-hero 2s ease-in-out infinite;
        }
        @keyframes hp-hero {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════
// 📝 SEO Metadata - يستخدم النظام الموحد
// ════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    
    return generateSEO({
      settings,
      type: 'website',
      url: '/',
    });
  } catch (error) {
    console.error('❌ Error generating homepage metadata:', error);
    return generateSEO({
      type: 'website',
      title: 'الرئيسية',
      description: 'شركة مقاولات عامة رائدة في المملكة العربية السعودية',
    });
  }
}

// ISR - إعادة التحقق كل دقيقة
export const revalidate = 60;

// ════════════════════════════════════════════════
// 🖥️ Main Component
// ════════════════════════════════════════════════
export default async function HomePage() {
  // ─── جلب جميع البيانات بشكل متوازي ───
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
    api.faqs?.() || Promise.resolve(null),
  ]);

  // ─── استخراج البيانات بأمان ───
  const settings = settingsResult.status === 'fulfilled' 
    ? settingsResult.value 
    : {};
  
  const designSettings = designSettingsResult.status === 'fulfilled' 
    ? designSettingsResult.value 
    : null;
  
  const heroSlidesData = heroSlidesResult.status === 'fulfilled' 
    ? extractArray(heroSlidesResult.value) 
    : [];
  
  const servicesData = servicesResult.status === 'fulfilled' 
    ? extractArray(servicesResult.value) 
    : [];
  
  // استخراج المشاريع
  let projectsData: any[] = [];
  if (projectsResult.status === 'fulfilled') {
    const result = projectsResult.value;
    if (result && result.data && Array.isArray(result.data)) {
      projectsData = result.data;
    } else if (Array.isArray(result)) {
      projectsData = result;
    }
  }
  
  const testimonialsData = testimonialsResult.status === 'fulfilled' 
    ? extractArray(testimonialsResult.value) 
    : [];
  
  const partnersData = partnersResult.status === 'fulfilled' 
    ? extractArray(partnersResult.value) 
    : [];
  
  const blogsData = blogsResult.status === 'fulfilled' 
    ? extractArray(blogsResult.value) 
    : [];
  
  const faqsData = normalizeFaqs(
    faqsResult.status === 'fulfilled' ? faqsResult.value : null
  );

  // ─── إعدادات السلايدر ───
  const sliderAutoplay = designSettings?.slider?.autoplay ?? true;
  const sliderAutoplayDelay = designSettings?.slider?.autoplay_delay ?? 5000;

  // ─── Debug Logging ───
  if (process.env.NODE_ENV === 'development') {
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║   🏠 HOMEPAGE DATA STATUS                 ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║ 🎨 Settings:     ${Object.keys(settings).length > 0 ? '✅ Loaded' : '❌ Empty'}              ║`);
    console.log(`║ 🎨 Design:       ${designSettings ? '✅ Loaded' : '⚠️  Defaults'}            ║`);
    console.log(`║ 🎬 Slider:       ${sliderAutoplay ? `✅ ${sliderAutoplayDelay}ms` : '⏸️  Manual'}                  ║`);
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║ 📊 Hero Slides:    ${String(heroSlidesData.length).padEnd(20)} ║`);
    console.log(`║ 🛠️  Services:       ${String(servicesData.length).padEnd(20)} ║`);
    console.log(`║ 🏢 Projects:        ${String(projectsData.length).padEnd(20)} ║`);
    console.log(`║ 💬 Testimonials:    ${String(testimonialsData.length).padEnd(20)} ║`);
    console.log(`║ 🤝 Partners:        ${String(partnersData.length).padEnd(20)} ║`);
    console.log(`║ 📰 Blogs:           ${String(blogsData.length).padEnd(20)} ║`);
    console.log(`║ ❓ FAQs:            ${String(faqsData.length).padEnd(20)} ║`);
    console.log('╚═══════════════════════════════════════════╝\n');
    
    // Log rejected promises
    [
      { name: 'Settings', r: settingsResult },
      { name: 'Hero', r: heroSlidesResult },
      { name: 'Services', r: servicesResult },
      { name: 'Projects', r: projectsResult },
      { name: 'Testimonials', r: testimonialsResult },
      { name: 'Partners', r: partnersResult },
      { name: 'Blogs', r: blogsResult },
      { name: 'FAQs', r: faqsResult },
    ].forEach(({ name, r }) => {
      if (r.status === 'rejected') {
        console.error(`❌ ${name} failed:`, r.reason?.message || r.reason);
      }
    });
  }

  return (
    <>
      {/* ═══════════════════════════════════════
          🎯 JSON-LD Schema (موحد - يضم كل شيء)
          ═══════════════════════════════════════ */}
      <JsonLd 
        settings={settings} 
        pageType="home"
      />

      {/* ═══════════════════════════════════════
          🎬 السلايدر الرئيسي
          ═══════════════════════════════════════ */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider 
          slides={heroSlidesData} 
          settings={settings}
          autoplay={sliderAutoplay}
          autoplayDelay={sliderAutoplayDelay}
        />
      </Suspense>

      {/* ═══════════════════════════════════════
          📊 الإحصائيات
          ═══════════════════════════════════════ */}
      <Suspense fallback={<SectionSkeleton height="250px" />}>
        <StatsCounter settings={settings} />
      </Suspense>

      {/* ═══════════════════════════════════════
          📂 التصنيفات
          ═══════════════════════════════════════ */}
      <Suspense fallback={<SectionSkeleton height="350px" />}>
        <CategoriesSection />
      </Suspense>

      {/* ═══════════════════════════════════════
          🛠️ الخدمات
          ═══════════════════════════════════════ */}
      {servicesData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <ServicesGrid services={servicesData} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════════
          ⭐ لماذا تختارنا
          ═══════════════════════════════════════ */}
      <WhyChooseUs />

      {/* ═══════════════════════════════════════
          🏢 المشاريع المميزة
          ═══════════════════════════════════════ */}
      {projectsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <FeaturedProjects projects={projectsData} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════════
          ⚙️ خطوات العمل
          ═══════════════════════════════════════ */}
      <ProcessSteps />

      {/* ═══════════════════════════════════════
          🖼️ المعرض
          ═══════════════════════════════════════ */}
      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <GallerySection />
      </Suspense>

      {/* ═══════════════════════════════════════
          💬 آراء العملاء
          ═══════════════════════════════════════ */}
      {testimonialsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <Testimonials featured={false} limit={12} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════════
          ❓ الأسئلة الشائعة
          ═══════════════════════════════════════ */}
      {faqsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <FAQAccordion faqs={faqsData} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════════
          🤝 الشركاء
          ═══════════════════════════════════════ */}
      {partnersData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="300px" />}>
          <Partners 
            partners={partnersData} 
            autoplayInterval={sliderAutoplayDelay}
          />
        </Suspense>
      )}
      
      {/* ═══════════════════════════════════════
          📰 أحدث المقالات
          ═══════════════════════════════════════ */}
      {blogsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <LatestBlog blogs={blogsData} />
        </Suspense>
      )}

      {/* ═══════════════════════════════════════
          🎯 Call to Action
          ═══════════════════════════════════════ */}
      <CTASection />
    </>
  );
}