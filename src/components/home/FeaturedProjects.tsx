// frontend/src/components/home/FeaturedProjects.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { imageUrl } from '@/lib/image';
import type { Project } from '@/lib/api';
import { getProjectStatusInfo } from '@/lib/api';

interface Props {
  initialProjects?: Project[];
  projects?: Project[]; // للتوافق مع الاستخدام القديم
  autoplaySpeed?: number; // مدة العرض بالمللي ثانية
}

export default function FeaturedProjects({ 
  initialProjects, 
  projects: projectsProp,
  autoplaySpeed = 5000 
}: Props) {
  const projectsData = initialProjects || projectsProp || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // تحديث عدد العناصر المرئية حسب حجم الشاشة
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsPerView(1);
      else if (width < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  if (!projectsData.length) return null;

  const totalPages = Math.ceil(projectsData.length / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);

  // العناصر المعروضة حالياً
  const visibleItems = projectsData.slice(currentIndex, currentIndex + itemsPerView);

  // التالي
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
    
    setTimeout(() => {
      if (currentIndex + itemsPerView < projectsData.length) {
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
        setCurrentIndex(Math.max(0, projectsData.length - itemsPerView));
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
  }, [currentIndex, itemsPerView, projectsData.length, autoplaySpeed]);

  // إيقاف التشغيل التلقائي عند hover
  const pauseAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };
  
  const resumeAutoplay = () => {
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, autoplaySpeed);
  };

  return (
    <section 
      className="projects-slider-section"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      style={{ 
        padding: '5rem 0',
        background: 'linear-gradient(170deg, #f8faff 0%, #ffffff 50%, #f8faff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
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
            <span className="badge-icon">🏗️</span>
            أعمالنا
          </span>
          <h2 className="section-title">
            مشاريعنا <span className="highlight">المميزة</span>
          </h2>
          <p className="section-subtitle">
            نفخر بتقديم أعمالنا التي تعكس خبرتنا والتزامنا بالجودة
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
              {visibleItems.map((project, idx) => {
                const img = project.main_image ? imageUrl(project.main_image) : null;
                const statusInfo = project.status ? getProjectStatusInfo(project.status) : null;
                
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className={`project-card ${project.is_featured ? 'featured' : ''}`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {/* Image Frame */}
                    <div className="card-image">
                      {img ? (
                        <img src={img} alt={project.title_ar} />
                      ) : (
                        <div className="no-image">🏗️</div>
                      )}
                      
                      {/* Badges */}
                      <div className="card-badges">
                        {project.is_featured && (
                          <span className="badge featured-badge">
                            ⭐ مميز
                          </span>
                        )}
                        {statusInfo && (
                          <span className="badge status-badge" style={{ background: statusInfo.color }}>
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="hover-overlay">
                        <div className="hover-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </div>
                        <span>عرض المشروع</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="card-content">
                      {project.category?.name_ar && (
                        <span className="project-category">{project.category.name_ar}</span>
                      )}
                      <h3 className="project-title">{project.title_ar}</h3>
                      {project.excerpt_ar && (
                        <p className="project-excerpt">{project.excerpt_ar.substring(0, 100)}...</p>
                      )}
                      
                      {/* Meta Info */}
                      <div className="project-meta">
                        {project.city && (
                          <span className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {project.city}
                          </span>
                        )}
                        {project.area_sqm && (
                          <span className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <line x1="3" y1="9" x2="21" y2="9"/>
                              <line x1="9" y1="21" x2="9" y2="9"/>
                            </svg>
                           <span suppressHydrationWarning>
  <span suppressHydrationWarning>{project.area_sqm.toLocaleString('ar-SA')} م²</span>
</span>
                          </span>
                        )}
                        {project.duration && (
                          <span className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {project.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
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

        {/* زر عرض الكل */}
        <div className="action-buttons">
          <Link href="/projects" className="btn btn-primary">
            عرض جميع المشاريع
            <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .projects-slider-section {
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

        /* Project Card */
        .project-card {
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .project-card.featured {
          border: 2px solid rgba(245,158,11,0.3);
          background: linear-gradient(135deg, #fff, #fff9f0);
        }

        /* Card Image */
        .card-image {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .project-card:hover .card-image img {
          transform: scale(1.08);
        }
        .no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
        }

        /* Badges */
        .card-badges {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          z-index: 2;
        }
        .badge {
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
        }
        .featured-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 4px 12px rgba(245,158,11,0.3);
        }
        .status-badge {
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* Hover Overlay */
        .hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 3;
        }
        .project-card:hover .hover-overlay {
          opacity: 1;
        }
        .hover-icon {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .hover-icon svg {
          width: 24px;
          height: 24px;
          stroke: white;
        }
        .project-card:hover .hover-icon {
          transform: scale(1.1);
        }
        .hover-overlay span {
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(0,0,0,0.6);
          padding: 0.35rem 1rem;
          border-radius: 999px;
        }

        /* Card Content */
        .card-content {
          padding: 1.5rem;
        }
        .project-category {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #f59e0b;
          background: rgba(245,158,11,0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          margin-bottom: 0.75rem;
        }
        .project-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem;
          line-height: 1.4;
        }
        .project-card:hover .project-title {
          color: #f59e0b;
        }
        .project-excerpt {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Meta Info */
        .project-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
        }
        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #94a3b8;
        }
        .meta-item svg {
          width: 12px;
          height: 12px;
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
          margin-top: 3rem;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 2rem;
          background: #0f172a;
          color: white;
          font-weight: 700;
          font-size: 0.9375rem;
          border-radius: 0.75rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn:hover {
          background: #1e293b;
          gap: 0.75rem;
        }
        .btn-arrow {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }
        .btn:hover .btn-arrow {
          transform: translateX(-4px);
        }

        @media (max-width: 768px) {
          .card-content {
            padding: 1rem;
          }
          .project-title {
            font-size: 1rem;
          }
          .project-meta {
            gap: 0.5rem;
          }
          .meta-item {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </section>
  );
}