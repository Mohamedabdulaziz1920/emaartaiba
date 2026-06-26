// src/app/projects/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api, Project } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { extractArray, toStr } from '@/lib/typeSafe';

// 🧩 Components
import ProjectFilter from '@/components/projects/ProjectFilter';
import ProjectsSlider from '@/components/projects/ProjectsSlider';

// ════════════════════════════════════════════
// ⚙️ Config
// ════════════════════════════════════════════
export const revalidate = 300; // ✅ 5 دقائق

// ════════════════════════════════════════════
// 📝 Metadata
// ════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return generateSEO({
    title: 'مشاريعنا المنجزة | معرض أعمالنا',
    description: 'تصفح مشاريعنا المنجزة في جميع مناطق السعودية. أكثر من 500 مشروع منجز بأعلى معايير الجودة.',
    keywords: ['مشاريع مقاولات', 'مشاريع منجزة', 'فلل سعودية', 'مشاريع تجارية', 'معرض أعمال'],
    url: '/projects',
    image: settings?.site_logo,
    settings,
  });
}

// ════════════════════════════════════════════
// 🎨 Skeletons
// ════════════════════════════════════════════
function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// 🖥️ Page Component
// ════════════════════════════════════════════
export default async function ProjectsPage() {
  const [settings, response] = await Promise.all([
    getSiteSettings(),
    api.projects().catch(() => ({ success: false, data: [] })),
  ]);

  const projects = extractArray(response?.data);
  const error = !response?.success && projects.length === 0;

  // Stats
  const stats = {
    total: projects.length,
    completed: projects.filter((p: Project) => p.status === 'completed').length,
    in_progress: projects.filter((p: Project) => p.status === 'in_progress').length,
    featured: projects.filter((p: Project) => p.is_featured).length,
    cities: new Set(projects.map((p: Project) => p.city).filter(Boolean)).size,
  };

  const featuredProjects = projects.filter((p: Project) => p.is_featured).slice(0, 10);
  const breadcrumbs = buildBreadcrumb({ name: 'المشاريع', url: '/projects' });

  return (
    <div className="projects-page">
      {/* ═══ JSON-LD ═══ */}
      <JsonLd 
        settings={settings} 
        pageType="projects"
        pageTitle="مشاريعنا المنجزة"
        pageDescription="تصفح مشاريعنا المنجزة في جميع مناطق السعودية"
        pageUrl="/projects"
      />

      {/* ═══ Hero ═══ */}
      <section className="projects-hero">
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <div className="hero-content">
            <span className="hero-badge">🏗️ مشاريعنا المنجزة</span>
            <h1 className="hero-title">
              مشاريع <span className="text-gradient-orange">نفخر بها</span>
            </h1>
            <p className="hero-subtitle">
              تعرّف على أبرز المشاريع التي نفذناها بأعلى معايير الجودة والاحترافية
            </p>
            {!error && projects.length > 0 && (
              <div className="hero-stats">
                <div className="stat-card">
                  <div className="stat-number">+{stats.total}</div>
                  <div className="stat-label">مشروع</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-card">
                  <div className="stat-number">+{stats.completed}</div>
                  <div className="stat-label">مكتمل</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-card">
                  <div className="stat-number">+{stats.cities}</div>
                  <div className="stat-label">مدينة</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="wave-decoration">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff" />
          </svg>
        </div>
      </section>

      {/* ═══ Featured Projects Slider ═══ */}
      {!error && featuredProjects.length >= 3 && (
        <section className="section-padding" style={{ paddingTop: '2rem', background: '#f8faff' }}>
          <div className="container-custom">
            <div className="slider-header">
              <h2 className="slider-header-title">⭐ مشاريعنا المميزة</h2>
              <p className="slider-header-desc">أبرز المشاريع التي نفخر بتنفيذها</p>
            </div>
            <Suspense fallback={<div className="h-80 bg-gray-200 rounded-xl animate-pulse" />}>
              <ProjectsSlider projects={featuredProjects} autoplayInterval={4000} />
            </Suspense>
          </div>
        </section>
      )}

      {/* ═══ Projects Filter ═══ */}
      <section className="section-padding projects-section">
        <div className="container-custom">
          <div className="projects-header">
            <h2 className="projects-title">جميع المشاريع</h2>
            <p className="projects-desc">استعرض جميع مشاريعنا المنجزة والقيد التنفيذ</p>
          </div>

          {error ? (
            <ErrorState message="حدث خطأ في تحميل المشاريع" />
          ) : projects.length > 0 ? (
            <Suspense fallback={<ProjectsSkeleton />}>
              <ProjectFilter projects={projects} />
            </Suspense>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      {!error && projects.length > 0 && (
        <section className="cta-section">
          <div className="container-custom">
            <div className="cta-card">
              <div className="cta-icon">🚀</div>
              <h2 className="cta-title">هل لديك مشروع تريد تنفيذه؟</h2>
              <p className="cta-description">تواصل معنا اليوم لمناقشة مشروعك والحصول على عرض سعر مجاني</p>
              <div className="cta-buttons">
                <Link href="/contact" className="cta-btn cta-btn-primary">📞 تواصل معنا</Link>
                <Link href="/quote-request" className="cta-btn cta-btn-secondary">📋 طلب عرض سعر</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .projects-page { min-height: 100vh; }
        .slider-header { text-align: center; margin-bottom: 2rem; }
        .slider-header-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
        .slider-header-desc { color: #64748b; font-size: 0.9375rem; }
        .projects-header { text-align: center; margin-bottom: 2.5rem; }
        .projects-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
        .projects-desc { color: #64748b; font-size: 0.9375rem; }
        
        .projects-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 4rem 0 6rem;
          position: relative;
          overflow: hidden;
        }
        .hero-content { text-align: center; margin-top: 2rem; }
        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: rgba(237, 137, 54, 0.15);
          color: #fbd38d;
          border: 1px solid rgba(237, 137, 54, 0.3);
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(8px);
        }
        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          margin: 0 0 1.5rem 0;
          line-height: 1.2;
        }
        .text-gradient-orange {
          background: linear-gradient(135deg, #f6ad55, #ed8936);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          color: #cbd5e0;
          font-size: 1.125rem;
          max-width: 42rem;
          margin: 0 auto 2.5rem;
          line-height: 1.8;
        }
        .hero-stats {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem 2rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          border-radius: 1.25rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .stat-card { text-align: center; min-width: 80px; }
        .stat-number { font-size: 1.75rem; font-weight: 900; color: #f6ad55; line-height: 1; margin-bottom: 0.35rem; }
        .stat-label { font-size: 0.8rem; color: #cbd5e0; font-weight: 600; }
        .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }
        .wave-decoration { position: absolute; bottom: 0; left: 0; right: 0; line-height: 0; }
        .wave-decoration svg { display: block; width: 100%; height: 60px; }
        
        .projects-section { background: #f8faff; min-height: 400px; }
        
        .cta-section { padding: 4rem 0; background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%); }
        .cta-card {
          background: linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%);
          color: white;
          padding: 4rem 2rem;
          border-radius: 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(26, 54, 93, 0.25);
        }
        .cta-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(237, 137, 54, 0.2), transparent 70%);
          border-radius: 50%;
        }
        .cta-icon { font-size: 4rem; margin-bottom: 1rem; position: relative; z-index: 1; }
        .cta-title { font-size: clamp(1.5rem, 4vw, 2.25rem); font-weight: 800; margin: 0 0 1rem 0; position: relative; z-index: 1; }
        .cta-description { font-size: 1.1rem; opacity: 0.95; max-width: 600px; margin: 0 auto 2rem; line-height: 1.7; position: relative; z-index: 1; }
        .cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .cta-btn-primary { background: linear-gradient(135deg, #ed8936, #dd6b20); color: white; }
        .cta-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(237, 137, 54, 0.4); }
        .cta-btn-secondary { background: white; color: #1a365d; }
        .cta-btn-secondary:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(255,255,255,0.25); }
        
        @media (max-width: 768px) {
          .projects-hero { padding: 3rem 0 5rem; }
          .hero-stats { gap: 1rem; padding: 1rem; width: 100%; }
          .stat-card { min-width: 65px; }
          .stat-number { font-size: 1.4rem; }
          .stat-divider { display: none; }
          .cta-card { padding: 3rem 1.5rem; }
          .cta-buttons { flex-direction: column; }
          .cta-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════
// 🚫 Error State
// ════════════════════════════════════════════
function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-red-100">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">عذراً! حدث خطأ</h3>
      <p className="text-red-500 font-semibold">{message}</p>
      <p className="text-gray-400 text-sm mt-2">يُرجى المحاولة مرة أخرى بعد قليل</p>
    </div>
  );
}

// ════════════════════════════════════════════
// 📭 Empty State
// ════════════════════════════════════════════
function EmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <div className="text-6xl mb-4">🏗️</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد مشاريع متاحة حالياً</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">نحن نعمل حالياً على إضافة مشاريعنا الجديدة. تابعونا قريباً!</p>
      <Link href="/contact" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl font-bold hover:shadow-lg transition-shadow">
        💬 تواصل معنا لمعرفة المزيد
      </Link>
    </div>
  );
}
