'use client';

import Link from 'next/link';
import { imageUrl } from '@/lib/image';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════
   🎯 Types
   ═══════════════════════════════════════════════════ */
interface Category {
  id: number;
  name_ar: string;
  slug: string;
}

interface Service {
  id: number;
  title_ar: string;
  title?: string;
  slug: string;
  excerpt_ar: string;
  excerpt?: string;
  icon: string | null;
  image: string | null;
  image_url?: string | null;
  is_featured: boolean;
  sort_order: number;
  category?: Category | null;
}

interface Props {
  services: Service[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  limit?: number;
}

/* ═══════════════════════════════════════════════════
   🎨 Constants
   ═══════════════════════════════════════════════════ */
const DEFAULT_ICONS = ['🏠', '🏢', '🎨', '🔧', '🏗️', '⚡', '🛠️', '🎯', '⭐'] as const;

const ICON_MAP: Record<string, string> = {
  home: '🏠', building: '🏢', paint: '🎨', tools: '🔧',
  construction: '🏗️', electric: '⚡', water: '💧', design: '📐',
  villa: '🏡', office: '🏬', house: '🏠', renovation: '🔨',
  maintenance: '🛠️', roof: '🏠', plumbing: '🚰', painting: '🎨',
  flooring: '🪵', carpentry: '🪚', welding: '⚡',
};

const DEFAULT_EXCERPT = 'نوفر هذه الخدمة بأعلى معايير الجودة والاحترافية.';

/* ═══════════════════════════════════════════════════
   🛠️ Helpers
   ═══════════════════════════════════════════════════ */

/**
 * ✅ الحصول على أيقونة الخدمة
 */
function getIcon(iconName: string | null | undefined, fallback: string): string {
  if (!iconName) return fallback;
  if (iconName.length <= 4) return iconName;
  return ICON_MAP[iconName.toLowerCase()] || fallback;
}

/**
 * ✅ اختصار النص
 */
function truncate(text: string, max = 95): string {
  if (!text) return DEFAULT_EXCERPT;
  return text.length > max ? `${text.substring(0, max)}...` : text;
}

/* ═══════════════════════════════════════════════════
   🔍 Custom Hook - Intersection Observer
   ═══════════════════════════════════════════════════ */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, inView };
}

/* ═══════════════════════════════════════════════════
   🎯 Main Component
   ═══════════════════════════════════════════════════ */
