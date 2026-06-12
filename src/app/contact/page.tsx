'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/components/shared/ContactForm';

// واجهة بيانات معلومات الاتصال الكاملة
interface ContactInfo {
  id?: number;
  phone_1: string;
  phone_2?: string | null;
  whatsapp?: string | null;
  email_1: string;
  email_2?: string | null;
  address_ar: string;
  address_en?: string | null;
  working_days_ar: string;
  working_days_en?: string | null;
  working_hours: string;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  map_embed_code?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

// بيانات افتراضية مؤقتة (سيتم استبدالها من API لاحقاً)
const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone_1: '+966 54 428 8051',
  email_1: 'info@dicoratjeeda.com',
  address_ar: 'جدة - حي الروضة - شارع الأمير سلطان',
  working_days_ar: 'السبت - الخميس',
  working_hours: '9:00 صباحاً - 6:00 مساءً',
};

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        // محاولة جلب معلومات الاتصال من API (إذا كان متاحاً)
        try {
          // استخدام fetch مباشرة بدلاً من api.contactInfo
          const response = await fetch('http://localhost:8000/api/v1/contact-info');
          if (response.ok) {
            const data = await response.json();
            if (data && data.data) {
              setContactInfo(prev => ({ ...prev, ...data.data }));
            } else if (data && data.phone_1) {
              setContactInfo(prev => ({ ...prev, ...data }));
            }
          }
        } catch (err) {
          console.log('Contact info API not available yet, using defaults');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const info = contactInfo;

  // بناء بطاقات الاتصال
  const contactCards = [
    { 
      icon: '📞', 
      title: 'الهاتف', 
      value: info.phone_1,
      href: `tel:${info.phone_1?.replace(/\s/g, '')}`,
      color: '#3b82f6' 
    },
    { 
      icon: '✉️', 
      title: 'البريد الإلكتروني', 
      value: info.email_1,
      href: `mailto:${info.email_1}`,
      color: '#8b5cf6' 
    },
    { 
      icon: '📍', 
      title: 'العنوان', 
      value: info.address_ar,
      href: '#',
      color: '#ef4444' 
    },
    { 
      icon: '🕐', 
      title: 'ساعات العمل', 
      value: `${info.working_days_ar}: ${info.working_hours}`,
      href: '#',
      color: '#10b981' 
    },
  ];

  // إضافة واتساب إذا كان موجوداً
  if (info.whatsapp) {
    contactCards.push({
      icon: '💬',
      title: 'واتساب',
      value: info.whatsapp,
      href: `https://wa.me/${info.whatsapp.replace(/\s/g, '').replace('+', '')}`,
      color: '#25D366',
    });
  }

  // بناء روابط التواصل الاجتماعي (فقط الموجودة)
  const socialLinks = [];
  if (info.facebook) socialLinks.push({ name: 'فيسبوك', url: info.facebook, color: '#1877F2', icon: 'f' });
  if (info.twitter) socialLinks.push({ name: 'تويتر', url: info.twitter, color: '#000000', icon: '𝕏' });
  if (info.instagram) socialLinks.push({ name: 'انستقرام', url: info.instagram, color: '#E4405F', icon: '📷' });
  if (info.linkedin) socialLinks.push({ name: 'لينكد إن', url: info.linkedin, color: '#0A66C2', icon: 'in' });
  if (info.youtube) socialLinks.push({ name: 'يوتيوب', url: info.youtube, color: '#FF0000', icon: '▶' });

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

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        color: 'white',
        padding: '5rem 0 6rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container-custom" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span className="section-badge animate-fadeInUp"
                style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}>
            📞 تواصل معنا
          </span>
          <h1 className="animate-fadeInUp animation-delay-100" style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: '900',
            marginBottom: '1rem'
          }}>
            دعنا <span className="text-gradient-orange">نتحدث</span>
          </h1>
          <p className="animate-fadeInUp animation-delay-200" style={{
            color: '#cbd5e0',
            fontSize: '1.125rem',
            maxWidth: '40rem',
            margin: '0 auto'
          }}>
            نحن هنا للإجابة على استفساراتك وتقديم أفضل الحلول لمشروعك
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
               style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
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
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    flexShrink: 0,
                    width: '3.5rem',
                    height: '3.5rem',
                    background: `${c.color}15`,
                    color: c.color,
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
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

              {/* Social Media Links - عرض فقط إذا كانت موجودة */}
              {socialLinks.length > 0 && (
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '1.25rem',
                  border: '1px solid #e8edf5',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                }}>
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
                          fontWeight: '600' 
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

          {/* Map Section - عرض فقط إذا كان موجوداً */}
          {info.map_embed_code && (
            <div style={{ marginTop: '2rem' }}>
              <div dangerouslySetInnerHTML={{ __html: info.map_embed_code }} />
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
        `}</style>
      </section>
    </div>
  );
}