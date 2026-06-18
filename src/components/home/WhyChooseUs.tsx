'use client';

const FEATURES = [
  { icon:'🏆', title:'خبرة 20+ عاماً',     desc:'في تنفيذ آلاف المشاريع بنجاح',           color:'#fbbf24' },
  { icon:'⭐', title:'جودة لا تُضاهى',      desc:'أفضل المواد ومعايير عالمية',              color:'#3b82f6' },
  { icon:'⏰', title:'التزام بالمواعيد',     desc:'تسليم في الوقت المحدد دائماً',           color:'#10b981' },
  { icon:'💎', title:'أسعار تنافسية',        desc:'قيمة مقابل المال بدون تنازل',            color:'#8b5cf6' },
  { icon:'🛡️', title:'ضمان شامل',          desc:'على جميع أعمال البناء والتشطيب',         color:'#ef4444' },
  { icon:'👷', title:'فريق متخصص',          desc:'مهندسون وفنيون محترفون',                 color:'#f97316' },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding why-choose-section">
      {/* خلفية زخرفية */}
      <div className="why-decoration-1" />
      <div className="why-decoration-2" />

      <div className="container-custom" style={{position:'relative', zIndex:1}}>
        <div className="why-grid">
          {/* النصف الأيمن: المميزات */}
          <div>
            <span className="section-badge">⭐ لماذا نحن؟</span>
            <h2 className="section-title" style={{textAlign:'right'}}>
              لماذا تختار <span className="text-gradient-orange">البناء المتميز؟</span>
            </h2>
            <p className="why-description">
              نحن لسنا مجرد شركة مقاولات، بل شريكك الموثوق في رحلة بناء أحلامك.
              نقدم خدمات متكاملة بجودة عالية وأسعار مناسبة.
            </p>

            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="hover-lift feature-card">
                  <div className="feature-bar" style={{background: f.color}}/>
                  <div className="feature-icon" style={{
                    background: `${f.color}15`,
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="feature-title">
                      {f.title}
                    </h3>
                    <p className="feature-desc">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* النصف الأيسر: الفورم */}
          <div className="form-wrapper">
            <div className="form-glow" />
            <div className="form-container">
              {/* نقاط زخرفية */}
              <div className="form-decoration" />

              <div style={{position:'relative', zIndex:1}}>
                <div className="form-badge">
                  ⚡ استشارة مجانية
                </div>
                <h3 className="form-title">
                  احصل على عرض سعر <span className="text-gradient-orange">مجاني</span>
                </h3>
                <p className="form-subtitle">
                  تواصل معنا الآن وسنتصل بك خلال 24 ساعة
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="contact-form">
                  <input type="text" placeholder="الاسم الكريم *" required className="form-input"/>
                  <input type="tel" placeholder="رقم الجوال *" required className="form-input"/>
                  <select className="form-input">
                    <option value="" className="form-option">نوع المشروع</option>
                    <option className="form-option">بناء فيلا سكنية</option>
                    <option className="form-option">مشروع تجاري</option>
                    <option className="form-option">تشطيبات داخلية</option>
                    <option className="form-option">ترميم وصيانة</option>
                  </select>
                  <textarea placeholder="وصف مختصر للمشروع" rows={3} className="form-input form-textarea"/>
                  <button type="submit" className="form-submit">
                    🚀 إرسال الطلب الآن
                  </button>
                </form>
                <p className="form-privacy">
                  🔒 معلوماتك محمية وآمنة 100%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .why-choose-section {
          background: var(--color-bg-card);
          position: relative;
          overflow: hidden;
        }

        /* Decorations */
        .why-decoration-1 {
          position: absolute;
          top: 10%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(237, 137, 54, 0.05), transparent);
          pointer-events: none;
        }

        .why-decoration-2 {
          position: absolute;
          bottom: 10%;
          left: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(43, 108, 176, 0.05), transparent);
          pointer-events: none;
        }

        /* Grid */
        .why-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .why-grid {
            grid-template-columns: 1.1fr 1fr;
            gap: 4rem;
          }
        }

        /* Description */
        .why-description {
          color: var(--color-text-muted);
          font-size: 1.0625rem;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Feature Card */
        .feature-card {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 1.25rem;
          background: var(--color-bg-card);
          border: 1px solid #e8edf5;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .feature-bar {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
        }

        .feature-icon {
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

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .feature-title {
          font-weight: 800;
          color: var(--color-text-dark);
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .feature-desc {
          color: var(--color-text-muted);
          font-size: 0.8125rem;
          line-height: 1.6;
        }

        /* Form Wrapper */
        .form-wrapper {
          position: relative;
        }

        .form-glow {
          position: absolute;
          inset: -20px;
          background: linear-gradient(135deg, 
            rgba(237, 137, 54, 0.3), 
            rgba(43, 108, 176, 0.3)
          );
          border-radius: 2rem;
          filter: blur(40px);
          opacity: 0.6;
          z-index: 0;
        }

        .form-container {
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, 
            var(--color-primary-dark), 
            var(--color-primary), 
            var(--color-primary-light)
          );
          border-radius: 1.75rem;
          padding: 2.5rem;
          color: var(--color-text-light);
          overflow: hidden;
        }

        .form-decoration {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(var(--color-secondary-rgb, 237, 137, 54), 0.2);
          filter: blur(40px);
        }

        /* Form Badge */
        .form-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          background: rgba(var(--color-secondary-rgb, 237, 137, 54), 0.2);
          color: var(--color-secondary-light);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          color: var(--color-text-light);
        }

        .form-subtitle {
          color: var(--footer-text, #cbd5e0);
          font-size: 0.9375rem;
          margin-bottom: 1.75rem;
        }

        /* Form */
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1.125rem;
          border-radius: 0.875rem;
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-text-light);
          border: 1px solid rgba(255, 255, 255, 0.15);
          outline: none;
          font-family: Cairo, sans-serif;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.2);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-textarea {
          resize: none;
        }

        .form-option {
          background: var(--color-primary);
          color: var(--color-text-light);
        }

        /* Submit Button */
        .form-submit {
          width: 100%;
          padding: 1.125rem;
          font-size: 1.0625rem;
          font-weight: 800;
          background: linear-gradient(135deg, 
            var(--btn-primary-bg), 
            var(--btn-primary-hover)
          );
          color: var(--btn-primary-text);
          border: none;
          border-radius: 0.875rem;
          cursor: pointer;
          font-family: Cairo, sans-serif;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .form-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, 
            var(--btn-primary-hover), 
            var(--color-secondary-dark)
          );
        }

        .form-submit:active {
          transform: translateY(0);
        }

        /* Privacy */
        .form-privacy {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>
    </section>
  );
}