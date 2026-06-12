'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/components/shared/ContactForm';
import { api } from '@/lib/api';

// ════════════════════════════════════════════════
// 📝 Types
// ════════════════════════════════════════════════
interface ContactPageInfo {
  id?: number;
  phone_1: string;
  phone_2: string;
  whatsapp: string;

  email_1: string;
  email_2: string;

  address_ar: string;
  address_en: string;

  working_days_ar: string;
  working_days_en: string;
  working_hours: string;

  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;

  map_embed_code: string;
  latitude: string;
  longitude: string;
}

interface ContactCard {
  icon: string;
  title: string;
  value: string;
  href: string;
  color: string;
}

interface SocialLink {
  name: string;
  url: string;
  color: string;
  icon: string;
}

// ════════════════════════════════════════════════
// 🛠️ Defaults
// ════════════════════════════════════════════════
const defaultContactInfo: ContactPageInfo = {
  id: 0,

  phone_1: '+966 00 000 0000',
  phone_2: '',
  whatsapp: '',

  email_1: 'info@example.com',
  email_2: '',

  address_ar: 'المملكة العربية السعودية',
  address_en: '',

  working_days_ar: 'السبت - الخميس',
  working_days_en: '',
  working_hours: '9:00 صباحاً - 6:00 مساءً',

  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',

  map_embed_code: '',
  latitude: '',
  longitude: '',
};

// ════════════════════════════════════════════════
// 🛠️ Normalizer
// ════════════════════════════════════════════════
function normalizeContactInfo(raw: any): ContactPageInfo {
  const data = raw?.data ?? raw;
  const item = Array.isArray(data) ? data[0] : data;

  if (!item || typeof item !== 'object') {
    return defaultContactInfo;
  }

  return {
    ...defaultContactInfo,
    id: item.id ?? 0,

    phone_1: item.phone_1 || item.phone || defaultContactInfo.phone_1,
    phone_2: item.phone_2 || item.phone_secondary || '',
    whatsapp: item.whatsapp || item.phone || defaultContactInfo.whatsapp,

    email_1: item.email_1 || item.email || defaultContactInfo.email_1,
    email_2: item.email_2 || item.email_secondary || '',

    address_ar: item.address_ar || item.address || defaultContactInfo.address_ar,
    address_en: item.address_en || item.address || '',

    working_days_ar:
      item.working_days_ar || item.working_days || defaultContactInfo.working_days_ar,
    working_days_en:
      item.working_days_en || item.working_days || defaultContactInfo.working_days_en,
    working_hours:
      item.working_hours_ar || item.working_hours || defaultContactInfo.working_hours,

    facebook: item.facebook || item.facebook_url || '',
    twitter: item.twitter || item.twitter_url || '',
    instagram: item.instagram || item.instagram_url || '',
    linkedin: item.linkedin || item.linkedin_url || '',
    youtube: item.youtube || item.youtube_url || '',

    map_embed_code: item.map_embed_code || item.google_maps_embed || '',
    latitude: String(item.latitude || item.google_maps_lat || ''),
    longitude: String(item.longitude || item.google_maps_lng || ''),
  };
}

