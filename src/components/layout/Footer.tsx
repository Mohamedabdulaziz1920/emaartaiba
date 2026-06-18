'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { settingsHelpers, type SiteSettings } from '@/lib/settings';
import NewsletterForm from '@/components/shared/NewsletterForm';
import { api } from '@/lib/api';

interface Props { 
  settings?: SiteSettings;
  navigation?: any[];
}

// أيقونات SVG مخصصة
const Facebook = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Twitter = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Linkedin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Youtube = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const MessageCircle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414z"/>
  </svg>
);

export default function Footer({ settings = {}, navigation = [] }: Props) {
  const [areas, setAreas] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [currentYear] = useState(new Date().getFullYear());

  const phone = settings.phone || settingsHelpers.defaults.phone;
  const email = settings.email || settingsHelpers.defaults.email;
  const address = settingsHelpers.fullAddress(settings) || settingsHelpers.defaults.address_ar;
  const siteName = settingsHelpers.siteName(settings);
  const workingHours = settings.working_hours || settingsHelpers.defaults.working_hours;
  const workingDays = settings.working_days || settingsHelpers.defaults.working_days;

  // جلب المناطق
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await api.areas();
        setAreas(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error('Failed to fetch areas:', error);
      }
    };
    fetchAreas();
  }, []);

  // جلب الخدمات
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.services();
        setServices(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  // الروابط السريعة الافتراضية
  const defaultQuickLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'عن الشركة', href: '/about' },
    { label: 'خدماتنا', href: '/services' },
    { label: 'مشاريعنا', href: '/projects' },
    { label: 'المدونة', href: '/blog' },
    { label: 'اتصل بنا', href: '/contact' },
  ];

  const quickLinks = navigation.length > 0 ? navigation : defaultQuickLinks;

  // روابط التواصل الاجتماعي
  const socialLinks = [
    { name: 'twitter', Icon: Twitter, url: settings.twitter, color: '#1DA1F2', label: 'تويتر' },
    { name: 'instagram', Icon: Instagram, url: settings.instagram, color: '#E4405F', label: 'انستقرام' },
    { name: 'facebook', Icon: Facebook, url: settings.facebook, color: '#1877F2', label: 'فيسبوك' },
    { name: 'linkedin', Icon: Linkedin, url: settings.linkedin, color: '#0A66C2', label: 'لينكدإن' },
    { name: 'youtube', Icon: Youtube, url: settings.youtube, color: '#FF0000', label: 'يوتيوب' },
  ].filter(s => s.url);

  const contactStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    textDecoration: 'none',
    color: 'inherit'
  };

  return (
    <footer style={{
      background: 'var(--footer-bg)',
      color: 'var(--footer-text)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* الشريط العلوي الملون */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'linear-gradient(90deg, var(--color-secondary), var(--color-secondary-light), var(--color-secondary))',
        backgroundSize: '200% 100%',
        animation: 'gradient-shift 3s ease infinite'
      }}/>

      {/* Newsletter */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(237,137,54,0.1), rgba(43,108,176,0.1))',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '2rem 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container-custom">
          <div className="newsletter-grid">
            <div>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                fontWeight: '800',
                color: 'var(--footer-text)',
                marginBottom: '0.375rem'
              }}>
                📬 اشترك في النشرة البريدية
              </h3>
              <p style={{ color: 'var(--footer-text)', opacity: 0.7, fontSize: '0.875rem' }}>
                احصل على آخر المقالات والعروض الحصرية
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container-custom" style={{ padding: '3rem 0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div className="footer-grid">
          {/* الشركة */}
          <div className="footer-col">
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              textDecoration: 'none', marginBottom: '1rem'
            }}>
              {settings.site_logo ? (
                <img src={settings.site_logo} alt={siteName}
                  style={{ height: '3rem', width: 'auto' }} />
              ) : (
                <div style={{
                  width: '2.75rem', height: '2.75rem',
                  background: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark))',
                  borderRadius: '0.625rem', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'var(--btn-primary-text)',
                  fontWeight: '900', fontSize: '1.25rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  flexShrink: 0
                }}>ب</div>
              )}
              <div>
                <div style={{ fontWeight: '800', fontSize: '1.0625rem', color: 'var(--footer-text)' }}>
                  {siteName.split('للمقاولات')[0].trim()}
                </div>
                <div style={{ color: 'var(--footer-text)', opacity: 0.6, fontSize: '0.6875rem' }}>
                  للمقاولات العامة
                </div>
              </div>
            </Link>
            <p style={{ color: 'var(--footer-text)', opacity: 0.7, fontSize: '0.8125rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
              {settings.site_description || `شركة مقاولات عامة رائدة في السعودية بخبرة تزيد عن 20 عاماً.`}
            </p>

            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {socialLinks.map((s) => (
                  <a key={s.name} href={s.url} aria-label={s.name}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
                      background: s.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', textDecoration: 'none', fontSize: '0.8125rem',
                      fontWeight: '700'
                    }}>
                    <s.Icon size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* روابط سريعة */}
          <div className="footer-col">
            <h3 className="footer-heading">روابط سريعة</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {quickLinks.map((item: any) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    <span className="footer-arrow">›</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الخدمات - ديناميكية من API */}
          <div className="footer-col">
            <h3 className="footer-heading">خدماتنا</h3>
            {services.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {services.map((s: any) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`} className="footer-link">
                      <span className="footer-arrow">›</span> {s.title_ar}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--footer-text)', opacity: 0.6, fontSize: '0.75rem' }}>
                لا توجد خدمات حالياً
              </p>
            )}
          </div>

          {/* التواصل */}
          <div className="footer-col">
            <h3 className="footer-heading">تواصل معنا</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <li>
                <a href={settingsHelpers.phoneLink(phone)} style={contactStyle}>
                  <span className="footer-icon">📞</span>
                  <div>
                    <div style={{ color: 'var(--footer-text)', opacity: 0.6, fontSize: '0.6875rem' }}>الهاتف</div>
                    <div style={{ color: 'var(--footer-text)', fontSize: '0.8125rem' }}>{phone}</div>
                  </div>
                </a>
              </li>
              <li>
                <a href={settingsHelpers.emailLink(email)} style={contactStyle}>
                  <span className="footer-icon">✉️</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ color: 'var(--footer-text)', opacity: 0.6, fontSize: '0.6875rem' }}>البريد</div>
                    <div style={{
                      color: 'var(--footer-text)', fontSize: '0.8125rem',
                      overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>{email}</div>
                  </div>
                </a>
              </li>
              <li style={contactStyle}>
                <span className="footer-icon">📍</span>
                <div>
                  <div style={{ color: 'var(--footer-text)', opacity: 0.6, fontSize: '0.6875rem' }}>العنوان</div>
                  <div style={{ color: 'var(--footer-text)', fontSize: '0.8125rem' }}>{address}</div>
                </div>
              </li>
              <li style={contactStyle}>
                <span className="footer-icon">🕐</span>
                <div>
                  <div style={{ color: 'var(--footer-text)', opacity: 0.6, fontSize: '0.6875rem' }}>ساعات العمل</div>
                  <div style={{ color: 'var(--footer-text)', fontSize: '0.8125rem' }}>{workingDays}<br />{workingHours}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* مناطق الخدمة - ديناميكية من API */}
        {areas.length > 0 && (
          <div style={{
            marginTop: '2rem', paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h4 style={{
              fontSize: '0.8125rem', fontWeight: '700', color: 'var(--footer-text)',
              marginBottom: '0.875rem', textAlign: 'center'
            }}>
              🌍 نخدم جميع مناطق المملكة
            </h4>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              justifyContent: 'center', gap: '0.5rem'
            }}>
              {areas.map((area: any) => (
                <Link key={area.id} href={`/areas/${area.slug}`} className="city-pill">
                  📍 {area.name_ar}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* الشريط السفلي */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.3)', position: 'relative', zIndex: 1
      }}>
        <div className="container-custom" style={{
          padding: '1rem 0',
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem'
        }}>
          <p style={{ color: 'var(--footer-text)', opacity: 0.7, fontSize: '0.8125rem', textAlign: 'center', width: '100%' }}>
            {settings.copyright_text || `© ${currentYear} ${siteName}. جميع الحقوق محفوظة.`}
          </p>

          {/* حقوق المبرمج */}
          <div style={{
            textAlign: 'center', width: '100%',
            fontSize: '0.7rem', opacity: 0.6, marginTop: '0.5rem'
          }}>
            تصميم وبرمجة :{' '}
            <a
              href="https://mohammed-almalgami.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--footer-text)',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              محمد الملجمي
            </a>
          </div>

          <div style={{
            display: 'flex', gap: '1.25rem', flexWrap: 'wrap',
            justifyContent: 'center', width: '100%'
          }}>
            <Link href="/privacy" className="bottom-link">سياسة الخصوصية</Link>
            <Link href="/terms" className="bottom-link">الشروط والأحكام</Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .newsletter-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .newsletter-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 640px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 2.5rem; }
        }

        .footer-heading {
          font-size: 0.9375rem;
          font-weight: 800;
          color: var(--footer-text);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--color-secondary);
          display: inline-block;
        }

        .footer-link {
          color: var(--footer-text);
          opacity: 0.8;
          text-decoration: none;
          font-size: 0.8125rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          transition: all 0.3s ease;
        }

        .footer-link:hover {
          color: var(--color-secondary);
          opacity: 1;
          transform: translateX(-3px);
        }

        .footer-arrow {
          color: var(--color-secondary);
        }

        .footer-icon {
          flex-shrink: 0;
          width: 2rem;
          height: 2rem;
          background: rgba(237, 137, 54, 0.15);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9375rem;
        }

        .city-pill {
          padding: 0.4rem 0.875rem;
          background: rgba(237, 137, 54, 0.1);
          border: 1px solid rgba(237, 137, 54, 0.2);
          border-radius: 9999px;
          color: var(--color-secondary-light);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .city-pill:hover {
          background: var(--color-secondary);
          color: var(--btn-primary-text);
          transform: translateY(-2px);
        }

        .bottom-link {
          color: var(--footer-text);
          opacity: 0.7;
          font-size: 0.8125rem;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .bottom-link:hover {
          opacity: 1;
          color: var(--color-secondary);
        }
      `}</style>
    </footer>
  );
}