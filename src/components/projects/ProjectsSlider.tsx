'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/api';

interface ProjectsSliderProps {
  projects: Project[];
  autoplayInterval?: number;
}

export default function ProjectsSlider({ projects, autoplayInterval = 4000 }: ProjectsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  if (!projects || projects.length === 0) return null;

  // تحديث عدد العناصر المعروضة حسب حجم الشاشة
  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // مصفوفة المشاريع المكررة للتأثير اللامتناهي
  const extendedProjects = [...projects, ...projects, ...projects];
  const totalSlides = projects.length;
  const maxIndex = totalSlides * 2 - itemsPerView;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev + itemsPerView >= totalSlides * 2) {
        return totalSlides;
      }
      return prev + 1;
    });
  }, [itemsPerView, totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return totalSlides * 2 - itemsPerView;
      }
      return prev - 1;
    });
  }, [itemsPerView, totalSlides]);

  // تشغيل السلايدر التلقائي
  useEffect(() => {
    if (!isClient) return;
    if (!autoplayInterval || isPaused || projects.length === 0) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoplayInterval, isPaused, projects.length, goToNext, isClient]);

  // إعادة تعيين الموضع عند تغيير عدد العناصر
  useEffect(() => {
    setCurrentIndex(totalSlides);
  }, [itemsPerView, totalSlides]);

  const translateX = -(currentIndex * (100 / itemsPerView));

  // التنقل إلى شريحة محددة
  const goToSlide = (index: number) => {
    setCurrentIndex(index * itemsPerView + totalSlides);
  };

  // عدد الصفحات
  const totalPages = Math.ceil(totalSlides / itemsPerView);
  const currentPage = Math.floor((currentIndex - totalSlides) / itemsPerView);

  if (!isClient) {
    return (
      <div className="projects-slider-container">
        <div className="slider-wrapper">
          <div className="slider-track-placeholder">
            {projects.slice(0, itemsPerView).map((project) => (
              <div key={project.id} className="slider-item-placeholder">
                <div className="project-card-placeholder">
                  <div className="placeholder-image"></div>
                  <div className="placeholder-content">
                    <div className="placeholder-title"></div>
                    <div className="placeholder-text"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          .slider-track-placeholder {
            display: flex;
            gap: 1.5rem;
          }
          .slider-item-placeholder {
            flex: 0 0 calc((100% - 3rem) / 3);
          }
          .project-card-placeholder {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          }
          .placeholder-image {
            height: 220px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          .placeholder-content {
            padding: 1.25rem;
          }
          .placeholder-title {
            height: 20px;
            background: #e2e8f0;
            border-radius: 4px;
            margin-bottom: 0.75rem;
            width: 70%;
          }
          .placeholder-text {
            height: 60px;
            background: #e2e8f0;
            border-radius: 4px;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @media (max-width: 1024px) {
            .slider-item-placeholder {
              flex: 0 0 calc((100% - 1.5rem) / 2);
            }
          }
          @media (max-width: 640px) {
            .slider-item-placeholder {
              flex: 0 0 100%;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className="projects-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-wrapper">
        <div 
          className="slider-track"
          style={{ transform: `translateX(${translateX}%)`, transition: 'transform 0.5s ease-out' }}
        >
          {extendedProjects.map((project, idx) => (
            <div key={`${project.id}-${idx}`} className="slider-item">
              <Link href={`/projects/${project.slug}`} className="project-card">
                <div className="project-image">
                  <img 
                    src={project.main_image || '/images/placeholder-project.jpg'} 
                    alt={project.title_ar}
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-project.jpg';
                    }}
                  />
                  <div className="project-overlay">
                    <span className="project-view">عرض التفاصيل</span>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-badge">
                    {project.status === 'completed' && '✅ منجز'}
                    {project.status === 'in_progress' && '🔨 قيد التنفيذ'}
                    {project.status === 'planned' && '📅 مخطط'}
                  </div>
                  <h3 className="project-title">{project.title_ar}</h3>
                  <p className="project-excerpt">
                    {project.excerpt_ar?.substring(0, 80)}...
                  </p>
                  <div className="project-footer">
                    {project.city && (
                      <span className="project-city">📍 {project.city}</span>
                    )}
                    {project.area_sqm && (
                      <span className="project-area">📐 {project.area_sqm} م²</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التحكم */}
      <button className="slider-arrow prev" onClick={goToPrev}>
        ‹
      </button>
      <button className="slider-arrow next" onClick={goToNext}>
        ›
      </button>

      {/* Dots الملاحة */}
      {totalPages > 1 && (
        <div className="slider-dots">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${currentPage === idx ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .projects-slider-container {
          position: relative;
          padding: 1rem 0;
          overflow: hidden;
        }

        .slider-wrapper {
          overflow: hidden;
          margin: 0 3rem;
        }

        .slider-track {
          display: flex;
          gap: 1.5rem;
          will-change: transform;
        }

        .slider-item {
          flex: 0 0 calc((100% - 3rem) / 3);
          min-width: 0;
        }

        @media (max-width: 1024px) {
          .slider-item {
            flex: 0 0 calc((100% - 1.5rem) / 2);
          }
        }

        @media (max-width: 640px) {
          .slider-wrapper {
            margin: 0 1rem;
          }
          .slider-item {
            flex: 0 0 100%;
          }
          .slider-track {
            gap: 1rem;
          }
        }

        .project-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          height: 100%;
        }

        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .project-image {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .project-card:hover .project-image img {
          transform: scale(1.05);
        }

        .project-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-card:hover .project-overlay {
          opacity: 1;
        }

        .project-view {
          padding: 0.5rem 1.25rem;
          background: #f59e0b;
          color: white;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .project-content {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .project-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #fef3c7;
          color: #d97706;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          align-self: flex-start;
        }

        .project-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .project-card:hover .project-title {
          color: #f59e0b;
        }

        .project-excerpt {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          flex: 1;
        }

        .project-footer {
          display: flex;
          gap: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e2e8f0;
          color: #1a365d;
          font-size: 1.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .slider-arrow.prev {
          left: 0.5rem;
        }

        .slider-arrow.next {
          right: 0.5rem;
        }

        .slider-arrow:hover {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }

        .slider-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .slider-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #cbd5e0;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slider-dot.active {
          width: 30px;
          border-radius: 5px;
          background: #f59e0b;
        }

        .slider-dot:hover {
          background: #f59e0b;
        }

        @media (max-width: 640px) {
          .slider-arrow {
            width: 36px;
            height: 36px;
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}