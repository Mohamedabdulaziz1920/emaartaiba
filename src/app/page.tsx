// frontend/src/app/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// 🎯 SEO
import { generateSEO } from '@/lib/seo/metadata';
import { JsonLd }      from '@/components/seo/JsonLd';

// 🛠️ Utilities
import { api }                from '@/lib/api';
import { getDesignSettings }  from '@/lib/colors';
import { getSiteSettings }    from '@/lib/settings';
import { extractArray }       from '@/lib/typeSafe'; // ✅ من typeSafe

// ════════════════════════════════════════════════
// ⚙️ Config
// ════════════════════════════════════════════════
export const revalidate = 300; // ✅ 300 بدلاً من 60

// ════════════════════════════════════════════════
// 🎨 Skeletons
// ════════════════════════════════════════════════
function SectionSkeleton({ height = '400px' }: { height?: string }) {
  return (
    <div
      className="hp-skeleton"
      style={{ minHeight: height }}
      aria-hidden="true"
    />
  );
}

function HeroSkeleton() {
  return <div className="hp-hero-skeleton" aria-hidden="true" />;
}

// ════════════════════════════════════════════════
// 📦 Dynamic Imports
// ════════════════════════════════════════════════
const HeroSlider = dynamic(
  () => import('@/components/home/HeroSlider'),
  { loading: () => <HeroSkeleton />, ssr: true }
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
// 🛠️ FAQ Helpers
// ════════════════════════════════════════════════
function normalizeFaqItem(item: any, index: number) {
  if (!item) return null;
  return {
    // ✅ استخدام index بدلاً من Math.random()
    id:       item.id   || item._id   || `faq-${index}`,
    question: item.question || item.question_ar ||
              item.title    || item.title_ar    || '',
    answer:   item.answer   || item.answer_ar   ||
              item.content  || item.content_ar  ||
              item.description || '',
  };
}

function normalizeFaqs(rawData: any): any[] {
  const items = extractArray(rawData);
  return items
    .map((item: any, i: number) => normalizeFaqItem(item, i))
    .filter((item): item is any => item !== null && !!item.question);
}

// ════════════════════════════════════════════════
// 📝 generateMetadata
// ════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    return generateSEO({ settings, type: 'website', url: '/' });
  } catch (error) {
    console.error('❌ Homepage metadata error:', error);
    // ✅ لا defaults خاصة بنشاط
    return generateSEO({ type: 'website', url: '/' });
  }
}

// ════════════════════════════════════════════════
// 🖥️ Page Component
// ════════════════════════════════════════════════
export default async function HomePage() {
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

  // ─── استخراج البيانات ─────────────────────────
  const settings = settingsResult.status === 'fulfilled'
    ? settingsResult.value : {};

  const designSettings = designSettingsResult.status === 'fulfilled'
    ? designSettingsResult.value : null;

  const heroSlidesData   = heroSlidesResult.status   === 'fulfilled' ? extractArray(heroSlidesResult.value)   : [];
  const servicesData     = servicesResult.status     === 'fulfilled' ? extractArray(servicesResult.value)     : [];
  const testimonialsData = testimonialsResult.status === 'fulfilled' ? extractArray(testimonialsResult.value) : [];
  const partnersData     = partnersResult.status     === 'fulfilled' ? extractArray(partnersResult.value)     : [];
  const blogsData        = blogsResult.status        === 'fulfilled' ? extractArray(blogsResult.value)        : [];

  // ✅ projectsData - نفس منطق extractArray
  const projectsData = projectsResult.status === 'fulfilled'
    ? extractArray(projectsResult.value) : [];

  const faqsData = normalizeFaqs(
    faqsResult.status === 'fulfilled' ? faqsResult.value : null
  );

  // ─── إعدادات التصميم ──────────────────────────
  const sliderAutoplay      = designSettings?.slider?.autoplay      ?? true;
  const sliderAutoplayDelay = designSettings?.slider?.autoplay_delay ?? 5000;

  // ─── Debug (development only) ─────────────────
  if (process.env.NODE_ENV === 'development') {
    const counts = {
      slides:       heroSlidesData.length,
      services:     servicesData.length,
      projects:     projectsData.length,
      testimonials: testimonialsData.length,
      partners:     partnersData.length,
      blogs:        blogsData.length,
      faqs:         faqsData.length,
    };

    // ✅ إصلاح: استخدام النتائج الأصلية للأخطاء
    const allResults = [
      { name: 'Settings',      result: settingsResult },
      { name: 'Design',        result: designSettingsResult },
      { name: 'Hero Slides',   result: heroSlidesResult },
      { name: 'Services',      result: servicesResult },
      { name: 'Projects',      result: projectsResult },
      { name: 'Testimonials',  result: testimonialsResult },
      { name: 'Partners',      result: partnersResult },
      { name: 'Blogs',         result: blogsResult },
      { name: 'FAQs',          result: faqsResult },
    ];

    const failed = allResults.filter(({ result }) => result.status === 'rejected');

    console.log(`\n🏠 Homepage: ${Object.values(counts).reduce((a, b) => a + b, 0)} items loaded`);
    console.table(counts);

    if (failed.length > 0) {
      failed.forEach(({ name, result }) => {
        const reason = (result as PromiseRejectedResult).reason;
        console.error(`❌ ${name}:`, reason?.message || reason);
      });
    }
  }

  // ════════════════════════════════════════════════
  // 🎨 Render
  // ════════════════════════════════════════════════
  return (
    <>
      <JsonLd settings={settings} pageType="home" />

      {/* Hero */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider
          slides={heroSlidesData}
          settings={settings}
          autoplay={sliderAutoplay}
          autoplayDelay={sliderAutoplayDelay}
        />
      </Suspense>

      {/* Stats */}
      <Suspense fallback={<SectionSkeleton height="250px" />}>
        <StatsCounter settings={settings} />
      </Suspense>

      {/* Categories */}
      <Suspense fallback={<SectionSkeleton height="350px" />}>
        <CategoriesSection />
      </Suspense>

      {/* Services */}
      {servicesData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <ServicesGrid services={servicesData} />
        </Suspense>
      )}

      {/* Why Choose Us */}
      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <WhyChooseUs />
      </Suspense>

      {/* Projects */}
      {projectsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <FeaturedProjects projects={projectsData} />
        </Suspense>
      )}

      {/* Process */}
      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <ProcessSteps />
      </Suspense>

      {/* Gallery */}
      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <GallerySection />
      </Suspense>

      {/* Testimonials */}
      {testimonialsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          {/* ✅ مرر البيانات للمكون أو دعه يجلبها بنفسه */}
          <Testimonials featured={false} limit={12} />
        </Suspense>
      )}

      {/* FAQs */}
      {faqsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <FAQAccordion faqs={faqsData} />
        </Suspense>
      )}

      {/* Partners */}
      {partnersData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="300px" />}>
          <Partners
            partners={partnersData}
            autoplayInterval={sliderAutoplayDelay}
          />
        </Suspense>
      )}

      {/* Blog */}
      {blogsData.length > 0 && (
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <LatestBlog blogs={blogsData} />
        </Suspense>
      )}

      {/* CTA */}
      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <CTASection />
      </Suspense>
    </>
  );
}