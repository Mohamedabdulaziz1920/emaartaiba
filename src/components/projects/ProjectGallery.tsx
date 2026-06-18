'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Download, Maximize2, Grid3x3, Image as ImageIcon 
} from 'lucide-react';
import { imageUrl } from '@/lib/image';

interface ProjectGalleryProps {
  images: string[];
  title: string;
  imageAlt?: string | null;
}

export default function ProjectGallery({ images, title, imageAlt }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [zoom, setZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // تحويل المسارات إلى روابط كاملة وتصفية الصور الفارغة
  const fullImages = (images || [])
    .filter(img => img && typeof img === 'string' && img.trim() !== '')
    .map(img => {
      try {
        return imageUrl(img);
      } catch {
        return img;
      }
    });

  // إذا لم توجد صور
  if (fullImages.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
    setZoom(1);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setZoom(1);
    document.body.style.overflow = 'auto';
  };

  const nextImage = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % fullImages.length);
    setZoom(1);
  }, [fullImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex(prev => (prev - 1 + fullImages.length) % fullImages.length);
    setZoom(1);
  }, [fullImages.length]);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  // تحميل الصورة
  const downloadImage = async () => {
    try {
      const response = await fetch(fullImages[selectedIndex]);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}-${selectedIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('فشل تحميل الصورة:', e);
    }
  };

  // ملء الشاشة
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // معالج keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'Escape':
          e.preventDefault();
          closeLightbox();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  // تنظيف overflow
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // معالجة اللمس (السحب على الموبايل)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <>
      {/* ════════════════════════════════════════════ */}
      {/* رأس المعرض */}
      {/* ════════════════════════════════════════════ */}
      <div className="gallery-container">
        <div className="gallery-header">
          <h3 className="gallery-title">
            <ImageIcon size={22} />
            معرض الصور
            <span className="gallery-count">{fullImages.length}</span>
          </h3>

          {fullImages.length > 6 && (
            <div className="view-toggles">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="عرض شبكي"
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
                title="عرض متراص"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* شبكة الصور */}
        {/* ════════════════════════════════════════════ */}
        <div className={`gallery-grid ${viewMode === 'masonry' ? 'masonry' : ''}`}>
          {fullImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="gallery-item"
              style={{
                aspectRatio: viewMode === 'masonry' && idx === 0 ? '16/9' : '1/1',
                gridColumn: viewMode === 'masonry' && idx === 0 ? 'span 2' : 'span 1',
              }}
            >
              {!loadedImages.has(idx) && (
                <div className="image-skeleton">
                  <div className="skeleton-spinner" />
                </div>
              )}
              <img
                src={img}
                alt={`${imageAlt || title} - صورة ${idx + 1}`}
                loading="lazy"
                onLoad={() => handleImageLoad(idx)}
                className="gallery-image"
                style={{ opacity: loadedImages.has(idx) ? 1 : 0 }}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/400x400/1a365d/ed8936?text=${idx + 1}`;
                  e.currentTarget.onerror = null;
                }}
              />
              <div className="gallery-item-overlay">
                <ZoomIn size={28} color="white" />
              </div>
              <span className="gallery-item-number">{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* Lightbox Modal */}
      {/* ════════════════════════════════════════════ */}
      {isOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* شريط الأدوات العلوي */}
          <div className="lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
            <div className="toolbar-info">
              <span className="toolbar-counter">
                {selectedIndex + 1} / {fullImages.length}
              </span>
              <span className="toolbar-title">{title}</span>
            </div>

            <div className="toolbar-actions">
              <button onClick={zoomOut} className="toolbar-btn" title="تصغير (-)">
                <ZoomOut size={20} />
              </button>
              <span className="toolbar-zoom">{Math.round(zoom * 100)}%</span>
              <button onClick={zoomIn} className="toolbar-btn" title="تكبير (+)">
                <ZoomIn size={20} />
              </button>
              <button onClick={downloadImage} className="toolbar-btn" title="تحميل">
                <Download size={20} />
              </button>
              <button onClick={toggleFullscreen} className="toolbar-btn" title="ملء الشاشة (F)">
                <Maximize2 size={20} />
              </button>
              <button onClick={closeLightbox} className="toolbar-btn close-btn" title="إغلاق (Esc)">
                <X size={22} />
              </button>
            </div>
          </div>

          {/* زر السابق */}
          {fullImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="nav-btn nav-prev"
              title="السابق (→)"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* زر التالي */}
          {fullImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="nav-btn nav-next"
              title="التالي (←)"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* الصورة */}
          <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
            <img
              src={fullImages[selectedIndex]}
              alt={`${imageAlt || title} - ${selectedIndex + 1}`}
              className="lightbox-image"
              style={{ transform: `scale(${zoom})` }}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/800x600/1a365d/ed8936?text=صورة+غير+متوفرة';
                e.currentTarget.onerror = null;
              }}
            />
          </div>

          {/* الشريط السفلي - معاينة الصور */}
          {fullImages.length > 1 && (
            <div className="lightbox-thumbnails" onClick={(e) => e.stopPropagation()}>
              {fullImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedIndex(idx); setZoom(1); }}
                  className={`thumb-btn ${idx === selectedIndex ? 'active' : ''}`}
                >
                  <img src={img} alt={`thumb ${idx + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* تلميح المفاتيح */}
          <div className="keyboard-hint">
            ⌨️ ← → للتنقل | + - للتكبير | Esc للإغلاق
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* الأنماط */}
      {/* ════════════════════════════════════════════ */}
      <style jsx>{`
        .gallery-container {
          margin-bottom: 2rem;
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .gallery-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .gallery-count {
          background: linear-gradient(135deg, var(--color-primary, #1a365d), var(--color-primary-light, #2b6cb0));
          color: white;
          padding: 0.2rem 0.7rem;
          border-radius: 1rem;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .view-toggles {
          display: flex;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.3rem;
          border-radius: 0.6rem;
        }

        .view-btn {
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: none;
          border-radius: 0.4rem;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn:hover {
          color: var(--color-primary, #1a365d);
        }

        .view-btn.active {
          background: white;
          color: var(--color-primary, #1a365d);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        /* الشبكة */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        .gallery-grid.masonry {
          grid-template-columns: repeat(4, 1fr);
        }

        .gallery-item {
          cursor: pointer;
          border-radius: 0.85rem;
          overflow: hidden;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .gallery-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease, opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.1);
        }

        .image-skeleton {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
        }

        .skeleton-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .gallery-item-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-item-overlay {
          opacity: 1;
        }

        .gallery-item-number {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          color: white;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* ════════════════════════════════════════════ */
        /* Lightbox */
        /* ════════════════════════════════════════════ */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.97);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* شريط الأدوات */
        .lightbox-toolbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 1rem 1.5rem;
          background: linear-gradient(180deg, rgba(0,0,0,0.8), transparent);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10001;
          backdrop-filter: blur(8px);
        }

        .toolbar-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: white;
        }

        .toolbar-counter {
          background: rgba(255,255,255,0.15);
          padding: 0.4rem 0.85rem;
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }

        .toolbar-title {
          font-size: 0.95rem;
          font-weight: 600;
          opacity: 0.9;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .toolbar-zoom {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 50px;
          text-align: center;
          background: rgba(255,255,255,0.1);
          padding: 0.3rem 0.6rem;
          border-radius: 0.4rem;
        }

        .toolbar-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }

        .toolbar-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.1);
        }

        .close-btn:hover {
          background: #ef4444;
        }

        /* أزرار التنقل */
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: none;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          z-index: 10001;
          backdrop-filter: blur(8px);
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-50%) scale(1.15);
        }

        .nav-prev {
          left: 1.5rem;
        }

        .nav-next {
          right: 1.5rem;
        }

        /* الصورة */
        .lightbox-image-wrapper {
          max-width: 90vw;
          max-height: 80vh;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 0.5rem;
          transition: transform 0.3s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        /* شريط الصور المصغرة */
        .lightbox-thumbnails {
          position: absolute;
          bottom: 4rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(0,0,0,0.6);
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          max-width: 90vw;
          overflow-x: auto;
          z-index: 10001;
        }

        .lightbox-thumbnails::-webkit-scrollbar {
          height: 4px;
        }

        .lightbox-thumbnails::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
        }

        .thumb-btn {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          border: 2px solid transparent;
          border-radius: 0.5rem;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.2s;
          padding: 0;
          background: none;
        }

        .thumb-btn:hover {
          opacity: 0.9;
        }

        .thumb-btn.active {
          opacity: 1;
          border-color: var(--color-secondary, #ed8936);
          transform: scale(1.1);
        }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* تلميح المفاتيح */
        .keyboard-hint {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.6);
          font-size: 0.75rem;
          background: rgba(0,0,0,0.4);
          padding: 0.4rem 1rem;
          border-radius: 2rem;
          z-index: 10001;
          backdrop-filter: blur(8px);
        }

        /* الموبايل */
        @media (max-width: 768px) {
          .gallery-grid,
          .gallery-grid.masonry {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .gallery-grid.masonry .gallery-item:first-child {
            grid-column: span 2;
          }

          .toolbar-title {
            display: none;
          }

          .toolbar-actions {
            gap: 0.25rem;
          }

          .toolbar-btn {
            width: 36px;
            height: 36px;
          }

          .toolbar-zoom {
            display: none;
          }

          .nav-btn {
            width: 44px;
            height: 44px;
          }

          .nav-prev {
            left: 0.5rem;
          }

          .nav-next {
            right: 0.5rem;
          }

          .lightbox-thumbnails {
            bottom: 3rem;
          }

          .thumb-btn {
            width: 50px;
            height: 50px;
          }

          .keyboard-hint {
            display: none;
          }
        }
      `}</style>
    </>
  );
}