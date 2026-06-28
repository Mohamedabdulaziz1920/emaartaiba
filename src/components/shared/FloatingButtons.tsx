'use client';

import { useState, useEffect } from 'react';
import { settingsHelpers, type SiteSettings } from '@/lib/settings';

// ✅ تعريف gtag في window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface Props {
  settings?: SiteSettings;
}

export default function FloatingButtons({ settings = {} }: Props) {
  const [showScroll, setShowScroll] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const phone = settings.phone || settingsHelpers.defaults.phone;
  const whatsapp = settings.whatsapp || settingsHelpers.defaults.whatsapp;

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ دالة تسجيل التحويل في Google Ads
  const trackPhoneConversion = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-18278947108/9fk7CJSbqcccEKSyioxE'
      });
      console.log('✅ Google Ads Conversion tracked: Phone call');
    }
  };

  // ✅ دالة معالجة النقر على زر الاتصال
  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // تسجيل التحويل
    trackPhoneConversion();
    
    // فتح رقم الهاتف بعد 300ms (لضمان تسجيل التحويل)
    setTimeout(() => {
      window.location.href = settingsHelpers.phoneLink(phone);
    }, 300);
  };

  return (
    <>
      <div className="floating-buttons">
        {/* WhatsApp */}
        <a
          href={settingsHelpers.whatsappLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="float-btn float-whatsapp"
          aria-label="WhatsApp"
          onMouseEnter={() => setShowTooltip('whatsapp')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {showTooltip === 'whatsapp' && (
            <span className="float-tooltip">تواصل عبر الواتساب</span>
          )}
          <span className="float-pulse" />
        </a>

        {/* Phone - مع تتبع التحويل */}
        <a
          href="#"
          onClick={handlePhoneClick}
          className="float-btn float-phone"
          aria-label="اتصل بنا"
          onMouseEnter={() => setShowTooltip('phone')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
          </svg>
          {showTooltip === 'phone' && (
            <span className="float-tooltip">اتصل بنا الآن</span>
          )}
        </a>

        {/* Scroll to top */}
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="float-btn float-scroll"
            aria-label="العودة للأعلى"
            onMouseEnter={() => setShowTooltip('scroll')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
            {showTooltip === 'scroll' && (
              <span className="float-tooltip">العودة للأعلى</span>
            )}
          </button>
        )}
      </div>

      <style jsx>{`
        .floating-buttons {
          position: fixed;
          bottom: 1.5rem;
          left: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          z-index: 100;
        }

        .float-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          border: none;
          cursor: pointer;
          position: relative;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .float-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        /* WhatsApp */
        .float-whatsapp {
          background: linear-gradient(135deg, #25D366, #128C7E);
        }

        /* Phone */
        .float-phone {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          animation: ringRotate 3s ease-in-out infinite;
        }

        @keyframes ringRotate {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }

        /* Scroll */
        .float-scroll {
          background: linear-gradient(135deg, var(--color-primary, #1a365d), var(--color-primary-light, #2b6cb0));
          animation: fadeInUp 0.3s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Pulse effect */
        .float-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.4);
          animation: pulse 2s infinite;
          pointer-events: none;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        /* Tooltip */
        .float-tooltip {
          position: absolute;
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: #1e293b;
          color: white;
          padding: 0.5rem 0.875rem;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 600;
          white-space: nowrap;
          animation: fadeInRight 0.2s ease;
          pointer-events: none;
        }

        .float-tooltip::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-right-color: #1e293b;
          border-left: 0;
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        @media (max-width: 640px) {
          .floating-buttons {
            bottom: 1rem;
            left: 1rem;
            gap: 0.625rem;
          }

          .float-btn {
            width: 48px;
            height: 48px;
          }

          .float-tooltip {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
