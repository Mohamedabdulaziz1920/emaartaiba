'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Stat {
  num: number;
  suffix: string;
  label: string;
  icon: string;
  colorVar: string;
}

const STATS: Stat[] = [
  { num: 500, suffix: '+', label: 'مشروع منجز', icon: '🏗️', colorVar: 'var(--color-primary)' },
  { num: 20, suffix: '+', label: 'سنة خبرة', icon: '📅', colorVar: 'var(--color-secondary)' },
  { num: 1000, suffix: '+', label: 'عميل سعيد', icon: '😊', colorVar: 'var(--color-success, #10b981)' },
  { num: 50, suffix: '+', label: 'مهندس متخصص', icon: '👷', colorVar: 'var(--color-info, #8b5cf6)' },
];

function Counter({ end, duration = 2000, start }: { end: number; duration?: number; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [start, end, duration]);

  return <>{count.toLocaleString('ar-SA')}</>;
}

export default function StatsCounter({ settings }: { settings: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [startCounters, setStartCounters] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStartCounters(true), 300);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const trustItems = [
    { icon: '✅', text: 'رخصة رسمية معتمدة', color: '#10b981' },
    { icon: '🤝', text: 'عضو اتحاد المقاولين', color: '#3b82f6' },
    { icon: '🏆', text: 'شهادة الجودة ISO', color: '#f59e0b' },
    { icon: '🛡️', text: 'ضمان 10 سنوات', color: '#ef4444' },
  ];

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        padding: '5rem 0',
        background: 'linear-gradient(135deg, var(--color-bg-card, #ffffff) 0%, var(--color-bg-light, #f8faff) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* خلفية زخرفية متحركة */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(237, 137, 54, 0.08), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(43, 108, 176, 0.08), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 25s ease-in-out infinite reverse',
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '0.5rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.15), rgba(237, 137, 54, 0.05))',
              color: 'var(--color-secondary, #ed8936)',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '700',
              marginBottom: '1rem',
              border: '1px solid rgba(237, 137, 54, 0.3)',
            }}
          >
            📊 إنجازاتنا
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              fontWeight: '800',
              color: 'var(--color-text-dark, #0f172a)',
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}
          >
            أرقام تتحدث عن{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-secondary, #ed8936), var(--color-secondary-light, #fbd38d))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              نجاحنا
            </span>
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted, #64748b)',
              maxWidth: '36rem',
              margin: '0 auto',
              fontSize: '1rem',
              lineHeight: '1.7',
            }}
          >
            خلال مسيرتنا، حققنا نتائج استثنائية تعكس التزامنا بالجودة والتميز
          </p>
        </motion.div>

        {/* البطاقات الإحصائية */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={startCounters ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--color-bg-card, #ffffff)',
                borderRadius: '1.5rem',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* شريط علوي ملون */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${stat.colorVar}, ${stat.colorVar}88)`,
                }}
              />

              {/* أيقونة متحركة */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
                style={{
                  fontSize: '3.5rem',
                  marginBottom: '1rem',
                  display: 'inline-block',
                }}
              >
                {stat.icon}
              </motion.div>

              {/* العدد */}
              <div
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: '900',
                  color: stat.colorVar,
                  marginBottom: '0.5rem',
                  lineHeight: '1',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                <Counter end={stat.num} start={startCounters} />
                {stat.suffix}
              </div>

              {/* التسمية */}
              <div
                style={{
                  color: 'var(--color-text-muted, #64748b)',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* شريط الثقة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={startCounters ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            paddingTop: '1rem',
          }}
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3, scale: 1.02 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '9999px',
                border: '1px solid rgba(237, 137, 54, 0.2)',
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: 'var(--color-text-dark, #1f2937)',
                cursor: 'default',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(2%, 2%) rotate(2deg); }
          66% { transform: translate(-1%, 1%) rotate(-1deg); }
        }
      `}</style>
    </section>
  );
}
