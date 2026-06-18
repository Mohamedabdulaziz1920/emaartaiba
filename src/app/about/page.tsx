// frontend/src/app/about/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { toStr, toUndefined, toArray } from '@/lib/typeSafe';


// ════════════════════════════════════════════════
// 🎯 Types - متوافقة مع استجابة الـ API
// ════════════════════════════════════════════════
interface VisionMissionValue {
  icon: string;
  title: string;
  description: string;
}

interface StatItem {
  num: string;
  label: string;
}

interface HeroSection {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
}

interface StorySection {
  badge: string;
  title: string;
  content: string;
  image: string | null;
}

interface CTASection {
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
}

interface SEOSection {
  title: string;
  description: string;
  keywords: string;
}

interface AboutPageData {
  hero: HeroSection;
  story: StorySection;
  vision_mission_values: VisionMissionValue[];
  stats: StatItem[];
  cta: CTASection;
  seo: SEOSection;
}

// ════════════════════════════════════════════════
// 🛠️ Helper Functions
// ════════════════════════════════════════════════

/**
 * جلب بيانات صفحة من نحن من API
 * يستخدم الـ api.about() من ملف api.ts
 */
async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const data = await api.about();
    return data as AboutPageData | null;
  } catch (error) {
    console.error('Error fetching about page data:', error);
    return null;
  }
}

// ════════════════════════════════════════════════
// 📝 SEO Metadata
// ════════════════════════════════════════════════
export async function generateMetadata(): Promise<Metadata> {
  const [settings, aboutData] = await Promise.all([
    getSiteSettings(),
    getAboutPageData(),
  ]);

  // إذا لم تكن هناك بيانات، نستخدم الإعدادات العامة
  if (!aboutData) {
    return generateSEO({
      settings,
      type: 'website',
      title: 'من نحن',
      description: 'تعرف على شركة البناء المتميز للمقاولات العامة',
      url: '/about',
    });
  }

  const metaTitle = toStr(aboutData.seo?.title) || toStr(aboutData.hero?.title) || 'من نحن';
  const metaDescription = toStr(aboutData.seo?.description) || toStr(aboutData.hero?.description) || '';
  const metaKeywords = aboutData.seo?.keywords?.split(',').map(k => k.trim()) || [];

  return generateSEO({
    settings,
    type: 'website',
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    url: '/about',
  });
}

export const revalidate = 60;

