import { api } from '@/lib/api';
import type { Metadata } from 'next';
import Link from 'next/link';

// 🎯 SEO - النظام الموحد
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { getSiteSettings } from '@/lib/settings';

// 🧩 Components
import FAQClient from '@/components/shared/FAQClient';

// ════════════════════════════════════════════════
// 🛠️ Helper: استخراج البيانات من API (محلياً بدلاً من typeSafe)
// ════════════════════════════════════════════════
function extractArray<T = any>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.data?.data && Array.isArray(data.data.data)) return data.data.data;
  if (data.items && Array.isArray(data.items)) return data.items;
  if (data.results && Array.isArray(data.results)) return data.results;
  return [];
}

// ════════════════════════════════════════════════
// 📝 SEO Metadata - النظام الموحد
// ════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return generateSEO({
    settings,
    type: 'website',
    title: 'الأسئلة الشائعة',
    description: 'إجابات على أكثر الأسئلة شيوعاً حول خدمات المقاولات والبناء والتشطيبات في السعودية. استشارات مجانية وخبراء في مجال البناء.',
    keywords: ['أسئلة شائعة', 'FAQ', 'مقاولات', 'بناء', 'تشطيبات', 'استشارات', 'خدمات مقاولات', 'سؤال وجواب'],
    url: '/faq',
  });
}

// ════════════════════════════════════════════════
// ⚡ ISR - إعادة التحقق كل دقيقة
// ════════════════════════════════════════════════
export const revalidate = 60;

// ════════════════════════════════════════════════
// 🖥️ الصفحة الرئيسية (Server Component)
// ════════════════════════════════════════════════
export default async function FAQPage() {
  // ─── جلب البيانات بالتوازي ───
  const [settings, faqsRaw] = await Promise.all([
    getSiteSettings(),
    api.faqs().catch(() => []),
  ]);

  // ─── تطبيع بيانات الـ FAQ مع الحقول المطلوبة لـ FAQSchema ───
  const rawFaqs = extractArray(faqsRaw)
    .map((item: any) => ({
      id: item.id || Math.random(),
      question: item.question || item.question_ar || item.title || '',
      answer: item.answer || item.answer_ar || item.content || item.description || '',
    }))
    .filter((item: any) => item.question && item.answer);

  // ─── تحويل البيانات إلى الشكل المطلوب لـ FAQSchema ───
  const faqsForSchema = rawFaqs.map((item: any) => ({
    question_ar: item.question,
    answer_ar: item.answer,
    question_en: item.question_en || '',
    answer_en: item.answer_en || '',
  }));

  // ─── Breadcrumbs ───
  const breadcrumbs = buildBreadcrumb(
    { name: 'الأسئلة الشائعة', url: '/faq' }
  );

  return (
    <>
      {/* ═══════════════════════════════════════
          🎯 JSON-LD Schemas (Server-Side)
          ═══════════════════════════════════════ */}
      
      {/* Organization + WebSite + WebPage + Breadcrumbs */}
      <JsonLd 
        settings={settings}
        pageType="blog"
        pageTitle="الأسئلة الشائعة"
        pageDescription="إجابات على أكثر الأسئلة شيوعاً حول خدمات المقاولات والبناء"
        pageUrl="/faq"
        breadcrumbs={breadcrumbs}
      />
      
      {/* ✅ FAQ Schema المتخصص - مع البيانات بالشكل الصحيح */}
      {faqsForSchema.length > 0 && (
        <FAQSchema 
          faqs={faqsForSchema}
          title="الأسئلة الشائعة عن خدمات المقاولات والبناء"
          description="إجابات على أكثر الأسئلة شيوعاً حول خدمات المقاولات والبناء والتشطيبات"
        />
      )}
      
      {/* Breadcrumb Component */}
      <Breadcrumb items={breadcrumbs} variant="dark" />

      <div>
        {/* ═══════════════════════════════════════
            🎬 Hero Section
            ═══════════════════════════════════════ */}
        <section style={{
          background:'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
          color:'white', padding:'5rem 0 6rem',
          position:'relative', overflow:'hidden'
        }}>
          <div className="container-custom" style={{position:'relative', zIndex:1, textAlign:'center'}}>
            <span className="section-badge animate-fadeInUp"
                  style={{background:'rgba(237,137,54,0.15)', color:'#fbd38d'}}>
              ❓ الأسئلة الشائعة
            </span>
            <h1 className="animate-fadeInUp animation-delay-100" style={{
              fontSize:'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight:'900', marginBottom:'1rem'
            }}>
              إجابات على <span className="text-gradient-orange">أسئلتك</span>
            </h1>
            <p className="animate-fadeInUp animation-delay-200" style={{
              color:'#cbd5e0', fontSize:'1.125rem', maxWidth:'40rem', margin:'0 auto'
            }}>
              تعرف على إجابات أكثر الأسئلة شيوعاً
            </p>
          </div>
          <div style={{position:'absolute', bottom:0, left:0, right:0, lineHeight:0}}>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
                 style={{display:'block', width:'100%', height:'60px'}}>
              <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
            </svg>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            📝 FAQ Content
            ═══════════════════════════════════════ */}
        <section className="section-padding" style={{background:'#f8faff'}}>
          <div className="container-custom" style={{maxWidth:'52rem'}}>
            {rawFaqs.length > 0 ? (
              <FAQClient faqs={rawFaqs} />
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                  لا توجد أسئلة شائعة حالياً
                </h3>
                <p style={{ color: '#64748b' }}>
                  سيتم إضافة الأسئلة الشائعة قريباً
                </p>
                <Link 
                  href="/contact" 
                  style={{
                    display: 'inline-block',
                    marginTop: '1.5rem',
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #1a365d, #2b6cb0)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '700',
                  }}
                >
                  تواصل معنا
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

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
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .section-padding {
          padding: 4rem 0;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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