'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  ArrowLeft,
  ChevronDown,
  Star,
  Award,
  Users,
  Briefcase,
  Building2,
  Hammer,
  HardHat,
  Home,
  Wrench,
  ShieldCheck,
  Clock,
  TrendingUp,
  Heart,
  ThumbsUp,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import {
  getHeroData,
  settingsHelpers,
  type SiteSettings,
  type HeroStat,
} from '@/lib/settings';

interface Props {
  settings?: SiteSettings | null;
  stats?: HeroStat[];
}

/* ═══════════════════════════════════════════════════════════════
   🎨 Icon Map - يدعم أيقونات متعددة من قاعدة البيانات
   ═══════════════════════════════════════════════════════════════ */
const ICON_MAP: Record<string, any> = {
  briefcase: Briefcase,
  award: Award,
  users: Users,
  star: Star,
  building: Building2,
  building2: Building2,
  hammer: Hammer,
  hardhat: HardHat,
  home: Home,
  wrench: Wrench,
  shield: ShieldCheck,
  shieldcheck: ShieldCheck,
  clock: Clock,
  trending: TrendingUp,
  trendingup: TrendingUp,
  heart: Heart,
  thumbsup: ThumbsUp,
  check: CheckCircle2,
  checkcircle: CheckCircle2,
  trophy: Trophy,
};

const getIcon = (name?: string) => {
  if (!name) return Briefcase;
  const key = name.toLowerCase().replace(/[-_\s]/g, '');
  return ICON_MAP[key] || Briefcase;
};

/* ═══════════════════════════════════════════════════════════════
   🔢 Counter Component - عدّاد تصاعدي عند الظهور
   ═══════════════════════════════════════════════════════════════ */
