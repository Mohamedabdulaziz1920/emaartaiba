'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Phone, HelpCircle, Plus, Minus } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   🎯 Types
   ═══════════════════════════════════════════════════ */
interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

interface Props {
  faqs?: FAQ[];
  phone?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

/* ═══════════════════════════════════════════════════
   📝 Default FAQs
   ═══════════════════════════════════════════════════ */
const DEFAULT_FAQS: FAQ[] = [
  {
    id: 1,
    question: 'كم تستغرق مدة بناء فيلا متوسطة؟',
    answer: 'تستغرق مدة بناء فيلا متوسطة الحجم (300-500 م²) من 8 إلى 12 شهراً حسب التصميم والمواصفات المطلوبة. نلتزم بالمواعيد المحددة ونوفر تقارير دورية عن سير العمل.',
  },
  {
    id: 2,
    question: 'هل تقدمون ضمان على أعمال البناء؟',
    answer: 'نعم، نقدم ضمان شامل لمدة 10 سنوات على الهيكل الإنشائي و3 سنوات على التشطيبات وسنة على الأعمال الكهربائية والصحية.',
  },
  {
    id: 3,
    question: 'كيف يتم حساب تكلفة المشروع؟',
    answer: 'يتم حساب التكلفة بناءً على عدة عوامل: المساحة، نوع المشروع، المواصفات، التشطيبات، الموقع. نقدم عرض سعر مفصل وشفاف بعد الزيارة الميدانية.',
  },
  {
    id: 4,
    question: 'هل توفرون التصاميم المعمارية؟',
    answer: 'نعم، نوفر خدمة التصميم المعماري الكامل من خلال فريق من المهندسين المعماريين المعتمدين، ويمكن تنفيذ تصاميمكم الخاصة أيضاً.',
  },
  {
    id: 5,
    question: 'في أي مدن تعملون؟',
    answer: 'نعمل في جميع مناطق المملكة العربية السعودية، مع تواجد قوي في جازان، جدة، الدمام، مكة المكرمة، والمدينة المنورة.',
  },
];

/* ═══════════════════════════════════════════════════
   🎯 Main Component
   ═══════════════════════════════════════════════════ */
export default function FAQAccordion({ 
  faqs,
  phone,
  title = 'لديك سؤال؟',
  subtitle = 'تصفح أكثر الأسئلة شيوعاً من عملائنا، وإذا لم تجد ما تبحث عنه، لا تتردد في التواصل معنا!',
  badge = '❓ الأسئلة الشائعة'
}: Props) {
  const displayFaqs = useMemo(() => {
    return faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  }, [faqs]);

  const [openId, setOpenId] = useState<number | null>(displayFaqs[0]?.id || null);

  const toggleFaq = useCallback((id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const phoneHref = useMemo(() => {
    if (!phone) return '#';
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }, [phone]);

  if (!displayFaqs.length) return null;

  return (
    <section className="faq-section" dir="rtl" suppressHydrationWarning>
      {/* ═══════════════════════════════════
          🎨 Background Decorations
          ═══════════════════════════════════ */}
      <div className="faq-decoration faq-decoration--1" aria-hidden="true" />
      <div className="faq-decoration faq-decoration--2" aria-hidden="true" />

      <div className="faq-container">
        <div className="faq-grid">
          
          {/* ═══════════════════════════════════
              📝 Left Side - Header
              ═══════════════════════════════════ */}
          <motion.div 
            className="faq-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="faq-badge">
              <HelpCircle size={16} />
              <span>{badge.replace('❓ ', '')}</span>
            </span>
            
            <h2 className="faq-title">
              {title}
              <br />
              <span className="faq-title-highlight">
                لدينا الإجابة!
              </span>
            </h2>
            
            <p className="faq-subtitle">
              {subtitle}
            </p>

            {phone && (
              <Link 
                href={phoneHref}
                className="faq-cta"
                aria-label={`اتصل بنا على ${phone}`}
              >
                <span className="faq-cta-icon">
                  <Phone size={20} />
                </span>
                <span className="faq-cta-text">
                  <span className="faq-cta-label">اتصل بنا الآن</span>
                  <span className="faq-cta-phone" dir="ltr">{phone}</span>
                </span>
              </Link>
            )}

            {/* Stats */}
            <div className="faq-stats">
              <div className="faq-stat">
                <div className="faq-stat-icon">💬</div>
                <div className="faq-stat-content">
                  <div className="faq-stat-number">{displayFaqs.length}+</div>
                  <div className="faq-stat-label">سؤال شائع</div>
                </div>
              </div>
              <div className="faq-stat">
                <div className="faq-stat-icon">⚡</div>
                <div className="faq-stat-content">
                  <div className="faq-stat-number">24/7</div>
                  <div className="faq-stat-label">دعم متواصل</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════
              📋 Right Side - Accordion
              ═══════════════════════════════════ */}
          <motion.div 
            className="faq-list"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {displayFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              
              return (
                <motion.div
                  key={faq.id}
                  className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="faq-question-btn"
                  >
                    <span className="faq-question-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    
                    <span className="faq-question-text">
                      {faq.question}
                    </span>
                    
                    <span 
                      className={`faq-toggle ${isOpen ? 'faq-toggle--open' : ''}`}
                      aria-hidden="true"
                    >
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          ease: 'easeInOut',
                          opacity: { duration: 0.2 }
                        }}
                        className="faq-answer-wrap"
                      >
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          🎨 Styles
          ═══════════════════════════════════ */}
      <style jsx>{`
        /* ═══ Base ═══ */
        .faq-section {
          background: var(--color-bg-light, #f8faff);
          width: 100%;
          padding: clamp(3rem, 6vw, 5rem) 0;
          overflow: hidden;
          position: relative;
          font-family: var(--font-family, 'Cairo'), sans-serif;
        }

        /* ═══ Background Decorations ═══ */
        .faq-decoration {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          z-index: 0;
        }

        .faq-decoration--1 {
          top: -20%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(
            circle,
            rgba(212, 175, 55, 0.08),
            transparent 70%
          );
        }

        .faq-decoration--2 {
          bottom: -20%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(26, 54, 93, 0.06),
            transparent 70%
          );
        }

        /* ═══ Container ═══ */
        .faq-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 1;
        }

        /* ═══ Grid ═══ */
        .faq-grid {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* ═══ Header ═══ */
        .faq-header {
          display: flex;
          flex-direction: column;
        }

        .faq-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.15),
            rgba(212, 175, 55, 0.05)
          );
          color: var(--color-secondary, #D4AF37);
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
          align-self: flex-start;
        }

        .faq-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--color-text-dark, #0f172a);
          margin: 0 0 1rem 0;
          line-height: 1.3;
          text-align: right;
          font-family: var(--font-family-headings, var(--font-family, 'Cairo')), sans-serif;
        }

        .faq-title-highlight {
          background: linear-gradient(
            135deg, 
            var(--color-secondary, #D4AF37), 
            var(--color-secondary-light, #F3E5AB)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .faq-subtitle {
          color: var(--color-text-muted, #64748b);
          font-size: 1rem;
          line-height: 1.8;
          margin: 0 0 2rem 0;
        }

        /* ═══ CTA Button ═══ */
        .faq-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1.5rem 0.875rem 0.875rem;
          background: linear-gradient(
            135deg, 
            var(--color-primary, #1a365d), 
            var(--color-primary-light, #2b6cb0)
          );
          color: #ffffff;
          font-weight: 700;
          text-decoration: none;
          border-radius: 1rem;
          box-shadow: 
            0 8px 20px rgba(26, 54, 93, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 2rem;
          align-self: flex-start;
        }

        .faq-cta:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 28px rgba(26, 54, 93, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .faq-cta-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            var(--color-secondary, #D4AF37),
            var(--color-accent, #FFD700)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-primary, #1a365d);
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
        }

        .faq-cta-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          line-height: 1.2;
        }

        .faq-cta-label {
          font-size: 0.875rem;
          font-weight: 800;
        }

        .faq-cta-phone {
          font-size: 0.75rem;
          opacity: 0.85;
          font-weight: 600;
        }

        /* ═══ Stats ═══ */
        .faq-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .faq-stat {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 0.875rem;
          border: 1px solid rgba(212, 175, 55, 0.15);
          transition: all 0.3s ease;
        }

        .faq-stat:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-2px);
        }

        .faq-stat-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .faq-stat-content {
          flex: 1;
          min-width: 0;
        }

        .faq-stat-number {
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--color-primary, #1a365d);
          line-height: 1.2;
        }

        .faq-stat-label {
          font-size: 0.75rem;
          color: var(--color-text-muted, #64748b);
          font-weight: 600;
          margin-top: 0.15rem;
        }

        /* ═══ FAQ List ═══ */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          width: 100%;
        }

        /* ═══ FAQ Item ═══ */
        .faq-item {
          background: var(--color-bg-card, #ffffff);
          border-radius: 1rem;
          overflow: hidden;
          border: 2px solid transparent;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }

        .faq-item--open {
          border-color: var(--color-secondary, #D4AF37);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(212, 175, 55, 0.1);
        }

        .faq-item:hover:not(.faq-item--open) {
          border-color: rgba(212, 175, 55, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
        }

        /* ═══ Question Button ═══ */
        .faq-question-btn {
          width: 100%;
          padding: 1.25rem 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: inherit;
          text-align: right;
          transition: background 0.3s ease;
        }

        .faq-question-btn:hover {
          background: rgba(212, 175, 55, 0.02);
        }

        .faq-question-btn:focus-visible {
          outline: 2px solid var(--color-secondary, #D4AF37);
          outline-offset: -2px;
          border-radius: 1rem;
        }

        .faq-question-number {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-secondary, #D4AF37);
          background: rgba(212, 175, 55, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          flex-shrink: 0;
          font-variant-numeric: tabular-nums;
        }

        .faq-item--open .faq-question-number {
          background: var(--color-secondary, #D4AF37);
          color: #ffffff;
        }

        .faq-question-text {
          flex: 1;
          color: var(--color-text-dark, #0f172a);
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.5;
          text-align: right;
        }

        .faq-toggle {
          width: 36px;
          height: 36px;
          min-width: 36px;
          background: rgba(212, 175, 55, 0.15);
          color: var(--color-secondary, #D4AF37);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-toggle--open {
          background: var(--color-secondary, #D4AF37);
          color: #ffffff;
          transform: rotate(180deg);
        }

        /* ═══ Answer ═══ */
        .faq-answer-wrap {
          overflow: hidden;
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem;
        }

        .faq-answer p {
          margin: 0;
          color: var(--color-text-muted, #64748b);
          line-height: 1.85;
          font-size: 0.9375rem;
          padding-top: 0.5rem;
          border-top: 1px dashed rgba(212, 175, 55, 0.2);
          padding-inline-start: 3.75rem;
        }

        /* ═══════════════════════════════════════════
           📱 Responsive
           ═══════════════════════════════════════════ */
        
        /* Small Tablet */
        @media (min-width: 640px) {
          .faq-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Tablet */
        @media (min-width: 768px) {
          .faq-container {
            padding: 0 2rem;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .faq-grid {
            display: grid;
            grid-template-columns: 1fr 1.4fr;
            gap: 4rem;
            align-items: start;
          }

          .faq-header {
            position: sticky;
            top: 100px;
          }
        }

        /* Large Desktop */
        @media (min-width: 1280px) {
          .faq-grid {
            gap: 5rem;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .faq-title {
            text-align: center;
          }
          
          .faq-subtitle {
            text-align: center;
          }
          
          .faq-badge,
          .faq-cta {
            align-self: center;
          }
          
          .faq-stats {
            grid-template-columns: 1fr;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .faq-section {
            padding: 2.5rem 0;
          }
          
          .faq-container {
            padding: 0 1rem;
          }
          
          .faq-question-btn {
            padding: 1rem 1.25rem;
            gap: 0.75rem;
          }
          
          .faq-question-text {
            font-size: 0.9375rem;
          }
          
          .faq-toggle {
            width: 32px;
            height: 32px;
            min-width: 32px;
          }
          
          .faq-answer {
            padding: 0 1.25rem 1.25rem;
          }
          
          .faq-answer p {
            padding-inline-start: 0;
            font-size: 0.875rem;
          }
          
          .faq-question-number {
            font-size: 0.7rem;
            padding: 0.2rem 0.4rem;
          }
          
          .faq-cta {
            padding: 0.75rem 1.25rem 0.75rem 0.75rem;
          }
          
          .faq-cta-icon {
            width: 2.25rem;
            height: 2.25rem;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .faq-item,
          .faq-toggle,
          .faq-cta,
          .faq-stat {
            transition: none;
          }
          
          .faq-cta:hover,
          .faq-stat:hover {
            transform: none;
          }
        }

        /* Print */
        @media print {
          .faq-decoration,
          .faq-cta,
          .faq-stats {
            display: none;
          }
          
          .faq-item {
            border: 1px solid #ddd;
            break-inside: avoid;
            margin-bottom: 1rem;
          }
          
          .faq-answer-wrap {
            display: block !important;
            height: auto !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}