'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Clock, Mail, MapPin } from 'lucide-react';
import { getTopBarData, type SiteSettings } from '@/lib/settings';

interface Props {
  settings?: SiteSettings;
}

export default function TopBar({ settings = {} }: Props) {
  /* ═══ بيانات ديناميكية من قاعدة البيانات ═══ */
  const { show, phone, email, address, workingTime } = getTopBarData(settings);
  const workingDays = settings.working_days_ar || settings.working_days || '';
  const workingHours = settings.working_hours_ar || settings.working_hours || '';
  const showTopBar = settings.show_top_bar !== false; // افتراضي true

  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastScrollRef = useRef(0);
  const ticking = useRef(false);

  /* ✅ منع FOUC - إضافة كلاس loaded بعد التحميل */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y > lastScrollRef.current && y > 160) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollRef.current = y;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // إخفاء الـ TopBar كاملاً إذا لم يكن هناك أي بيانات
  if (!showTopBar || (!phone && !email && !address && !workingDays)) {
    return null;
  }

  if (!show || (!phone && !email && !address && !workingTime)) {
    return null;
  }

  // تجميع نص ساعات العمل
  const workingTimeText = workingDays && workingHours
    ? `${workingDays} | ${workingHours}`
    : workingDays || workingHours;

  return (
    <div className={`tb ${!isVisible ? 'tb--hidden' : ''} ${isLoaded ? 'loaded' : ''}`}>
      <div className="tb__inner">
        {/* ── Left: working hours badge ── */}
        {workingTimeText && (
          <div className="tb__side tb__side--start">
            <div className="tb__badge">
              <span className="tb__pulse" />
              <Clock size={12} />
              <span>{workingTimeText}</span>
            </div>
          </div>
        )}

        {/* ── Right: info items ── */}
        <div className="tb__side tb__side--end">
          {address && (
            <>
              <div className="tb__item">
                <MapPin size={13} />
                <span>{address}</span>
              </div>
              {(email || phone) && <span className="tb__sep" />}
            </>
          )}

          {email && (
            <>
              <a href={`mailto:${email}`} className="tb__item tb__item--link">
                <Mail size={13} />
                <span>{email}</span>
              </a>
              {phone && <span className="tb__sep" />}
            </>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="tb__item tb__item--link tb__item--phone"
            >
              <span className="tb__phone-icon">
                <Phone size={12} />
              </span>
              <span>{phone}</span>
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        /* ───────── منع FOUC ───────── */
        .tb {
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tb.loaded {
          opacity: 1;
        }

        /* ───────── TopBar Styles ───────── */
        .tb {
          background: linear-gradient(90deg, #0b1120 0%, #111d35 50%, #0b1120 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          z-index: 95;
          transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tb--hidden {
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
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
        .tb__side { display: flex; align-items: center; gap: 0.5rem; }
        .tb__side--end { gap: 0; }
        .tb__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.22rem 0.7rem 0.22rem 0.55rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.18);
          border-radius: 99px;
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
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
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
          font-size: 0.73rem;
          font-weight: 500;
          color: rgba(203, 213, 225, 0.85);
          text-decoration: none;
          white-space: nowrap;
          padding: 0.35rem 0;
          transition: color 0.3s ease;
          letter-spacing: 0.01em;
        }
        .tb__item--link { cursor: pointer; }
        .tb__item--link:hover { color: #fbbf24; }
        .tb__item--phone {
          color: #fbbf24;
          font-weight: 700;
          font-size: 0.76rem;
          direction: ltr;
          unicode-bidi: plaintext;
        }
        .tb__item--phone:hover { color: #f59e0b; }
        .tb__phone-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.15);
          flex-shrink: 0;
          transition: background 0.3s ease;
        }
        .tb__item--phone:hover .tb__phone-icon {
          background: rgba(245, 158, 11, 0.25);
        }
        @media (max-width: 1100px) {
          .tb__side--start { display: none; }
          .tb__side--end { width: 100%; justify-content: flex-end; }
        }
        @media (max-width: 768px) { .tb { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .tb { transition: none; }
          .tb__pulse { animation: none; }
        }
      `}</style>
    </div>
  );
}