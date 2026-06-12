'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Partner {
  id: number;
  name: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  logo: string;
  cover_image: string | null;
  website: string | null;
  description: string | null;
  is_featured: boolean;
  sort_order: number;
}

interface PartnersProps {
  partners?: Partner[];
  autoplayInterval?: number; // milliseconds between scrolls
}

export default function Partners({ partners: propPartners, autoplayInterval = 4000 }: PartnersProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (propPartners && propPartners.length > 0) {
      setPartners(propPartners);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [propPartners]);

  const getPartnerName = (partner: Partner): string => {
    return partner.name_ar || partner.name || 'شريك';
  };

  // تحديث عدد العناصر المرئية حسب الشاشة
  const updateItemsPerView = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) setItemsPerView(2);
    else if (width < 1024) setItemsPerView(3);
    else setItemsPerView(4);
  }, []);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [updateItemsPerView]);

  const totalSlides = Math.ceil(partners.length / itemsPerView);
  const maxSlide = Math.max(0, totalSlides - 1);

  // الانتقال إلى الشريحة التالية
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => {
      const next = prev + 1;
      return next > maxSlide ? 0 : next;
    });
    setTimeout(() => setIsAnimating(false), 500);
  }, [maxSlide, isAnimating]);

  // الانتقال إلى الشريحة السابقة
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => {
      const next = prev - 1;
      return next < 0 ? maxSlide : next;
    });
    setTimeout(() => setIsAnimating(false), 500);
  };

  // التبديل إلى شريحة محددة
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // التشغيل التلقائي
  useEffect(() => {
    if (!autoplayInterval || isPaused || partners.length === 0) return;
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, autoplayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoplayInterval, isPaused, partners.length, nextSlide]);

  // إيقاف التشغيل عند hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (loading) {
    return (
      <section className="partners-section loading">
        <div className="container-custom">
          <div className="loading-spinner"></div>
        </div>
        <style jsx>{`
          .partners-section {
            padding: 3rem 0;
            background: var(--color-bg-light, #f8faff);
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto;
            border: 3px solid #e2e8f0;
            border-top: 3px solid var(--color-secondary, #f59e0b);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  if (!partners.length) return null;

  // تقسيم الشركاء إلى مجموعات حسب itemsPerView
  const slides: Partner[][] = [];
  for (let i = 0; i < partners.length; i += itemsPerView) {
    slides.push(partners.slice(i, i + itemsPerView));
  }

  const visibleSlides = slides;
  const currentSlides = visibleSlides[currentSlide] || [];

  return (
    <section
      className="partners-section"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container-custom">
        {/* رأس القسم */}
        <div className="section-header">
          <span className="section-badge">
            <span className="badge-icon">🤝</span>
            شركاؤنا
          </span>
          <h2 className="section-title">
            شركاء <span className="highlight">النجاح</span>
          </h2>
          <p className="section-subtitle">
            نفخر بشراكتنا مع كبرى الشركات والمؤسسات في المملكة
          </p>
          <div className="title-divider">
            <span className="divider-line"></span>
            <span className="divider-diamond">◆</span>
            <span className="divider-line"></span>
          </div>
        </div>

        {/* سلايدر الشركاء */}
        <div className="slider-container">
          {visibleSlides.length > 1 && (
            <>
              <button className="nav-btn prev" onClick={prevSlide} aria-label="السابق">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="nav-btn next" onClick={nextSlide} aria-label="التالي">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div className={`slides-wrapper ${isAnimating ? 'animating' : ''}`}>
            <div className="slides-grid" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {visibleSlides.map((slideGroup, idx) => (
                <div key={idx} className="slide">
                  {slideGroup.map((partner) => (
                    <div key={partner.id} className="partner-card">
                      <div className="partner-logo-wrapper">
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt={getPartnerName(partner)}
                            className="partner-logo"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.add('visible');
                            }}
                          />
                        ) : null}
                        <div className="partner-fallback">
                          {getPartnerName(partner).charAt(0)}
                        </div>
                      </div>
                      <div className="partner-info">
                        <h3 className="partner-name">{getPartnerName(partner)}</h3>
                        {partner.description && (
                          <p className="partner-desc">{partner.description.substring(0, 60)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* نقاط التصفح */}
        {visibleSlides.length > 1 && (
          <div className="pagination-dots">
            {visibleSlides.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
                aria-label={`الانتقال للشريحة ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .partners-section {
          padding: 5rem 0;
          background: linear-gradient(170deg, #f8faff 0%, #ffffff 50%, #f8faff 100%);
          position: relative;
          overflow: hidden;
        }

        /* رأس القسم */
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #f59e0b;
          margin-bottom: 1.5rem;
        }
        .badge-icon {
          font-size: 1rem;
        }
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        .highlight {
          color: #f59e0b;
          position: relative;
          display: inline-block;
        }
        .highlight::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #f59e0b, transparent);
          border-radius: 3px;
        }
        .section-subtitle {
          color: #64748b;
          max-width: 40rem;
          margin: 0 auto;
          font-size: 1rem;
        }
        .title-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .divider-line {
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f59e0b, transparent);
        }
        .divider-diamond {
          color: #f59e0b;
          font-size: 0.6rem;
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* سلايدر */
        .slider-container {
          position: relative;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 3rem;
        }

        /* أزرار التنقل */
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          background: white;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .nav-btn:hover {
          background: #f59e0b;
          border-color: #f59e0b;
          transform: translateY(-50%) scale(1.05);
        }
        .nav-btn:hover svg {
          stroke: white;
        }
        .nav-btn svg {
          width: 20px;
          height: 20px;
          stroke: #1e293b;
          transition: stroke 0.3s ease;
        }
        .prev {
          left: 0;
        }
        .next {
          right: 0;
        }
        .prev svg {
          transform: rotate(180deg);
        }

        .slides-wrapper {
          overflow: hidden;
          border-radius: 1rem;
        }
        .slides-grid {
          display: flex;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide {
          flex: 0 0 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          padding: 0.5rem;
        }
        @media (max-width: 1024px) {
          .slide {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .slide {
            grid-template-columns: repeat(2, 1fr);
          }
          .slider-container {
            padding: 0 2rem;
          }
        }

        /* بطاقة الشريك */
        .partner-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem 1rem;
          text-align: center;
          transition: all 0.4s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }
        .partner-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          border-color: #f59e0b20;
        }

        .partner-logo-wrapper {
          width: 100px;
          height: 100px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 50%;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .partner-logo {
          width: 80%;
          height: auto;
          object-fit: contain;
          filter: grayscale(100%);
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        .partner-card:hover .partner-logo {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.05);
        }
        .partner-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          display: none;
        }
        .partner-fallback.visible {
          display: flex;
        }
        .partner-info {
          margin-top: 0.5rem;
        }
        .partner-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          transition: color 0.3s ease;
        }
        .partner-card:hover .partner-name {
          color: #f59e0b;
        }
        .partner-desc {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* نقاط التصفح */
        .pagination-dots {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 2rem;
        }
        .dot {
          width: 10px;
          height: 10px;
          background: #cbd5e1;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .dot:hover {
          background: #f59e0b;
        }
        .dot.active {
          width: 28px;
          background: #f59e0b;
          border-radius: 10px;
        }

        /* استجابة إضافية */
        @media (max-width: 640px) {
          .partner-logo-wrapper {
            width: 70px;
            height: 70px;
          }
          .partner-name {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}