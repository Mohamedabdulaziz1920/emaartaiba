import Link from 'next/link';

const PHONE    = process.env.NEXT_PUBLIC_PHONE    || '+966500000000';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '966500000000';

export default function CTASection() {
  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('مرحباً، أود الاستفسار')}`;
  
  return (
    <section className="cta-section">
      {/* خلفية زخرفية */}
      <div className="cta-decoration-1" />
      <div className="cta-decoration-2" />
      <div className="cta-pattern" />

      <div className="container-custom" style={{position:'relative', zIndex:2}}>
        <div className="cta-badge">
          🎯 ابدأ معنا اليوم
        </div>
        
        <h2 className="cta-title">
          جاهز لبدء <span className="text-gradient-orange">مشروعك؟</span>
        </h2>
        
        <p className="cta-description">
          تواصل معنا الآن واحصل على استشارة مجانية وعرض سعر مفصل لمشروعك
        </p>

        <div className="cta-buttons">
          <a href={`tel:${PHONE}`} className="cta-btn cta-btn-phone">
            <span className="cta-btn-icon">📞</span>
            <span>اتصل بنا الآن</span>
          </a>

          <a 
            href={waUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cta-btn cta-btn-whatsapp"
          >
            <span className="cta-btn-icon">💬</span>
            <span>واتساب</span>
          </a>

          <Link href="/contact" className="cta-btn cta-btn-outline">
            <span className="cta-btn-icon">📝</span>
            <span>اطلب عرض سعر</span>
          </Link>
        </div>

        {/* مميزات سريعة */}
        <div className="cta-features">
          <div className="cta-feature">
            <span className="cta-feature-icon">✅</span>
            <span>استشارة مجانية</span>
          </div>
          <div className="cta-feature">
            <span className="cta-feature-icon">⚡</span>
            <span>رد سريع خلال 24 ساعة</span>
          </div>
          <div className="cta-feature">
            <span className="cta-feature-icon">🔒</span>
            <span>معلوماتك محمية</span>
          </div>
        </div>
      </div>

      <style>{`
        .cta-section {
          padding: 6rem 0;
          text-align: center;
          color: var(--color-text-light);
          background: linear-gradient(135deg, 
            var(--color-primary-dark), 
            var(--color-primary), 
            var(--color-primary-light)
          );
          position: relative;
          overflow: hidden;
        }

        /* Decorations */
        .cta-decoration-1 {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, 
  rgba(var(--color-primary-rgb, 43, 108, 176), 0.4) 0%, 
  transparent 70%
);
          filter: blur(40px);
          pointer-events: none;
          z-index: 1;
        }

        .cta-decoration-2 {
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(43, 108, 176, 0.4) 0%, 
            transparent 70%
          );
          filter: blur(40px);
          pointer-events: none;
          z-index: 1;
        }

        .cta-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.4;
          pointer-events: none;
          z-index: 1;
        }

        /* Badge */
        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: rgba(237, 137, 54, 0.2);
          color: var(--color-secondary-light);
          font-size: 0.875rem;
          font-weight: 700;
          border-radius: 9999px;
          margin-bottom: 1.25rem;
          border: 1px solid rgba(237, 137, 54, 0.3);
          backdrop-filter: blur(10px);
        }

        /* Title */
        .cta-title {
          font-size: clamp(1.875rem, 5vw, 3rem);
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.2;
          color: var(--color-text-light);
        }

        /* Description */
        .cta-description {
          color: var(--color-secondary-light);
          font-size: clamp(1rem, 2vw, 1.25rem);
          margin: 0 auto 2.5rem;
          max-width: 40rem;
          line-height: 1.7;
          opacity: 0.95;
        }

        /* Buttons */
        .cta-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2.5rem;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          padding: 1.125rem 2rem;
          border-radius: 0.875rem;
          font-weight: 800;
          text-decoration: none;
          font-size: 1.0625rem;
          font-family: Cairo, sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          min-width: 200px;
          letter-spacing: 0.3px;
        }

        .cta-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .cta-btn:hover::before {
          left: 100%;
        }

        .cta-btn-icon {
          font-size: 1.25rem;
          display: inline-flex;
          align-items: center;
        }

        /* الزر البرتقالي - اتصل */
        .cta-btn-phone {
          background: linear-gradient(135deg, 
            var(--btn-primary-bg), 
            var(--btn-primary-hover)
          );
          color: var(--btn-primary-text);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .cta-btn-phone:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          background: linear-gradient(135deg, 
            var(--btn-primary-hover), 
            var(--color-secondary-dark)
          );
        }

        /* زر الواتساب */
        .cta-btn-whatsapp {
          background: linear-gradient(135deg, #25d366, #128c7e);
          color: white;
          box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
        }

        .cta-btn-whatsapp:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(37, 211, 102, 0.5);
          background: linear-gradient(135deg, #128c7e, #075e54);
        }

        /* الزر المحاط */
        .cta-btn-outline {
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text-light);
          border: 2px solid rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
        }

        .cta-btn-outline:hover {
          transform: translateY(-3px);
          background: var(--color-bg-card);
          color: var(--color-text-dark);
          border-color: var(--color-bg-card);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        /* Features */
        .cta-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          color: var(--color-secondary-light);
          font-size: 0.9375rem;
          font-weight: 600;
          opacity: 0.9;
        }

        .cta-feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .cta-feature:hover {
          background: rgba(237, 137, 54, 0.2);
          border-color: var(--color-secondary);
          transform: translateY(-2px);
        }

        .cta-feature-icon {
          font-size: 1.125rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .cta-section {
            padding: 4rem 0;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
            padding: 0 1rem;
          }

          .cta-btn {
            min-width: unset;
            width: 100%;
          }

          .cta-features {
            gap: 0.75rem;
            font-size: 0.8125rem;
          }

          .cta-feature {
            padding: 0.4rem 0.875rem;
          }
        }

        @media (max-width: 480px) {
          .cta-section {
            padding: 3rem 0;
          }

          .cta-features {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}