// ════════════════════════════════════════════════
// 🖥️ الصفحة الرئيسية
// ════════════════════════════════════════════════
export default async function AboutPage() {
  const [settings, aboutData] = await Promise.all([
    getSiteSettings(),
    getAboutPageData(),
  ]);

  // إذا لم تكن هناك بيانات، نظهر 404
  if (!aboutData) {
    notFound();
  }

  // Breadcrumbs
  const breadcrumbs = buildBreadcrumb(
    { name: 'من نحن', url: '/about' },
  );

  // ─── استخراج البيانات من الـ API ───
  
  // Hero Section
  const heroBadge = toStr(aboutData.hero?.badge);
  const heroTitle = toStr(aboutData.hero?.title);
  const heroSubtitle = toStr(aboutData.hero?.subtitle);
  const heroDescription = toStr(aboutData.hero?.description);
  const heroImage = aboutData.hero?.image || null;

  // Story Section
  const storyBadge = toStr(aboutData.story?.badge);
  const storyTitle = toStr(aboutData.story?.title);
  const storyContent = toStr(aboutData.story?.content);
  const storyImage = aboutData.story?.image || null;

  // Vision, Mission, Values
  const visionMissionValues = aboutData.vision_mission_values || [];

  // Stats
  const stats = aboutData.stats || [];

  // CTA Section
  const ctaTitle = toStr(aboutData.cta?.title);
  const ctaSubtitle = toStr(aboutData.cta?.subtitle);
  const ctaButtonText = toStr(aboutData.cta?.button_text) || 'تواصل معنا';
  const ctaButtonLink = toStr(aboutData.cta?.button_link) || '/contact';

  // خلفية Hero
  const heroBgImage = heroImage 
    ? `linear-gradient(135deg, #0f1729cc, #1a365dcc), url(${heroImage})` 
    : 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)';

  return (
    <>
      {/* Breadcrumb Schema */}
      <Breadcrumb items={breadcrumbs} variant="dark" />

      <div>
        {/* ═══════════════════════════════════════
            🎬 Hero Section
            ═══════════════════════════════════════ */}
        <section style={{
          background: heroBgImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '5rem 0 6rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container-custom" style={{position:'relative', zIndex:1, textAlign:'center'}}>
            {heroBadge && (
              <span className="section-badge animate-fadeInUp"
                    style={{background:'rgba(212,175,55,0.15)', color:'#fbd38d'}}>
                {heroBadge}
              </span>
            )}
            <h1 className="animate-fadeInUp animation-delay-100" style={{
              fontSize:'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight:'900', marginBottom:'1rem'
            }}>
              {heroSubtitle && <>{heroSubtitle} </>}
              {heroTitle && <span className="text-gradient-orange">{heroTitle}</span>}
            </h1>
            {heroDescription && (
              <p className="animate-fadeInUp animation-delay-200" style={{
                color:'#cbd5e0', fontSize:'1.125rem', maxWidth:'42rem',
                margin:'0 auto', lineHeight:'1.8'
              }}>
                {heroDescription}
              </p>
            )}
          </div>
          <div style={{position:'absolute', bottom:0, left:0, right:0, lineHeight:0}}>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
                 style={{display:'block', width:'100%', height:'60px'}}>
              <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
            </svg>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            📖 Story Section
            ═══════════════════════════════════════ */}
        {(storyBadge || storyTitle || storyContent) && (
          <section className="section-padding" style={{background:'#f8faff'}}>
            <div className="container-custom" style={{maxWidth:'52rem', textAlign:'center'}}>
              {storyBadge && <span className="section-badge">{storyBadge}</span>}
              {storyTitle && <h2 className="section-title">{storyTitle}</h2>}
              {storyImage && (
                <div style={{
                  marginBottom: '2rem',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src={storyImage} 
                    alt={storyTitle}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              )}
              {storyContent && (
                <div 
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: storyContent }} 
                />
              )}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            ⭐ Vision, Mission, Values Section
            ═══════════════════════════════════════ */}
        {visionMissionValues.length > 0 && (
          <section className="section-padding" style={{background:'white'}}>
            <div className="container-custom">
              <div style={{textAlign:'center', marginBottom:'3rem'}}>
                <span className="section-badge">⭐ رؤيتنا ورسالتنا</span>
                <h2 className="section-title">ما الذي يحركنا؟</h2>
              </div>
              <div className="grid-3">
                {visionMissionValues.map((item, i) => (
                  <div key={i} className="card-pro hover-lift" style={{
                    background:'#f8faff', padding:'2.5rem 2rem',
                    textAlign:'center', borderRadius:'1.5rem',
                    border:'1px solid #e8edf5'
                  }}>
                    <div style={{
                      width:'5rem', height:'5rem', margin:'0 auto 1.25rem',
                      background:'linear-gradient(135deg, #1a365d, #2b6cb0)',
                      borderRadius:'1.25rem', display:'flex',
                      alignItems:'center', justifyContent:'center',
                      fontSize:'2.5rem',
                      boxShadow:'0 12px 30px rgba(26,54,93,0.25)'
                    }}>
                      {item.icon}
                    </div>
                    <h3 style={{fontSize:'1.5rem', fontWeight:'800', color:'#0f172a', marginBottom:'0.75rem'}}>
                      {item.title}
                    </h3>
                    <p style={{color:'#64748b', lineHeight:'1.8', fontSize:'0.9375rem'}}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            📊 Stats Section
            ═══════════════════════════════════════ */}
        {stats.length > 0 && (
          <section style={{
            background:'linear-gradient(135deg, #1a365d, #2b6cb0)',
            padding:'5rem 0', color:'white'
          }}>
            <div className="container-custom">
              <div className="grid-4">
                {stats.map((stat, i) => (
                  <div key={i} style={{textAlign:'center'}}>
                    <div className="text-gradient-orange" style={{
                      fontSize:'clamp(2.5rem, 6vw, 3.5rem)',
                      fontWeight:'900', lineHeight:'1', marginBottom:'0.5rem'
                    }}>
                      {stat.num}
                    </div>
                    <div style={{color:'#cbd5e0', fontWeight:'600', fontSize:'1rem'}}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            📞 CTA Section
            ═══════════════════════════════════════ */}
        {(ctaTitle || ctaSubtitle) && (
          <section className="section-padding" style={{background:'#f8faff', textAlign:'center'}}>
            <div className="container-custom">
              {ctaTitle && <h2 className="section-title">{ctaTitle}</h2>}
              {ctaSubtitle && <p className="section-desc" style={{marginBottom:'2rem'}}>{ctaSubtitle}</p>}
              <Link href={ctaButtonLink} className="btn btn-primary"
                    style={{padding:'1rem 2.5rem', display: 'inline-block'}}>
                {ctaButtonText}
              </Link>
            </div>
          </section>
        )}
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
          letter-spacing: 0.5px;
        }
        
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        
        .section-desc {
          color: #64748b;
          font-size: 1.0625rem;
          max-width: 42rem;
          margin: 0 auto;
          line-height: 1.8;
        }
        
        .text-gradient-orange {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        
        .rich-content p {
          color: #475569;
          line-height: 1.9;
          font-size: 1.0625rem;
          margin-bottom: 1rem;
        }
        
        .rich-content h2, .rich-content h3 {
          color: #0f172a;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
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
        
        .btn-primary {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
          padding: 0.85rem 2rem;
          border-radius: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(237, 137, 54, 0.3);
        }
        
        @media (max-width: 768px) {
          .grid-3, .grid-4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}