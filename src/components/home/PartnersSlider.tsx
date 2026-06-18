'use client';

import { imageUrl } from '@/lib/image';

interface Partner {
  id: number;
  name: string;
  logo?: string;
  url?: string;
}

interface Props {
  partners?: Partner[];
}

const DEFAULT_PARTNERS: Partner[] = [
  { id: 1, name: 'شريك 1' },
  { id: 2, name: 'شريك 2' },
  { id: 3, name: 'شريك 3' },
  { id: 4, name: 'شريك 4' },
  { id: 5, name: 'شريك 5' },
  { id: 6, name: 'شريك 6' },
];

export default function PartnersSlider({ partners = DEFAULT_PARTNERS }: Props) {
  if (!partners?.length) return null;

  const doubled = [...partners, ...partners];

  return (
    <section className="partners-section">
      <div className="container-custom">
        <div style={{textAlign:'center', marginBottom:'2.5rem'}}>
          <span className="section-badge" style={{ background: 'rgba(237, 137, 54, 0.15)' }}>🤝 شركاؤنا</span>
          <h2 className="section-title" style={{ color: 'var(--color-text-dark, #1f2937)' }}>شركاء النجاح</h2>
          <p className="section-desc" style={{ color: 'var(--color-text-muted, #64748b)' }}>
            نفتخر بثقة كبرى الشركات والمؤسسات بنا
          </p>
        </div>

        <div className="partners-wrapper">
          <div className="partners-track">
            {doubled.map((p, i) => (
              <div key={`${p.id}-${i}`} className="partner-item">
                {p.logo ? (
                  <img 
                    src={imageUrl(p.logo)} 
                    alt={p.name} 
                    className="partner-logo"
                  />
                ) : (
                  <div className="partner-placeholder">
                    {p.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .partners-section {
          padding: 4rem 0;
          background: var(--color-bg-card, #ffffff);
          overflow: hidden;
          border-top: 1px solid var(--color-border-light, #f1f5f9);
          border-bottom: 1px solid var(--color-border-light, #f1f5f9);
        }

        .partners-wrapper {
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(90deg, 
            transparent 0%, 
            black 10%, 
            black 90%, 
            transparent 100%
          );
        }

        .partners-track {
          display: flex;
          gap: 3rem;
          animation: scroll 30s linear infinite;
          width: max-content;
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .partners-track:hover {
          animation-play-state: paused;
        }

        .partner-item {
          flex-shrink: 0;
          width: 180px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 1.5rem;
          background: var(--color-bg-light, #f8faff);
          border-radius: 1rem;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .partner-item:hover {
          background: var(--color-bg-card, #ffffff);
          border-color: var(--color-secondary, #ed8936);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .partner-logo {
          max-width: 100%;
          max-height: 60px;
          object-fit: contain;
          filter: grayscale(100%);
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .partner-item:hover .partner-logo {
          filter: grayscale(0%);
          opacity: 1;
        }

        .partner-placeholder {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, 
            var(--color-secondary, #ed8936), 
            var(--color-secondary-dark, #dd6b20)
          );
          color: var(--color-text-light, white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
        }

        @media (max-width: 640px) {
          .partner-item {
            width: 140px;
            height: 80px;
          }

          .partners-track {
            gap: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
