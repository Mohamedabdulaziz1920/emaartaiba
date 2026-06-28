'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/components/shared/ContactForm';
import { api } from '@/lib/api';

// ════════════════════════════════════════════════
// 📝 Types
// ════════════════════════════════════════════════
interface ContactPageInfo {
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

// ════════════════════════════════════════════════
// 🎯 Component
// ════════════════════════════════════════════════
export default function ContactPageClient() {
  const [contactInfo, setContactInfo] = useState<ContactPageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ جلب الإعدادات من جدول settings
        const response = await api.settings();
        const s = response?.data || response || {};

        const info: ContactPageInfo = {
          phone_1: s.phone || '',
          phone_2: s.phone_secondary || '',
          whatsapp: s.whatsapp || s.phone || '',
          email_1: s.email || '',
          email_2: s.email_secondary || '',
          address_ar: s.address_ar || s.address || '',
          address_en: s.address_en || '',
          working_days_ar: s.working_days_ar || s.working_days || '',
          working_days_en: s.working_days_en || '',
          working_hours: s.working_hours_ar || s.working_hours || '',
          facebook: s.facebook || '',
          twitter: s.twitter || '',
          instagram: s.instagram || '',
          linkedin: s.linkedin || '',
          youtube: s.youtube || '',
          map_embed_code: s.google_maps_embed || '',
          latitude: s.google_maps_lat || s.latitude || '',
          longitude: s.google_maps_lng || s.longitude || '',
        };

        setContactInfo(info);
      } catch (err) {
        console.error('Error fetching contact info:', err);
        setError('حدث خطأ في تحميل معلومات الاتصال');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // ════════════════════════════════════════════════
  // 🎨 Render
  // ════════════════════════════════════════════════
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

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
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

  const info = contactInfo || {
    phone_1: '',
    phone_2: '',
    whatsapp: '',
    email_1: '',
    email_2: '',
    address_ar: '',
    address_en: '',
    working_days_ar: '',
    working_days_en: '',
    working_hours: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    map_embed_code: '',
    latitude: '',
    longitude: '',
  };

  // ─── Contact Cards ─────────────────────────────
  const contactCards = [
    { icon: '📞', title: 'الهاتف', value: info.phone_1, href: `tel:${info.phone_1.replace(/\s/g, '')}`, color: '#3b82f6' },
    ...(info.phone_2 ? [{ icon: '📱', title: 'هاتف ثاني', value: info.phone_2, href: `tel:${info.phone_2.replace(/\s/g, '')}`, color: '#6366f1' }] : []),
    ...(info.whatsapp ? [{ icon: '💬', title: 'واتساب', value: info.whatsapp, href: `https://wa.me/${info.whatsapp.replace(/\s/g, '').replace('+', '')}`, color: '#25D366' }] : []),
    { icon: '✉️', title: 'البريد الإلكتروني', value: info.email_1, href: `mailto:${info.email_1}`, color: '#8b5cf6' },
    { icon: '📍', title: 'العنوان', value: info.address_ar || info.address_en || '', href: '#', color: '#ef4444' },
    { icon: '🕐', title: 'ساعات العمل', value: `${info.working_days_ar || info.working_days_en || ''}: ${info.working_hours || ''}`, href: '#', color: '#10b981' },
  ].filter(c => c.value);

  // ─── Social Links ─────────────────────────────
  const socialLinks = [];
  if (info.facebook) socialLinks.push({ name: 'فيسبوك', url: info.facebook, color: '#1877F2', icon: 'f' });
  if (info.twitter) socialLinks.push({ name: 'تويتر', url: info.twitter, color: '#000000', icon: '𝕏' });
  if (info.instagram) socialLinks.push({ name: 'انستقرام', url: info.instagram, color: '#E4405F', icon: '📷' });
  if (info.linkedin) socialLinks.push({ name: 'لينكد إن', url: info.linkedin, color: '#0A66C2', icon: 'in' });
  if (info.youtube) socialLinks.push({ name: 'يوتيوب', url: info.youtube, color: '#FF0000', icon: '▶' });

  const mapUrl = info.latitude && info.longitude
    ? `https://maps.google.com/maps?q=${info.latitude},${info.longitude}&z=15&output=embed`
    : null;

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
          color: 'white',
          padding: '4rem 0 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-custom" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span className="section-badge" style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}>
            📞 تواصل معنا
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '900', marginBottom: '1rem' }}>
            دعنا <span style={{ background: 'linear-gradient(135deg, #ed8936, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>نتحدث</span>
          </h1>
          <p style={{ color: '#cbd5e0', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto' }}>
            نحن هنا للإجابة على استفساراتك وتقديم أفضل الحلول لمشروعك
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '4rem 0', background: '#f8faff' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="contact-grid">
            {/* Contact Info Cards - من جدول settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contactCards.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    textDecoration: 'none',
                    border: '1px solid #e8edf5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover-lift"
                >
                  <div style={{
                    flexShrink: 0,
                    width: '3rem',
                    height: '3rem',
                    background: `${c.color}15`,
                    color: c.color,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{c.title}</div>
                    <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '0.95rem' }}>{c.value}</div>
                  </div>
                </a>
              ))}

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <div style={{
                  background: 'white',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  border: '1px solid #e8edf5',
                }}>
                  <div style={{ color: '#0f172a', fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    📱 تابعنا على
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {socialLinks.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                        background: link.color,
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}>
                        {link.icon} {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form - يخزن في جدول contacts */}
            <div>
              <ContactForm />
            </div>
          </div>

          {/* Map */}
          {(info.map_embed_code || mapUrl) && (
            <div style={{ marginTop: '3rem', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
                📍 موقعنا على الخريطة
              </h3>
              {info.map_embed_code ? (
                <div dangerouslySetInnerHTML={{ __html: info.map_embed_code }} />
              ) : mapUrl ? (
                <iframe src={mapUrl} width="100%" height="350" style={{ border: 0 }} allowFullScreen loading="lazy" title="موقع الشركة" />
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
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          }
          .section-badge {
            display: inline-block;
            padding: 0.4rem 1rem;
            background: rgba(237,137,54,0.15);
            border: 1px solid rgba(237,137,54,0.3);
            border-radius: 9999px;
            font-weight: 700;
            font-size: 0.85rem;
            margin-bottom: 1.5rem;
          }
        `}</style>
      </section>
    </div>
  );
}
