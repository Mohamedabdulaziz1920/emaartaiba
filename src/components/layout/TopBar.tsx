'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Phone, Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import { getTopBarData, settingsHelpers, type SiteSettings } from '@/lib/settings';

interface Props {
  settings?: SiteSettings | null;
}

export default function TopBar({ settings = null }: Props) {
  const safeSettings = (settings ?? {}) as SiteSettings;

  const { show, phone, email, address, workingTime } = getTopBarData(safeSettings);
  
  // ✅ استخراج بيانات إضافية ديناميكية
  const whatsapp = safeSettings.whatsapp || safeSettings.phone || '';
  const workingDays = safeSettings.working_days_ar || safeSettings.working_days || '';
  const workingHours = safeSettings.working_hours_ar || safeSettings.working_hours || '';
  const showTopBar = safeSettings.show_top_bar !== false;

  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  const lastScrollRef = useRef(0);
  const tickingRef = useRef(false);

  // ✅ نص أوقات العمل
  const workingTimeText = useMemo(() => {
    if (workingDays && workingHours) return `${workingDays} | ${workingHours}`;
    return workingDays || workingHours || workingTime || '';
  }, [workingDays, workingHours, workingTime]);

  const hasData = Boolean(phone || email || address || workingTimeText);
  const shouldRender = showTopBar && show && hasData;

  // ✅ Scroll Handler محسّن
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
      // ✅ إخفاء عند النزول
      else if (currentY > lastY + 8 && currentY > 160) {
        setIsVisible(false);
      }
      // ✅ إظهار عند الصعود
      else if (currentY < lastY - 8) {
        setIsVisible(true);
      }

      lastScrollRef.current = currentY;
      tickingRef.current = false;
    });
  }, []);

  // ✅ تفعيل بعد mount لتجنب Hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!shouldRender || !mounted) return;

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, shouldRender, mounted]);

  if (!shouldRender) return null;

  return (
    <div
      className={`tb ${!isVisible ? 'tb--hidden' : ''}`}
      aria-label="شريط المعلومات العلوي"
      suppressHydrationWarning
    >
      <div className="tb__inner">
        
        {/* ═══ بداية الشريط: أوقات العمل ═══ */}
        {workingTimeText && (
          <div className="tb__side tb__side--start">
            <div className="tb__badge" aria-label={`أوقات العمل: ${workingTimeText}`}>
              <span className="tb__pulse" aria-hidden="true" />
              <Clock size={13} aria-hidden="true" strokeWidth={2.5} />
              <span className="tb__badge-text">{workingTimeText}</span>
            </div>
          </div>
        )}

        {/* ═══ نهاية الشريط: وسائل التواصل ═══ */}
        <div className="tb__side tb__side--end">
          
          {/* العنوان */}
          {address && (
            <>
              <div className="tb__item tb__item--address" aria-label={`العنوان: ${address}`}>
                <MapPin size={13} aria-hidden="true" />
                <span className="tb__item-text">{address}</span>
              </div>
              {(email || phone || whatsapp) && <span className="tb__sep" aria-hidden="true" />}
            </>
          )}

          {/* البريد الإلكتروني */}
          {email && (
            <>
              <a
                href={`mailto:${email}`}
                className="tb__item tb__item--link"
                aria-label={`راسلنا: ${email}`}
              >
                <Mail size={13} aria-hidden="true" />
                <span className="tb__item-text">{email}</span>
              </a>
              {(phone || whatsapp) && <span className="tb__sep" aria-hidden="true" />}
            </>
          )}

          {/* واتساب */}
          {whatsapp && whatsapp !== phone && (
            <>
              <a
                href={settingsHelpers.whatsappLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="tb__item tb__item--link tb__item--whatsapp"
                aria-label={`واتساب: ${whatsapp}`}
              >
                <span className="tb__icon-wrap tb__icon-wrap--wa" aria-hidden="true">
                  <MessageCircle size={12} />
                </span>
                <span className="tb__item-text" dir="ltr">{whatsapp}</span>
              </a>
              {phone && <span className="tb__sep" aria-hidden="true" />}
            </>
          )}

          {/* الهاتف */}
          {phone && (
            <a
              href={settingsHelpers.phoneLink(phone)}
              className="tb__item tb__item--link tb__item--phone"
              aria-label={`اتصل: ${phone}`}
            >
              <span className="tb__icon-wrap" aria-hidden="true">
                <Phone size={12} />
              </span>
              <span className="tb__item-text" dir="ltr">{phone}</span>
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        /* ═══════════════════════════════════════════
           🎨 Top Bar Base
           ═══════════════════════════════════════════ */
        .tb {
          background: linear-gradient(
            90deg,
            var(--color-primary-dark, #0b1120) 0%,
            var(--color-primary, #111d35) 50%,
            var(--color-primary-dark, #0b1120) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          z-index: 95;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.35s ease;
          will-change: transform, opacity;
          font-family: var(--font-family, 'Cairo', sans-serif);
        }

        .tb--hidden {
          transform: translate3d(0, -100%, 0);
          opacity: 0;
          pointer-events: none;
        }

        /* ═══════════════════════════════════════════
           📦 Inner Container
           ═══════════════════════════════════════════ */
        .tb__inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(0.75rem, 3vw, 2.5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 40px;
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

        /* ═══════════════════════════════════════════
           🕐 Working Hours Badge
           ═══════════════════════════════════════════ */
        .tb__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.85rem 0.3rem 0.65rem;
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.15),
            rgba(212, 175, 55, 0.05)
          );
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-secondary, #fbbf24);
          white-space: nowrap;
          letter-spacing: 0.01em;
          transition: all 0.3s ease;
        }

        .tb__badge:hover {
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.2),
            rgba(212, 175, 55, 0.08)
          );
          border-color: rgba(212, 175, 55, 0.35);
        }

        .tb__badge-text {
          line-height: 1;
        }

        .tb__pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.7);
          animation: tb-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes tb-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.8);
          }
        }

        /* ═══════════════════════════════════════════
           📝 Items & Separators
           ═══════════════════════════════════════════ */
        .tb__sep {
          display: block;
          width: 1px;
          height: 16px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255, 255, 255, 0.12),
            transparent
          );
          margin: 0 0.85rem;
          flex-shrink: 0;
        }

        .tb__item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          min-height: 32px;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(203, 213, 225, 0.9);
          text-decoration: none;
          white-space: nowrap;
          padding: 0.35rem 0;
          transition: color 0.25s ease, transform 0.25s ease;
          letter-spacing: 0.01em;
        }

        .tb__item-text {
          line-height: 1.2;
        }

        .tb__item--address {
          max-width: 300px;
        }
        
        .tb__item--address .tb__item-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tb__item--link {
          cursor: pointer;
        }

        .tb__item--link:hover,
        .tb__item--link:focus-visible {
          color: var(--color-secondary, #fbbf24);
        }

        /* ═══════════════════════════════════════════
           📞 Phone Style
           ═══════════════════════════════════════════ */
        .tb__item--phone {
          color: var(--color-secondary, #fbbf24);
          font-weight: 700;
          font-size: 0.78rem;
        }

        .tb__item--phone:hover,
        .tb__item--phone:focus-visible {
          color: var(--color-accent, #f59e0b);
        }

        /* ═══════════════════════════════════════════
           💬 WhatsApp Style
           ═══════════════════════════════════════════ */
        .tb__item--whatsapp {
          color: #25d366;
          font-weight: 600;
        }

        .tb__item--whatsapp:hover,
        .tb__item--whatsapp:focus-visible {
          color: #128c7e;
        }

        /* ═══════════════════════════════════════════
           🎨 Icon Wrapper
           ═══════════════════════════════════════════ */
        .tb__icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.15);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .tb__item--phone:hover .tb__icon-wrap,
        .tb__item--phone:focus-visible .tb__icon-wrap {
          background: rgba(212, 175, 55, 0.3);
          transform: scale(1.1);
        }

        .tb__icon-wrap--wa {
          background: rgba(37, 211, 102, 0.15);
        }

        .tb__item--whatsapp:hover .tb__icon-wrap--wa,
        .tb__item--whatsapp:focus-visible .tb__icon-wrap--wa {
          background: rgba(37, 211, 102, 0.3);
          transform: scale(1.1);
        }

        /* ═══════════════════════════════════════════
           📱 Responsive Design
           ═══════════════════════════════════════════ */

        /* Tablet - Landscape */
        @media (max-width: 1200px) {
          .tb__item--address {
            max-width: 200px;
          }
          
          .tb__sep {
            margin: 0 0.65rem;
          }
        }

        /* Tablet - Portrait */
        @media (max-width: 1024px) {
          .tb__side--start {
            display: none;
          }

          .tb__side--end {
            width: 100%;
            justify-content: center;
          }
          
          .tb__item--address {
            max-width: 150px;
          }
        }

        /* Small Tablet */
        @media (max-width: 768px) {
          .tb__inner {
            min-height: 36px;
          }
          
          .tb__item--address {
            display: none;
          }
          
          .tb__item--address + .tb__sep {
            display: none;
          }
        }

        /* Mobile Landscape */
        @media (max-width: 640px) {
          .tb__inner {
            padding: 0 0.65rem;
            min-height: 34px;
          }
          
          .tb__item {
            font-size: 0.7rem;
          }
          
          .tb__item--phone,
          .tb__item--whatsapp {
            font-size: 0.72rem;
          }
          
          .tb__sep {
            margin: 0 0.4rem;
            height: 12px;
          }
          
          .tb__icon-wrap {
            width: 20px;
            height: 20px;
          }
          
          /* إخفاء الإيميل على الشاشات الصغيرة إذا كان الهاتف موجود */
          .tb__item--link:has(.lucide-mail) {
            display: none;
          }
        }

        /* Mobile Portrait */
        @media (max-width: 480px) {
          .tb__inner {
            padding: 0 0.5rem;
            min-height: 32px;
          }
          
          .tb__side--end {
            gap: 0;
          }
          
          .tb__item {
            font-size: 0.68rem;
            gap: 0.3rem;
          }
          
          .tb__sep {
            margin: 0 0.3rem;
          }
          
          .tb__icon-wrap {
            width: 18px;
            height: 18px;
          }
        }

        /* Very Small Screens */
        @media (max-width: 360px) {
          .tb__item--whatsapp .tb__item-text {
            display: none;
          }
          
          .tb__item--whatsapp {
            padding: 0.3rem;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .tb,
          .tb__badge,
          .tb__item,
          .tb__icon-wrap {
            transition: none !important;
          }

          .tb__pulse {
            animation: none;
          }
        }

        /* Print */
        @media print {
          .tb {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}