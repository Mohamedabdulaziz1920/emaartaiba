import { api } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props { params: Promise<{ city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const area     = await api.area(city).catch(() => null);
  if (!area) return { title: 'المنطقة غير موجودة' };
  return {
    title:       area.meta_title_ar    || `مقاولات ${area.name_ar}`,
    description: area.meta_description_ar || area.description_ar,
  };
}

export default async function AreaPage({ params }: Props) {
  const { city } = await params;
  const area     = await api.area(city).catch(() => null);
  if (!area) notFound();

  return (
    <div>
      <section style={{
        background:'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        color:'white', padding:'5rem 0 6rem',
        position:'relative', overflow:'hidden'
      }}>
        <div className="container-custom" style={{position:'relative', zIndex:1}}>
          <nav style={{color:'#90cdf4', fontSize:'0.875rem', marginBottom:'1.5rem'}}>
            <Link href="/" style={{color:'#90cdf4', textDecoration:'none'}}>الرئيسية</Link>
            <span style={{margin:'0 0.5rem'}}>›</span>
            <Link href="/areas" style={{color:'#90cdf4', textDecoration:'none'}}>المناطق</Link>
            <span style={{margin:'0 0.5rem'}}>›</span>
            <span style={{color:'white'}}>{area.name_ar}</span>
          </nav>

          <h1 style={{
            fontSize:'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight:'900', marginBottom:'1rem'
          }}>
            مقاولات <span className="text-gradient-orange">{area.name_ar}</span>
          </h1>
          {area.region_ar && (
            <p style={{color:'#90cdf4', fontSize:'1.125rem', marginBottom:'1rem'}}>
              📍 {area.region_ar}
            </p>
          )}
          {area.description_ar && (
            <p style={{color:'#cbd5e0', fontSize:'1.0625rem', lineHeight:'1.8', maxWidth:'48rem'}}>
              {area.description_ar}
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

      <section className="section-padding" style={{background:'#f8faff'}}>
        <div className="container-custom">
          <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'2rem'}} className="content-grid">
            <div style={{
              background:'white', borderRadius:'1.5rem', padding:'2.5rem',
              boxShadow:'0 4px 20px rgba(0,0,0,0.04)'
            }}>
              <h2 style={{fontSize:'1.5rem', fontWeight:'800', color:'#0f172a', marginBottom:'1rem'}}>
                خدماتنا في {area.name_ar}
              </h2>
              <p style={{color:'#475569', lineHeight:'1.9', marginBottom:'1.5rem'}}>
                نقدم في {area.name_ar} مجموعة شاملة من خدمات المقاولات العامة بأعلى معايير الجودة:
              </p>
              <ul style={{paddingRight:'1.5rem', color:'#475569', lineHeight:'2'}}>
                <li>🏠 بناء الفلل والقصور الفاخرة</li>
                <li>🏢 المشاريع التجارية والصناعية</li>
                <li>🎨 التشطيبات الداخلية والخارجية</li>
                <li>🔧 الترميم والصيانة الشاملة</li>
                <li>⚡ البنية التحتية والكهرومكانيكية</li>
              </ul>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              <div style={{
                background:'linear-gradient(135deg, #1a365d, #2b6cb0)',
                color:'white', borderRadius:'1.5rem', padding:'2rem',
                position:'sticky', top:'6rem'
              }}>
                <h3 style={{fontSize:'1.25rem', fontWeight:'800', marginBottom:'1rem'}}>
                  📞 تواصل مع فرع {area.name_ar}
                </h3>
                {area.office_address_ar && (
                  <p style={{color:'#cbd5e0', fontSize:'0.875rem', marginBottom:'0.75rem'}}>
                    📍 {area.office_address_ar}
                  </p>
                )}
                {area.office_phone && (
                  <a href={`tel:${area.office_phone}`} style={{
                    color:'#fbd38d', textDecoration:'none', display:'block',
                    fontSize:'1.125rem', fontWeight:'700', marginBottom:'1.5rem'
                  }}>
                    📞 {area.office_phone}
                  </a>
                )}
                <Link href="/contact" className="btn btn-secondary"
                      style={{width:'100%', justifyContent:'center'}}>
                  💬 احصل على عرض سعر
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .content-grid { grid-template-columns: 2fr 1fr !important; }
          }
        `}</style>
      </section>
    </div>
  );
}
