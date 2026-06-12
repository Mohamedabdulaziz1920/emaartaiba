'use client';

const STEPS = [
  {
    number: '01',
    icon: '💬',
    title: 'التواصل والاستشارة',
    description: 'تواصل معنا واحصل على استشارة مجانية لمشروعك',
  },
  {
    number: '02',
    icon: '📐',
    title: 'التصميم والتخطيط',
    description: 'نضع لك خطة مفصلة وتصاميم تناسب احتياجاتك',
  },
  {
    number: '03',
    icon: '💰',
    title: 'عرض السعر',
    description: 'نقدم لك عرض سعر مفصل وشفاف بدون تكاليف خفية',
  },
  {
    number: '04',
    icon: '🏗️',
    title: 'التنفيذ والمتابعة',
    description: 'ننفذ المشروع بأعلى جودة مع متابعة دورية لكل مرحلة',
  },
  {
    number: '05',
    icon: '✅',
    title: 'التسليم والضمان',
    description: 'نسلمك المشروع في الموعد المحدد مع ضمان شامل',
  },
];

export default function ProcessSteps() {
  return (
    <section className="section-padding process-section">
      <div className="container-custom">
        <div style={{textAlign:'center', marginBottom:'3.5rem'}}>
          <span className="section-badge">⚙️ كيف نعمل؟</span>
          <h2 className="section-title">خطوات العمل معنا</h2>
          <p className="section-desc">
            عملية بسيطة وواضحة من البداية حتى تسليم مشروعك
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              
              {i < STEPS.length - 1 && (
                <div className="step-arrow">←</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .process-section {
          background: var(--color-bg-card);
          position: relative;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          position: relative;
        }

        @media (min-width: 640px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .steps-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 1rem;
          }
        }

        .step-card {
          background: var(--color-bg-light);
          padding: 2rem 1.5rem;
          border-radius: 1.25rem;
          text-align: center;
          position: relative;
          transition: all 0.4s ease;
          border: 2px solid transparent;
        }

        .step-card:hover {
          background: var(--color-bg-card);
          border-color: var(--color-secondary);
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          position: absolute;
          top: -20px;
          right: -10px;
          font-size: 4rem;
          font-weight: 900;
          color: var(--color-secondary);
          opacity: 0.15;
          line-height: 1;
          font-family: system-ui;
          transition: all 0.4s ease;
        }

        .step-card:hover .step-number {
          opacity: 0.3;
          transform: scale(1.2);
        }

        .step-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .step-card:hover .step-icon {
          transform: scale(1.15) rotate(-5deg);
        }

        .step-title {
          font-size: 1.0625rem;
          font-weight: 800;
          color: var(--color-text-dark);
          margin-bottom: 0.5rem;
          transition: color 0.3s ease;
        }

        .step-card:hover .step-title {
          color: var(--color-secondary);
        }

        .step-description {
          color: var(--color-text-muted);
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .step-arrow {
          display: none;
          position: absolute;
          left: -1.5rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2rem;
          color: var(--color-secondary);
          opacity: 0.3;
        }

        @media (min-width: 1024px) {
          .step-arrow {
            display: block;
          }
        }
      `}</style>
    </section>
  );
}