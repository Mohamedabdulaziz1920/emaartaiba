'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api, type Testimonial } from '@/lib/api';

interface Props {
  featured?: boolean;
  limit?: number;
  showAddButton?: boolean;
  autoplaySpeed?: number; // مدة العرض بالمللي ثانية
}

export default function Testimonials({ 
  featured = true, 
  limit = 9, 
  showAddButton = true,
  autoplaySpeed = 5000 
}: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        let data: Testimonial[];
        
        if (featured) {
          data = await api.featuredTestimonials();
        } else {
          data = await api.testimonials();
        }
        
        setTestimonials(data.slice(0, limit));
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('حدث خطأ في تحميل آراء العملاء');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [featured, limit]);

  // عدد العناصر المرئية حسب الشاشة
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // حساب عدد الصفحات
  const totalPages = Math.ceil(testimonials.length / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);

  // العناصر المعروضة حالياً
  const visibleItems = testimonials.slice(currentIndex, currentIndex + itemsPerView);

  // التالي
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
    
    setTimeout(() => {
      if (currentIndex + itemsPerView < testimonials.length) {
        setCurrentIndex(prev => prev + itemsPerView);
      } else {
        setCurrentIndex(0);
      }
      setTimeout(() => setIsAnimating(false), 500);
    }, 300);
  };

  // السابق
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('prev');
    
    setTimeout(() => {
      if (currentIndex - itemsPerView >= 0) {
        setCurrentIndex(prev => prev - itemsPerView);
      } else {
        setCurrentIndex(Math.max(0, testimonials.length - itemsPerView));
      }
      setTimeout(() => setIsAnimating(false), 500);
    }, 300);
  };

  // الانتقال لصفحة محددة
  const goToPage = (page: number) => {
    if (isAnimating) return;
    setCurrentIndex(page * itemsPerView);
  };

  // التشغيل التلقائي
  useEffect(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, autoplaySpeed);
    
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [currentIndex, itemsPerView, testimonials.length, autoplaySpeed]);

  // إيقاف التشغيل التلقائي عند hover
  const pauseAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };
  
  const resumeAutoplay = () => {
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, autoplaySpeed);
  };

  // الحصول على الحرف الأول
  const getInitial = (name: string): string => {
    return name ? name.charAt(0) : 'ع';
  };

  // تنسيق النجوم
  const renderStars = (rating: number) => {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return (
      <span style={{ color: '#f59e0b', direction: 'ltr', display: 'inline-block', letterSpacing: '2px' }}>
        {fullStars}{emptyStars}
      </span>
    );
  };

  if (loading) {
    return (
      <section className="section-padding" style={{ background: 'var(--color-bg-light, #f8faff)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>جاري تحميل آراء العملاء...</p>
          </div>
        </div>
        <style>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid var(--color-secondary, #f59e0b);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding" style={{ background: 'var(--color-bg-light, #f8faff)' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section 
      className="testimonials-section"
      style={{ 
        padding: '5rem 0',
        background: 'linear-gradient(170deg, #f8faff 0%, #ffffff 50%, #f8faff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Background Decoration */}
      <div className="bg-decoration">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <span className="badge-icon">💬</span>
            آراء العملاء
          </span>
          <h2 className="section-title">
            ماذا يقول <span className="highlight">عملاؤنا؟</span>
          </h2>
          <p className="section-subtitle">
            ثقة عملائنا هي أغلى جوائزنا
          </p>
          <div className="title-divider">
            <span className="divider-line"></span>
            <span className="divider-diamond">◆</span>
            <span className="divider-line"></span>
          </div>
        </div>

        {/* Slider Container */}
        <div className="slider-container">
          {/* Navigation Buttons */}
          {totalPages > 1 && (
            <>
              <button 
                className="nav-btn nav-prev" 
                onClick={prevSlide}
                disabled={isAnimating}
                aria-label="السابق"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button 
                className="nav-btn nav-next" 
                onClick={nextSlide}
                disabled={isAnimating}
                aria-label="التالي"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Slides */}
          <div className={`slides-wrapper ${isAnimating ? `animating ${direction}` : ''}`}>
            <div className="slides-grid">
              {visibleItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`testimonial-card ${item.is_featured ? 'featured' : ''}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Quote Icon */}
                  <div className="quote-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 11h-4v-4h4v4zm8 0h-4v-4h4v4zm-12 6h-4v-4h4v4zm8 0h-4v-4h4v4z"/>
                    </svg>
                  </div>

                  {/* Content */}
                  <p className="testimonial-text">
                    "{item.excerpt || item.content}"
                  </p>

                  {/* Client Info */}
                  <div className="client-info">
                    <div className="client-avatar">
                      {item.client_image ? (
                        <img src={item.client_image} alt={item.client_name} />
                      ) : (
                        <span className="avatar-initial">{getInitial(item.client_name)}</span>
                      )}
                    </div>
                    <div className="client-details">
                      <h4 className="client-name">{item.client_name}</h4>
                      {item.client_position && (
                        <p className="client-position">{item.client_position}</p>
                      )}
                      {item.client_company && (
                        <p className="client-company">{item.client_company}</p>
                      )}
                    </div>
                  </div>

                  {/* Rating & Date */}
                  <div className="rating-row">
                    <div className="stars">{renderStars(item.rating)}</div>
                    {item.approved_at && (
                      <span className="review-date">
                        {new Date(item.approved_at).toLocaleDateString('ar-SA')}
                      </span>
                    )}
                  </div>

                  {/* Featured Badge */}
                  {item.is_featured && (
                    <div className="featured-badge">
                      <span>⭐</span> مميز
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="pagination-dots">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${currentPage === idx ? 'active' : ''}`}
                  onClick={() => goToPage(idx)}
                  aria-label={`الانتقال للصفحة ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link href="/testimonials" className="btn btn-primary">
            عرض جميع الآراء
            <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          {showAddButton && (
            <Link href="/testimonials/add" className="btn btn-secondary">
              ✍️ أضف تقييمك
              <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .testimonials-section {
          position: relative;
          overflow: hidden;
        }

        /* Background Decorations */
        .bg-decoration {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }
        .orb-1 {
          width: 400px;
          height: 400px;
          top: -100px;
          right: -100px;
          background: radial-gradient(circle, rgba(245,158,11,0.3), transparent);
          animation: float 20s ease-in-out infinite;
        }
        .orb-2 {
          width: 350px;
          height: 350px;
          bottom: -80px;
          left: -80px;
          background: radial-gradient(circle, rgba(26,54,93,0.3), transparent);
          animation: float 25s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(245,158,11,0.15), transparent);
          animation: pulse 8s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.5; }
        }

        /* Section Header */
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

        /* Slider Container */
        .slider-container {
          position: relative;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 3rem;
        }

        /* Navigation Buttons */
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
        .nav-btn:hover:not(:disabled) {
          background: #f59e0b;
          border-color: #f59e0b;
          transform: translateY(-50%) scale(1.05);
        }
        .nav-btn:hover:not(:disabled) svg {
          stroke: white;
        }
        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .nav-btn svg {
          width: 20px;
          height: 20px;
          stroke: #1e293b;
          transition: stroke 0.3s ease;
        }
        .nav-prev {
          left: 0;
        }
        .nav-next {
          right: 0;
        }
        .nav-prev svg {
          transform: rotate(180deg);
        }

        /* Slides */
        .slides-wrapper {
          overflow: hidden;
          border-radius: 1rem;
        }
        .slides-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Responsive grid */
        @media (max-width: 1024px) {
          .slides-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .slides-grid {
            grid-template-columns: 1fr;
          }
          .slider-container {
            padding: 0 2rem;
          }
        }

        /* Animation classes */
        .slides-wrapper.animating.next .slides-grid {
          animation: slideInNext 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slides-wrapper.animating.prev .slides-grid {
          animation: slideInPrev 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideInNext {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInPrev {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Testimonial Card */
        .testimonial-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .testimonial-card.featured {
          border: 2px solid rgba(245,158,11,0.3);
          background: linear-gradient(135deg, #fff, #fff9f0);
        }

        .quote-icon {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          background: rgba(245,158,11,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quote-icon svg {
          width: 20px;
          height: 20px;
          color: #f59e0b;
        }

        .testimonial-text {
          font-size: 0.9375rem;
          line-height: 1.8;
          color: #475569;
          margin-bottom: 1.5rem;
          font-style: italic;
          min-height: 100px;
        }

        .client-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .client-avatar {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .client-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-initial {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
        }
        .client-details {
          flex: 1;
        }
        .client-name {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.25rem;
        }
        .client-position {
          font-size: 0.7rem;
          color: #64748b;
          margin: 0;
        }
        .client-company {
          font-size: 0.65rem;
          color: #94a3b8;
          margin: 0.2rem 0 0;
        }

        .rating-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        .stars {
          font-size: 0.875rem;
          letter-spacing: 2px;
        }
        .review-date {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .featured-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* Pagination Dots */
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

        /* Action Buttons */
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 2rem;
          font-weight: 700;
          font-size: 0.9375rem;
          border-radius: 0.75rem;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .btn-primary {
          background: #0f172a;
          color: white;
        }
        .btn-primary:hover {
          background: #1e293b;
          gap: 0.75rem;
        }
        .btn-secondary {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }
        .btn-secondary:hover {
          gap: 0.75rem;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(245,158,11,0.3);
        }
        .btn-arrow {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }
        .btn:hover .btn-arrow {
          transform: translateX(-4px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .testimonial-card {
            padding: 1.5rem;
          }
          .testimonial-text {
            font-size: 0.875rem;
            min-height: auto;
          }
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          .btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}