'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { settingsHelpers, buildMediaUrl, type SiteSettings } from '@/lib/settings';
import NewsletterForm from '@/components/shared/NewsletterForm';
import { api } from '@/lib/api';

interface Props { 
  settings?: SiteSettings;
  navigation?: any[];
  services?: any[];
}

/* ═══════════════════════════════════════════════════
   🎨 Social Icon Component
   ═══════════════════════════════════════════════════ */
const SocialIcon = memo(({ 
  Icon, 
  url, 
  color, 
  label,
  size = 16 
}: { 
  Icon: React.ComponentType<{ size?: number }>;
  url: string;
  color: string;
  label: string;
  size?: number;
}) => (
  <a
    href={url}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="social-icon"
    style={{ '--social-color': color } as React.CSSProperties}
  >
    <Icon size={size} />
  </a>
));
SocialIcon.displayName = 'SocialIcon';

/* ═══════════════════════════════════════════════════
   🔗 Footer Link Component
   ═══════════════════════════════════════════════════ */
const FooterLink = memo(({ href, label }: { href: string; label: string }) => (
  <li>
    <Link href={href} className="footer-link">
      <span className="footer-arrow">←</span>
      <span>{label}</span>
    </Link>
  </li>
));
FooterLink.displayName = 'FooterLink';

/* ═══════════════════════════════════════════════════
   📍 City Pill Component
   ═══════════════════════════════════════════════════ */
const CityPill = memo(({ area }: { area: any }) => (
  <Link href={`/areas/${area.slug}`} className="city-pill">
    <span className="city-pill-icon">📍</span>
    <span>{area.name_ar}</span>
  </Link>
));
CityPill.displayName = 'CityPill';

/* ═══════════════════════════════════════════════════
   🛠️ Service Link Component
   ═══════════════════════════════════════════════════ */
const ServiceLink = memo(({ service }: { service: any }) => (
  <li>
    <Link href={`/services/${service.slug}`} className="footer-link">
      <span className="footer-arrow">←</span>
      <span>{service.title_ar}</span>
    </Link>
  </li>
));
ServiceLink.displayName = 'ServiceLink';

/* ═══════════════════════════════════════════════════
   🎯 Main Footer Component
   ═══════════════════════════════════════════════════ */
