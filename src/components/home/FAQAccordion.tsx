'use client';

import { useState } from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Props {
  faqs?: FAQ[];
}

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

export default function FAQAccordion({ faqs }: Props) {
  const displayFaqs = (faqs && faqs.length > 0) ? faqs : DEFAULT_FAQS;
  const [openId, setOpenId] = useState<number | null>(displayFaqs[0]?.id || null);

  if (!displayFaqs?.length) return null;

  return (
    <section style={{
      background: 'var(--color-bg-light, #f8faff)',
      width: '100%',
      padding: '4rem 0',
      overflowX: 'hidden',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem',
      }}>
        <div className="faq-v3-grid">
          
          {/* العنوان والوصف */}
          <div className="faq-v3-header">
            <span style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(237, 137, 54, 0.15)',
              color: 'var(--color-secondary, #c2410c)',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.875rem',
              marginBottom: '1rem',
              border: '1px solid rgba(237, 137, 54, 0.3)',
            }}>
              ❓ الأسئلة الشائعة
            </span>
            
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--color-text-dark, #0f172a)',
              marginBottom: '1rem',
              lineHeight: 1.3,
              textAlign: 'right',
              background: 'none',
              WebkitBackgroundClip: 'unset',
              WebkitTextFillColor: 'var(--color-text-dark, #0f172a)',
              backgroundClip: 'unset',
            }}>
              لديك سؤال؟<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--color-secondary, #ed8936), var(--color-secondary-light, #f6ad55))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                لدينا الإجابة!
              </span>
            </h2>
            
            <p style={{
              color: 'var(--color-text-muted, #64748b)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginTop: '1rem',
              marginBottom: 0,
            }}>
              تصفح أكثر الأسئلة شيوعاً من عملائنا، وإذا لم تجد ما تبحث عنه،
              لا تتردد في التواصل معنا!
            </p>

            <a 
              href="tel:+966500000000" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '2rem',
                padding: '0.875rem 1.75rem',
                background: 'linear-gradient(135deg, var(--color-primary, #1a365d), var(--color-primary-light, #2b6cb0))',
                color: 'var(--color-text-light, #ffffff)',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>📞</span>
              <span>اتصل بنا للمزيد</span>
            </a>
          </div>

          {/* قائمة الأسئلة */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
          }}>
            {displayFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              
              return (
                <div
                  key={faq.id}
                  style={{
                    background: 'var(--color-bg-card, #ffffff)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    border: isOpen ? '2px solid var(--color-secondary, #ed8936)' : '2px solid #f0f0f0',
                    boxShadow: isOpen 
                      ? '0 10px 30px rgba(0, 0, 0, 0.08)' 
                      : '0 2px 10px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease',
                    width: '100%',
                  }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    type="button"
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      fontFamily: 'inherit',
                      textAlign: 'right',
                      color: 'var(--color-text-dark, #0f172a)',
                    }}
                  >
                    <span style={{
                      color: 'var(--color-text-dark, #0f172a)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      flex: 1,
                      textAlign: 'right',
                      lineHeight: 1.5,
                      display: 'block',
                      background: 'none',
                      WebkitBackgroundClip: 'unset',
                      WebkitTextFillColor: 'var(--color-text-dark, #0f172a)',
                      backgroundClip: 'unset',
                    }}>
                      {faq.question}
                    </span>
                    
                    <span 
                      aria-hidden="true"
                      style={{
                        width: '36px',
                        height: '36px',
                        minWidth: '36px',
                        background: isOpen ? 'var(--color-secondary, #ed8936)' : 'rgba(237, 137, 54, 0.15)',
                        color: isOpen ? 'var(--color-text-light, #ffffff)' : 'var(--color-secondary, #ed8936)',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                        lineHeight: 1,
                        fontFamily: 'Arial, sans-serif',
                      }}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div style={{
                      padding: '0 1.5rem 1.5rem',
                      animation: 'faqV3FadeIn 0.3s ease',
                    }}>
                      <p style={{
                        margin: 0,
                        color: 'var(--color-text-muted, #64748b)',
                        lineHeight: 1.8,
                        fontSize: '0.9375rem',
                        background: 'none',
                        WebkitBackgroundClip: 'unset',
                        WebkitTextFillColor: 'var(--color-text-muted, #64748b)',
                        backgroundClip: 'unset',
                      }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes faqV3FadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-v3-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .faq-v3-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 4rem;
            align-items: start;
          }

          .faq-v3-header {
            position: sticky;
            top: 100px;
          }
        }

        @media (max-width: 768px) {
          .faq-v3-header {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
