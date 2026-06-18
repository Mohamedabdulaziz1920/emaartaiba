'use client';

import Link from 'next/link';
import { imageUrl } from '@/lib/image';
import { useMemo, useState, useEffect, useRef } from 'react';

// ============================================
// 🎯 Types
// ============================================
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

// ============================================
// 🎨 Service Styles
// ============================================
const SERVICE_STYLES = [
  { icon: '🏠', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', glow: 'rgba(102,126,234,0.4)' },
  { icon: '🏢', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', glow: 'rgba(245,87,108,0.4)' },
  { icon: '🎨', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', glow: 'rgba(79,172,254,0.4)' },
  { icon: '🔧', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', glow: 'rgba(67,233,123,0.4)' },
  { icon: '🏗️', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', glow: 'rgba(250,112,154,0.4)' },
  { icon: '⚡', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', glow: 'rgba(161,140,209,0.4)' },
];

// ============================================
// 🛠️ Helper Functions
// ============================================
function getIcon(iconName: string | null | undefined, fallback: string): string {
  if (!iconName) return fallback;
  if (iconName.length <= 4) return iconName;

  const map: Record<string, string> = {
    home: '🏠', building: '🏢', paint: '🎨', tools: '🔧',
    construction: '🏗️', electric: '⚡', water: '💧', design: '📐',
    villa: '🏡', office: '🏬', house: '🏠', renovation: '🔨',
    maintenance: '🛠️', roof: '🏠', plumbing: '🚰', painting: '🎨',
    flooring: '🪵', carpentry: '🪚', welding: '⚡',
  };

  return map[iconName.toLowerCase()] || fallback;
}

function truncateText(text: string, max = 100): string {
  if (!text) return 'نوفر هذه الخدمة بأعلى معايير الجودة والاحترافية.';
  return text.length > max ? `${text.substring(0, max)}...` : text;
}

// ============================================
// 🔗 Intersection Observer Hook
// ============================================
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ============================================
// 🖥️ Main Component
// ============================================
export default function ServicesGrid({
  services,
  title = 'ماذا نقدم لك؟',
  subtitle = 'نقدم مجموعة شاملة من خدمات المقاولات العامة بأعلى معايير الجودة والاحترافية',
  showViewAll = true,
  limit = 6,
}: Props) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { ref: sectionRef, inView } = useInView(0.1);

  const displayedServices = useMemo(() => {
    return [...services]
      .sort((a, b) => {
        if (a.is_featured === b.is_featured) return (a.sort_order || 0) - (b.sort_order || 0);
        return a.is_featured ? -1 : 1;
      })
      .slice(0, limit);
  }, [services, limit]);

  if (!displayedServices.length) return null;

  const handleImageLoad = (url: string) => {
    setLoadedImages((prev) => new Set(prev).add(url));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setHoveredCard(id);
  };

  return (
    <section className="sg-section" dir="rtl" ref={sectionRef}>
      {/* Animated Background Elements */}
      <div className="sg-bg-grid" aria-hidden="true" />
      <div className="sg-bg-orb sg-orb-1" aria-hidden="true" />
      <div className="sg-bg-orb sg-orb-2" aria-hidden="true" />
      <div className="sg-bg-orb sg-orb-3" aria-hidden="true" />

      {/* Floating Particles */}
      <div className="sg-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="sg-particle" style={{
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--d': `${8 + Math.random() * 20}s`,
            '--s': `${0.3 + Math.random() * 0.7}`,
          } as React.CSSProperties} />
        ))}
      </div>

      <div className="sg-container">
        {/* Header */}
        <div className={`sg-header ${inView ? 'sg-visible' : ''}`}>
          <div className="sg-badge-wrap">
            <span className="sg-badge">
              <span className="sg-badge-dot" />
              <span className="sg-badge-icon">⚡</span>
              خدماتنا المميزة
            </span>
          </div>

          <h2 className="sg-title">
            <span className="sg-title-line">{title}</span>
          </h2>

          <p className="sg-subtitle">{subtitle}</p>

          <div className="sg-title-decoration" aria-hidden="true">
            <span className="sg-deco-line" />
            <span className="sg-deco-diamond">◆</span>
            <span className="sg-deco-line" />
          </div>
        </div>

        {/* Grid */}
        <div className="sg-grid">
          {displayedServices.map((service, index) => {
            const style = SERVICE_STYLES[index % SERVICE_STYLES.length];
            const mediaSrc = service.image_url || (service.image ? imageUrl(service.image) : null);
            const icon = getIcon(service.icon, style.icon);
            const titleText = service.title_ar || service.title || 'خدمة';
            const excerptText = truncateText(service.excerpt_ar || service.excerpt || '', 100);
            const isHovered = hoveredCard === service.id;

            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className={`sg-card ${inView ? 'sg-visible' : ''} ${service.is_featured ? 'sg-featured' : ''}`}
                style={{ '--delay': `${index * 0.12}s`, '--glow': style.glow } as React.CSSProperties}
                aria-label={`عرض تفاصيل خدمة ${titleText}`}
                onMouseMove={(e) => handleMouseMove(e, service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Spotlight Effect */}
                <div
                  className="sg-card-spotlight"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, var(--glow), transparent 40%)`,
                  }}
                />

                {/* Border Glow */}
                <div className="sg-card-border" />

                {/* Card Inner */}
                <div className="sg-card-inner">
                  {/* Media */}
                  <div className="sg-card-media" style={{ background: style.gradient }}>
                    <div className="sg-media-overlay" />
                    <div className="sg-media-pattern" aria-hidden="true" />

                    {mediaSrc ? (
                      <>
                        {!loadedImages.has(mediaSrc) && (
                          <div className="sg-image-skeleton">
                            <div className="sg-skeleton-shimmer" />
                            <span className="sg-skeleton-icon">📷</span>
                          </div>
                        )}
                        <img
                          src={mediaSrc}
                          alt={titleText}
                          className={`sg-card-image ${loadedImages.has(mediaSrc) ? 'sg-loaded' : ''}`}
                          loading="lazy"
                          decoding="async"
                          onLoad={() => handleImageLoad(mediaSrc)}
                        />
                      </>
                    ) : (
                      <div className="sg-icon-area">
                        <div className="sg-icon-ring sg-ring-1" />
                        <div className="sg-icon-ring sg-ring-2" />
                        <div className="sg-icon-ring sg-ring-3" />
                        <span className="sg-card-icon">{icon}</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="sg-badges">
                      {service.is_featured && (
                        <span className="sg-badge-featured">
                          <span className="sg-badge-star">⭐</span>
                          مميز
                        </span>
                      )}
                      {service.category && (
                        <span className="sg-badge-category">
                          {service.category.name_ar}
                        </span>
                      )}
                    </div>

                    {/* Number */}
                    <span className="sg-card-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="sg-card-content">
                    <div className="sg-content-top">
                      <div className="sg-chip-row">
                        <span className="sg-chip" style={{ '--chip-color': style.glow } as React.CSSProperties}>
                          {service.is_featured ? '🔥 الأكثر طلباً' : service.category?.name_ar || '✨ خدمة احترافية'}
                        </span>
                      </div>

                      <h3 className="sg-card-title">{titleText}</h3>

                      <p className="sg-card-excerpt">{excerptText}</p>
                    </div>

                    <div className="sg-card-footer">
                      <span className="sg-footer-text">اكتشف المزيد</span>
                      <span className="sg-footer-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        {showViewAll && services.length > limit && (
          <div className={`sg-cta-wrap ${inView ? 'sg-visible' : ''}`}>
            <Link href="/services" className="sg-cta-btn">
              <span className="sg-cta-bg" />
              <span className="sg-cta-content">
                <span>عرض جميع الخدمات</span>
                <svg className="sg-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </span>
            </Link>

            <p className="sg-cta-note">
              <span className="sg-cta-note-icon">📋</span>
              أكثر من {services.length} خدمة متاحة لك
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ========================================
           🌌 SECTION
        ======================================== */
        .sg-section {
          position: relative;
          overflow: hidden;
          padding: clamp(4rem, 8vw, 7rem) 0;
          background: linear-gradient(170deg, #f0f4ff 0%, #fefefe 32%, #fff9f5 65%, #f0f4ff 100%);
        }

        .sg-container {
          position: relative;
          z-index: 5;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 3vw, 2rem);
        }

        /* ========================================
           🎆 BACKGROUND
        ======================================== */
        .sg-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
          z-index: 0;
        }

        .sg-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }

        .sg-orb-1 {
          width: 500px;
          height: 500px;
          top: -180px;
          right: -120px;
          background: radial-gradient(circle, rgba(237,137,54,0.15), transparent 70%);
          animation: sg-float 18s ease-in-out infinite;
        }

        .sg-orb-2 {
          width: 400px;
          height: 400px;
          bottom: -140px;
          left: -100px;
          background: radial-gradient(circle, rgba(99,102,241,0.13), transparent 70%);
          animation: sg-float 22s ease-in-out infinite reverse;
        }

        .sg-orb-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(236,72,153,0.08), transparent 70%);
          animation: sg-float 15s ease-in-out infinite;
        }

        @keyframes sg-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 25px) scale(0.95); }
          75% { transform: translate(15px, 10px) scale(1.02); }
        }

        /* ========================================
           ✨ PARTICLES
        ======================================== */
        .sg-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .sg-particle {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(237,137,54,0.35);
          animation: sg-particle-float var(--d) ease-in-out infinite;
          transform: scale(var(--s));
        }

        @keyframes sg-particle-float {
          0%, 100% { transform: scale(var(--s)) translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(var(--s)) translateY(-30px) rotate(180deg); opacity: 0.8; }
        }

        /* ========================================
           📌 HEADER
        ======================================== */
        .sg-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto clamp(2.5rem, 5vw, 4rem);
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sg-header.sg-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sg-badge-wrap {
          margin-bottom: 1.5rem;
        }

        .sg-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          font-size: 0.88rem;
          font-weight: 800;
          color: #92400e;
          background: linear-gradient(135deg, rgba(237,137,54,0.12), rgba(251,191,36,0.1));
          border: 1px solid rgba(237,137,54,0.2);
          box-shadow: 0 8px 25px rgba(237,137,54,0.08);
          position: relative;
          overflow: hidden;
        }

        .sg-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: sg-badge-shine 3s ease-in-out infinite;
        }

        @keyframes sg-badge-shine {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .sg-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ed8936;
          animation: sg-pulse 2s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(237,137,54,0.5);
        }

        @keyframes sg-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .sg-badge-icon {
          font-size: 1rem;
          animation: sg-bounce 2s ease-in-out infinite;
        }

        @keyframes sg-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .sg-title {
          margin: 0 0 1.2rem;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .sg-title-line {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #ed8936 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sg-subtitle {
          margin: 0;
          max-width: 640px;
          margin-inline: auto;
          font-size: clamp(1rem, 1.5vw, 1.1rem);
          line-height: 2;
          color: #64748b;
        }

        .sg-title-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .sg-deco-line {
          width: 60px;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(90deg, transparent, rgba(237,137,54,0.5), transparent);
        }

        .sg-deco-diamond {
          color: #ed8936;
          font-size: 0.6rem;
          animation: sg-spin 6s linear infinite;
        }

        @keyframes sg-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ========================================
           📦 GRID
        ======================================== */
        .sg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
          gap: clamp(1.25rem, 2.5vw, 1.75rem);
          align-items: stretch;
        }

        /* ========================================
           🃏 CARD
        ======================================== */
        .sg-card {
          --glow: rgba(99,102,241,0.3);
          position: relative;
          display: block;
          text-decoration: none;
          border-radius: 1.5rem;
          opacity: 0;
          transform: translateY(50px) scale(0.97);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: var(--delay, 0s);
          isolation: isolate;
        }

        .sg-card.sg-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .sg-card-spotlight {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          z-index: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .sg-card-border {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 1px solid rgba(226,232,240,0.8);
          z-index: 2;
          pointer-events: none;
          transition: border-color 0.35s ease;
        }

        .sg-card:hover .sg-card-border {
          border-color: rgba(237,137,54,0.3);
        }

        .sg-card-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: inherit;
          overflow: hidden;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,0.03),
            0 10px 30px -5px rgba(0,0,0,0.06);
          transition: box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sg-card:hover .sg-card-inner {
          transform: translateY(-8px);
          box-shadow:
            0 25px 50px -12px rgba(0,0,0,0.12),
            0 12px 24px rgba(237,137,54,0.06);
        }

        .sg-card:focus-visible {
          outline: none;
        }

        .sg-card:focus-visible .sg-card-border {
          border-color: #ed8936;
          box-shadow: 0 0 0 3px rgba(237,137,54,0.15);
        }

        /* ========================================
           🖼️ MEDIA
        ======================================== */
        .sg-card-media {
          position: relative;
          height: clamp(200px, 25vw, 260px);
          overflow: hidden;
        }

        .sg-media-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(180deg,
            rgba(15,23,42,0) 0%,
            rgba(15,23,42,0.06) 60%,
            rgba(15,23,42,0.35) 100%
          );
          transition: opacity 0.4s ease;
        }

        .sg-card:hover .sg-media-overlay {
          opacity: 0.7;
        }

        .sg-media-pattern {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.5;
        }

        .sg-card-image {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transform: scale(1.08);
          filter: saturate(0.9);
          transition: opacity 0.5s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
        }

        .sg-card-image.sg-loaded {
          opacity: 1;
          transform: scale(1);
          filter: saturate(1);
        }

        .sg-card:hover .sg-card-image.sg-loaded {
          transform: scale(1.06);
          filter: saturate(1.1);
        }

        /* Skeleton */
        .sg-image-skeleton {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.05);
        }

        .sg-skeleton-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.25) 50%,
            transparent 100%
          );
          animation: sg-shimmer 1.5s ease-in-out infinite;
        }

        @keyframes sg-shimmer {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .sg-skeleton-icon {
          position: relative;
          z-index: 2;
          font-size: 2rem;
          opacity: 0.5;
          animation: sg-pulse 1.5s ease-in-out infinite;
        }

        /* Icon Area */
        .sg-icon-area {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sg-icon-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .sg-ring-1 {
          width: 180px;
          height: 180px;
          animation: sg-ring-pulse 4s ease-in-out infinite;
        }

        .sg-ring-2 {
          width: 140px;
          height: 140px;
          background: rgba(255,255,255,0.08);
          animation: sg-ring-pulse 4s ease-in-out infinite 0.5s;
        }

        .sg-ring-3 {
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          animation: sg-ring-pulse 4s ease-in-out infinite 1s;
        }

        @keyframes sg-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.7; }
        }

        .sg-card-icon {
          position: relative;
          z-index: 3;
          font-size: clamp(3.5rem, 7vw, 5rem);
          filter: drop-shadow(0 8px 20px rgba(0,0,0,0.2));
          animation: sg-icon-float 3s ease-in-out infinite;
        }

        @keyframes sg-icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* Badges */
        .sg-badges {
          position: absolute;
          top: 0.9rem;
          right: 0.9rem;
          left: 0.9rem;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .sg-badge-featured {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ed8936, #f56565);
          color: white;
          box-shadow: 0 8px 20px rgba(237,137,54,0.35);
          animation: sg-badge-glow 2s ease-in-out infinite;
        }

        @keyframes sg-badge-glow {
          0%, 100% { box-shadow: 0 8px 20px rgba(237,137,54,0.35); }
          50% { box-shadow: 0 8px 30px rgba(237,137,54,0.55); }
        }

        .sg-badge-star {
          animation: sg-bounce 1.5s ease-in-out infinite;
        }

        .sg-badge-category {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.5);
          color: #1e293b;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        /* Card Number */
        .sg-card-number {
          position: absolute;
          bottom: 0.8rem;
          left: 0.9rem;
          z-index: 5;
          font-size: 2.2rem;
          font-weight: 900;
          color: rgba(255,255,255,0.15);
          line-height: 1;
          font-feature-settings: 'tnum';
          transition: color 0.3s ease;
        }

        .sg-card:hover .sg-card-number {
          color: rgba(255,255,255,0.3);
        }

        /* ========================================
           📝 CONTENT
        ======================================== */
        .sg-card-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: clamp(1rem, 2vw, 1.5rem);
          gap: 1rem;
        }

        .sg-content-top {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sg-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .sg-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
          background: rgba(99,102,241,0.06);
          border: 1px solid rgba(99,102,241,0.1);
          color: #4338ca;
          transition: all 0.3s ease;
        }

        .sg-card:hover .sg-chip {
          background: rgba(237,137,54,0.08);
          border-color: rgba(237,137,54,0.15);
          color: #92400e;
        }

        .sg-card-title {
          margin: 0;
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          font-weight: 900;
          line-height: 1.5;
          color: #0f172a;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
        }

        .sg-card:hover .sg-card-title {
          color: #ed8936;
        }

        .sg-card-excerpt {
          margin: 0;
          font-size: clamp(0.88rem, 1vw, 0.95rem);
          line-height: 1.9;
          color: #64748b;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ========================================
           🔗 FOOTER
        ======================================== */
        .sg-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          margin-top: auto;
          border-top: 1px solid rgba(226,232,240,0.7);
          transition: border-color 0.3s ease;
        }

        .sg-card:hover .sg-card-footer {
          border-color: rgba(237,137,54,0.2);
        }

        .sg-footer-text {
          font-size: 0.92rem;
          font-weight: 800;
          color: #1e3a5f;
          transition: color 0.3s ease;
        }

        .sg-card:hover .sg-footer-text {
          color: #ed8936;
        }

        .sg-footer-arrow {
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          background: rgba(30,58,95,0.06);
          color: #1e3a5f;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sg-footer-arrow svg {
          width: 1rem;
          height: 1rem;
          transition: transform 0.3s ease;
        }

        .sg-card:hover .sg-footer-arrow {
          background: linear-gradient(135deg, #ed8936, #f56565);
          color: white;
          transform: translateX(-6px) scale(1.1);
          box-shadow: 0 8px 20px rgba(237,137,54,0.3);
        }

        .sg-card:hover .sg-footer-arrow svg {
          transform: translateX(-2px);
        }

        /* ========================================
           🎯 FEATURED CARD
        ======================================== */
        .sg-featured .sg-card-inner {
          background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,249,240,0.95));
        }

        .sg-featured .sg-card-border {
          border-color: rgba(237,137,54,0.15);
        }

        /* ========================================
           🔘 CTA
        ======================================== */
        .sg-cta-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: clamp(2.5rem, 5vw, 4rem);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
        }

        .sg-cta-wrap.sg-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sg-cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: min(100%, 280px);
          padding: 1.1rem 2rem;
          border-radius: 1rem;
          text-decoration: none;
          overflow: hidden;
          isolation: isolate;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.4s ease;
          box-shadow: 0 10px 30px rgba(30,58,95,0.15);
        }

        .sg-cta-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(135deg, #1e3a5f 0%, #2b6cb0 100%);
          transition: opacity 0.4s ease;
        }

        .sg-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(135deg, #ed8936 0%, #f56565 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .sg-cta-btn:hover::before {
          opacity: 1;
        }

        .sg-cta-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(237,137,54,0.25);
        }

        .sg-cta-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(237,137,54,0.2), 0 20px 40px rgba(237,137,54,0.25);
        }

        .sg-cta-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
          font-size: 1rem;
          font-weight: 900;
        }

        .sg-cta-icon {
          width: 1.1rem;
          height: 1.1rem;
          transition: transform 0.3s ease;
        }

        .sg-cta-btn:hover .sg-cta-icon {
          transform: translateX(-5px);
        }

        .sg-cta-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .sg-cta-note-icon {
          font-size: 1rem;
        }

        /* ========================================
           📱 RESPONSIVE
        ======================================== */
        @media (max-width: 767px) {
          .sg-section {
            padding: 3rem 0;
          }

          .sg-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .sg-card-media {
            height: 200px;
          }

          .sg-cta-btn {
            width: 100%;
          }

          .sg-bg-orb {
            display: none;
          }

          .sg-particles {
            display: none;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .sg-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .sg-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* ========================================
           ♿ REDUCED MOTION
        ======================================== */
        @media (prefers-reduced-motion: reduce) {
          .sg-card,
          .sg-card-inner,
          .sg-card-image,
          .sg-card-icon,
          .sg-header,
          .sg-cta-wrap,
          .sg-footer-arrow,
          .sg-cta-btn,
          .sg-badge-dot,
          .sg-badge-icon,
          .sg-deco-diamond {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }

          .sg-card.sg-visible {
            opacity: 1;
            transform: none;
          }

          .sg-header.sg-visible,
          .sg-cta-wrap.sg-visible {
            opacity: 1;
            transform: none;
          }

          .sg-card:hover .sg-card-inner,
          .sg-cta-btn:hover {
            transform: none !important;
          }

          .sg-particles,
          .sg-bg-orb {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}