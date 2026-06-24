// frontend/src/app/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// 🎯 SEO
import { generateSEO } from '@/lib/seo/metadata'; 
import { JsonLd } from '@/components/seo/JsonLd';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getDesignSettings } from '@/lib/colors';
import { getSiteSettings } from '@/lib/settings';

// ✅ تحسين: استخدام dynamic import للمكونات الثقيلة
const HeroSlider = dynamic(
  () => import('@/components/home/HeroSlider'),
  { 
    loading: () => <HeroSkeleton />,
    ssr: true 
  }
);

const StatsCounter = dynamic(
  () => import('@/components/home/StatsCounter'),
  { loading: () => <SectionSkeleton height="250px" /> }
);

const ServicesGrid = dynamic(
  () => import('@/components/home/ServicesGrid'),
  { loading: () => <SectionSkeleton height="600px" /> }
);

const WhyChooseUs = dynamic(
  () => import('@/components/home/WhyChooseUs'),
  { loading: () => <SectionSkeleton height="400px" /> }
);

const FeaturedProjects = dynamic(
  () => import('@/components/home/FeaturedProjects'),
  { loading: () => <SectionSkeleton height="600px" /> }
);

const ProcessSteps = dynamic(
  () => import('@/components/home/ProcessSteps'),
  { loading: () => <SectionSkeleton height="400px" /> }
);

const GallerySection = dynamic(
  () => import('@/components/home/GallerySection'),
  { loading: () => <SectionSkeleton height="500px" /> }
);

const Testimonials = dynamic(
  () => import('@/components/home/Testimonials'),
  { loading: () => <SectionSkeleton height="400px" /> }
);

const FAQAccordion = dynamic(
  () => import('@/components/home/FAQAccordion'),
  { loading: () => <SectionSkeleton height="500px" /> }
);

const Partners = dynamic(
  () => import('@/components/home/Partners'),
  { loading: () => <SectionSkeleton height="300px" /> }
);

const LatestBlog = dynamic(
  () => import('@/components/home/LatestBlog'),
  { loading: () => <SectionSkeleton height="500px" /> }
);

const CTASection = dynamic(
  () => import('@/components/home/CTASection'),
  { loading: () => <SectionSkeleton height="300px" /> }
);

const CategoriesSection = dynamic(
  () => import('@/components/home/CategoriesSection'),
  { loading: () => <SectionSkeleton height="350px" /> }
);

// ════════════════════════════════════════════════
// 🛠️ Helper Functions
// ════════════════════════════════════════════════

function extractArray<T = any>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
  if (raw.items && Array.isArray(raw.items)) return raw.items;
  if (raw.results && Array.isArray(raw.results)) return raw.results;
  return [];
}

function normalizeFaqItem(item: any): any | null {
  if (!item) return null;
  return {
    id: item.id || item._id || `faq-${Math.random().toString(36).substring(2, 9)}`,
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
          contain: layout style paint;
        }
        .hp-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212, 175, 55, 0.05) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: hp-skel 1.8s ease-in-out infinite;
        }
        @keyframes hp-skel {
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
          contain: layout style paint;
        }
        .hp-hero-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212, 175, 55, 0.08) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: hp-hero 2s ease-in-out infinite;
        }
        @keyframes hp-hero {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hp-hero-shimmer { animation: none; }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════
// 📝 SEO Metadata
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
  
  let projectsData: any[] = [];
  if (projectsResult.status === 'fulfilled') {
    const result = projectsResult.value;
    if (result?.data && Array.isArray(result.data)) {
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

  // ─── Debug Logging (محسن) ───
  if (process.env.NODE_ENV === 'development') {
    // ✅ تحسين: التحقق من وجود البيانات قبل Object.keys
    const hasData = (data: any): boolean => {
      if (!data) return false;
      if (Array.isArray(data)) return data.length > 0;
      if (typeof data === 'object') return Object.keys(data).length > 0;
      return false;
    };

    const dataSummary = [
      { name: 'Settings', data: settings, status: settingsResult.status },
      { name: 'Design', data: designSettings, status: designSettingsResult.status },
      { name: 'Hero Slides', data: heroSlidesData, status: heroSlidesResult.status },
      { name: 'Services', data: servicesData, status: servicesResult.status },
      { name: 'Projects', data: projectsData, status: projectsResult.status },
      { name: 'Testimonials', data: testimonialsData, status: testimonialsResult.status },
      { name: 'Partners', data: partnersData, status: partnersResult.status },
      { name: 'Blogs', data: blogsData, status: blogsResult.status },
      { name: 'FAQs', data: faqsData, status: faqsResult.status },
    ];

    const success = dataSummary.filter(d => 
      d.status === 'fulfilled' && hasData(d.data)
    );
    const failed = dataSummary.filter(d => d.status === 'rejected');

    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║   🏠 HOMEPAGE DATA STATUS                 ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║ ✅ Loaded:  ${String(success.length).padEnd(20)}║`);
    console.log(`║ ❌ Failed:  ${String(failed.length).padEnd(20)}║`);
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║ 🎬 Slider:   ${sliderAutoplay ? `✅ ${sliderAutoplayDelay}ms` : '⏸️  Manual'}             ║`);
    console.log(`║ 📊 Slides:   ${String(heroSlidesData.length).padEnd(20)}║`);
    console.log(`║ 🛠️ Services: ${String(servicesData.length).padEnd(20)}║`);
    console.log(`║ 🏢 Projects: ${String(projectsData.length).padEnd(20)}║`);
    console.log(`║ 💬 Reviews:  ${String(testimonialsData.length).padEnd(20)}║`);
    console.log(`║ 🤝 Partners: ${String(partnersData.length).padEnd(20)}║`);
    console.log(`║ 📰 Blogs:    ${String(blogsData.length).padEnd(20)}║`);
    console.log(`║ ❓ FAQs:     ${String(faqsData.length).padEnd(20)}║`);
    console.log('╚═══════════════════════════════════════════╝\n');

    // عرض الأخطاء فقط - مع التحقق من وجود reason
    failed.forEach(({ name, data }) => {
      const errorData = data as any;
      const errorMessage = errorData?.reason?.message || 
                          errorData?.reason || 
                          'Unknown error';
      console.error(`❌ ${name} failed:`, errorMessage);
    });
  }

  return (
    <>
      <JsonLd 
        settings={settings} 
        pageType="home"
      />

      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider 
          slides={heroSlidesData} 
          settings={settings}
          autoplay={sliderAutoplay}
          autoplayDelay={sliderAutoplayDelay}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="250px" />}>
        <StatsCounter settings={settings} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="350px" />}>
        <CategoriesSection />
      </Suspense>

      {servicesData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <ServicesGrid services={servicesData} />
        </Suspense>
      )}

      <WhyChooseUs />

      {projectsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <FeaturedProjects projects={projectsData} />
        </Suspense>
      )}

      <ProcessSteps />

      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <GallerySection />
      </Suspense>

      {testimonialsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <Testimonials featured={false} limit={12} />
        </Suspense>
      )}

      {faqsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <FAQAccordion faqs={faqsData} />
        </Suspense>
      )}

      {partnersData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="300px" />}>
          <Partners 
            partners={partnersData} 
            autoplayInterval={sliderAutoplayDelay}
          />
        </Suspense>
      )}
      
      {blogsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <LatestBlog blogs={blogsData} />
        </Suspense>
      )}

      <CTASection />
    </>
  );
}