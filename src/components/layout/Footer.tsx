'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { settingsHelpers, type SiteSettings } from '@/lib/settings';
import NewsletterForm from '@/components/shared/NewsletterForm';
import { api } from '@/lib/api';

interface Props { 
  settings?: SiteSettings;
  navigation?: any[];
  services?: any[];
}

// ✅ تحسين: استخراج أيقونات SVG كمكونات منفصلة مع memo
const SocialIcon = memo(({ 
  Icon, 
  url, 
  color, 
  label,
  size = 14 
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

// ✅ تحسين: استخراج مكون الفوتر لينك
const FooterLink = memo(({ href, label }: { href: string; label: string }) => (
  <li>
    <Link href={href} className="footer-link">
      <span className="footer-arrow">›</span> {label}
    </Link>
  </li>
));

FooterLink.displayName = 'FooterLink';

// ✅ تحسين: استخراج مكون منطقة الخدمة
const CityPill = memo(({ area }: { area: any }) => (
  <Link href={`/areas/${area.slug}`} className="city-pill">
    📍 {area.name_ar}
  </Link>
));

CityPill.displayName = 'CityPill';

// ✅ تحسين: استخراج مكون خدمة
const ServiceLink = memo(({ service }: { service: any }) => (
  <li>
    <Link href={`/services/${service.slug}`} className="footer-link">
      <span className="footer-arrow">›</span> {service.title_ar}
    </Link>
  </li>
));

ServiceLink.displayName = 'ServiceLink';

export default function Footer({ settings = {}, navigation = [], services: propServices = [] }: Props) {
  const [areas, setAreas] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>(propServices);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentYear = new Date().getFullYear();

  // ✅ تحسين: استخدام useMemo للبيانات المشتقة
  const {
    phone,
    email,
    address,
    siteName,
    workingHours,
    workingDays,
    siteLogo,
    siteDescription,
    copyrightText,
  } = useMemo(() => ({
    phone: settings.phone || settingsHelpers.defaults.phone || '',
    email: settings.email || settingsHelpers.defaults.email || '',
    address: settingsHelpers.fullAddress(settings) || settingsHelpers.defaults.address_ar || '',
    siteName: settingsHelpers.siteName(settings) || 'البناء المتميز',
    workingHours: settings.working_hours || settingsHelpers.defaults.working_hours || '',
    workingDays: settings.working_days || settingsHelpers.defaults.working_days || '',
    siteLogo: settings.site_logo || '',
    siteDescription: settings.site_description || '',
    copyrightText: settings.copyright_text || '',
  }), [settings]);

  // ✅ تحسين: روابط التواصل الاجتماعي
  const socialLinks = useMemo(() => {
    const links = [
      { name: 'twitter', Icon: TwitterIcon, url: settings.twitter, color: '#1DA1F2', label: 'تويتر' },
      { name: 'instagram', Icon: InstagramIcon, url: settings.instagram, color: '#E4405F', label: 'انستقرام' },
      { name: 'facebook', Icon: FacebookIcon, url: settings.facebook, color: '#1877F2', label: 'فيسبوك' },
      { name: 'linkedin', Icon: LinkedinIcon, url: settings.linkedin, color: '#0A66C2', label: 'لينكدإن' },
      { name: 'youtube', Icon: YoutubeIcon, url: settings.youtube, color: '#FF0000', label: 'يوتيوب' },
    ];
    return links.filter((s): s is typeof s & { url: string } => Boolean(s.url));
  }, [settings]);

  // ✅ تحسين: الروابط السريعة
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

  // ✅ منع FOUC - مع منع Hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // ✅ تحسين: جلب الخدمات مع useCallback
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
      setServices([
        { id: 1, title_ar: 'ترميم وتشطيب', slug: 'trmym-otshtyb' },
        { id: 2, title_ar: 'دهانات وديكورات', slug: 'dhanat-odykorat' },
        { id: 3, title_ar: 'بناء ملاحق', slug: 'bnaaa-mlahk' },
        { id: 4, title_ar: 'عزل حراري', slug: 'aazl-hrary' },
        { id: 5, title_ar: 'أعمال الجبس', slug: 'aaamal-algbs' },
        { id: 6, title_ar: 'تركيب سيراميك', slug: 'trkyb-syramyk' },
      ]);
    }
  }, [propServices]);

  // ✅ جلب المناطق
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
    <footer 
      className="footer"
      style={{
        background: 'var(--footer-bg)',
        color: 'var(--footer-text)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* الشريط العلوي الملون */}
      <div className="footer-top-bar" aria-hidden="true" />

      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="container-custom">
          <div className="newsletter-grid">
            <div>
              <h3 id="newsletter-title" className="newsletter-title">📬 اشترك في النشرة البريدية</h3>
              <p className="newsletter-desc">احصل على آخر المقالات والعروض الحصرية</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container-custom footer-main">
        <div className="footer-grid">
          {/* الشركة */}
          <div className="footer-col">
            <Link href="/" className="footer-brand">
              {siteLogo ? (
                <Image
                  src={siteLogo}
                  alt={siteName}
                  width={44}
                  height={44}
                  className="footer-logo-img"
                  loading="lazy"
                />
              ) : (
                <div className="footer-brand-icon">ب</div>
              )}
              <div>
                <div className="footer-brand-name">{siteName.split('للمقاولات')[0].trim()}</div>
                <div className="footer-brand-sub">للمقاولات العامة</div>
              </div>
            </Link>
            <p className="footer-desc">
              {siteDescription || `شركة مقاولات عامة رائدة في السعودية بخبرة تزيد عن 20 عاماً.`}
            </p>

            {socialLinks.length > 0 && (
              <div className="footer-social">
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

          {/* روابط سريعة */}
          <div className="footer-col">
            <h3 className="footer-heading">روابط سريعة</h3>
            <ul className="footer-links">
              {quickLinks.map((item: any) => (
                <FooterLink key={item.href} href={item.href} label={item.label} />
              ))}
            </ul>
          </div>

          {/* الخدمات */}
          <div className="footer-col">
            <h3 className="footer-heading">خدماتنا</h3>
            {services.length > 0 ? (
              <ul className="footer-links">
                {services.map((s: any) => (
                  <ServiceLink key={s.id} service={s} />
                ))}
              </ul>
            ) : (
              <p className="footer-empty">لا توجد خدمات حالياً</p>
            )}
          </div>

          {/* التواصل */}
          <div className="footer-col">
            <h3 className="footer-heading">تواصل معنا</h3>
            <ul className="footer-contact">
              {phone && (
                <li>
                  <a href={settingsHelpers.phoneLink(phone)} className="footer-contact-item">
                    <span className="footer-icon">📞</span>
                    <div>
                      <div className="footer-contact-label">الهاتف</div>
                      <div className="footer-contact-value">{phone}</div>
                    </div>
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={settingsHelpers.emailLink(email)} className="footer-contact-item">
                    <span className="footer-icon">✉️</span>
                    <div>
                      <div className="footer-contact-label">البريد</div>
                      <div className="footer-contact-value">{email}</div>
                    </div>
                  </a>
                </li>
              )}
              {address && (
                <li className="footer-contact-item">
                  <span className="footer-icon">📍</span>
                  <div>
                    <div className="footer-contact-label">العنوان</div>
                    <div className="footer-contact-value">{address}</div>
                  </div>
                </li>
              )}
              {(workingDays || workingHours) && (
                <li className="footer-contact-item">
                  <span className="footer-icon">🕐</span>
                  <div>
                    <div className="footer-contact-label">ساعات العمل</div>
                    <div className="footer-contact-value">
                      {workingDays}
                      {workingDays && workingHours && <br />}
                      {workingHours}
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* مناطق الخدمة */}
        {areas.length > 0 && (
          <div className="footer-areas">
            <h4 className="footer-areas-title">🌍 نخدم جميع مناطق المملكة</h4>
            <div className="footer-areas-list">
              {areas.map((area: any) => (
                <CityPill key={area.id} area={area} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* الشريط السفلي */}
      <div className="footer-bottom">
        <div className="container-custom footer-bottom-inner">
          <p className="footer-copyright">
            {copyrightText || `© ${currentYear} ${siteName}. جميع الحقوق محفوظة.`}
          </p>

          <div className="footer-credit">
            تصميم وبرمجة :{' '}
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
            <Link href="/privacy" className="bottom-link">سياسة الخصوصية</Link>
            <Link href="/terms" className="bottom-link">الشروط والأحكام</Link>
          </div>
        </div>
      </div>

      {/* ═══════ Styles - بدون jsx لتجنب Hydration mismatch ═══════ */}
      <style>{`
        /* ───────── منع FOUC ───────── */
        .footer {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        /* ───────── Top Bar ───────── */
        .footer-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--color-secondary, #D4AF37),
            var(--color-secondary-light, #F3E5AB),
            var(--color-secondary, #D4AF37)
          );
          background-size: 200% 100%;
          animation: footer-gradient-shift 3s ease infinite;
        }
        @keyframes footer-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ───────── Newsletter ───────── */
        .footer-newsletter {
          background: linear-gradient(135deg, rgba(237,137,54,0.1), rgba(43,108,176,0.1));
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 2rem 0;
          position: relative;
          z-index: 1;
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
        .newsletter-title {
          font-size: clamp(1.125rem, 3vw, 1.5rem);
          font-weight: 800;
          color: var(--footer-text, #cbd5e0);
          margin-bottom: 0.375rem;
        }
        .newsletter-desc {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.7;
          font-size: 0.875rem;
        }

        /* ───────── Main ───────── */
        .footer-main {
          padding: 3rem 0 1.5rem;
          position: relative;
          z-index: 1;
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

        /* ───────── Brand ───────── */
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          margin-bottom: 1rem;
        }
        .footer-logo-img {
          height: 2.75rem;
          width: auto;
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.95);
          padding: 4px;
        }
        .footer-brand-icon {
          width: 2.75rem;
          height: 2.75rem;
          background: linear-gradient(135deg, var(--color-secondary, #D4AF37), var(--color-secondary-dark, #B8960F));
          border-radius: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--btn-primary-text, #0f172a);
          font-weight: 900;
          font-size: 1.25rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
          flex-shrink: 0;
        }
        .footer-brand-name {
          font-weight: 800;
          font-size: 1.0625rem;
          color: var(--footer-text, #cbd5e0);
        }
        .footer-brand-sub {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.6;
          font-size: 0.6875rem;
        }
        .footer-desc {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.7;
          font-size: 0.8125rem;
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }

        /* ───────── Social ───────── */
        .footer-social {
          display: flex;
          gap: 0.5rem;
        }
        .social-icon {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.5rem;
          background: var(--social-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          will-change: transform;
        }
        .social-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px var(--social-color)40;
        }
        @media (prefers-reduced-motion: reduce) {
          .social-icon { transition: none; }
          .social-icon:hover { transform: none; }
        }

        /* ───────── Headings ───────── */
        .footer-heading {
          font-size: 0.9375rem;
          font-weight: 800;
          color: var(--footer-text, #cbd5e0);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--color-secondary, #D4AF37);
          display: inline-block;
        }

        /* ───────── Links ───────── */
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0;
          margin: 0;
        }
        .footer-link {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.8;
          text-decoration: none;
          font-size: 0.8125rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          transition: all 0.3s ease;
        }
        .footer-link:hover {
          color: var(--color-secondary, #D4AF37);
          opacity: 1;
          transform: translateX(-3px);
        }
        .footer-arrow {
          color: var(--color-secondary, #D4AF37);
        }
        .footer-empty {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.6;
          font-size: 0.75rem;
        }

        /* ───────── Contact ───────── */
        .footer-contact {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          padding: 0;
          margin: 0;
        }
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
          color: inherit;
        }
        .footer-contact-label {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.6;
          font-size: 0.6875rem;
        }
        .footer-contact-value {
          color: var(--footer-text, #cbd5e0);
          font-size: 0.8125rem;
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

        /* ───────── Areas ───────── */
        .footer-areas {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-areas-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--footer-text, #cbd5e0);
          margin-bottom: 0.875rem;
          text-align: center;
        }
        .footer-areas-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }
        .city-pill {
          padding: 0.4rem 0.875rem;
          background: rgba(237, 137, 54, 0.1);
          border: 1px solid rgba(237, 137, 54, 0.2);
          border-radius: 9999px;
          color: var(--color-secondary-light, #F3E5AB);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
          will-change: transform;
        }
        .city-pill:hover {
          background: var(--color-secondary, #D4AF37);
          color: var(--btn-primary-text, #0f172a);
          transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .city-pill { transition: none; }
          .city-pill:hover { transform: none; }
        }

        /* ───────── Bottom ───────── */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.3);
          position: relative;
          z-index: 1;
        }
        .footer-bottom-inner {
          padding: 1rem 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }
        .footer-copyright {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.7;
          font-size: 0.8125rem;
          text-align: center;
          margin: 0;
        }
        .footer-credit {
          text-align: center;
          font-size: 0.7rem;
          opacity: 0.6;
        }
        .footer-credit-link {
          color: var(--footer-text, #cbd5e0);
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.3s ease;
        }
        .footer-credit-link:hover {
          opacity: 1;
        }
        .footer-bottom-links {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .bottom-link {
          color: var(--footer-text, #cbd5e0);
          opacity: 0.7;
          font-size: 0.8125rem;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }
        .bottom-link:hover {
          opacity: 1;
          color: var(--color-secondary, #D4AF37);
        }

        @media (min-width: 768px) {
          .footer-bottom-inner {
            flex-wrap: nowrap;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer { transition: none; }
          .footer * { animation-duration: 0.01ms !important; }
        }
      `}</style>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════
// أيقونات SVG
// ═══════════════════════════════════════════════════════════

const FacebookIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
));

FacebookIcon.displayName = 'FacebookIcon';

const TwitterIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
));

TwitterIcon.displayName = 'TwitterIcon';

const InstagramIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
));

InstagramIcon.displayName = 'InstagramIcon';

const LinkedinIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
));

LinkedinIcon.displayName = 'LinkedinIcon';

const YoutubeIcon = memo(({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
));

YoutubeIcon.displayName = 'YoutubeIcon';