function Counter({ value }: { value: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();

        // استخراج البادئة واللاحقة
        const hasPlus = value.includes('+');
        const hasK = /k/i.test(value);
        const hasM = /m/i.test(value);
        const hasPercent = value.includes('%');

        const prefix = hasPlus ? '+' : '';
        const numStr = value.replace(/[^\d.]/g, '');
        const target = parseFloat(numStr);

        let suffix = '';
        if (hasK) suffix = 'K';
        else if (hasM) suffix = 'M';
        else if (hasPercent) suffix = '%';

        if (!target || isNaN(target)) {
          setDisplay(value);
          return;
        }

        const duration = 1500;
        const step = 16;
        const steps = Math.max(1, duration / step);
        let current = 0;

        const timer = setInterval(() => {
          current += target / steps;
          if (current >= target) {
            clearInterval(timer);
            setDisplay(`${prefix}${target}${suffix}`);
          } else {
            const value =
              target % 1 === 0
                ? Math.floor(current).toString()
                : current.toFixed(1);
            setDisplay(`${prefix}${value}${suffix}`);
          }
        }, step);

        return () => clearInterval(timer);
      },
      { threshold: 0.5 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   🎯 Helper: تنسيق رقم الهاتف للعرض
   ═══════════════════════════════════════════════════════════════ */
const formatPhoneDisplay = (phone: string): string => {
  if (!phone) return '';
  return phone
    .replace(/^\+?966/, '0')
    .replace(/^00966/, '0')
    .replace(/\s+/g, '');
};

/* ═══════════════════════════════════════════════════════════════
   🚀 Main Component
   ═══════════════════════════════════════════════════════════════ */
export default function HeroSection({
  settings = {},
  stats: statsProp,
}: Props) {
  const safeSettings = settings || {};

  /* ═══ جلب كل بيانات Hero ديناميكياً من settings helper ═══ */
  const {
    badgeText,
    titleLine1,
    titleLine2,
    description,
    descHighlight,
    cities,
    callBtn,
    whatsappBtn,
    whatsappSub,
    inquireBtn,
    whatsappMessage,
    trustItems,
    stats: settingsStats,
  } = getHeroData(safeSettings);

  /* ═══ بيانات الاتصال ═══ */
  const phone = safeSettings.phone || '';
  const whatsapp = safeSettings.whatsapp || phone;

  /* ═══ تحديد مصدر الإحصائيات ═══ */
  const stats: HeroStat[] =
    statsProp && statsProp.length > 0 ? statsProp : settingsStats;

  /* ═══ إعداد الروابط ═══ */
  const phoneDisplay = formatPhoneDisplay(phone);
  const callLink = settingsHelpers.phoneLink(phone);
  const waUrl = settingsHelpers.whatsappLink(whatsapp, whatsappMessage);

  /* ═══ حالة عرض الأقسام (لإخفاء الفارغة) ═══ */
  const hasTitle = Boolean(titleLine1 || titleLine2);
  const hasDescription = Boolean(description || descHighlight || cities);
  const hasActions = Boolean(phone || whatsapp);
  const hasTrust = trustItems.length > 0;
  const hasStats = stats.length > 0;

  /* ═══ Scroll handler ═══ */
  const scrollDown = () => {
    if (typeof window === 'undefined') return;
    window.scrollBy({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  };

  /* ═══════════════════════════════════════════════════════════════
     🎨 Render
     ═══════════════════════════════════════════════════════════════ */
  return (
    <section className="hs" dir="rtl">
      {/* ── Background layers ── */}
      <div className="hs__bg" aria-hidden="true">
        <div className="hs__bg-base" />
        <div className="hs__bg-radial hs__bg-radial--orange" />
        <div className="hs__bg-radial hs__bg-radial--blue" />
        <div className="hs__bg-radial hs__bg-radial--purple" />
        <div className="hs__grid" />
      </div>

      {/* ── Animated orbs ── */}
      <div className="hs__orbs" aria-hidden="true">
        <span className="hs__orb hs__orb--1" />
        <span className="hs__orb hs__orb--2" />
        <span className="hs__orb hs__orb--3" />
      </div>

      {/* ── Main content ── */}
      <div className="hs__wrap">
        <div className="hs__content">
          {/* Badge */}
          {badgeText && (
            <div className="hs__badge hs__anim hs__anim--0">
              <span className="hs__badge-pulse" />
              <Award size={14} />
              <span>{badgeText}</span>
            </div>
          )}

          {/* Title */}
          {hasTitle && (
            <h1 className="hs__title hs__anim hs__anim--1">
              {titleLine1 && (
                <span className="hs__title-line">{titleLine1}</span>
              )}
              {titleLine2 && (
                <span className="hs__title-gradient">{titleLine2}</span>
              )}
            </h1>
          )}

          {/* Description */}
          {hasDescription && (
            <p className="hs__desc hs__anim hs__anim--2">
              {descHighlight && (
                <>
                  <strong className="hs__accent">{descHighlight}</strong>{' '}
                </>
              )}
              {description}
              {cities && (
                <>
                  {' '}
                  <span className="hs__cities">{cities}</span>
                </>
              )}
            </p>
          )}

          {/* CTA buttons */}
          {hasActions && (
            <div className="hs__actions hs__anim hs__anim--3">
              {phone && (
                <a href={callLink} className="hs__btn hs__btn--primary">
                  <span className="hs__btn-icon">
                    <Phone size={17} strokeWidth={2.5} />
                  </span>
                  <span className="hs__btn-body">
                    <strong>{callBtn}</strong>
                    {phoneDisplay && <small>{phoneDisplay}</small>}
                  </span>
                </a>
              )}

              {whatsapp && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hs__btn hs__btn--wa"
                >
                  <span className="hs__btn-icon hs__btn-icon--wa">
                    <MessageCircle size={17} strokeWidth={2.5} />
                  </span>
                  <span className="hs__btn-body">
                    <strong>{whatsappBtn}</strong>
                    {whatsappSub && <small>{whatsappSub}</small>}
                  </span>
                </a>
              )}

              {inquireBtn && (
                <Link href="/contact" className="hs__btn hs__btn--ghost">
                  <span>{inquireBtn}</span>
                  <ArrowLeft size={16} strokeWidth={2.5} />
                </Link>
              )}
            </div>
          )}

          {/* Trust indicators */}
          {hasTrust && (
            <div className="hs__trust hs__anim hs__anim--4">
              {trustItems.map((item, i) => (
                <span key={i} className="hs__trust-wrap">
                  <span className="hs__trust-item">{item}</span>
                  {i < trustItems.length - 1 && (
                    <span className="hs__trust-sep" />
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Stats grid */}
          {hasStats && (
            <div className="hs__stats hs__anim hs__anim--5">
              {stats.map((stat, i) => {
                const Icon = getIcon(stat.icon);
                const color = stat.color || '#f59e0b';
                return (
                  <div key={i} className="hs__stat">
                    <div
                      className="hs__stat-ring"
                      style={{ '--clr': color } as React.CSSProperties}
                    >
                      <Icon size={22} strokeWidth={1.8} style={{ color }} />
                    </div>
                    <div className="hs__stat-num" style={{ color }}>
                      <Counter value={stat.num} />
                    </div>
                    <div className="hs__stat-lbl">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <button
        type="button"
        className="hs__scroll"
        onClick={scrollDown}
        aria-label="تمرير للأسفل"
      >
        <span className="hs__scroll-ring">
          <ChevronDown size={18} />
        </span>
        <span className="hs__scroll-txt">تمرير</span>
      </button>

      {/* ── Bottom wave ── */}
      <div className="hs__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none">
          <path
            d="M0,80 C200,20 400,60 720,30 C1040,0 1240,50 1440,80 L1440,80 L0,80 Z"
            fill="var(--color-bg-light,#f8faff)"
          />
        </svg>
      </div>

      {/* ═══════════════════ Styles ═══════════════════ */}
      <style jsx>{`
        /* ───── Section shell ───── */
        .hs {
          position: relative;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          overflow: hidden;
          isolation: isolate;
          direction: rtl;
        }

        /* ───── Background layers ───── */
        .hs__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hs__bg-base {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            #080e1d 0%,
            #0f1a30 45%,
            #152342 100%
          );
        }
        .hs__bg-radial {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .hs__bg-radial--orange {
          top: -5%;
          right: -5%;
          width: 55%;
          height: 55%;
          background: radial-gradient(
            circle,
            rgba(245, 158, 11, 0.22) 0%,
            transparent 70%
          );
        }
        .hs__bg-radial--blue {
          bottom: -5%;
          left: -5%;
          width: 60%;
          height: 60%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.25) 0%,
            transparent 70%
          );
        }
        .hs__bg-radial--purple {
          top: 40%;
          left: 35%;
          width: 40%;
          height: 40%;
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.15) 0%,
            transparent 70%
          );
        }
        .hs__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.04) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: radial-gradient(
            ellipse at center,
            black 30%,
            transparent 80%
          );
          -webkit-mask-image: radial-gradient(
            ellipse at center,
            black 30%,
            transparent 80%
          );
        }

        /* ───── Orbs ───── */
        .hs__orbs {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .hs__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          animation: orb 18s ease-in-out infinite alternate;
        }
        .hs__orb--1 {
          width: 420px;
          height: 420px;
          top: 5%;
          right: 3%;
          background: rgba(245, 158, 11, 0.18);
          animation-duration: 22s;
        }
        .hs__orb--2 {
          width: 520px;
          height: 520px;
          bottom: 8%;
          left: 2%;
          background: rgba(59, 130, 246, 0.2);
          animation-duration: 26s;
          animation-delay: -8s;
        }
        .hs__orb--3 {
          width: 300px;
          height: 300px;
          top: 45%;
          left: 40%;
          background: rgba(139, 92, 246, 0.14);
          animation-duration: 20s;
          animation-delay: -4s;
        }
        @keyframes orb {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -40px) scale(1.08);
          }
          100% {
            transform: translate(-20px, 25px) scale(0.94);
          }
        }

        /* ───── Content wrapper ───── */
        .hs__wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          padding: clamp(5rem, 10vh, 7rem) clamp(1rem, 5vw, 3rem)
            clamp(3rem, 6vh, 5rem);
        }
        .hs__content {
          max-width: 56rem;
          margin: 0 auto;
          text-align: center;
        }

        /* ───── Animation entrance ───── */
        .hs__anim {
          opacity: 0;
          transform: translateY(28px);
          animation: fadeUp 0.65s ease forwards;
        }
        .hs__anim--0 {
          animation-delay: 0.05s;
        }
        .hs__anim--1 {
          animation-delay: 0.18s;
        }
        .hs__anim--2 {
          animation-delay: 0.3s;
        }
        .hs__anim--3 {
          animation-delay: 0.42s;
        }
        .hs__anim--4 {
          animation-delay: 0.54s;
        }
        .hs__anim--5 {
          animation-delay: 0.66s;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ───── Badge ───── */
        .hs__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.1rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 999px;
          color: #fbbf24;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 1.6rem;
          letter-spacing: 0.02em;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .hs__badge-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.7);
          animation: bpulse 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes bpulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.45;
            transform: scale(0.7);
          }
        }

        /* ───── Title ───── */
        .hs__title {
          font-size: clamp(2.1rem, 7vw, 5rem);
          font-weight: 900;
          line-height: 1.15;
          margin: 0 0 1.4rem;
          letter-spacing: -0.03em;
        }
        .hs__title-line {
          display: block;
          color: #fff;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.45);
        }
        .hs__title-gradient {
          display: block;
          margin-top: 0.2em;
          background: linear-gradient(
            135deg,
            #f59e0b 0%,
            #fcd34d 50%,
            #fb923c 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 2px 18px rgba(245, 158, 11, 0.4));
        }

        /* ───── Description ───── */
        .hs__desc {
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          color: rgba(203, 213, 225, 0.9);
          line-height: 1.8;
          margin: 0 auto 2rem;
          max-width: 42rem;
        }
        .hs__accent {
          color: #f59e0b;
          font-weight: 800;
        }
        .hs__cities {
          color: rgba(147, 197, 253, 0.85);
          font-weight: 600;
          font-size: 0.95em;
        }

        /* ───── Action buttons ───── */
        .hs__actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.4rem;
        }
        .hs__btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.7rem 1.25rem;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          overflow: hidden;
          isolation: isolate;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hs__btn::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          transform: translateX(110%) skewX(-16deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.18),
            transparent
          );
          transition: transform 0.65s ease;
        }
        .hs__btn:hover::before {
          transform: translateX(-110%) skewX(-16deg);
        }
        .hs__btn:hover {
          transform: translateY(-3px);
        }

        .hs__btn-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          transition: background 0.3s ease;
        }
        .hs__btn:hover .hs__btn-icon {
          background: rgba(255, 255, 255, 0.3);
        }

        .hs__btn-body {
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
          line-height: 1.15;
          text-align: start;
        }
        .hs__btn-body strong {
          font-size: 0.88rem;
          font-weight: 800;
        }
        .hs__btn-body small {
          font-size: 0.7rem;
          opacity: 0.85;
          direction: ltr;
          unicode-bidi: plaintext;
        }

        /* Primary */
        .hs__btn--primary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #fff;
          box-shadow: 0 10px 30px rgba(245, 158, 11, 0.35);
        }
        .hs__btn--primary:hover {
          box-shadow: 0 14px 40px rgba(245, 158, 11, 0.5);
        }

        /* WhatsApp */
        .hs__btn--wa {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          color: #fff;
          box-shadow: 0 10px 30px rgba(37, 211, 102, 0.28);
        }
        .hs__btn--wa:hover {
          box-shadow: 0 14px 40px rgba(37, 211, 102, 0.4);
        }
        .hs__btn-icon--wa {
          background: rgba(255, 255, 255, 0.18);
          animation: waPop 2s ease-out infinite;
        }
        @keyframes waPop {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(37, 211, 102, 0);
          }
        }

        /* Ghost */
        .hs__btn--ghost {
          background: rgba(255, 255, 255, 0.07);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          min-height: 46px;
          padding-inline: 1.4rem;
          gap: 0.5rem;
        }
        .hs__btn--ghost:hover {
          background: rgba(255, 255, 255, 0.13);
          border-color: rgba(255, 255, 255, 0.28);
          color: #fff;
        }

        /* ───── Trust strip ───── */
        .hs__trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .hs__trust-wrap {
          display: inline-flex;
          align-items: center;
        }
        .hs__trust-item {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(203, 213, 225, 0.75);
          padding: 0.2rem 0.6rem;
          white-space: nowrap;
        }
        .hs__trust-sep {
          display: inline-block;
          width: 1px;
          height: 12px;
          background: rgba(255, 255, 255, 0.15);
          vertical-align: middle;
        }

        /* ───── Stats ───── */
        .hs__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 52rem;
          margin: 0 auto;
        }
        .hs__stat {
          background: rgba(255, 255, 255, 0.045);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 1.4rem 0.75rem 1.1rem;
          text-align: center;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }
        .hs__stat:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
        }
        .hs__stat-ring {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.07);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          transition: all 0.35s ease;
        }
        .hs__stat:hover .hs__stat-ring {
          background: rgba(255, 255, 255, 0.12);
          transform: scale(1.08);
        }
        .hs__stat-num {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 0.35rem;
          letter-spacing: -0.02em;
        }
        .hs__stat-lbl {
          color: rgba(203, 213, 225, 0.7);
          font-size: clamp(0.72rem, 1.4vw, 0.82rem);
          font-weight: 600;
        }

        /* ───── Scroll button ───── */
        .hs__scroll {
          position: absolute;
          bottom: clamp(2rem, 4vh, 3.5rem);
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.3s ease;
          animation: scrollBounce 2.2s ease-in-out infinite;
        }
        .hs__scroll:hover {
          color: rgba(255, 255, 255, 0.85);
        }
        .hs__scroll-ring {
          width: 36px;
          height: 36px;
          border: 1.5px solid currentColor;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hs__scroll-txt {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
        }
        @keyframes scrollBounce {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-8px);
          }
        }

        /* ───── Wave ───── */
        .hs__wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          line-height: 0;
          z-index: 2;
        }
        .hs__wave svg {
          display: block;
          width: 100%;
          height: clamp(40px, 6vh, 80px);
        }

        /* ═══ Responsive ═══ */
        @media (max-width: 900px) {
          .hs__stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .hs__orbs {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hs__actions {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
            margin-inline: auto;
            gap: 0.6rem;
          }
          .hs__btn {
            width: 100%;
            border-radius: 14px;
            justify-content: center;
          }
          .hs__btn-body {
            align-items: center;
            text-align: center;
          }
          .hs__trust {
            gap: 0.1rem;
          }
          .hs__trust-item {
            font-size: 0.7rem;
            padding-inline: 0.4rem;
          }
          .hs__scroll {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .hs__stats {
            gap: 0.5rem;
          }
          .hs__stat {
            padding: 1rem 0.5rem 0.85rem;
            border-radius: 14px;
          }
          .hs__stat-ring {
            width: 40px;
            height: 40px;
          }
          .hs__badge {
            font-size: 0.72rem;
            padding: 0.35rem 0.9rem;
          }
        }

        @media (min-width: 1280px) {
          .hs__stats {
            max-width: 58rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hs__anim {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .hs__orb {
            animation: none;
          }
          .hs__scroll {
            animation: none;
          }
          .hs__badge-pulse {
            animation: none;
          }
          .hs__btn-icon--wa {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}