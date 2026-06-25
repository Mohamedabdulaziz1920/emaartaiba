// frontend/src/app/about/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd }    from '@/components/seo/JsonLd';
import Breadcrumb    from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api }             from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { toStr }           from '@/lib/typeSafe'; // ✅ حذف toUndefined وtoArray

// ✅ CSS منفصل
import styles from './about.module.css';

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════
interface VisionMissionValue {
  icon:        string;
  title:       string;
  description: string;
}

interface StatItem {
  num:   string;
  label: string;
}

interface HeroSection {
  badge:       string;
  title:       string;
  subtitle:    string;
  description: string;
  image:       string | null;
}

interface StorySection {
  badge:   string;
  title:   string;
  content: string;
  image:   string | null;
}

interface CTASection {
  title:       string;
  subtitle:    string;
  button_text: string;
  button_link: string;
}

interface SEOSection {
  title:       string;
  description: string;
  keywords:    string;
}

interface AboutPageData {
  hero:                  HeroSection;
  story:                 StorySection;
  vision_mission_values: VisionMissionValue[];
  stats:                 StatItem[];
  cta:                   CTASection;
  seo:                   SEOSection;
}

// ════════════════════════════════════════════════
// 🛠️ Helper
// ════════════════════════════════════════════════
async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const data = await api.about();
    return data as AboutPageData | null;
  } catch (error) {
    console.error('❌ Error fetching about page:', error);
    return null;
  }
}

// ════════════════════════════════════════════════
// ⚙️ Config
// ════════════════════════════════════════════════
export const revalidate = 300; // ✅ 300 بدلاً من 60

// ════════════════════════════════════════════════
// 📝 generateMetadata
// ════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  const [settings, aboutData] = await Promise.all([
    getSiteSettings(),
    getAboutPageData(),
  ]);

  if (!aboutData) {
    return generateSEO({
      settings,
      type:  'website',
      title: 'من نحن',
      // ✅ وصف من settings بدلاً من نص ثابت خاص بنشاط
      description: toStr(settings?.site_description_ar) ||
                   toStr(settings?.site_description)    ||
                   '',
      url: '/about',
    });
  }

  const metaTitle       = toStr(aboutData.seo?.title)       ||
                          toStr(aboutData.hero?.title)       ||
                          'من نحن';
  const metaDescription = toStr(aboutData.seo?.description) ||
                          toStr(aboutData.hero?.description) ||
                          '';
  const metaKeywords    = aboutData.seo?.keywords
    ? aboutData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : [];

  return generateSEO({
    settings,
    type:        'website',
    title:       metaTitle,
    description: metaDescription,
    keywords:    metaKeywords,
    url:         '/about',
    image:       aboutData.hero?.image || undefined,
  });
}

