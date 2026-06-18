'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import type { HeroSlide } from '@/lib/api';
import { settingsHelpers, type SiteSettings } from '@/lib/settings';

/* ─────────────────────────── Types ─────────────────────────── */
interface Props {
  slides: HeroSlide[];
  settings?: SiteSettings;
  autoplay?: boolean;
  autoplayDelay?: number;
}

type SettingsWithWhatsapp = SiteSettings & {
  whatsapp?: string | null;
};

/* ─────────────────────────── Helpers ─────────────────────────── */
const getImageUrl = (image: string | null | undefined): string => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const cleanPath = image.replace(/^\/+/, '');
  return cleanPath.startsWith('storage/')
    ? `${backendUrl}/${cleanPath}`
    : `${backendUrl}/storage/${cleanPath}`;
};

function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  if (hex.startsWith('var(') || hex.startsWith('rgb')) return hex;
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(0,0,0,${alpha})`;
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha))})`;
}

const toEnglishDigits = (v: string = '') =>
  v
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

const toWhatsAppNumber = (v: string = ''): string => {
  const digits = toEnglishDigits(v).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0') && digits.length >= 9) return `966${digits.slice(1)}`;
  return digits;
};

/* ─────────────────────────── Maps ─────────────────────────── */
const TITLE_SIZE_MAP: Record<string, string> = {
  '2xl': 'clamp(1.25rem,2.2vw,1.5rem)',
  '3xl': 'clamp(1.5rem,2.8vw,1.875rem)',
  '4xl': 'clamp(1.75rem,3.4vw,2.25rem)',
  '5xl': 'clamp(2rem,4vw,3rem)',
  '6xl': 'clamp(2.25rem,4.8vw,3.5rem)',
  '7xl': 'clamp(2.5rem,5.4vw,4.25rem)',
  'text-2xl': 'clamp(1.25rem,2.2vw,1.5rem)',
  'text-3xl': 'clamp(1.5rem,2.8vw,1.875rem)',
  'text-4xl': 'clamp(1.75rem,3.4vw,2.25rem)',
  'text-5xl': 'clamp(2rem,4vw,3rem)',
  'text-6xl': 'clamp(2.25rem,4.8vw,3.5rem)',
  'text-7xl': 'clamp(2.5rem,5.4vw,4.25rem)',
};

const SUBTITLE_SIZE_MAP: Record<string, string> = {
  sm: 'clamp(0.75rem,1.3vw,0.875rem)',
  md: 'clamp(0.813rem,1.5vw,0.938rem)',
  lg: 'clamp(0.875rem,1.8vw,1.063rem)',
  xl: 'clamp(0.938rem,2vw,1.125rem)',
  '2xl': 'clamp(1rem,2.3vw,1.25rem)',
  'text-sm': 'clamp(0.75rem,1.3vw,0.875rem)',
  'text-base': 'clamp(0.813rem,1.5vw,0.938rem)',
  'text-lg': 'clamp(0.875rem,1.8vw,1.063rem)',
  'text-xl': 'clamp(0.938rem,2vw,1.125rem)',
};

const DESC_SIZE_MAP: Record<string, string> = {
  sm: 'clamp(0.813rem,1.3vw,0.938rem)',
  md: 'clamp(0.875rem,1.5vw,1rem)',
  lg: 'clamp(0.938rem,1.8vw,1.063rem)',
  xl: 'clamp(1rem,2vw,1.125rem)',
  '2xl': 'clamp(1.063rem,2.3vw,1.25rem)',
  'text-sm': 'clamp(0.813rem,1.3vw,0.938rem)',
  'text-base': 'clamp(0.875rem,1.5vw,1rem)',
  'text-lg': 'clamp(0.938rem,1.8vw,1.063rem)',
  'text-xl': 'clamp(1rem,2vw,1.125rem)',
};

