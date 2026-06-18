import type { Metadata } from 'next';
import Link from 'next/link';

// 🎯 SEO - النظام الموحد
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { getSiteSettings } from '@/lib/settings';

// ════════════════════════════════════════════════
// 📝 SEO Metadata - النظام الموحد
// ════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return generateSEO({
    settings,
    type: 'website',
    title: 'سياسة الخصوصية',
    description: 'سياسة الخصوصية لموقع شركة البناء المتميز للمقاولات العامة. تعرف على كيفية جمع واستخدام وحماية معلوماتك الشخصية.',
    keywords: ['سياسة الخصوصية', 'خصوصية', 'حماية البيانات', 'معلومات شخصية', 'شروط الاستخدام', 'مقاولات'],
    url: '/privacy',
  });
}

// ════════════════════════════════════════════════
// ⚡ ISR - إعادة التحقق كل 24 ساعة
// ════════════════════════════════════════════════
export const revalidate = 86400; // 24 ساعة

// ════════════════════════════════════════════════
// 🖥️ الصفحة الرئيسية (Server Component)
// ════════════════════════════════════════════════
export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  
  // ─── Breadcrumbs ───
  const breadcrumbs = buildBreadcrumb(
    { name: 'سياسة الخصوصية', url: '/privacy' }
  );

  // ─── تاريخ التحديث ───
  const lastUpdated = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* ═══════════════════════════════════════
          🎯 JSON-LD Schemas (Server-Side)
          ═══════════════════════════════════════ */}
      
      {/* Organization + WebSite + WebPage + Breadcrumbs */}
      <JsonLd 
        settings={settings}
        pageType="about"  // ✅ تغيير من "privacy" إلى "about" لأن JsonLd لا يدعم "privacy"
        pageTitle="سياسة الخصوصية"
        pageDescription="سياسة الخصوصية لموقع شركة البناء المتميز للمقاولات العامة"
        pageUrl="/privacy"
        breadcrumbs={breadcrumbs}
      />
      
      {/* Breadcrumb Component */}
      <Breadcrumb items={breadcrumbs} variant="dark" />

      <div>
        {/* ═══════════════════════════════════════
            🎬 Hero Section
            ═══════════════════════════════════════ */}
        <section style={{
          background:'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
          color:'white', padding:'4rem 0 5rem',
          position:'relative', overflow:'hidden'
        }}>
          <div className="container-custom" style={{position:'relative', zIndex:1, textAlign:'center'}}>
            <span className="section-badge"
                  style={{background:'rgba(237,137,54,0.15)', color:'#fbd38d'}}>
              🔒 الخصوصية
            </span>
            <h1 style={{
              fontSize:'clamp(2rem, 4vw, 2.75rem)',
              fontWeight:'900', marginBottom:'0.75rem'
            }}>
              سياسة الخصوصية
            </h1>
            <p style={{color:'#cbd5e0', fontSize:'1rem'}}>
              آخر تحديث: {lastUpdated}
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
            📝 المحتوى
            ═══════════════════════════════════════ */}
        <section className="section-padding" style={{background:'#f8faff'}}>
          <div className="container-custom" style={{maxWidth:'52rem'}}>
            <div style={{
              background:'white', borderRadius:'1.5rem', padding:'2.5rem',
              boxShadow:'0 4px 20px rgba(0,0,0,0.04)'
            }}>
              <Section title="🔐 مقدمة">
                في شركة البناء المتميز للمقاولات العامة، نحن نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية.
                توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدام موقعنا.
              </Section>

              <Section title="📋 المعلومات التي نجمعها">
                <ul style={listStyle}>
                  <li>الاسم ومعلومات الاتصال (الهاتف، البريد الإلكتروني)</li>
                  <li>تفاصيل المشاريع والاستفسارات</li>
                  <li>عنوان IP وبيانات المتصفح</li>
                  <li>معلومات الموقع الجغرافي (اختياري)</li>
                  <li>سجلات المحادثات والتواصل</li>
                </ul>
              </Section>

              <Section title="🎯 كيف نستخدم معلوماتك">
                <ul style={listStyle}>
                  <li>الرد على استفساراتك وتقديم عروض الأسعار</li>
                  <li>تحسين خدماتنا وتجربة المستخدم</li>
                  <li>إرسال التحديثات والعروض الترويجية (بموافقتك)</li>
                  <li>الامتثال للمتطلبات القانونية والتنظيمية</li>
                </ul>
              </Section>

              <Section title="🛡️ حماية المعلومات">
                نتخذ إجراءات أمنية صارمة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح.
                نستخدم تشفير SSL لجميع البيانات المنقولة عبر موقعنا.
              </Section>

              <Section title="🍪 ملفات تعريف الارتباط (Cookies)">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في هذه الملفات
                من خلال إعدادات متصفحك.
              </Section>

              <Section title="📞 اتصل بنا">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة{' '}
                <Link href="/contact" style={{color:'#1a365d', fontWeight:'700'}}>
                  التواصل معنا
                </Link>.
              </Section>
            </div>
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
        .section-padding {
          padding: 4rem 0;
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

// ════════════════════════════════════════════════
// 🧩 Section Component
// ════════════════════════════════════════════════
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{marginBottom:'2rem'}}>
      <h2 style={{
        fontSize:'1.375rem', fontWeight:'800',
        color:'#0f172a', marginBottom:'0.875rem'
      }}>
        {title}
      </h2>
      <div style={{color:'#475569', lineHeight:'1.9', fontSize:'1rem'}}>
        {children}
      </div>
    </div>
  );
}

const listStyle: React.CSSProperties = {
  paddingRight:'1.5rem', display:'flex',
  flexDirection:'column', gap:'0.5rem'
};