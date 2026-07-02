'use client';

import { useState, useCallback, FormEvent } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   🎯 Types
   ═══════════════════════════════════════════════════ */
interface Feature {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  gradient: string;
}

interface FormData {
  name: string;
  phone: string;
  projectType: string;
  message: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  companyName?: string;
}

/* ═══════════════════════════════════════════════════
   ⭐ Features Data
   ═══════════════════════════════════════════════════ */
const FEATURES: Feature[] = [
  { 
    id: 'experience',
    icon: '🏆', 
    title: 'خبرة 20+ عاماً', 
    desc: 'في تنفيذ آلاف المشاريع بنجاح', 
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  },
  { 
    id: 'quality',
    icon: '⭐', 
    title: 'جودة لا تُضاهى', 
    desc: 'أفضل المواد ومعايير عالمية', 
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  { 
    id: 'time',
    icon: '⏰', 
    title: 'التزام بالمواعيد', 
    desc: 'تسليم في الوقت المحدد دائماً', 
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  { 
    id: 'price',
    icon: '💎', 
    title: 'أسعار تنافسية', 
    desc: 'قيمة مقابل المال بدون تنازل', 
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  { 
    id: 'warranty',
    icon: '🛡️', 
    title: 'ضمان شامل', 
    desc: 'على جميع أعمال البناء والتشطيب', 
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  { 
    id: 'team',
    icon: '👷', 
    title: 'فريق متخصص', 
    desc: 'مهندسون وفنيون محترفون', 
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
  },
];

/* ═══════════════════════════════════════════════════
   🎯 Main Component
   ═══════════════════════════════════════════════════ */
export default function WhyChooseUs({ 
  title = 'لماذا تختار',
  subtitle = 'نحن لسنا مجرد شركة، بل شريكك الموثوق في رحلة بناء أحلامك. نقدم خدمات متكاملة بجودة عالية وأسعار مناسبة.',
  companyName = 'شركتنا؟'
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    projectType: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', projectType: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <section className="wcu-section" dir="rtl" suppressHydrationWarning>
      <div className="wcu-decoration wcu-decoration--1" aria-hidden="true" />
      <div className="wcu-decoration wcu-decoration--2" aria-hidden="true" />
      <div className="wcu-decoration wcu-decoration--3" aria-hidden="true" />

      <div className="wcu-container">
        <div className="wcu-grid">
          
          <motion.div 
            className="wcu-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="wcu-badge">
              <span className="wcu-badge-icon">⭐</span>
              <span>لماذا نحن؟</span>
            </span>
            
            <h2 className="wcu-title">
              {title}{' '}
              <span className="wcu-title-highlight">{companyName}</span>
            </h2>
            
            <p className="wcu-description">
              {subtitle}
            </p>

            <div className="wcu-features">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  className="wcu-feature"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div 
                    className="wcu-feature__bar" 
                    style={{ background: feature.gradient }}
                  />
                  <div 
                    className="wcu-feature__icon"
                    style={{ 
                      background: `${feature.color}15`,
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div className="wcu-feature__content">
                    <h3 className="wcu-feature__title">
                      {feature.title}
                    </h3>
                    <p className="wcu-feature__desc">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="wcu-form-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="wcu-form-glow" aria-hidden="true" />
            
            <div className="wcu-form-container">
              <div className="wcu-form-decoration" aria-hidden="true" />

              <div className="wcu-form-inner">
                <div className="wcu-form-badge">
                  <span>⚡</span>
                  <span>استشارة مجانية</span>
                </div>
                
                <h3 className="wcu-form-title">
                  احصل على عرض سعر{' '}
                  <span className="wcu-form-title-highlight">مجاني</span>
                </h3>
                
                <p className="wcu-form-subtitle">
                  تواصل معنا الآن وسنتصل بك خلال 24 ساعة
                </p>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="wcu-alert wcu-alert--success"
                  >
                    ✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="wcu-alert wcu-alert--error"
                  >
                    ⚠️ حدث خطأ، يرجى المحاولة مرة أخرى
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="wcu-form">
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="الاسم الكريم *" 
                    required 
                    className="wcu-input"
                    disabled={isSubmitting}
                    aria-label="الاسم"
                  />
                  
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="رقم الجوال *" 
                    required 
                    className="wcu-input"
                    disabled={isSubmitting}
                    aria-label="رقم الجوال"
                  />
                  
                  <select 
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="wcu-input wcu-select"
                    disabled={isSubmitting}
                    aria-label="نوع المشروع"
                  >
                    <option value="" className="wcu-option">نوع المشروع</option>
                    <option value="villa" className="wcu-option">بناء فيلا سكنية</option>
                    <option value="commercial" className="wcu-option">مشروع تجاري</option>
                    <option value="finishing" className="wcu-option">تشطيبات داخلية</option>
                    <option value="renovation" className="wcu-option">ترميم وصيانة</option>
                    <option value="other" className="wcu-option">أخرى</option>
                  </select>
                  
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="وصف مختصر للمشروع" 
                    rows={3} 
                    className="wcu-input wcu-textarea"
                    disabled={isSubmitting}
                    aria-label="وصف المشروع"
                  />
                  
                  <button 
                    type="submit" 
                    className="wcu-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="wcu-spinner" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>إرسال الطلب الآن</span>
                      </>
                    )}
                  </button>
                </form>
                
                <p className="wcu-privacy">
                  <span>🔒</span>
                  <span>معلوماتك محمية وآمنة 100%</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .wcu-section {
          background: var(--color-bg-card, #ffffff);
          position: relative;
          overflow: hidden;
          padding: clamp(3rem, 6vw, 5rem) 0;
          font-family: var(--font-family, 'Cairo'), sans-serif;
        }

        .wcu-decoration {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
        }
        
        .wcu-decoration--1 {
          top: 10%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08), transparent 70%);
        }
        
        .wcu-decoration--2 {
          bottom: 10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(26, 54, 93, 0.08), transparent 70%);
        }
        
        .wcu-decoration--3 {
          top: 50%;
          left: 40%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.05), transparent 70%);
          transform: translate(-50%, -50%);
        }

        .wcu-container {
          position: relative;
          z-index: 2;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 1.5rem;
          width: 100%;
        }

        .wcu-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }

        .wcu-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
          color: var(--color-secondary, #D4AF37);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .wcu-badge-icon {
          font-size: 1rem;
        }

        .wcu-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--color-text-dark, #0f172a);
          margin: 0 0 1rem 0;
          line-height: 1.3;
          text-align: right;
          font-family: var(--font-family-headings, var(--font-family, 'Cairo')), sans-serif;
        }

        .wcu-title-highlight {
          background: linear-gradient(135deg, var(--color-secondary, #D4AF37), var(--color-secondary-light, #F3E5AB));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .wcu-description {
          color: var(--color-text-muted, #64748b);
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .wcu-features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .wcu-feature {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 1.25rem;
          background: var(--color-bg-card, #ffffff);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          align-items: center;
        }

        .wcu-feature:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          border-color: rgba(212, 175, 55, 0.2);
        }

        .wcu-feature__bar {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 4px;
        }

        .wcu-feature__icon {
          flex-shrink: 0;
          width: 3rem;
          height: 3rem;
          border-radius: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: transform 0.3s ease;
        }

        .wcu-feature:hover .wcu-feature__icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .wcu-feature__content {
          flex: 1;
          min-width: 0;
        }

        .wcu-feature__title {
          font-weight: 800;
          color: var(--color-text-dark, #0f172a);
          font-size: 1rem;
          margin: 0 0 0.25rem 0;
          line-height: 1.4;
        }

        .wcu-feature__desc {
          color: var(--color-text-muted, #64748b);
          font-size: 0.8125rem;
          line-height: 1.6;
          margin: 0;
        }

        .wcu-form-wrapper {
          position: relative;
          width: 100%;
        }

        .wcu-form-glow {
          position: absolute;
          inset: -20px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(26, 54, 93, 0.3));
          border-radius: 2rem;
          filter: blur(40px);
          opacity: 0.6;
          z-index: 0;
        }

        .wcu-form-container {
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, var(--color-primary-dark, #0f172a), var(--color-primary, #1a365d), var(--color-primary-light, #2b6cb0));
          border-radius: 1.75rem;
          padding: 2rem;
          color: #ffffff;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .wcu-form-decoration {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.2);
          filter: blur(40px);
          pointer-events: none;
        }

        .wcu-form-inner {
          position: relative;
          z-index: 1;
        }

        .wcu-form-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          background: rgba(212, 175, 55, 0.2);
          color: var(--color-secondary-light, #F3E5AB);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .wcu-form-title {
          font-size: clamp(1.375rem, 3vw, 1.75rem);
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
          color: #ffffff;
          font-family: var(--font-family-headings, var(--font-family, 'Cairo')), sans-serif;
        }

        .wcu-form-title-highlight {
          background: linear-gradient(135deg, var(--color-secondary, #D4AF37), var(--color-accent, #FFD700));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .wcu-form-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9375rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .wcu-alert {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .wcu-alert--success {
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .wcu-alert--error {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .wcu-form {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .wcu-input {
          width: 100%;
          padding: 0.875rem 1.125rem;
          border-radius: 0.875rem;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          outline: none;
          font-family: var(--font-family, 'Cairo'), sans-serif;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .wcu-input:focus {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--color-secondary, #D4AF37);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
        }

        .wcu-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .wcu-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wcu-select {
          appearance: none;
          cursor: pointer;
        }

        .wcu-textarea {
          resize: vertical;
          min-height: 80px;
          font-family: var(--font-family, 'Cairo'), sans-serif;
        }

        .wcu-option {
          background: var(--color-primary, #1a365d);
          color: #ffffff;
          padding: 0.5rem;
        }

        .wcu-submit {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--color-secondary, #D4AF37), var(--color-secondary-dark, #B8960F));
          color: #0f172a;
          border: none;
          border-radius: 0.875rem;
          cursor: pointer;
          font-family: var(--font-family, 'Cairo'), sans-serif;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .wcu-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(212, 175, 55, 0.4);
        }

        .wcu-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .wcu-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .wcu-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(15, 23, 42, 0.3);
          border-top-color: #0f172a;
          border-radius: 50%;
          animation: wcu-spin 0.8s linear infinite;
        }

        @keyframes wcu-spin {
          to { transform: rotate(360deg); }
        }

        .wcu-privacy {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          text-align: center;
          margin: 1rem 0 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }

        @media (min-width: 640px) {
          .wcu-features {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 768px) {
          .wcu-form-container {
            padding: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .wcu-grid {
            grid-template-columns: 1.1fr 1fr;
            gap: 4rem;
          }
          
          .wcu-features {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1280px) {
          .wcu-grid {
            gap: 5rem;
          }
        }

      @media (max-width: 767px) {
  .wcu-section {
    padding: 2.5rem 0;
  }

  .wcu-container {
    padding: 0 1rem;
  }

  .wcu-grid {
    gap: 2rem;
  }

  .wcu-title {
    text-align: center;
  }

  .wcu-description {
    text-align: center;
  }

  .wcu-badge {
    display: flex;
    justify-content: center;
    width: fit-content;
    margin: 0 auto 1rem;
  }

  .wcu-features {
    grid-template-columns: 1fr;
  }

  /* ✅ توسيط البطاقات - استخدم !important */
  .wcu-feature {
    display: flex !important;
    flex-direction: column !important;
    text-align: center !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.75rem !important;
    padding: 1.5rem 1.25rem !important;
  }

  /* ✅ إخفاء الشريط الجانبي في الجوال */
  .wcu-feature__bar {
    display: none !important;
  }

  /* ✅ الأيقونة في المنتصف */
  .wcu-feature__icon {
    width: 3.5rem !important;
    height: 3.5rem !important;
    font-size: 1.75rem !important;
    margin: 0 auto !important;
    flex-shrink: 0 !important;
  }

  /* ✅ المحتوى في المنتصف */
  .wcu-feature__content {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    text-align: center !important;
    flex: none !important;
  }

  .wcu-feature__title {
    text-align: center !important;
    width: 100% !important;
  }

  .wcu-feature__desc {
    text-align: center !important;
    width: 100% !important;
  }

  /* توسيط الفورم */
  .wcu-form-container {
    padding: 1.5rem;
  }

  .wcu-form-badge {
    margin-left: auto;
    margin-right: auto;
  }

  .wcu-form-title {
    text-align: center;
  }

  .wcu-form-subtitle {
    text-align: center;
  }
}

        @media (max-width: 480px) {
          .wcu-feature {
            padding: 1rem;
          }
          
          .wcu-feature__icon {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.25rem;
          }
          
          .wcu-feature__title {
            font-size: 0.9375rem;
          }
          
          .wcu-feature__desc {
            font-size: 0.75rem;
          }
          
          .wcu-form-container {
            padding: 1.25rem;
            border-radius: 1.25rem;
          }
          
          .wcu-input {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }
          
          .wcu-submit {
            padding: 0.875rem 1.25rem;
            font-size: 0.9375rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wcu-feature,
          .wcu-input,
          .wcu-submit {
            transition: none;
          }
          
          .wcu-spinner {
            animation: none;
          }
        }

        @media print {
          .wcu-decoration,
          .wcu-form-glow,
          .wcu-form-decoration {
            display: none;
          }
          
          .wcu-form-container {
            background: white;
            color: black;
            box-shadow: none;
          }
        }
      `}</style>
    </section>
  );
}