export default function ServicesGrid({
  services,
  title = 'ماذا نقدم لك؟',
  subtitle = 'نقدم مجموعة شاملة من الخدمات بأعلى معايير الجودة والاحترافية',
  showViewAll = true,
  limit = 6,
}: Props) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { ref: sectionRef, inView } = useInView(0.08);

  /* ═══ Sorted & Limited Services ═══ */
  const displayed = useMemo(() => {
    if (!services || services.length === 0) return [];
    
    return [...services]
      .sort((a, b) => {
        // ✅ Featured first
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        // ✅ Then by sort_order
        return (a.sort_order || 0) - (b.sort_order || 0);
      })
      .slice(0, limit);
  }, [services, limit]);

  /* ═══ Image Handlers ═══ */
  const handleImageLoad = useCallback((url: string) => {
    setLoadedImages((prev) => new Set(prev).add(url));
  }, []);

  const handleImageError = useCallback((url: string) => {
    setFailedImages((prev) => new Set(prev).add(url));
  }, []);

  /* ═══ Empty State ═══ */
  if (!displayed.length) return null;

  return (
    <section className="sg" dir="rtl" ref={sectionRef} aria-label="خدماتنا">
      {/* ═══════════════════════════════════
          🎨 Background Decorations
          ═══════════════════════════════════ */}
      <div className="sg-bg-mesh" aria-hidden="true" />
      <div className="sg-orb sg-orb--1" aria-hidden="true" />
      <div className="sg-orb sg-orb--2" aria-hidden="true" />

      <div className="sg-wrap">
        {/* ═══════════════════════════════════
            📌 Header
            ═══════════════════════════════════ */}
        <header className={`sg-hdr ${inView ? 'sg-in' : ''}`}>
          <span className="sg-pill">
            <span className="sg-pill-dot" aria-hidden="true" />
            <span>⚡ خدماتنا المميزة</span>
          </span>
          
          <h2 className="sg-h2">
            <span className="sg-h2-grad">{title}</span>
          </h2>
          
          <p className="sg-sub">{subtitle}</p>
          
          <div className="sg-hdr-line" aria-hidden="true">
            <span className="sg-hdr-line__bar" />
            <span className="sg-hdr-line__diamond">◆</span>
            <span className="sg-hdr-line__bar" />
          </div>
        </header>

        {/* ═══════════════════════════════════
            🎯 Services Grid
            ═══════════════════════════════════ */}
        <div className="sg-grid" role="list">
          {displayed.map((service, idx) => {
            const imgSrc = service.image_url || (service.image ? imageUrl(service.image) : null);
            const icon = getIcon(service.icon, DEFAULT_ICONS[idx % DEFAULT_ICONS.length]);
            const serviceTitle = service.title_ar || service.title || 'خدمة';
            const excerpt = truncate(service.excerpt_ar || service.excerpt || '', 95);
            const hasValidImage = imgSrc && !failedImages.has(imgSrc);
            const isImageLoaded = imgSrc && loadedImages.has(imgSrc);

            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className={`sg-card ${inView ? 'sg-in' : ''} ${service.is_featured ? 'sg-card--featured' : ''}`}
                style={{ '--i': idx } as React.CSSProperties}
                aria-label={`عرض تفاصيل خدمة ${serviceTitle}`}
                role="listitem"
              >
                <div className="sg-shine" aria-hidden="true" />
                
                <div className="sg-inner">
                  {/* ═══ Image/Icon Frame ═══ */}
                  <div className="sg-frame">
                    <div className="sg-media">
                      {hasValidImage ? (
                        <>
                          {!isImageLoaded && (
                            <div className="sg-skel">
                              <div className="sg-skel-bar" />
                              <span className="sg-skel-icon">📷</span>
                            </div>
                          )}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={serviceTitle}
                            className={`sg-img ${isImageLoaded ? 'sg-img--loaded' : ''}`}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => handleImageLoad(imgSrc)}
                            onError={() => handleImageError(imgSrc)}
                          />
                        </>
                      ) : (
                        <div className="sg-icon-box">
                          <span className="sg-icon-ring sg-icon-ring--1" aria-hidden="true" />
                          <span className="sg-icon-ring sg-icon-ring--2" aria-hidden="true" />
                          <span className="sg-icon">{icon}</span>
                        </div>
                      )}

                      {/* ═══ Badges ═══ */}
                      <div className="sg-badges">
                        {service.is_featured && (
                          <span className="sg-badge sg-badge--featured">
                            ⭐ مميز
                          </span>
                        )}
                        {service.category && (
                          <span className="sg-badge sg-badge--category">
                            {service.category.name_ar}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ═══ Content ═══ */}
                  <h3 className="sg-title">{serviceTitle}</h3>
                  <p className="sg-desc">{excerpt}</p>

                  {/* ═══ Button ═══ */}
                  <div className="sg-btn-wrap">
                    <span className="sg-btn">
                      <span className="sg-btn-plus" aria-hidden="true">
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                      <span className="sg-btn-txt">اكتشف المزيد</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ═══════════════════════════════════
            🎯 View All Button
            ═══════════════════════════════════ */}
        {showViewAll && services.length > limit && (
          <div className={`sg-all ${inView ? 'sg-in' : ''}`}>
            <Link 
              href="/services" 
              className="sg-all-btn"
              aria-label={`عرض جميع الخدمات (${services.length} خدمة)`}
            >
              <span className="sg-all-bg" aria-hidden="true" />
              <span className="sg-all-txt">
                <span className="sg-all-plus" aria-hidden="true">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <span>عرض جميع الخدمات ({services.length})</span>
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════
          🎨 Styles
          ═══════════════════════════════════ */}
      <style jsx>{`
        /* ═══════════════════════════════════════════
           🌌 Section Base
           ═══════════════════════════════════════════ */
        .sg {
          position: relative;
          overflow: hidden;
          padding: clamp(4rem, 8vw, 7rem) 0;
          background: linear-gradient(
            175deg, 
            var(--service-grid-bg-start, var(--color-bg-light, #f8faff)) 0%, 
            var(--color-bg-card, #fff) 30%, 
            var(--service-grid-bg-end, #f1f5f9) 62%, 
            var(--service-grid-bg-start, var(--color-bg-light, #f8faff)) 100%
          );
          font-family: var(--font-family, 'Cairo'), sans-serif;
        }

        .sg-wrap {
          position: relative;
          z-index: 4;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 3vw, 2rem);
        }

        /* ═══════════════════════════════════════════
           🎨 Background Decorations
           ═══════════════════════════════════════════ */
        .sg-bg-mesh {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(
            ellipse 65% 65% at 50% 50%, 
            #000 25%, 
            transparent
          );
          -webkit-mask-image: radial-gradient(
            ellipse 65% 65% at 50% 50%, 
            #000 25%, 
            transparent
          );
        }

        .sg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          animation: sg-drift 20s ease-in-out infinite alternate;
        }

        .sg-orb--1 {
          width: 520px;
          height: 520px;
          top: -200px;
          right: -140px;
          background: rgba(212, 175, 55, 0.14);
        }

        .sg-orb--2 {
          width: 420px;
          height: 420px;
          bottom: -180px;
          left: -120px;
          background: rgba(99, 102, 241, 0.12);
          animation-direction: alternate-reverse;
        }

        @keyframes sg-drift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(35px, -25px) scale(1.06); }
          100% { transform: translate(-20px, 30px) scale(0.95); }
        }

        /* ═══════════════════════════════════════════
           📌 Header
           ═══════════════════════════════════════════ */
        .sg-hdr {
          text-align: center;
          max-width: 760px;
          margin: 0 auto clamp(2.5rem, 5vw, 4rem);
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sg-hdr.sg-in {
          opacity: 1;
          transform: none;
        }

        .sg-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.55rem 1.3rem;
          border-radius: 999px;
          font-size: 0.86rem;
          font-weight: 800;
          color: #92400e;
          background: linear-gradient(
            135deg, 
            rgba(212, 175, 55, 0.11), 
            rgba(251, 191, 36, 0.09)
          );
          border: 1px solid rgba(212, 175, 55, 0.18);
          margin-bottom: 1.2rem;
          position: relative;
          overflow: hidden;
        }

        .sg-pill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.45), 
            transparent
          );
          animation: sg-pill-shine 3.5s ease-in-out infinite;
        }

        @keyframes sg-pill-shine {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .sg-pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-secondary, #D4AF37);
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.55);
          animation: sg-pill-dot 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes sg-pill-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(0.75); }
        }

        .sg-h2 {
          margin: 0 0 1rem;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.22;
          letter-spacing: -0.025em;
          font-family: var(--font-family-headings, var(--font-family, 'Cairo')), sans-serif;
        }

        .sg-h2-grad {
          background: linear-gradient(
            135deg, 
            var(--color-primary-dark, #0f172a) 0%, 
            var(--color-primary, #1a365d) 45%, 
            var(--color-secondary, #D4AF37) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sg-sub {
          margin: 0 auto;
          max-width: 620px;
          font-size: clamp(0.97rem, 1.4vw, 1.08rem);
          line-height: 2;
          color: var(--color-text-muted, #64748b);
        }

        .sg-hdr-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-top: 1.4rem;
        }

        .sg-hdr-line__bar {
          width: 55px;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(212, 175, 55, 0.45), 
            transparent
          );
        }

        .sg-hdr-line__diamond {
          color: var(--color-secondary, #D4AF37);
          font-size: 0.55rem;
          animation: sg-diamond-spin 7s linear infinite;
        }

        @keyframes sg-diamond-spin {
          to { transform: rotate(360deg); }
        }

        /* ═══════════════════════════════════════════
           📦 Grid
           ═══════════════════════════════════════════ */
        .sg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
          gap: clamp(1.25rem, 2.5vw, 1.75rem);
        }

        /* ═══════════════════════════════════════════
           🃏 Card
           ═══════════════════════════════════════════ */
        .sg-card {
          --i: 0;
          --glow: rgba(212, 175, 55, 0.35);
          position: relative;
          display: block;
          text-decoration: none;
          opacity: 0;
          transform: translateY(55px) scale(0.96);
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: calc(var(--i) * 0.13s);
          isolation: isolate;
          border-radius: 2rem;
        }

        .sg-card.sg-in {
          opacity: 1;
          transform: none;
        }

        .sg-shine {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: 10;
          overflow: hidden;
          pointer-events: none;
        }

        .sg-shine::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 45%;
          height: 200%;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255, 255, 255, 0.18) 45%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.18) 55%,
            transparent 70%
          );
          transform: rotate(25deg) translateX(-100%);
          opacity: 0;
        }

        .sg-card:hover .sg-shine::before {
          opacity: 1;
          animation: sg-shine-slide 1.2s ease-out forwards;
        }

        @keyframes sg-shine-slide {
          0%   { transform: rotate(25deg) translateX(-100%); }
          100% { transform: rotate(25deg) translateX(320%); }
        }

        /* ═══ Card Inner ═══ */
        .sg-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1rem 1rem 1.4rem;
          border-radius: 2rem;
          background: linear-gradient(
            160deg, 
            var(--service-card-bg-start, var(--color-primary, #1e293b)) 0%, 
            var(--service-card-bg-end, var(--color-primary-dark, #0f172a)) 100%
          );
          border: 2px solid rgba(212, 175, 55, 0.35);
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.15), 
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      box-shadow 0.45s ease, 
                      border-color 0.45s ease;
        }

        .sg-card:hover .sg-inner {
          transform: translateY(-10px);
          border-color: var(--service-card-hover-border, var(--color-secondary, #D4AF37));
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.25), 
            0 15px 35px var(--service-card-glow, var(--glow)), 
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .sg-card:focus-visible {
          outline: none;
        }

        .sg-card:focus-visible .sg-inner {
          border-color: var(--color-secondary, #D4AF37);
          box-shadow: 
            0 0 0 4px rgba(212, 175, 55, 0.2), 
            0 30px 60px rgba(0, 0, 0, 0.2);
        }

        /* ═══════════════════════════════════════════
           🖼️ Image Frame
           ═══════════════════════════════════════════ */
        .sg-frame {
          position: relative;
          padding: 6px;
          border-radius: 1.5rem;
          background: linear-gradient(
            135deg, 
            var(--service-icon-gradient-start, var(--color-secondary, #D4AF37)) 0%, 
            var(--service-icon-gradient-end, var(--color-accent, #FFD700)) 50%, 
            var(--service-icon-gradient-start, var(--color-secondary, #D4AF37)) 100%
          );
          box-shadow: 
            0 8px 25px rgba(212, 175, 55, 0.25), 
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          margin-bottom: 1.2rem;
          transition: transform 0.4s ease;
        }

        .sg-card:hover .sg-frame {
          transform: scale(1.01);
        }

        .sg-media {
          position: relative;
          border-radius: 1.2rem;
          overflow: hidden;
          aspect-ratio: 4 / 3.2;
          background: var(--color-primary-dark, #1a202c);
        }

        .sg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transform: scale(1.06);
          filter: saturate(0.95);
          transition: opacity 0.5s ease, 
                      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), 
                      filter 0.4s ease;
        }

        .sg-img--loaded {
          opacity: 1;
          transform: scale(1);
          filter: saturate(1);
        }

        .sg-card:hover .sg-img--loaded {
          transform: scale(1.07);
          filter: saturate(1.1);
        }

        /* ═══ Skeleton ═══ */
        .sg-skel {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.15);
        }

        .sg-skel-icon {
          position: relative;
          z-index: 2;
          font-size: 2rem;
          opacity: 0.5;
          color: #fff;
        }

        .sg-skel-bar {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.15), 
            transparent
          );
          animation: sg-shimmer 1.5s ease-in-out infinite;
        }

        @keyframes sg-shimmer {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        /* ═══ Icon Fallback ═══ */
        .sg-icon-box {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg, 
            var(--service-icon-gradient-start, var(--color-secondary, #D4AF37)), 
            var(--service-icon-gradient-end, var(--color-accent, #FFD700))
          );
        }

        .sg-icon-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sg-icon-ring--1 {
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.08);
          animation: sg-ring-pulse 4s ease-in-out infinite;
        }

        .sg-icon-ring--2 {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: sg-ring-pulse 4s ease-in-out infinite 0.6s;
        }

        @keyframes sg-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.08); opacity: 0.65; }
        }

        .sg-icon {
          position: relative;
          z-index: 3;
          font-size: clamp(3rem, 6vw, 4.5rem);
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.25));
          animation: sg-icon-float 3s ease-in-out infinite;
        }

        @keyframes sg-icon-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        /* ═══ Badges ═══ */
        .sg-badges {
          position: absolute;
          top: 0.8rem;
          right: 0.8rem;
          left: 0.8rem;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.4rem;
          pointer-events: none;
        }

        .sg-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
          pointer-events: auto;
        }

        .sg-badge--featured {
          background: linear-gradient(
            135deg, 
            var(--color-secondary, #D4AF37), 
            #f56565
          );
          color: #fff;
          box-shadow: 0 6px 18px rgba(212, 175, 55, 0.45);
          animation: sg-badge-glow 2s ease-in-out infinite;
        }

        @keyframes sg-badge-glow {
          0%, 100% { box-shadow: 0 6px 18px rgba(212, 175, 55, 0.45); }
          50%      { box-shadow: 0 8px 28px rgba(212, 175, 55, 0.7); }
        }

        .sg-badge--category {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #1e293b;
          font-size: 0.68rem;
          font-weight: 700;
        }

        /* ═══════════════════════════════════════════
           📝 Title & Description
           ═══════════════════════════════════════════ */
        .sg-title {
          margin: 0 0 0.6rem;
          font-size: clamp(1.1rem, 1.5vw, 1.35rem);
          font-weight: 900;
          line-height: 1.5;
          color: var(--color-text-light, #fff);
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
          font-family: var(--font-family-headings, var(--font-family, 'Cairo')), sans-serif;
        }

        .sg-card:hover .sg-title {
          color: var(--color-accent, #FFD700);
        }

        .sg-desc {
          margin: 0 0 1.2rem;
          font-size: 0.87rem;
          line-height: 1.85;
          color: #94a3b8;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ═══════════════════════════════════════════
           🔘 Button
           ═══════════════════════════════════════════ */
        .sg-btn-wrap {
          margin-top: auto;
          display: flex;
          justify-content: center;
        }

        .sg-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.7rem 1.5rem 0.7rem 0.55rem;
          border-radius: 999px;
          background: #fff;
          color: #1e293b;
          font-size: 0.92rem;
          font-weight: 800;
          overflow: hidden;
          isolation: isolate;
          box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.15), 
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      box-shadow 0.35s ease, 
                      background 0.35s ease, 
                      color 0.35s ease, 
                      padding 0.35s ease;
        }

        .sg-btn-plus {
          width: 2.1rem;
          height: 2.1rem;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg, 
            var(--service-btn-bg-start, var(--color-secondary, #D4AF37)), 
            var(--service-btn-bg-end, var(--color-accent, #FFD700))
          );
          color: #fff;
          flex-shrink: 0;
          box-shadow: 
            0 4px 12px rgba(212, 175, 55, 0.4), 
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      background 0.35s ease;
        }

        .sg-btn-plus svg {
          width: 1rem;
          height: 1rem;
          transition: transform 0.4s ease;
        }

        .sg-btn-txt {
          position: relative;
          z-index: 1;
        }

        .sg-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 40%;
          height: 200%;
          background: linear-gradient(
            105deg, 
            transparent 40%, 
            rgba(255, 255, 255, 0.5) 50%, 
            transparent 60%
          );
          transform: rotate(25deg) translateX(-100%);
          opacity: 0;
          z-index: 2;
          pointer-events: none;
        }

        .sg-card:hover .sg-btn::after {
          opacity: 1;
          animation: sg-shine-slide 1s 0.2s ease-out forwards;
        }

        .sg-card:hover .sg-btn {
          transform: translateY(-2px);
          background: linear-gradient(
            135deg, 
            var(--service-btn-hover-bg-start, var(--color-secondary-dark, #B8960F)), 
            var(--service-btn-hover-bg-end, var(--color-secondary, #D4AF37))
          );
          color: #fff;
          padding-left: 0.7rem;
          padding-right: 1.7rem;
          box-shadow: 
            0 10px 28px rgba(212, 175, 55, 0.45), 
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .sg-card:hover .sg-btn-plus {
          background: #fff;
          color: var(--color-secondary, #D4AF37);
          transform: rotate(180deg) scale(1.1);
        }

        .sg-card:hover .sg-btn-plus svg {
          transform: rotate(-180deg);
        }

        /* ═══ Featured Card ═══ */
        .sg-card--featured .sg-inner {
          border-color: rgba(212, 175, 55, 0.55);
          background: linear-gradient(
            160deg, 
            var(--color-primary, #1e293b) 0%, 
            var(--color-primary-dark, #0f172a) 60%, 
            #1c1917 100%
          );
        }

        /* ═══════════════════════════════════════════
           🎯 View All Button
           ═══════════════════════════════════════════ */
        .sg-all {
          display: flex;
          justify-content: center;
          margin-top: clamp(2.5rem, 5vw, 4rem);
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s,
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s;
        }

        .sg-all.sg-in {
          opacity: 1;
          transform: none;
        }

        .sg-all-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: min(100%, 320px);
          padding: 1rem 2rem 1rem 0.85rem;
          border-radius: 999px;
          text-decoration: none;
          overflow: hidden;
          isolation: isolate;
          background: #fff;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.12), 
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      box-shadow 0.4s ease, 
                      background 0.4s ease;
        }

        .sg-all-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(
            135deg, 
            var(--service-btn-bg-start, var(--color-secondary, #D4AF37)), 
            var(--service-btn-bg-end, var(--color-accent, #FFD700))
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .sg-all-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3);
        }

        .sg-all-btn:hover .sg-all-bg {
          opacity: 1;
        }

        .sg-all-btn:hover .sg-all-txt {
          color: #fff;
        }

        .sg-all-btn:hover .sg-all-plus {
          background: #fff;
          color: var(--color-secondary, #D4AF37);
          transform: rotate(180deg) scale(1.1);
        }

        .sg-all-btn:focus-visible {
          outline: none;
          box-shadow: 
            0 0 0 4px rgba(212, 175, 55, 0.25), 
            0 20px 40px rgba(212, 175, 55, 0.3);
        }

        .sg-all-txt {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1e293b;
          font-size: 1rem;
          font-weight: 900;
          transition: color 0.4s ease;
        }

        .sg-all-plus {
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg, 
            var(--service-btn-bg-start, var(--color-secondary, #D4AF37)), 
            var(--service-btn-bg-end, var(--color-accent, #FFD700))
          );
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.45);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sg-all-plus svg {
          width: 1.15rem;
          height: 1.15rem;
        }

        .sg-all-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 40%;
          height: 200%;
          background: linear-gradient(
            105deg, 
            transparent 40%, 
            rgba(255, 255, 255, 0.45) 50%, 
            transparent 60%
          );
          transform: rotate(25deg) translateX(-100%);
          z-index: 3;
          pointer-events: none;
          opacity: 0;
        }

        .sg-all-btn:hover::after {
          opacity: 1;
          animation: sg-shine-slide 1s 0.15s ease-out forwards;
        }

        /* ═══════════════════════════════════════════
           📱 Responsive
           ═══════════════════════════════════════════ */
        
        /* Small phones */
        @media (max-width: 479px) {
          .sg { padding: 2.8rem 0; }
          .sg-grid { 
            grid-template-columns: 1fr; 
            gap: 1.25rem; 
          }
          .sg-card { border-radius: 1.6rem; }
          .sg-inner { 
            border-radius: 1.6rem; 
            padding: 0.85rem 0.85rem 1.2rem; 
          }
          .sg-frame { 
            border-radius: 1.25rem; 
            padding: 5px; 
          }
          .sg-media { 
            border-radius: 1rem; 
            aspect-ratio: 4 / 3.4; 
          }
          .sg-btn { 
            padding: 0.65rem 1.3rem 0.65rem 0.5rem; 
            font-size: 0.88rem; 
          }
          .sg-btn-plus { 
            width: 2rem; 
            height: 2rem; 
          }
          .sg-all-btn { width: 100%; }
          .sg-orb, .sg-bg-mesh { display: none; }
        }

        /* Small tablets */
        @media (min-width: 480px) and (max-width: 767px) {
          .sg-grid { 
            grid-template-columns: 1fr; 
            gap: 1.4rem; 
            max-width: 420px; 
            margin-left: auto; 
            margin-right: auto; 
          }
        }

        /* Tablets */
        @media (min-width: 768px) and (max-width: 1023px) {
          .sg-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Desktops */
        @media (min-width: 1024px) {
          .sg-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* Large Desktops */
        @media (min-width: 1400px) {
          .sg-grid { 
            grid-template-columns: repeat(3, 1fr); 
            gap: 2rem; 
          }
        }

        /* ═══════════════════════════════════════════
           ♿ Accessibility & Motion
           ═══════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .sg-card.sg-in,
          .sg-hdr.sg-in,
          .sg-all.sg-in { 
            opacity: 1; 
            transform: none; 
          }
          
          .sg-card:hover .sg-inner,
          .sg-card:hover .sg-btn,
          .sg-card:hover .sg-btn-plus,
          .sg-all-btn:hover,
          .sg-all-btn:hover .sg-all-plus { 
            transform: none !important; 
          }
          
          .sg-orb { display: none; }
        }

        /* ═══════════════════════════════════════════
           🖨️ Print Styles
           ═══════════════════════════════════════════ */
        @media print {
          .sg-orb,
          .sg-bg-mesh,
          .sg-shine,
          .sg-all { 
            display: none; 
          }
          
          .sg {
            padding: 2rem 0;
            background: white;
          }
          
          .sg-inner {
            background: white;
            border: 2px solid #ddd;
            box-shadow: none;
            break-inside: avoid;
          }
          
          .sg-title,
          .sg-desc {
            color: black;
          }
        }
      `}</style>
    </section>
  );
}