export default function Footer({ settings = {}, navigation = [], services: propServices = [] }: Props) {
  const [areas, setAreas] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>(propServices);
  const currentYear = new Date().getFullYear();

  const {
    phone,
    whatsapp,
    email,
    address,
    siteName,
    siteTagline,
    workingHours,
    workingDays,
    siteLogo,
    siteDescription,
    copyrightText,
    siteIcon,
  } = useMemo(() => ({
    phone: settings?.phone || '',
    whatsapp: settings?.whatsapp || settings?.phone || '',
    email: settings?.email || '',
    address: settingsHelpers.fullAddress(settings || {}) || '',
    siteName: settingsHelpers.siteName(settings || {}) || '',
    siteTagline: settings?.site_tagline_ar || settings?.site_tagline || '',
    workingHours: settings?.working_hours_ar || settings?.working_hours || '',
    workingDays: settings?.working_days_ar || settings?.working_days || '',
    siteLogo: settings?.site_logo ? buildMediaUrl(settings.site_logo) : '',
    siteDescription: settings?.site_description_ar || settings?.site_description || '',
    copyrightText: settings?.copyright_text_ar || settings?.copyright_text || '',
    siteIcon: settings?.site_icon || '🏢',
  }), [settings]);

  const socialLinks = useMemo(() => {
    const links = [
      { name: 'facebook', Icon: FacebookIcon, url: settings.facebook, color: '#1877F2', label: 'فيسبوك' },
      { name: 'twitter', Icon: TwitterIcon, url: settings.twitter, color: '#1DA1F2', label: 'تويتر' },
      { name: 'instagram', Icon: InstagramIcon, url: settings.instagram, color: '#E4405F', label: 'انستقرام' },
      { name: 'linkedin', Icon: LinkedinIcon, url: settings.linkedin, color: '#0A66C2', label: 'لينكدإن' },
      { name: 'youtube', Icon: YoutubeIcon, url: settings.youtube, color: '#FF0000', label: 'يوتيوب' },
      { name: 'tiktok', Icon: TiktokIcon, url: settings.tiktok, color: '#000000', label: 'تيك توك' },
      { name: 'snapchat', Icon: SnapchatIcon, url: settings.snapchat, color: '#FFFC00', label: 'سناب شات' },
    ];
    return links.filter((s): s is typeof s & { url: string } => Boolean(s.url));
  }, [settings]);

  const quickLinks = useMemo(() => {
    if (navigation && navigation.length > 0) {
      return navigation.slice(0, 6);
    }
    return [
      { label: 'الرئيسية', href: '/' },
      { label: 'عن الشركة', href: '/about' },
      { label: 'خدماتنا', href: '/services' },
      { label: 'مشاريعنا', href: '/projects' },
      { label: 'المدونة', href: '/blog' },
      { label: 'اتصل بنا', href: '/contact' },
    ];
  }, [navigation]);

  const fetchServices = useCallback(async () => {
    if (propServices.length > 0) {
      setServices(propServices);
      return;
    }

    try {
      const data = await api.services();
      setServices(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices([]);
    }
  }, [propServices]);

  const fetchAreas = useCallback(async () => {
    try {
      const data = await api.areas();
      setAreas(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchAreas();
  }, [fetchServices, fetchAreas]);

  return (
    <footer className="footer" suppressHydrationWarning>
      <div className="footer-top-bar" aria-hidden="true" />

      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="footer-container">
          <div className="newsletter-grid">
            <div className="newsletter-content">
              <h3 className="newsletter-title">
                <span className="newsletter-emoji">📬</span>
                اشترك في النشرة البريدية
              </h3>
              <p className="newsletter-desc">
                احصل على آخر المقالات والعروض الحصرية مباشرة إلى بريدك
              </p>
            </div>
            <div className="newsletter-form-wrapper">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-container footer-main">
        <div className="footer-grid">
          
          {/* ═══ العمود الأول: معلومات الشركة ═══ */}
          <div className="footer-col footer-col--brand">
            {/* ✅ Brand Section - عمودي */}
            <div className="footer-brand-wrapper">
              <Link href="/" className="footer-brand-link" aria-label={siteName}>
                {siteLogo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={siteLogo}
                    alt={siteName}
                    className="footer-logo-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="footer-brand-icon">
                    {siteIcon}
                  </div>
                )}
              </Link>
              
              {/* ✅ Description تحت الشعار */}
              <p className="footer-desc">
                {siteDescription || `شركة رائدة في السعودية بخبرة تزيد عن 20 عاماً في تقديم أفضل الخدمات لعملائنا الكرام.`}
              </p>

              {/* Social Icons */}
              {socialLinks.length > 0 && (
                <div className="footer-social" aria-label="روابط التواصل الاجتماعي">
                  {socialLinks.map((s) => (
                    <SocialIcon
                      key={s.name}
                      Icon={s.Icon}
                      url={s.url}
                      color={s.color}
                      label={s.label}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ═══ العمود الثاني: روابط سريعة ═══ */}
          <div className="footer-col">
            <h3 className="footer-heading">
              <span className="footer-heading-line" />
              روابط سريعة
            </h3>
            <ul className="footer-links">
              {quickLinks.map((item: any) => (
                <FooterLink key={item.href} href={item.href} label={item.label} />
              ))}
            </ul>
          </div>

          {/* ═══ العمود الثالث: الخدمات ═══ */}
          <div className="footer-col">
            <h3 className="footer-heading">
              <span className="footer-heading-line" />
              خدماتنا
            </h3>
            {services.length > 0 ? (
              <ul className="footer-links">
                {services.map((s: any) => (
                  <ServiceLink key={s.id} service={s} />
                ))}
              </ul>
            ) : (
              <p className="footer-empty">📋 لا توجد خدمات حالياً</p>
            )}
          </div>

          {/* ═══ العمود الرابع: التواصل ═══ */}
          <div className="footer-col">
            <h3 className="footer-heading">
              <span className="footer-heading-line" />
              تواصل معنا
            </h3>
            <ul className="footer-contact">
              {phone && (
                <li>
                  <a 
                    href={settingsHelpers.phoneLink(phone)} 
                    className="footer-contact-item"
                    aria-label={`اتصل على ${phone}`}
                  >
                    <span className="footer-icon" aria-hidden="true">📞</span>
                    <div className="footer-contact-text">
                      <span className="footer-contact-label">الهاتف</span>
                      <span className="footer-contact-value" dir="rtl">{phone}</span>
                    </div>
                  </a>
                </li>
              )}
              
              {whatsapp && whatsapp !== phone && (
                <li>
                  <a 
                    href={settingsHelpers.whatsappLink(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-item"
                    aria-label={`واتساب ${whatsapp}`}
                  >
                    <span className="footer-icon" aria-hidden="true">💬</span>
                    <div className="footer-contact-text">
                      <span className="footer-contact-label">واتساب</span>
                      <span className="footer-contact-value" dir="rtl">{whatsapp}</span>
                    </div>
                  </a>
                </li>
              )}
              
              {email && (
                <li>
                  <a 
                    href={settingsHelpers.emailLink(email)} 
                    className="footer-contact-item"
                    aria-label={`راسلنا على ${email}`}
                  >
                    <span className="footer-icon" aria-hidden="true">✉️</span>
                    <div className="footer-contact-text">
                      <span className="footer-contact-label">البريد الإلكتروني</span>
                      <span className="footer-contact-value">{email}</span>
                    </div>
                  </a>
                </li>
              )}
              
              {address && (
                <li className="footer-contact-item">
                  <span className="footer-icon" aria-hidden="true">📍</span>
                  <div className="footer-contact-text">
                    <span className="footer-contact-label">العنوان</span>
                    <span className="footer-contact-value">{address}</span>
                  </div>
                </li>
              )}
              
              {(workingDays || workingHours) && (
                <li className="footer-contact-item">
                  <span className="footer-icon" aria-hidden="true">🕐</span>
                  <div className="footer-contact-text">
                    <span className="footer-contact-label">ساعات العمل</span>
                    <span className="footer-contact-value">
                      {workingDays}
                      {workingDays && workingHours && <br />}
                      {workingHours}
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* مناطق الخدمة */}
        {areas.length > 0 && (
          <div className="footer-areas">
            <h4 className="footer-areas-title">
              <span aria-hidden="true">🌍</span>
              نخدم جميع مناطق المملكة
            </h4>
            <div className="footer-areas-list">
              {areas.map((area: any) => (
                <CityPill key={area.id} area={area} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">
         <p className="footer-copyright" suppressHydrationWarning>
  {copyrightText || `© ${currentYear} ${siteName}. جميع الحقوق محفوظة.`}
</p>

          <div className="footer-credit">
            <span>تصميم وبرمجة:</span>{' '}
            <a
              href="https://mohammed-almalgami.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-credit-link"
            >
              محمد الملجمي
            </a>
          </div>

          <div className="footer-bottom-links">
            <Link href="/privacy" className="bottom-link">
              سياسة الخصوصية
            </Link>
            <span className="bottom-divider" aria-hidden="true">•</span>
            <Link href="/terms" className="bottom-link">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════ Styles ═══════════════════ */}
      <style>{`
        /* ═══════════════════════════════════════════
           🎨 Footer Base
           ═══════════════════════════════════════════ */
        .footer {
          background: var(--footer-bg, #0f1729);
          color: var(--footer-text, #cbd5e0);
          position: relative;
          overflow: hidden;
          font-family: var(--font-family, 'Cairo'), sans-serif;
        }

        /* ═══════════════════════════════════════════
           📦 Container - نفس container-custom
           ═══════════════════════════════════════════ */
        .footer-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        /* ═══════════════════════════════════════════
           📊 Top Bar
           ═══════════════════════════════════════════ */
        .footer-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            var(--color-secondary, #D4AF37) 0%,
            var(--color-accent, #FFD700) 25%,
            var(--color-secondary-light, #F3E5AB) 50%,
            var(--color-accent, #FFD700) 75%,
            var(--color-secondary, #D4AF37) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s ease infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ═══════════════════════════════════════════
           📬 Newsletter Section
           ═══════════════════════════════════════════ */
        .footer-newsletter {
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.08) 0%,
            rgba(26, 54, 93, 0.15) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 2.5rem 0;
          position: relative;
          z-index: 1;
        }
        
        .newsletter-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: center;
        }
        
        .newsletter-title {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .newsletter-emoji {
          font-size: 1.5rem;
        }
        
        .newsletter-desc {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.8;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        /* ═══════════════════════════════════════════
           📦 Main Footer Content
           ═══════════════════════════════════════════ */
        .footer-main {
          padding: 3.5rem 1.5rem 2rem;
          position: relative;
          z-index: 1;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }

        /* ═══════════════════════════════════════════
           🏢 Brand Column - عمودي بالكامل
           ═══════════════════════════════════════════ */
        .footer-col--brand {
          display: flex;
          flex-direction: column;
        }

        .footer-brand-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .footer-brand-link {
          display: inline-block;
          text-decoration: none;
          margin-bottom: 0.5rem;
          transition: opacity 0.3s ease;
          max-width: 200px;
        }
        
        .footer-brand-link:hover {
          opacity: 0.85;
        }
        
        .footer-logo-img {
          height: 3.5rem;
          width: auto;
          max-width: 180px;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.95);
          padding: 8px 12px;
          object-fit: contain;
          display: block;
        }
        
        .footer-brand-icon {
          width: 3.5rem;
          height: 3.5rem;
          background: linear-gradient(
            135deg,
            var(--color-secondary, #D4AF37),
            var(--color-secondary-dark, #B8960F)
          );
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          color: #0f172a;
          font-weight: 900;
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
        }
        
        .footer-desc {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.85;
          font-size: 0.875rem;
          line-height: 1.75;
          margin: 0;
        }

        /* ═══════════════════════════════════════════
           🌐 Social Icons
           ═══════════════════════════════════════════ */
        .footer-social {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
        }
        
        .social-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.625rem;
          background: var(--social-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .social-icon:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 6px 20px var(--social-color);
        }

        /* ═══════════════════════════════════════════
           📝 Headings
           ═══════════════════════════════════════════ */
        .footer-heading {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 3rem;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--color-secondary, #D4AF37),
            transparent
          );
          border-radius: 2px;
        }
        
        .footer-heading-line {
          display: inline-block;
          width: 4px;
          height: 20px;
          background: var(--color-secondary, #D4AF37);
          border-radius: 2px;
        }

        /* ═══════════════════════════════════════════
           🔗 Footer Links
           ═══════════════════════════════════════════ */
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          padding: 0;
          margin: 0;
        }
        
        .footer-link {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.8;
          text-decoration: none;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          padding: 0.25rem 0;
        }
        
        .footer-link:hover {
          color: var(--color-secondary, #D4AF37);
          opacity: 1;
          transform: translateX(-4px);
        }
        
        .footer-arrow {
          color: var(--color-secondary, #D4AF37);
          font-weight: bold;
          transition: transform 0.3s ease;
        }
        
        .footer-link:hover .footer-arrow {
          transform: translateX(-3px);
        }
        
        .footer-empty {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.6;
          font-size: 0.8125rem;
          font-style: italic;
        }

        /* ═══════════════════════════════════════════
           📞 Contact Section - محسّن!
           ═══════════════════════════════════════════ */
        .footer-contact {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          padding: 0;
          margin: 0;
        }
        
        /* ✅ الإصلاح المهم - contact item */
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem !important;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease;
        }
        
        a.footer-contact-item:hover {
          transform: translateX(-3px);
        }
        
        .footer-icon {
          flex-shrink: 0;
          width: 2.25rem;
          height: 2.25rem;
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.15),
            rgba(212, 175, 55, 0.05)
          );
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        a.footer-contact-item:hover .footer-icon {
          background: var(--color-secondary, #D4AF37);
          border-color: var(--color-secondary, #D4AF37);
          transform: scale(1.1);
        }
        
        /* ✅ text container - قريب من الأيقونة */
        .footer-contact-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
          flex: 1;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .footer-contact-label {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.6;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }
        
        .footer-contact-value {
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.4;
          word-break: break-word;
        }

        /* ═══════════════════════════════════════════
           🌍 Service Areas
           ═══════════════════════════════════════════ */
        .footer-areas {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .footer-areas-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 1.25rem 0;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .footer-areas-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .city-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 9999px;
          color: var(--color-secondary-light, #F3E5AB);
          text-decoration: none;
          font-size: 0.8125rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .city-pill:hover {
          background: var(--color-secondary, #D4AF37);
          color: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.35);
          border-color: var(--color-secondary, #D4AF37);
        }
        
        .city-pill-icon {
          font-size: 0.875rem;
        }

        /* ═══════════════════════════════════════════
           ⬇️ Footer Bottom
           ═══════════════════════════════════════════ */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }
        
        .footer-bottom-inner {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .footer-copyright {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.7;
          font-size: 0.8125rem;
          text-align: center;
          margin: 0;
          line-height: 1.5;
        }
        
        .footer-credit {
          text-align: center;
          font-size: 0.75rem;
          opacity: 0.7;
          color: var(--footer-text, #cbd5e0);
        }
        
        .footer-credit-link {
          color: var(--color-secondary, #D4AF37);
          text-decoration: none;
          font-weight: 700;
          transition: opacity 0.3s ease;
        }
        
        .footer-credit-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
        
        .footer-bottom-links {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .bottom-link {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.7;
          font-size: 0.8125rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .bottom-link:hover {
          opacity: 1;
          color: var(--color-secondary, #D4AF37);
        }
        
        .bottom-divider {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.4;
        }

        /* ═══════════════════════════════════════════
           📱 Responsive
           ═══════════════════════════════════════════ */
        
        /* Small phones */
        @media (max-width: 480px) {
          .footer-main {
            padding: 2.5rem 0 1.5rem;
          }
          
          .footer-newsletter {
            padding: 2rem 0;
          }
          
          .footer-col--brand,
          .footer-brand-wrapper {
            align-items: center;
            text-align: center;
          }
          
          .footer-desc {
            text-align: center;
          }
          
          .footer-social {
            justify-content: center;
          }
          
          .footer-heading {
            justify-content: center;
            text-align: center;
          }
          
          .footer-heading::after {
            right: 50%;
            transform: translateX(50%);
          }
          
          .footer-links,
          .footer-contact {
            align-items: stretch;
          }
          
          .footer-bottom-inner {
            flex-direction: column;
            text-align: center;
          }
        }

        /* Tablets */
        @media (min-width: 640px) and (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        /* ✅ Desktop - 4 columns مع الشعار الأول أكبر */
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
            gap: 2.5rem;
          }
          
          .footer-col--brand,
          .footer-brand-wrapper {
            align-items: flex-start;
          }
          
          .newsletter-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }

        /* Large Desktops */
        @media (min-width: 1280px) {
          .footer-main {
            padding: 4rem 1.5rem 2.5rem;
          }
          
          .footer-grid {
            gap: 3rem;
          }
        }

        @media (min-width: 768px) {
          .footer-bottom-inner {
            flex-wrap: nowrap;
          }
        }

        /* Print */
        @media print {
          .footer-newsletter,
          .footer-social,
          .footer-areas,
          .footer-top-bar {
            display: none;
          }
          
          .footer {
            background: white;
            color: black;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .footer-top-bar,
          .social-icon,
          .city-pill,
          .footer-link,
          .footer-contact-item,
          .footer-icon {
            animation: none !important;
            transition: none !important;
          }
          
          .social-icon:hover,
          .city-pill:hover,
          .footer-link:hover,
          .footer-contact-item:hover,
          .footer-icon:hover {
            transform: none !important;
          }
        }
      `}</style>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   🎨 أيقونات SVG
   ═══════════════════════════════════════════════════ */

const FacebookIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
));
FacebookIcon.displayName = 'FacebookIcon';

const TwitterIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
));
TwitterIcon.displayName = 'TwitterIcon';

const InstagramIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
));
InstagramIcon.displayName = 'InstagramIcon';

const LinkedinIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
));
LinkedinIcon.displayName = 'LinkedinIcon';

const YoutubeIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
));
YoutubeIcon.displayName = 'YoutubeIcon';

const TiktokIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84 0z"/>
  </svg>
));
TiktokIcon.displayName = 'TiktokIcon';

const SnapchatIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.166.007A5.44 5.44 0 0 1 17.6 5.437l-.017 1.51c-.001.152.023.301.07.446l.11.245.03.077c.086.19.286.325.535.325h.014c.34-.023.7-.15 1.075-.335l.243-.128c.316-.16.577-.246.786-.246.212 0 .422.077.616.222.199.149.32.36.32.598 0 .258-.14.5-.386.7l-.207.16c-.343.264-.798.605-1.35.87l-.223.099c-.213.089-.336.313-.279.535.055.222.116.442.216.647l.075.147c.407.775 1.146 1.634 2.437 1.947l.183.041c.213.045.32.174.32.35 0 .277-.276.548-.804.717l-.24.07c-.297.081-.702.157-.928.29-.155.093-.221.276-.221.428 0 .143.045.284.129.404l.126.164c.117.147.234.284.234.483 0 .275-.276.522-.771.522l-.336-.021c-.213-.028-.404-.062-.586-.062-.24 0-.462.032-.688.147l-.13.075c-.148.093-.298.19-.457.286l-.174.099c-.297.16-.617.263-.958.263-.278 0-.532-.062-.784-.199l-.147-.086c-.298-.184-.606-.365-.929-.532l-.145-.072c-.36-.165-.744-.267-1.147-.267-.68 0-1.244.288-1.822.629l-.132.079c-.298.181-.634.365-.994.512l-.147.058c-.361.135-.732.222-1.108.222l-.212-.007c-.573-.033-.947-.238-.947-.522 0-.146.088-.276.19-.404l.135-.164c.086-.108.148-.239.148-.404 0-.183-.09-.4-.276-.507-.222-.128-.61-.211-.906-.29l-.24-.07c-.529-.169-.804-.44-.804-.717 0-.176.106-.305.319-.35l.183-.041c1.291-.313 2.03-1.172 2.437-1.947l.075-.147c.1-.205.161-.425.216-.647.057-.222-.066-.446-.28-.535l-.222-.099c-.552-.265-1.007-.606-1.35-.87l-.208-.16c-.246-.2-.386-.442-.386-.7 0-.238.12-.449.32-.598.194-.145.404-.222.616-.222.21 0 .47.086.786.246l.243.128c.375.185.734.312 1.075.335h.014c.249 0 .449-.135.535-.325l.031-.077.108-.245c.048-.145.072-.294.07-.446l-.017-1.51A5.44 5.44 0 0 1 12.166.007z"/>
  </svg>
));
SnapchatIcon.displayName = 'SnapchatIcon';