import { api } from '@/lib/api';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مناطق خدماتنا',
  description: 'نقدم خدمات المقاولات في جميع مناطق المملكة العربية السعودية.',
};

const AREA_GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#30cfd0,#330867)',
];

export default async function AreasPage() {
  const areas = await api.areas().catch(() => []);

  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        color: 'white', padding: '5rem 0 6rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div className="container-custom" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span className="section-badge animate-fadeInUp"
                style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}>
            📍 مناطق خدماتنا
          </span>
          <h1 className="animate-fadeInUp animation-delay-100" style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: '900', marginBottom: '1rem'
          }}>
            نخدم <span className="text-gradient-orange">جميع مناطق المملكة</span>
          </h1>
          <p className="animate-fadeInUp animation-delay-200" style={{
            color: '#cbd5e0', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto'
          }}>
            فروعنا في جميع أنحاء المملكة لخدمتك أينما كنت
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
               style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff" />
          </svg>
        </div>
      </section>

      <section className="section-padding" style={{ background: '#f8faff' }}>
        <div className="container-custom">
          <div className="grid-3">
            {(areas as any[]).map((a: any, i: number) => (
              <Link key={a.id} href={`/areas/${a.slug}`} className="card-pro" style={{
                background: 'white', borderRadius: '1.5rem', overflow: 'hidden',
                textDecoration: 'none', border: '1px solid #e8edf5',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}>
                <div style={{
                  height: '10rem',
                  background: AREA_GRADIENTS[i % AREA_GRADIENTS.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '4rem' }}>📍</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                    {a.name_ar}
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {a.region_ar}
                  </p>
                  {a.description_ar && (
                    <p className="line-clamp-2" style={{
                      color: '#64748b', fontSize: '0.875rem', lineHeight: '1.6',
                      marginBottom: '1rem'
                    }}>
                      {a.description_ar}
                    </p>
                  )}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#1a365d',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    اعرف المزيد ←
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