const FONT_WEIGHT_MAP: Record<string, string> = {
  '300': '300', '400': '400', '500': '500', '600': '600',
  '700': '700', '800': '800', '900': '900',
  'font-light': '300', 'font-normal': '400', 'font-medium': '500',
  'font-semibold': '600', 'font-bold': '700', 'font-extrabold': '800', 'font-black': '900',
};

const FONT_FAMILY_MAP: Record<string, string> = {
  default: 'inherit',
  Cairo: '"Cairo",sans-serif',
  Tajawal: '"Tajawal",sans-serif',
  Amiri: '"Amiri",serif',
};

const normalizeAlign = (v?: string): 'right' | 'center' | 'left' => {
  const c = v?.replace('text-', '') || 'right';
  if (c === 'right' || c === 'end') return 'right';
  if (c === 'left' || c === 'start') return 'left';
  if (c === 'center') return 'center';
  return 'right';
};

const normalizePosition = (v?: string): 'right' | 'center' | 'left' => {
  if (v === 'right' || v === 'end') return 'right';
  if (v === 'left' || v === 'start') return 'left';
  if (v === 'center') return 'center';
  return 'right';
};

/* ─────────────────────────── Defaults ─────────────────────────── */
const DEFAULT_DESIGN = {
  title_color: '#FFFFFF',
  subtitle_color: '#F59E0B',
  description_color: '#FFFFFF',
  title_size: '5xl',
  subtitle_size: 'lg',
  description_size: 'xl',
  title_weight: '900',
  font_family: 'default',
  text_align: 'right' as const,
  content_position: 'right' as const,
  vertical_position: 'center' as const,
  content_max_width: 720,
  overlay_type: 'gradient' as const,
  overlay_color: '#000000',
  overlay_opacity: 55,
  button_bg_color: '#F59E0B',
  button_text_color: '#FFFFFF',
  button_hover_color: '#D97706',
  transition_effect: 'fade' as const,
  enable_ken_burns: false,
  display_duration: 6,
  show_decoration: true,
  decoration_color: '#F59E0B',
};

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */
export default function HeroSlider({
  slides = [],
  settings = {},
  autoplay = true,
  autoplayDelay,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(autoplay);
  const [isHovering, setIsHovering] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progressKey, setProgressKey] = useState(0);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Contact info
  const phone = String(settings.phone || settingsHelpers.defaults.phone || '').trim();
  const whatsVal = String(((settings as SettingsWithWhatsapp).whatsapp || phone || '')).trim();
  const whatsNum = toWhatsAppNumber(whatsVal);
  const whatsHref = whatsNum ? `https://wa.me/${whatsNum}` : settingsHelpers.phoneLink(phone);

  const slide = slides[currentSlide] || slides[0];

  const design = useMemo(() => {
    const m = { ...DEFAULT_DESIGN, ...(slide?.design || {}) };
    return {
      ...m,
      text_align: normalizeAlign(String(m.text_align || 'right')),
      content_position: normalizePosition(String(m.content_position || 'right')),
    };
  }, [slide]);

  const delay = useMemo(() => {
    const dur = Number(design.display_duration);
    const ms = dur > 0 ? dur * 1000 : 5000;
    return autoplayDelay && autoplayDelay > 0 ? autoplayDelay : ms;
  }, [autoplayDelay, design.display_duration]);

  // Guard index
  useEffect(() => {
    if (slides.length > 0 && currentSlide > slides.length - 1) setCurrentSlide(0);
  }, [slides.length, currentSlide]);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1 || isHovering) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrentSlide((p) => (p + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, delay);
    return () => clearInterval(id);
  }, [isAutoPlay, slides.length, delay, isHovering]);

  // Cleanup
  useEffect(() => () => { if (resumeRef.current) clearTimeout(resumeRef.current); }, []);

  const pauseAuto = useCallback(() => {
    setIsAutoPlay(false);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    if (autoplay) resumeRef.current = setTimeout(() => setIsAutoPlay(true), 10000);
  }, [autoplay]);

  const goTo = useCallback((i: number, dir: 1 | -1 = 1) => {
    if (!slides.length) return;
    setDirection(dir);
    setCurrentSlide((i + slides.length) % slides.length);
    setProgressKey((k) => k + 1);
    pauseAuto();
  }, [slides.length, pauseAuto]);

  const next = () => goTo(currentSlide + 1, 1);
  const prev = () => goTo(currentSlide - 1, -1);

  /* ── Empty state ── */
  if (!slides.length || !slide) {
    return (
      <section className="hero-empty">
        <div className="hero-empty-inner">
          <span className="hero-empty-icon">🎬</span>
          <h2>لا توجد سلايدات بعد</h2>
          <p>أضف سلايدات من لوحة التحكم</p>
        </div>
        <style jsx>{`
          .hero-empty {
            min-height: 560px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #fff;
          }
          .hero-empty-inner { text-align: center; }
          .hero-empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
          .hero-empty h2 { font-size: 1.75rem; margin-bottom: 0.5rem; font-weight: 800; }
          .hero-empty p { opacity: 0.7; font-size: 1rem; }
        `}</style>
      </section>
    );
  }

  /* ── Dynamic styles ── */
  const overlayStyle = (): CSSProperties => {
    if (design.overlay_type === 'none') return { display: 'none' };
    const rawOp = Number(design.overlay_opacity);
    const op = Number.isFinite(rawOp) ? rawOp / 100 : 0.55;
    const c = String(design.overlay_color || '#000000');
    if (design.overlay_type === 'solid')
      return { background: hexToRgba(c, Math.max(0, Math.min(1, op))) };
    const s = hexToRgba(c, Math.min(1, op + 0.32));
    const m = hexToRgba(c, Math.min(1, op + 0.05));
    const l = hexToRgba(c, Math.max(0, op - 0.35));
    if (design.content_position === 'left')
      return { background: `linear-gradient(to right,${s} 0%,${m} 45%,${l} 100%)` };
    if (design.content_position === 'center')
      return { background: `radial-gradient(ellipse at center,${s} 0%,${m} 50%,${l} 100%)` };
    return { background: `linear-gradient(to left,${s} 0%,${m} 45%,${l} 100%)` };
  };

  const contentWrapStyle = (): CSSProperties => {
    const vMap: Record<string, string> = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
    return { alignItems: vMap[String(design.vertical_position)] || 'center' };
  };

  const contentStyle = (): CSSProperties => {
    const maxW = Math.max(320, Number(design.content_max_width) || 720);
    const posMap: Record<string, CSSProperties> = {
      right: { marginRight: 0, marginLeft: 'auto' },
      center: { marginRight: 'auto', marginLeft: 'auto' },
      left: { marginLeft: 0, marginRight: 'auto' },
    };
    return {
      maxWidth: `min(${maxW}px,100%)`,
      textAlign: design.text_align,
      fontFamily: FONT_FAMILY_MAP[String(design.font_family)] || 'inherit',
      direction: 'rtl',
      ...(posMap[design.content_position] || posMap.right),
    };
  };

  const flexAlign = (): CSSProperties => {
    const m: Record<string, string> = { right: 'flex-start', center: 'center', left: 'flex-end' };
    return { justifyContent: m[design.text_align] || 'flex-start' };
  };

  /* ── Animation variants ── */
  const imgVariants = {
    fade: {
      initial: { opacity: 0, scale: 1.08 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
    },
    slide: {
      initial: { opacity: 0, x: direction > 0 ? 120 : -120 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: direction > 0 ? -120 : 120 },
    },
    zoom: {
      initial: { opacity: 0, scale: 1.25 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.92 },
    },
    flip: {
      initial: { opacity: 0, rotateY: 70 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: -70 },
    },
  };

  const anim = imgVariants[design.transition_effect as keyof typeof imgVariants] || imgVariants.fade;
  const imgUrl = getImageUrl(slide.image);
  const showContact = Boolean(slide.show_phone_button && phone);

  return (
    <section
      className="hero-slider"
      dir="rtl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* ── Background image ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${currentSlide}`}
          initial={anim.initial}
          animate={anim.animate}
          exit={anim.exit}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`hero-bg ${design.enable_ken_burns ? 'ken-burns' : ''}`}
        >
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={slide.image_alt_ar || slide.title_ar || 'صورة السلايدر'}
              className="hero-bg-img"
              loading="eager"
            />
          ) : (
            <div className="hero-bg-fallback" />
          )}
          <div className="hero-overlay" style={overlayStyle()} />
          {/* Subtle noise texture */}
          <div className="hero-noise" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      {/* ── Decorative elements ── */}
      {design.show_decoration && (
        <motion.div
          className="hero-deco"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          aria-hidden="true"
        >
          <span className="deco-bar deco-bar--1" style={{ background: design.decoration_color }} />
          <span className="deco-bar deco-bar--2" style={{ background: design.decoration_color }} />
          <span className="deco-bar deco-bar--3" style={{ background: design.decoration_color }} />
          <span
            className="deco-glow"
            style={{ background: `radial-gradient(circle,${hexToRgba(design.decoration_color, 0.35)} 0%,transparent 70%)` }}
          />
        </motion.div>
      )}

      {/* ── Floating particles (pure CSS) ── */}
      <div className="hero-particles" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      {/* ── Content ── */}
      <div className="hero-body" style={contentWrapStyle()}>
        <div className="hero-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, delay: 0.18, ease: 'easeOut' }}
              className="hero-content"
              style={contentStyle()}
            >
              {/* Subtitle */}
              {slide.subtitle_ar && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.35 }}
                  className="hero-subtitle"
                  style={{
                    color: design.subtitle_color,
                    fontSize: SUBTITLE_SIZE_MAP[String(design.subtitle_size)] || SUBTITLE_SIZE_MAP.lg,
                  }}
                >
                  <span className="subtitle-accent" style={{ background: design.subtitle_color }} />
                  <span>{slide.subtitle_ar}</span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.48 }}
                className="hero-title"
                style={{
                  color: design.title_color,
                  fontSize: TITLE_SIZE_MAP[String(design.title_size)] || TITLE_SIZE_MAP['5xl'],
                  fontWeight: FONT_WEIGHT_MAP[String(design.title_weight)] || design.title_weight,
                }}
              >
                {slide.title_ar}
              </motion.h1>

              {/* Description */}
              {slide.description_ar && (
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.62 }}
                  className="hero-desc"
                  style={{
                    color: design.description_color,
                    fontSize: DESC_SIZE_MAP[String(design.description_size)] || DESC_SIZE_MAP.xl,
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.description_ar }}
                />
              )}

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.78 }}
                className="hero-actions"
                style={flexAlign()}
              >
                {slide.button_text_ar && (
                  <Link
                    href={slide.button_link || '#'}
                    className="h-btn h-btn--primary"
                    style={{
                      '--btn-bg': design.button_bg_color,
                      '--btn-bg2': design.button_hover_color,
                      '--btn-color': design.button_text_color,
                    } as CSSProperties}
                  >
                    <span className="h-btn__label">
                      <strong>{slide.button_text_ar}</strong>
                    </span>
                    <span className="h-btn__arrow">
                      <ArrowLeft size={17} strokeWidth={2.5} />
                    </span>
                  </Link>
                )}

                {showContact && (
                  <>
                    <a
                      href={settingsHelpers.phoneLink(phone)}
                      className="h-btn h-btn--glass h-btn--call"
                      aria-label={`اتصل بنا على ${phone}`}
                      style={{ '--accent': design.button_bg_color } as CSSProperties}
                    >
                      <span className="h-btn__icon h-btn__icon--accent">
                        <Phone size={18} strokeWidth={2.5} />
                      </span>
                      <span className="h-btn__copy">
                        <strong>اتصل الآن</strong>
                        <small>{phone}</small>
                      </span>
                    </a>

                    <a
                      href={whatsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-btn h-btn--whatsapp"
                      aria-label="تواصل معنا عبر واتساب"
                    >
                      <span className="h-btn__icon">
                        <MessageCircle size={18} strokeWidth={2.5} />
                      </span>
                      <span className="h-btn__copy">
                        <strong>واتساب</strong>
                        <small>{whatsVal || phone}</small>
                      </span>
                    </a>
                  </>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      {slides.length > 1 && (
        <>
          <motion.button
            type="button"
            onClick={prev}
            className="hero-arrow hero-arrow--prev"
            aria-label="السابق"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </motion.button>
          <motion.button
            type="button"
            onClick={next}
            className="hero-arrow hero-arrow--next"
            aria-label="التالي"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </motion.button>
        </>
      )}

      {/* ── Dots / Progress ── */}
      {slides.length > 1 && (
        <div className="hero-indicators" aria-label="تنقل السلايدر">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i, i > currentSlide ? 1 : -1)}
              className={`hero-ind ${i === currentSlide ? 'hero-ind--active' : ''}`}
              aria-label={`اذهب للسلايد ${i + 1}`}
            >
              {i === currentSlide && isAutoPlay && !isHovering && (
                <motion.span
                  key={progressKey}
                  className="hero-ind__progress"
                  style={{ background: design.decoration_color }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: delay / 1000, ease: 'linear' }}
                />
              )}
              <span
                className="hero-ind__dot"
                style={{
                  background: i === currentSlide ? design.decoration_color : 'rgba(255,255,255,0.45)',
                }}
              />
            </button>
          ))}

          {/* Slide counter */}
          <span className="hero-counter">
            <span className="hero-counter__current">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="hero-counter__sep">/</span>
            <span className="hero-counter__total">{String(slides.length).padStart(2, '0')}</span>
          </span>
        </div>
      )}

      {/* ── Bottom gradient line ── */}
      <div className="hero-bottom-line" style={{ background: `linear-gradient(90deg,transparent,${design.decoration_color},transparent)` }} />

      {/* ═══════ Styles ═══════ */}
      <style jsx>{`
        /* ───── Base ───── */
        .hero-slider {
          position: relative;
          width: 100%;
          min-height: 540px;
          height: clamp(540px, 75vh, 800px);
          height: clamp(540px, 75svh, 800px);
          max-height: 800px;
          overflow: hidden;
          background: #0a0e1a;
          isolation: isolate;
        }

        /* ───── Background ───── */
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          will-change: transform, opacity;
        }
        .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .hero-bg-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%);
        }
        .ken-burns .hero-bg-img {
          animation: kb 18s ease-in-out infinite alternate;
        }
        @keyframes kb {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.12) translate(-1.2%, -1%); }
        }

        /* Overlay */
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        /* Noise texture overlay */
        .hero-noise {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          mix-blend-mode: overlay;
        }

        /* ───── Decoration ───── */
        .hero-deco {
          position: absolute;
          top: 50%;
          right: clamp(1.5rem, 5vw, 5rem);
          transform: translateY(-50%);
          z-index: 6;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }
        .deco-bar {
          width: 5px;
          border-radius: 999px;
          opacity: 0.9;
        }
        .deco-bar--1 { height: 48px; box-shadow: 0 0 22px currentColor; }
        .deco-bar--2 { height: 80px; margin-right: 14px; box-shadow: 0 0 28px currentColor; }
        .deco-bar--3 { height: 36px; box-shadow: 0 0 18px currentColor; }
        .deco-glow {
          position: absolute;
          width: 120px;
          height: 120px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: -1;
        }

        /* ───── Particles ───── */
        .hero-particles {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          overflow: hidden;
        }
        .hero-particles span {
          position: absolute;
          display: block;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          animation: float linear infinite;
        }
        .hero-particles span:nth-child(1) { width: 6px; height: 6px; top: 15%; left: 10%; animation-duration: 22s; animation-delay: 0s; }
        .hero-particles span:nth-child(2) { width: 4px; height: 4px; top: 55%; left: 80%; animation-duration: 28s; animation-delay: 2s; }
        .hero-particles span:nth-child(3) { width: 8px; height: 8px; top: 70%; left: 35%; animation-duration: 20s; animation-delay: 4s; }
        .hero-particles span:nth-child(4) { width: 3px; height: 3px; top: 30%; left: 60%; animation-duration: 25s; animation-delay: 1s; }
        .hero-particles span:nth-child(5) { width: 5px; height: 5px; top: 80%; left: 50%; animation-duration: 18s; animation-delay: 3s; }
        @keyframes float {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(30px) rotate(720deg); opacity: 0; }
        }

        /* ───── Content wrapper ───── */
        .hero-body {
          position: relative;
          z-index: 10;
          height: 100%;
          min-height: inherit;
          display: flex;
          padding: clamp(2rem, 4vh, 4rem) 0 calc(clamp(2rem, 4vh, 4rem) + 28px);
          box-sizing: border-box;
        }
        .hero-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding-inline: clamp(4rem, 7vw, 7rem);
          display: flex;
          box-sizing: border-box;
        }
        .hero-content {
          width: 100%;
          color: #fff;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* ───── Subtitle ───── */
        .hero-subtitle {
          display: inline-flex !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 1.1rem;
          line-height: 1.4;
          font-weight: 700;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4);
          letter-spacing: 0.02em;
        }
        .subtitle-accent {
          display: inline-block !important;
          width: 5px !important;
          min-width: 5px !important;
          height: 26px !important;
          border-radius: 999px !important;
          flex-shrink: 0 !important;
          box-shadow: 0 0 20px currentColor;
        }

        /* ───── Title ───── */
        .hero-title {
          line-height: 1.15;
          margin: 0 0 1.1rem;
          text-shadow: 0 6px 30px rgba(0,0,0,0.55);
          letter-spacing: -0.03em;
          word-wrap: break-word;
          overflow-wrap: break-word;
          text-wrap: balance;
        }

        /* ───── Description ───── */
        .hero-desc {
          line-height: 1.75;
          margin-bottom: 0;
          opacity: 0.94;
          text-shadow: 0 2px 14px rgba(0,0,0,0.45);
          max-width: 100%;
        }

        /* ───── Navigation arrows ───── */
        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 16px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 22;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .hero-arrow:hover {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.35);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .hero-arrow--prev { left: 20px; }
        .hero-arrow--next { right: 20px; }

        /* ───── Indicators ───── */
        .hero-indicators {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 24;
        }
        .hero-ind {
          position: relative;
          width: 12px;
          height: 12px;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .hero-ind--active {
          width: 40px;
        }
        .hero-ind__dot {
          display: block;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          transition: all 0.35s ease;
        }
        .hero-ind--active .hero-ind__dot {
          height: 5px;
        }
        .hero-ind__progress {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          height: 5px;
          top: 50%;
          transform: translateY(-50%);
          transform-origin: right;
          opacity: 0.4;
        }

        /* Counter */
        .hero-counter {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-right: 12px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.6);
          font-variant-numeric: tabular-nums;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .hero-counter__current {
          color: #fff;
          font-size: 0.88rem;
        }
        .hero-counter__sep {
          opacity: 0.4;
          margin: 0 1px;
        }

        /* ───── Bottom line ───── */
        .hero-bottom-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          z-index: 20;
          opacity: 0.5;
        }

        /* ═══════════════════════════════════════════
           Responsive
           ═══════════════════════════════════════════ */
        @media (max-width: 1200px) {
          .hero-container { padding-inline: clamp(3rem, 6vw, 5.5rem); }
          .hero-deco { right: clamp(1.2rem, 3.5vw, 3rem); }
        }

        @media (max-width: 900px) {
          .hero-slider {
            min-height: 500px;
            height: clamp(500px, 70vh, 700px);
          }
          .hero-container { padding-inline: clamp(2rem, 5vw, 4rem); }
          .hero-deco { display: none; }
          .hero-arrow {
            width: 42px;
            height: 42px;
            border-radius: 12px;
          }
          .hero-arrow--prev { left: 12px; }
          .hero-arrow--next { right: 12px; }
          .hero-particles { display: none; }
        }

        @media (max-width: 640px) {
          .hero-slider {
            height: auto;
            min-height: 560px;
            max-height: none;
          }
          .hero-body {
            padding: 2.5rem 0 5rem;
          }
          .hero-container {
            padding-inline: 1.25rem;
          }
          .hero-content {
            max-width: 100% !important;
            margin-inline: auto !important;
            text-align: center !important;
          }
          .hero-subtitle {
            justify-content: center !important;
            margin-bottom: 0.85rem;
          }
          .hero-title {
            font-size: clamp(1.5rem, 7vw, 2.25rem) !important;
            margin-bottom: 0.85rem;
          }
          .hero-desc {
            font-size: 0.9rem !important;
            line-height: 1.7;
          }
          .hero-arrow {
            width: 38px;
            height: 38px;
            top: auto;
            bottom: 22px;
            transform: none;
            border-radius: 10px;
          }
          .hero-arrow--prev { left: 14px; }
          .hero-arrow--next { right: 14px; }
          .hero-indicators { bottom: 32px; }
          .hero-counter { display: none; }
        }

        @media (max-width: 420px) {
          .hero-slider { min-height: 580px; }
          .hero-body { padding-top: 2rem; }
          .hero-title { font-size: clamp(1.3rem, 7.5vw, 1.9rem) !important; }
          .hero-desc { font-size: 0.84rem !important; }
        }

        @media (min-width: 1440px) {
          .hero-slider {
            height: clamp(640px, 78vh, 880px);
            max-height: 880px;
          }
          .hero-container {
            max-width: 1520px;
            padding-inline: clamp(6rem, 8vw, 9rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ken-burns .hero-bg-img { animation: none; }
          .hero-particles { display: none; }
        }
      `}</style>

      <style jsx global>{`
        /* ═══════ Global button styles ═══════ */
        .hero-slider .hero-desc p { margin: 0; }
        .hero-slider .hero-desc p + p { margin-top: 0.5rem; }

        .hero-slider .hero-actions {
          display: flex !important;
          align-items: center !important;
          gap: 0.7rem !important;
          flex-wrap: wrap !important;
          margin-top: 1.5rem;
          width: 100%;
          position: relative;
          z-index: 25;
          direction: rtl;
        }

        /* ─── Base button ─── */
        .hero-slider .h-btn {
          position: relative;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          min-height: 50px;
          max-width: 100%;
          padding: 0.65rem 1.1rem;
          border-radius: 14px;
          text-decoration: none !important;
          color: #fff !important;
          border: 1px solid rgba(255,255,255,0.15);
          overflow: hidden;
          isolation: isolate;
          white-space: nowrap;
          font-weight: 600;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        /* Shine effect */
        .hero-slider .h-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          transform: translateX(120%) skewX(-18deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: transform 0.7s ease;
        }
        .hero-slider .h-btn:hover::before {
          transform: translateX(-120%) skewX(-18deg);
        }
        .hero-slider .h-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 44px rgba(0,0,0,0.28);
          border-color: rgba(255,255,255,0.3);
        }
        .hero-slider .h-btn:active {
          transform: translateY(-1px);
        }

        /* ─── Primary ─── */
        .hero-slider .h-btn--primary {
          min-height: 54px;
          padding-inline: 1.4rem;
          background: linear-gradient(135deg, var(--btn-bg, #F59E0B) 0%, var(--btn-bg2, #D97706) 100%);
          color: var(--btn-color, #fff) !important;
          border-color: rgba(255,255,255,0.12);
          box-shadow:
            0 12px 36px rgba(0,0,0,0.25),
            0 0 0 1px rgba(255,255,255,0.1) inset,
            0 1px 0 rgba(255,255,255,0.15) inset;
        }
        .hero-slider .h-btn--primary:hover {
          filter: brightness(1.08) saturate(1.1);
          box-shadow:
            0 16px 48px rgba(0,0,0,0.32),
            0 0 0 1px rgba(255,255,255,0.15) inset;
        }

        /* Arrow in primary btn */
        .hero-slider .h-btn__arrow {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.2);
          transition: all 0.35s ease;
        }
        .hero-slider .h-btn--primary:hover .h-btn__arrow {
          transform: translateX(-4px);
          background: rgba(255,255,255,0.3);
        }

        /* ─── Glass ─── */
        .hero-slider .h-btn--glass {
          background: rgba(255,255,255,0.08);
        }
        .hero-slider .h-btn--glass:hover {
          background: rgba(255,255,255,0.15);
        }

        /* ─── Icon ─── */
        .hero-slider .h-btn__icon {
          position: relative;
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.14);
          transition: background 0.3s ease;
        }
        .hero-slider .h-btn__icon--accent {
          background: var(--accent, #F59E0B);
        }

        /* ─── Copy ─── */
        .hero-slider .h-btn__label {
          display: flex;
          align-items: center;
          gap: 0;
          line-height: 1.15;
        }
        .hero-slider .h-btn__label strong {
          font-size: 0.95rem;
          font-weight: 800;
        }
        .hero-slider .h-btn__copy {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          line-height: 1.15;
          text-align: start;
          min-width: 0;
        }
        .hero-slider .h-btn__copy strong {
          font-size: 0.88rem;
          font-weight: 800;
        }
        .hero-slider .h-btn__copy small {
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.72rem;
          font-weight: 600;
          opacity: 0.85;
          direction: ltr;
          unicode-bidi: plaintext;
        }

        /* ─── WhatsApp ─── */
        .hero-slider .h-btn--whatsapp {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          border-color: rgba(37,211,102,0.25);
        }
        .hero-slider .h-btn--whatsapp:hover {
          background: linear-gradient(135deg, #2be872 0%, #1aad70 100%);
          border-color: rgba(37,211,102,0.4);
        }
        .hero-slider .h-btn--whatsapp .h-btn__icon::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: inherit;
          background: rgba(37,211,102,0.3);
          z-index: -1;
          animation: waPulse 2s ease-out infinite;
        }
        @keyframes waPulse {
          0%   { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* ═══════ Responsive buttons ═══════ */
        @media (max-width: 1200px) {
          .hero-slider .hero-actions { gap: 0.6rem !important; }
          .hero-slider .h-btn {
            min-height: 48px;
            padding: 0.6rem 0.95rem;
          }
          .hero-slider .h-btn__icon {
            width: 34px;
            height: 34px;
            min-width: 34px;
          }
        }

        @media (max-width: 900px) {
          .hero-slider .hero-actions {
            justify-content: center !important;
            margin-top: 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .hero-slider .hero-actions {
            flex-direction: column;
            align-items: stretch !important;
            justify-content: center !important;
            width: 100%;
            max-width: 320px;
            margin: 1.25rem auto 0;
            gap: 0.6rem !important;
          }
          .hero-slider .h-btn {
            width: 100%;
            min-height: 48px;
            border-radius: 14px;
            justify-content: center;
          }
          .hero-slider .h-btn__copy {
            align-items: center;
            text-align: center;
          }
          .hero-slider .h-btn__copy small {
            max-width: 180px;
          }
          .hero-slider .h-btn--primary {
            order: -1;
          }
        }

        @media (max-width: 420px) {
          .hero-slider .hero-actions { max-width: 290px; }
          .hero-slider .h-btn {
            min-height: 46px;
            padding: 0.55rem 0.8rem;
          }
          .hero-slider .h-btn__copy strong { font-size: 0.84rem; }
          .hero-slider .h-btn__copy small { display: none; }
          .hero-slider .h-btn__label strong { font-size: 0.9rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-slider .h-btn,
          .hero-slider .h-btn::before,
          .hero-slider .h-btn__arrow {
            transition: none !important;
          }
          .hero-slider .h-btn--whatsapp .h-btn__icon::after {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}