import type { Metadata } from 'next';
import Link from 'next/link';

// 🎯 SEO - النظام الموحد
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { getSiteSettings } from '@/lib/settings';
import { api } from '@/lib/api';

// 🧩 Components
import TestimonialCard from '@/components/home/Testimonials';

// ════════════════════════════════════════════════
// 📝 SEO Metadata - النظام الموحد
// ════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return generateSEO({
    settings,
    type: 'website',
    title: 'آراء العملاء | تجارب عملاء شركة البناء المتميز',
    description: 'اقرأ آراء وتجارب عملاء شركة البناء المتميز. تعرف على قصص نجاح مشاريعنا وخدماتنا من وجهة نظر عملائنا.',
    keywords: ['آراء العملاء', 'تجارب العملاء', 'شهادات', 'تقييمات', 'مقاولات', 'بناء', 'خدمات'],
    url: '/testimonials',
  });
}

// ════════════════════════════════════════════════
// ⚡ ISR - إعادة التحقق كل دقيقة
// ════════════════════════════════════════════════
export const revalidate = 60;

// ════════════════════════════════════════════════
// 🛠️ Helper: استخراج البيانات من API
// ════════════════════════════════════════════════
function extractTestimonials(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
  if (raw.items && Array.isArray(raw.items)) return raw.items;
  if (raw.results && Array.isArray(raw.results)) return raw.results;
  return [];
}

// ════════════════════════════════════════════════
// 🖥️ الصفحة الرئيسية (Server Component)
// ════════════════════════════════════════════════
export default async function TestimonialsPage() {
  const [settings, testimonialsRaw] = await Promise.all([
    getSiteSettings(),
    api.testimonials().catch(() => []),
  ]);

  // ─── استخراج البيانات بأمان ───
  const testimonialsData = extractTestimonials(testimonialsRaw);

  // ─── Breadcrumbs ───
  const breadcrumbs = buildBreadcrumb(
    { name: 'آراء العملاء', url: '/testimonials' }
  );

  return (
    <>
      {/* ═══════════════════════════════════════
          🎯 JSON-LD Schemas (Server-Side)
          ═══════════════════════════════════════ */}
      <JsonLd 
        settings={settings}
        pageType="about"
        pageTitle="آراء العملاء"
        pageDescription="تجارب عملاء شركة البناء المتميز"
        pageUrl="/testimonials"
        breadcrumbs={breadcrumbs}
      />
      
      {/* Breadcrumb Component */}
      <Breadcrumb items={breadcrumbs} variant="dark" />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        color: 'white',
        padding: '4rem 0 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container-custom" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span className="section-badge"
                style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}>
            💬 آراء العملاء
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '900',
            marginBottom: '1rem'
          }}>
            ماذا يقول <span className="text-gradient-orange">عملاؤنا</span>
          </h1>
          <p style={{
            color: '#cbd5e0',
            fontSize: '1.125rem',
            maxWidth: '40rem',
            margin: '0 auto'
          }}>
            آراء وتجارب حقيقية من عملائنا الكرام
          </p>
          
          {/* ✅ زر إضافة رأي - بدون Event Handlers */}
          <Link 
            href="/testimonials/add"
            className="add-testimonial-btn"
            style={{
              display: 'inline-block',
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              background: '#f59e0b',
              color: 'white',
              borderRadius: '2rem',
              textDecoration: 'none',
              fontWeight: '700',
              transition: 'all 0.3s ease',
            }}
          >
            ✍️ أضف رأيك
          </Link>
        </div>
        
        {/* Wave Decoration */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
               style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
          </svg>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-padding" style={{ background: '#f8faff' }}>
        <div className="container-custom">
          {testimonialsData.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                لا توجد آراء حالياً
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                كن أول من يشاركنا رأيه وتجربته
              </p>
              <Link 
                href="/testimonials/add"
                className="empty-cta"
                style={{
                  padding: '0.75rem 2rem',
                  background: '#f59e0b',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                }}
              >
                أضف رأيك الآن
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {testimonialsData.map((testimonial: any, index: number) => (
                <TestimonialCard 
                  key={testimonial.id || index}
                  {...testimonial}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .section-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: linear-gradient(135deg, rgba(237,137,54,0.15), rgba(237,137,54,0.05));
          color: #ed8936;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .text-gradient-orange {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .section-padding {
          padding: 4rem 0;
        }
        
        /* ✅ CSS Styles بدلاً من Event Handlers */
        .add-testimonial-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
        }
        
        .empty-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }
        
        @media (max-width: 768px) {
          .section-padding {
            padding: 2rem 0;
          }
        }
      `}</style>
    </>
  );
}