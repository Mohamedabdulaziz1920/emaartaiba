'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import {
  Building2,
  Calendar,
  Smile,
  HardHat,
  ShieldCheck,
  Award,
  BadgeCheck,
  Trophy,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { parseJsonField, type SiteSettings } from '@/lib/settings';

/* ═══════════════════════════════════════════════════════════════
   📊 Types
   ═══════════════════════════════════════════════════════════════ */
interface StatItem {
  num: number | string;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: string;
  color?: string;
  gradient?: string;
}

interface TrustItem {
  text: string;
  icon?: string;
}

interface Props {
  settings?: SiteSettings | null;
  stats?: StatItem[];
  trustItems?: (string | TrustItem)[];
  title?: string;
  subtitle?: string;
}

/* ═══════════════════════════════════════════════════════════════
   🛡️ Type-safe Helpers (للوصول الآمن لقيم settings)
   ═══════════════════════════════════════════════════════════════ */

/**
 * استخراج قيمة نصية بأمان من settings
 */
const getStringValue = (
  settings: SiteSettings | null | undefined,
  ...keys: string[]
): string => {
  if (!settings) return '';
  for (const key of keys) {
    const value = settings[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return '';
};

/**
 * استخراج قيمة من settings قد تكون string أو array
 */
const getRawValue = (
  settings: SiteSettings | null | undefined,
  ...keys: string[]
): any => {
  if (!settings) return undefined;
  for (const key of keys) {
    const value = settings[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return undefined;
};

/* ═══════════════════════════════════════════════════════════════
   🎨 Icon Map
   ═══════════════════════════════════════════════════════════════ */
const ICON_MAP: Record<string, any> = {
  building: Building2,
  building2: Building2,
  calendar: Calendar,
  smile: Smile,
  hardhat: HardHat,
  shield: ShieldCheck,
  shieldcheck: ShieldCheck,
  award: Award,
  badge: BadgeCheck,
  badgecheck: BadgeCheck,
  trophy: Trophy,
  sparkles: Sparkles,
  trending: TrendingUp,
  trendingup: TrendingUp,
};

const getIcon = (name?: string) => {
  if (!name) return null;
  const key = name.toLowerCase().replace(/[-_\s]/g, '');
  return ICON_MAP[key] || null;
};

/* ═══════════════════════════════════════════════════════════════
   📊 Default Data
   ═══════════════════════════════════════════════════════════════ */
const DEFAULT_STATS: StatItem[] = [
  {
    num: 500,
    suffix: '+',
    label: 'مشروع منجز',
    icon: 'building',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  {
    num: 20,
    suffix: '+',
    label: 'سنة خبرة',
    icon: 'calendar',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },
  {
    num: 300,
    suffix: '+',
    label: 'عميل سعيد',
    icon: 'smile',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    num: 50,
    suffix: '+',
    label: 'مهندس متخصص',
    icon: 'hardhat',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  },
];

const DEFAULT_TRUST: string[] = [
  '✅ رخصة رسمية معتمدة',
  '✅ عضو اتحاد المقاولين',
  '✅ شهادة الجودة ISO',
  '✅ ضمان 10 سنوات',
];

const DEFAULT_TITLE = 'أرقام تتحدث عن نجاحنا';
const DEFAULT_SUBTITLE =
  'خلال مسيرتنا، حققنا نتائج استثنائية تعكس التزامنا بالجودة والتميز';
const DEFAULT_BADGE = 'إنجازاتنا';

/* ═══════════════════════════════════════════════════════════════
   🔢 Counter Hook
   ═══════════════════════════════════════════════════════════════ */
function useCounter(target: number, duration = 2200, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || !target) return;

    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(eased * target);

      setCount(currentValue);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [start, target, duration]);

  return count;
}

/* ═══════════════════════════════════════════════════════════════
   🎴 Stat Card Component
   ═══════════════════════════════════════════════════════════════ */
function StatCard({
  stat,
  start,
  index,
}: {
  stat: StatItem;
  start: boolean;
  index: number;
}) {
  const numericValue =
    typeof stat.num === 'number'
      ? stat.num
      : parseInt(String(stat.num), 10) || 0;
  const count = useCounter(numericValue, 2200, start);
  const Icon = getIcon(stat.icon);
  const color = stat.color || '#f59e0b';
  const gradient =
    stat.gradient || `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`;

  const displayNum = count.toLocaleString('ar-SA');

  return (
    <div
      className="sc-card"
      style={
        {
          '--card-color': color,
          '--card-gradient': gradient,
          '--card-delay': `${index * 0.1}s`,
        } as React.CSSProperties
      }
    >
      <div className="sc-card__glow" aria-hidden="true" />

      <div className="sc-card__icon-wrap">
        <div className="sc-card__icon-ring" />
        <div className="sc-card__icon">
          {Icon ? (
            <Icon size={26} strokeWidth={2} />
          ) : (
            <span className="sc-card__emoji">{stat.icon || '✨'}</span>
          )}
        </div>
      </div>

      <div className="sc-card__number">
        {stat.prefix && <span className="sc-card__prefix">{stat.prefix}</span>}
        <span className="sc-card__num">{displayNum}</span>
        {stat.suffix && <span className="sc-card__suffix">{stat.suffix}</span>}
      </div>

      <div className="sc-card__label">{stat.label}</div>

      <div className="sc-card__line" aria-hidden="true" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🚀 Main Component
   ═══════════════════════════════════════════════════════════════ */
export default function StatsCounter({
  settings = {},
  stats: statsProp,
  trustItems: trustProp,
  title: titleProp,
  subtitle: subtitleProp,
}: Props) {
  const safeSettings = settings || {};
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  /* ═══ نصوص ديناميكية (Type-safe) ═══ */
  const title: string =
    titleProp ||
    getStringValue(safeSettings, 'stats_title_ar', 'stats_title') ||
    DEFAULT_TITLE;

  const subtitle: string =
    subtitleProp ||
    getStringValue(safeSettings, 'stats_subtitle_ar', 'stats_subtitle') ||
    DEFAULT_SUBTITLE;

  const badgeText: string =
    getStringValue(safeSettings, 'stats_badge_ar', 'stats_badge') ||
    DEFAULT_BADGE;

  /* ═══ الإحصائيات (Type-safe) ═══ */
  const stats: StatItem[] = useMemo(() => {
    if (statsProp && statsProp.length > 0) return statsProp;

    // استخراج القيمة الخام بأمان
    const rawStats = getRawValue(safeSettings, 'counter_stats', 'stats_data');
    const fromSettings = parseJsonField<StatItem>(rawStats, []);

    return fromSettings.length > 0 ? fromSettings : DEFAULT_STATS;
  }, [statsProp, safeSettings]);

  /* ═══ Trust Items (Type-safe) ═══ */
  const trustItems: string[] = useMemo(() => {
    if (trustProp && trustProp.length > 0) {
      return trustProp.map((t) => (typeof t === 'string' ? t : t.text));
    }

    const rawTrust = getRawValue(safeSettings, 'trust_badges_ar', 'trust_badges');
    const fromSettings = parseJsonField<string>(rawTrust, []);

    return fromSettings.length > 0 ? fromSettings : DEFAULT_TRUST;
  }, [trustProp, safeSettings]);

  /* ═══ تقسيم العنوان بأمان (لإبراز آخر كلمة) ═══ */
  const titleParts = useMemo(() => {
    if (!title || typeof title !== 'string') {
      return { main: DEFAULT_TITLE, accent: '' };
    }

    const words = title.trim().split(/\s+/);
    if (words.length <= 1) {
      return { main: title, accent: '' };
    }

    return {
      main: words.slice(0, -1).join(' '),
      accent: words[words.length - 1],
    };
  }, [title]);

  /* ═══ Intersection Observer ═══ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="sc-section">
      {/* ── Decorative background ── */}
      <div className="sc-bg" aria-hidden="true">
        <div className="sc-bg__grid" />
        <div className="sc-bg__glow sc-bg__glow--1" />
        <div className="sc-bg__glow sc-bg__glow--2" />
      </div>

      <div className="sc-wrap">
        {/* ═══ Header ═══ */}
        <div className={`sc-header ${start ? 'sc-header--visible' : ''}`}>
          {badgeText && (
            <div className="sc-header__badge">
              <Sparkles size={14} />
              <span>{badgeText}</span>
            </div>
          )}

          <h2 className="sc-header__title">
            {titleParts.accent ? (
              <>
                <span>{titleParts.main}</span>{' '}
                <span className="sc-header__title-accent">
                  {titleParts.accent}
                </span>
              </>
            ) : (
              <span>{titleParts.main}</span>
            )}
          </h2>

          {subtitle && <p className="sc-header__subtitle">{subtitle}</p>}
        </div>

        {/* ═══ Stats Grid ═══ */}
        <div className={`sc-grid ${start ? 'sc-grid--visible' : ''}`}>
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} start={start} index={i} />
          ))}
        </div>

        {/* ═══ Trust Bar ═══ */}
        {trustItems.length > 0 && (
          <div className={`sc-trust ${start ? 'sc-trust--visible' : ''}`}>
            {trustItems.map((item, i) => (
              <span
                key={i}
                className="sc-trust__item"
                style={
                  {
                    '--item-delay': `${0.6 + i * 0.08}s`,
                  } as React.CSSProperties
                }
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════ Styles ═══════════════════ */}
      <style jsx>{`
        /* ───── Section ───── */
        .sc-section {
          position: relative;
          padding: clamp(3.5rem, 8vw, 6rem) 0;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #fafbff 50%,
            #ffffff 100%
          );
          overflow: hidden;
          isolation: isolate;
        }

        /* ───── Background decoration ───── */
        .sc-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .sc-bg__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(
            ellipse at center,
            black 30%,
            transparent 75%
          );
          -webkit-mask-image: radial-gradient(
            ellipse at center,
            black 30%,
            transparent 75%
          );
        }
        .sc-bg__glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
        }
        .sc-bg__glow--1 {
          width: 480px;
          height: 480px;
          top: -10%;
          right: -5%;
          background: radial-gradient(
            circle,
            rgba(245, 158, 11, 0.18) 0%,
            transparent 70%
          );
        }
        .sc-bg__glow--2 {
          width: 520px;
          height: 520px;
          bottom: -15%;
          left: -8%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.15) 0%,
            transparent 70%
          );
        }

        /* ───── Container ───── */
        .sc-wrap {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 4vw, 2rem);
        }

        /* ═══════════════════════════
           📌 HEADER
           ═══════════════════════════ */
        .sc-header {
          text-align: center;
          margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sc-header--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .sc-header__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 1rem;
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.12),
            rgba(245, 158, 11, 0.05)
          );
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 999px;
          color: #d97706;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: 0.02em;
        }

        .sc-header__title {
          font-size: clamp(1.7rem, 4.5vw, 2.5rem);
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0.85rem;
          line-height: 1.25;
          letter-spacing: -0.025em;
        }
        .sc-header__title-accent {
          background: linear-gradient(
            135deg,
            #f59e0b 0%,
            #fb923c 50%,
            #f59e0b 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: gradientShift 4s ease infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% center; }
          50%      { background-position: 100% center; }
        }

        .sc-header__subtitle {
          color: #64748b;
          max-width: 38rem;
          margin: 0 auto;
          font-size: clamp(0.9rem, 1.6vw, 1rem);
          line-height: 1.75;
        }

        /* ═══════════════════════════
           📊 STATS GRID
           ═══════════════════════════ */
        .sc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .sc-grid {
            gap: 1.25rem;
          }
        }

        @media (min-width: 1024px) {
          .sc-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }

        /* ═══════════════════════════
           🎴 STAT CARD
           ═══════════════════════════ */
        .sc-card {
          position: relative;
          padding: clamp(1.4rem, 2.5vw, 2rem) clamp(1rem, 2vw, 1.5rem);
          background: #ffffff;
          border-radius: 22px;
          text-align: center;
          overflow: hidden;
          isolation: isolate;
          border: 1px solid rgba(15, 23, 42, 0.06);
          box-shadow:
            0 1px 0 rgba(15, 23, 42, 0.02),
            0 8px 24px rgba(15, 23, 42, 0.04);
          transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
          opacity: 0;
          transform: translateY(28px);
        }

        .sc-grid--visible .sc-card {
          animation: cardIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-delay: var(--card-delay, 0s);
        }

        @keyframes cardIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sc-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--card-gradient);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        .sc-card:hover {
          transform: translateY(-8px);
          border-color: rgba(15, 23, 42, 0.1);
          box-shadow:
            0 1px 0 rgba(15, 23, 42, 0.04),
            0 20px 50px rgba(15, 23, 42, 0.12);
        }

        .sc-card:hover::before {
          transform: scaleX(1);
        }

        .sc-card__glow {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: var(--card-gradient);
          opacity: 0;
          z-index: -1;
          transition: opacity 0.4s ease;
          filter: blur(20px);
        }
        .sc-card:hover .sc-card__glow {
          opacity: 0.15;
        }

        /* ─── Icon ─── */
        .sc-card__icon-wrap {
          position: relative;
          width: 64px;
          height: 64px;
          margin: 0 auto 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-card__icon-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--card-gradient);
          opacity: 0.12;
          transition: all 0.4s ease;
        }
        .sc-card:hover .sc-card__icon-ring {
          opacity: 0.22;
          transform: scale(1.15);
        }

        .sc-card__icon {
          position: relative;
          z-index: 1;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--card-gradient);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 6px 18px rgba(15, 23, 42, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sc-card:hover .sc-card__icon {
          transform: scale(1.08) rotate(-6deg);
        }

        .sc-card__emoji {
          font-size: 1.5rem;
          line-height: 1;
        }

        /* ─── Number ─── */
        .sc-card__number {
          display: inline-flex;
          align-items: baseline;
          gap: 0.1rem;
          margin-bottom: 0.5rem;
          line-height: 1;
          color: var(--card-color);
          font-weight: 900;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .sc-card__num {
          font-size: clamp(1.85rem, 4.5vw, 2.75rem);
          background: var(--card-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .sc-card__prefix,
        .sc-card__suffix {
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          opacity: 0.85;
          font-weight: 800;
        }

        /* ─── Label ─── */
        .sc-card__label {
          color: #475569;
          font-weight: 600;
          font-size: clamp(0.85rem, 1.6vw, 0.95rem);
          letter-spacing: 0.01em;
          line-height: 1.4;
        }

        /* ─── Bottom line ─── */
        .sc-card__line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 40%;
          height: 2px;
          background: var(--card-gradient);
          border-radius: 99px;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.6;
        }
        .sc-card:hover .sc-card__line {
          transform: translateX(-50%) scaleX(1);
        }

        /* ═══════════════════════════
           🛡️ TRUST BAR
           ═══════════════════════════ */
        .sc-trust {
          margin-top: clamp(2.5rem, 5vw, 3.5rem);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.65rem;
        }

        .sc-trust__item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1.1rem;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          opacity: 0;
          transform: translateY(15px);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .sc-trust--visible .sc-trust__item {
          animation: trustIn 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-delay: var(--item-delay, 0s);
        }

        @keyframes trustIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sc-trust__item:hover {
          background: linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%);
          color: #b45309;
          border-color: #fbbf24;
          transform: translateY(-3px);
          box-shadow:
            0 8px 20px rgba(245, 158, 11, 0.18),
            0 0 0 4px rgba(245, 158, 11, 0.05);
        }

        /* ═══════════════════════════
           📱 RESPONSIVE
           ═══════════════════════════ */
        @media (max-width: 640px) {
          .sc-section {
            padding: 3rem 0;
          }

          .sc-card {
            padding: 1.25rem 0.9rem;
            border-radius: 18px;
          }

          .sc-card__icon-wrap {
            width: 54px;
            height: 54px;
            margin-bottom: 0.85rem;
          }

          .sc-card__icon {
            width: 42px;
            height: 42px;
          }

          .sc-trust {
            gap: 0.45rem;
          }

          .sc-trust__item {
            font-size: 0.72rem;
            padding: 0.45rem 0.85rem;
          }
        }

        @media (max-width: 420px) {
          .sc-card__num {
            font-size: 1.65rem;
          }
          .sc-card__prefix,
          .sc-card__suffix {
            font-size: 1.2rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sc-header,
          .sc-card,
          .sc-trust__item,
          .sc-header__title-accent {
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}