// ════════════════════════════════════════════════
// 🎯 Component
// ════════════════════════════════════════════════
export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactPageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = await api.contactInfo();
        const normalized = normalizeContactInfo(raw);
        setContactInfo(normalized);
      } catch (err) {
        console.error('Error fetching contact info:', err);
        setError('حدث خطأ في تحميل معلومات الاتصال');
        setContactInfo(defaultContactInfo);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const info: ContactPageInfo = contactInfo ?? defaultContactInfo;

  const contactCards: ContactCard[] = [
    {
      icon: '📞',
      title: 'الهاتف',
      value: info.phone_1,
      href: `tel:${info.phone_1.replace(/\s/g, '')}`,
      color: '#3b82f6',
    },
    ...(info.phone_2
      ? [
          {
            icon: '📱',
            title: 'هاتف ثاني',
            value: info.phone_2,
            href: `tel:${info.phone_2.replace(/\s/g, '')}`,
            color: '#6366f1',
          } as ContactCard,
        ]
      : []),
    {
      icon: '✉️',
      title: 'البريد الإلكتروني',
      value: info.email_1,
      href: `mailto:${info.email_1}`,
      color: '#8b5cf6',
    },
    ...(info.email_2
      ? [
          {
            icon: '📧',
            title: 'بريد إلكتروني ثاني',
            value: info.email_2,
            href: `mailto:${info.email_2}`,
            color: '#a855f7',
          } as ContactCard,
        ]
      : []),
    {
      icon: '📍',
      title: 'العنوان',
      value: info.address_ar,
      href: '#',
      color: '#ef4444',
    },
    {
      icon: '🕐',
      title: 'ساعات العمل',
      value: `${info.working_days_ar || info.working_days_en || 'الأحد - الخميس'}: ${info.working_hours || '8:00 ص - 5:00 م'}`,
      href: '#',
      color: '#10b981',
    },
  ];

  if (info.whatsapp) {
    contactCards.push({
      icon: '💬',
      title: 'واتساب',
      value: info.whatsapp,
      href: `https://wa.me/${info.whatsapp.replace(/\s/g, '').replace('+', '')}`,
      color: '#25D366',
    });
  }

  const socialLinks: SocialLink[] = [];
  if (info.facebook) socialLinks.push({ name: 'فيسبوك', url: info.facebook, color: '#1877F2', icon: 'f' });
  if (info.twitter) socialLinks.push({ name: 'تويتر', url: info.twitter, color: '#000000', icon: '𝕏' });
  if (info.instagram) socialLinks.push({ name: 'انستقرام', url: info.instagram, color: '#E4405F', icon: '📷' });
  if (info.linkedin) socialLinks.push({ name: 'لينكد إن', url: info.linkedin, color: '#0A66C2', icon: 'in' });
  if (info.youtube) socialLinks.push({ name: 'يوتيوب', url: info.youtube, color: '#FF0000', icon: '▶' });

  const mapUrl =
    info.latitude && info.longitude
      ? `https://maps.google.com/maps?q=${info.latitude},${info.longitude}&z=15&output=embed`
      : null;

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <style>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #f59e0b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && !contactInfo) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem' }}>
            حدث خطأ
          </h3>
          <p style={{ color: '#64748b' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
          color: 'white',
          padding: '5rem 0 6rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-custom" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span
            className="section-badge animate-fadeInUp"
            style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}
          >
            📞 تواصل معنا
          </span>
          <h1
            className="animate-fadeInUp animation-delay-100"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: '900',
              marginBottom: '1rem',
            }}
          >
            دعنا <span className="text-gradient-orange">نتحدث</span>
          </h1>
          <p
            className="animate-fadeInUp animation-delay-200"
            style={{
              color: '#cbd5e0',
              fontSize: '1.125rem',
              maxWidth: '40rem',
              margin: '0 auto',
            }}
          >
            نحن هنا للإجابة على استفساراتك وتقديم أفضل الحلول لمشروعك
          </p>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '60px' }}
          >
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding" style={{ background: '#f8faff' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="contact-grid">
            {/* Contact Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contactCards.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className="hover-lift"
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '1.25rem',
                    textDecoration: 'none',
                    border: '1px solid #e8edf5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: '3.5rem',
                      height: '3.5rem',
                      background: `${c.color}15`,
                      color: c.color,
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                      {c.title}
                    </div>
                    <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '1rem' }}>
                      {c.value}
                    </div>
                  </div>
                </a>
              ))}

              {/* Social Media Links */}
              {socialLinks.length > 0 && (
                <div
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '1.25rem',
                    border: '1px solid #e8edf5',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ color: '#0f172a', fontWeight: '700', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    📱 تابعنا على
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {socialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: link.color,
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '2rem',
                          textDecoration: 'none',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        {link.icon} {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>

          {/* Map Section */}
          {(info.map_embed_code || mapUrl) && (
            <div
              style={{
                marginTop: '3rem',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  marginBottom: '1rem',
                  paddingRight: '0.5rem',
                }}
              >
                📍 موقعنا على الخريطة
              </h3>

              {info.map_embed_code ? (
                <div dangerouslySetInnerHTML={{ __html: info.map_embed_code }} />
              ) : mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع الشركة على الخريطة"
                />
              ) : null}
            </div>
          )}
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .contact-grid {
              grid-template-columns: 1fr 2fr !important;
            }
          }
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          }
          .text-gradient-orange {
            background: linear-gradient(135deg, #ed8936, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .section-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, rgba(237,137,54,0.15), rgba(237,137,54,0.05));
            border: 1px solid rgba(237,137,54,0.3);
            border-radius: 9999px;
            color: #fbd38d;
            font-weight: 700;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
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
        `}</style>
      </section>
    </div>
  );
}
 