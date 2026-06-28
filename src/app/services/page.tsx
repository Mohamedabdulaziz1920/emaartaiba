// src/app/services/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { extractArray } from '@/lib/typeSafe';

// 🧩 Components
import ServiceCard from '@/components/services/ServiceCard';
import ServicesFilter from '@/components/services/ServicesFilter';

// ════════════════════════════════════════════
// ⚙️ Config
// ════════════════════════════════════════════
export const revalidate = 300;

// ════════════════════════════════════════════
// 📝 Metadata
// ════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return generateSEO({
    title: 'خدماتنا | مقاولات عامة وتشطيبات',
    description: 'نقدم مجموعة متكاملة من خدمات المقاولات العامة والتشطيبات والدهانات والديكورات بأعلى معايير الجودة',
    keywords: ['مقاولات', 'تشطيبات', 'دهانات', 'ديكورات', 'بناء فلل', 'ترميم'],
    url: '/services',
    image: settings?.site_logo,
    settings,
  });
}

// ════════════════════════════════════════════
// 🎨 Skeleton
// ════════════════════════════════════════════
function ServicesSkeleton() {
  return (
    <div className="services-grid">
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
export default async function ServicesPage() {
  const [settings, servicesResponse] = await Promise.all([
    getSiteSettings(),
    api.services().catch(() => ({ success: false, data: [] })),
  ]);

  const services = extractArray(servicesResponse);
  const categories = extractArray(
    services
      .map((s: any) => s.category)
      .filter(Boolean)
      .filter((cat: any, i: number, self: any[]) => 
        self.findIndex((c: any) => c.id === cat.id) === i
      )
  );

  const breadcrumbs = buildBreadcrumb({ name: 'خدماتنا', url: '/services' });

  return (
    <div className="services-page">
      {/* ═══ JSON-LD ═══ */}
      <JsonLd 
        settings={settings} 
        pageType="services"
        pageTitle="خدماتنا"
        pageDescription="نقدم مجموعة متكاملة من خدمات المقاولات العامة"
        pageUrl="/services"
      />

      {/* ═══ Hero ═══ */}
      <section className="services-hero">
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <div className="hero-content">
            <span className="hero-badge">⚡ خدماتنا</span>
            <h1 className="hero-title">
              خدمات <span className="text-gradient-orange">مقاولات شاملة</span>
            </h1>
            <p className="hero-subtitle">
              نقدم مجموعة متكاملة من خدمات المقاولات العامة بأعلى معايير الجودة والاحترافية
            </p>
          </div>
        </div>
        <div className="wave-decoration">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff" />
          </svg>
        </div>
      </section>

      {/* ═══ Services ═══ */}
      <section className="services-section">
        <div className="container-custom">
          <Suspense fallback={<ServicesSkeleton />}>
            {services.length > 0 ? (
              <ServicesFilter 
                services={services} 
                categories={categories}
                initialCategory="all"
              />
            ) : (
              <EmptyState />
            )}
          </Suspense>
        </div>
      </section>

      <style>{`
        .services-page { min-height: 100vh; background: #f8faff; }
        
        .services-hero {
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
          margin: 0 auto;
          line-height: 1.8;
        }
        .wave-decoration {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          line-height: 0;
        }
        .wave-decoration svg { display: block; width: 100%; height: 60px; }
        
        .services-section { padding: 4rem 0 5rem; }
        
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .services-grid { grid-template-columns: repeat(3, 1fr); }
        }
        
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border-radius: 1rem;
        }
        .empty-icon { font-size: 5rem; margin-bottom: 1rem; }
        .empty-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
        .empty-desc { color: #64748b; margin-bottom: 1.5rem; }
        .empty-btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          border-radius: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .empty-btn:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════
// 📭 Empty State
// ════════════════════════════════════════════
function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">🛠️</div>
      <h3 className="empty-title">لا توجد خدمات متاحة حالياً</h3>
      <p className="empty-desc">نحن نعمل على إضافة خدماتنا الجديدة. تابعونا قريباً!</p>
      <Link href="/contact" className="empty-btn">💬 تواصل معنا</Link>
    </div>
  );
}