// ════════════════════════════════════════════════
// 🖥️ Page Component
// ════════════════════════════════════════════════
export default async function AboutPage() {
  const [settings, aboutData] = await Promise.all([
    getSiteSettings(),
    getAboutPageData(),
  ]);

  if (!aboutData) notFound();

  // ─── Breadcrumbs ──────────────────────────────
  const breadcrumbs = buildBreadcrumb(
    { name: 'من نحن', url: '/about' }
  );

  // ─── Hero ──────────────────────────────────────
  const heroBadge       = toStr(aboutData.hero?.badge);
  const heroTitle       = toStr(aboutData.hero?.title);
  const heroSubtitle    = toStr(aboutData.hero?.subtitle);
  const heroDescription = toStr(aboutData.hero?.description);
  const heroImage       = aboutData.hero?.image || null;

  // ─── Story ─────────────────────────────────────
  const storyBadge   = toStr(aboutData.story?.badge);
  const storyTitle   = toStr(aboutData.story?.title);
  const storyContent = toStr(aboutData.story?.content);
  const storyImage   = aboutData.story?.image || null;

  // ─── VMV ───────────────────────────────────────
  const visionMissionValues = aboutData.vision_mission_values || [];

  // ─── Stats ─────────────────────────────────────
  const stats = aboutData.stats || [];

  // ─── CTA ───────────────────────────────────────
  const ctaTitle      = toStr(aboutData.cta?.title);
  const ctaSubtitle   = toStr(aboutData.cta?.subtitle);
  const ctaButtonText = toStr(aboutData.cta?.button_text) || 'تواصل معنا';
  const ctaButtonLink = toStr(aboutData.cta?.button_link) || '/contact';

  // ─── site name ─────────────────────────────────
  const siteName = toStr(settings?.site_name_ar) ||
                   toStr(settings?.site_name)     ||
                   '';

  // ════════════════════════════════════════════════
  // 🎨 Render
  // ════════════════════════════════════════════════
  return (
    <>
      {/* ═══ SEO Schemas ═══ */}
      {/* ✅ JsonLd مضاف */}
      <JsonLd
        settings={settings}
        pageType="about"
        pageTitle={heroTitle || 'من نحن'}
        pageDescription={heroDescription || undefined}
        pageUrl="/about"
        pageImage={heroImage || undefined}
        breadcrumbs={breadcrumbs}
      />

      <div>

        {/* ═══ Hero ═══ */}
        <section
          className={styles.hero}
          style={heroImage ? {
            backgroundImage: `linear-gradient(135deg, #0f1729cc, #1a365dcc), url(${heroImage})`,
          } : undefined}
        >
          <div className={`container-custom ${styles.heroInner}`}>

            {/* ✅ Breadcrumb داخل Hero */}
            <Breadcrumb items={breadcrumbs} variant="dark" />

            <div className={styles.heroContent}>
              {heroBadge && (
                <span className={styles.heroBadge}>{heroBadge}</span>
              )}

              <h1 className={styles.heroTitle}>
                {heroSubtitle && <>{heroSubtitle} </>}
                {heroTitle && (
                  <span className={styles.gradientOrange}>{heroTitle}</span>
                )}
              </h1>

              {heroDescription && (
                <p className={styles.heroDesc}>{heroDescription}</p>
              )}
            </div>
          </div>

          <div className={styles.wave}>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path
                d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z"
                fill="#f8faff"
              />
            </svg>
          </div>
        </section>

        {/* ═══ Story ═══ */}
        {(storyBadge || storyTitle || storyContent) && (
          <section className={`section-padding ${styles.storySection}`}>
            <div className={`container-custom ${styles.storyContainer}`}>
              {storyBadge && (
                <span className={styles.badge}>{storyBadge}</span>
              )}
              {storyTitle && (
                <h2 className={styles.sectionTitle}>{storyTitle}</h2>
              )}

              {/* ✅ Next.js Image */}
              {storyImage && (
                <div className={styles.storyImageWrapper}>
                  <Image
                    src={storyImage}
                    alt={storyTitle || 'قصتنا'}
                    width={800}
                    height={450}
                    className={styles.storyImage}
                  />
                </div>
              )}

              {storyContent && (
                <div
                  className={`rich-content ${styles.storyContent}`}
                  dangerouslySetInnerHTML={{ __html: storyContent }}
                />
              )}
            </div>
          </section>
        )}

        {/* ═══ Vision / Mission / Values ═══ */}
        {visionMissionValues.length > 0 && (
          <section className={`section-padding ${styles.vmvSection}`}>
            <div className="container-custom">
              <div className={styles.sectionHeader}>
                {/* ✅ نص قابل للتخصيص من API (إذا أضفناه) */}
                <span className={styles.badge}>⭐ رؤيتنا ورسالتنا</span>
                <h2 className={styles.sectionTitle}>ما الذي يحركنا؟</h2>
              </div>

              <div className={styles.vmvGrid}>
                {visionMissionValues.map((item, i) => (
                  <div key={i} className={styles.vmvCard}>
                    <div className={styles.vmvIcon}>{item.icon}</div>
                    <h3 className={styles.vmvTitle}>{item.title}</h3>
                    <p className={styles.vmvDesc}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ Stats ═══ */}
        {stats.length > 0 && (
          <section className={styles.statsSection}>
            <div className="container-custom">
              <div className={styles.statsGrid}>
                {stats.map((stat, i) => (
                  <div key={i} className={styles.statItem}>
                    <div className={`${styles.statNum} ${styles.gradientOrange}`}>
                      {stat.num}
                    </div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ CTA ═══ */}
        {(ctaTitle || ctaSubtitle) && (
          <section className={`section-padding ${styles.ctaSection}`}>
            <div className="container-custom">
              {ctaTitle && (
                <h2 className={styles.sectionTitle}>{ctaTitle}</h2>
              )}
              {ctaSubtitle && (
                <p className={styles.sectionDesc}>{ctaSubtitle}</p>
              )}
              <Link href={ctaButtonLink} className="btn btn-primary">
                {ctaButtonText}
              </Link>
            </div>
          </section>
        )}

      </div>
    </>
  );
}