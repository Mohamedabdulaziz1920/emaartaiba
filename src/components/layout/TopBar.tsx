'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Phone, Clock, Mail, MapPin } from 'lucide-react';
import { getTopBarData, settingsHelpers, type SiteSettings } from '@/lib/settings';

interface Props {
  settings?: SiteSettings | null;
}

export default function TopBar({ settings = null }: Props) {
  const safeSettings = (settings ?? {}) as SiteSettings;

  const { show, phone, email, address, workingTime } = getTopBarData(safeSettings);

  const workingDays = safeSettings.working_days_ar || safeSettings.working_days || '';
  const workingHours = safeSettings.working_hours_ar || safeSettings.working_hours || '';
  const showTopBar = safeSettings.show_top_bar !== false;

  const [isVisible, setIsVisible] = useState(true);

  const lastScrollRef = useRef(0);
  const tickingRef = useRef(false);

  const workingTimeText = useMemo(() => {
    if (workingDays && workingHours) return `${workingDays} | ${workingHours}`;
    return workingDays || workingHours || workingTime || '';
  }, [workingDays, workingHours, workingTime]);

  const hasData = Boolean(phone || email || address || workingTimeText);
  const shouldRender = showTopBar && show && hasData;

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;

    window.requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const lastY = lastScrollRef.current;

      // ✅ إظهار دائم قرب أعلى الصفحة
      if (currentY <= 120) {
        setIsVisible(true);
      }
      // ✅ إخفاء عند النزول الواضح
      else if (currentY > lastY + 6 && currentY > 160) {
        setIsVisible(false);
      }
      // ✅ إظهار عند الصعود
      else if (currentY < lastY - 6) {
        setIsVisible(true);
      }

      lastScrollRef.current = currentY;
      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className={`tb ${!isVisible ? 'tb--hidden' : ''}`}
      aria-label="شريط المعلومات العلوي"
    >
      <div className="tb__inner">
        {/* بداية الشريط: الدوام */}
        {workingTimeText && (
          <div className="tb__side tb__side--start">
            <div className="tb__badge" aria-label={`أوقات العمل: ${workingTimeText}`}>
              <span className="tb__pulse" aria-hidden="true" />
              <Clock size={12} aria-hidden="true" />
              <span>{workingTimeText}</span>
            </div>
          </div>
        )}

        {/* نهاية الشريط: وسائل التواصل */}
        <div className="tb__side tb__side--end">
          {address && (
            <>
              <div className="tb__item" aria-label={`العنوان: ${address}`}>
                <MapPin size={13} aria-hidden="true" />
                <span>{address}</span>
              </div>
              {(email || phone) && <span className="tb__sep" aria-hidden="true" />}
            </>
          )}

          {email && (
            <>
              <a
                href={`mailto:${email}`}
                className="tb__item tb__item--link"
                aria-label={`راسلنا عبر البريد الإلكتروني ${email}`}
              >
                <Mail size={13} aria-hidden="true" />
                <span>{email}</span>
              </a>
              {phone && <span className="tb__sep" aria-hidden="true" />}
            </>
          )}

          {phone && (
            <a
              href={settingsHelpers.phoneLink(phone)}
              className="tb__item tb__item--link tb__item--phone"
              aria-label={`اتصل بنا على الرقم ${phone}`}
            >
              <span className="tb__phone-icon" aria-hidden="true">
                <Phone size={12} />
              </span>
              <span>{phone}</span>
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .tb {
          background: linear-gradient(90deg, #0b1120 0%, #111d35 50%, #0b1120 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          z-index: 95;
          transition:
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.35s ease;
          will-change: transform, opacity;
        }

        .tb--hidden {
          transform: translate3d(0, -100%, 0);
          opacity: 0;
          pointer-events: none;
        }

        .tb__inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 3vw, 2.5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 38px;
          gap: 1rem;
        }

        .tb__side {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
        }

        .tb__side--end {
          gap: 0;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .tb__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.22rem 0.7rem 0.22rem 0.55rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.18);
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #fbbf24;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .tb__pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale3d(1, 1, 1);
          }
          50% {
            opacity: 0.5;
            transform: scale3d(0.75, 0.75, 1);
          }
        }

        .tb__sep {
          display: block;
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 0.75rem;
          flex-shrink: 0;
        }

        .tb__item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          min-height: 32px;
          font-size: 0.73rem;
          font-weight: 500;
          color: rgba(203, 213, 225, 0.9);
          text-decoration: none;
          white-space: nowrap;
          padding: 0.35rem 0;
          transition: color 0.25s ease;
          letter-spacing: 0.01em;
        }

        .tb__item--link {
          cursor: pointer;
        }

        .tb__item--link:hover,
        .tb__item--link:focus-visible {
          color: #fbbf24;
        }

        .tb__item--phone {
          color: #fbbf24;
          font-weight: 700;
          font-size: 0.76rem;
          direction: ltr;
          unicode-bidi: plaintext;
        }

        .tb__item--phone:hover,
        .tb__item--phone:focus-visible {
          color: #f59e0b;
        }

        .tb__phone-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.15);
          flex-shrink: 0;
          transition: background-color 0.25s ease;
        }

        .tb__item--phone:hover .tb__phone-icon,
        .tb__item--phone:focus-visible .tb__phone-icon {
          background: rgba(245, 158, 11, 0.25);
        }

        @media (max-width: 1100px) {
          .tb__side--start {
            display: none;
          }

          .tb__side--end {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .tb {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tb {
            transition: none;
          }

          .tb__pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}