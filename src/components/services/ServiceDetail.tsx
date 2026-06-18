// frontend/src/components/services/ServiceDetail.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ============================================
// 🎯 Types
// ============================================
interface Category {
  id: number;
  name_ar: string;
  slug: string;
}

interface ServiceDetailProps {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  excerpt: string;
  excerpt_ar: string;
  content: string;
  content_ar: string;
  image_url: string | null;
  background_image_url: string | null;
  gallery: string[];
  video_url: string | null;
  embed_video_url: string | null;
  is_featured: boolean;
  category: Category | null;
  tags?: { id: number; name_ar: string; slug: string }[];
}

// ============================================
// 🖥️ Component
// ============================================
export default function ServiceDetail({
  title,
  title_ar,
  content,
  content_ar,
  image_url,
  gallery,
  video_url,
  embed_video_url,
  category,
  tags,
}: ServiceDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const displayTitle = title || title_ar;
  const displayContent = content || content_ar;
  
  // تجميع كل الصور (الرئيسية + المعرض)
  const allImages = [image_url, ...(gallery || [])].filter(Boolean) as string[];
  
  const openLightbox = (img: string) => {
    setSelectedImage(img);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };
  
  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  return (
    <div className="service-detail">
      {/* Main Content */}
      <div className="service-content-wrapper">
        {image_url && (
          <div className="main-image">
            <img src={image_url} alt={displayTitle} />
          </div>
        )}
        
        <div 
          className="service-content"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      </div>
      
      {/* Gallery Section */}
      {allImages.length > 1 && (
        <div className="gallery-section">
          <h3 className="gallery-title">🖼️ معرض الصور</h3>
          <div className="gallery-grid">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                className="gallery-item"
                onClick={() => openLightbox(img)}
              >
                <img src={img} alt={`${displayTitle} - ${idx + 1}`} loading="lazy" />
                <div className="gallery-overlay">
                  <span>🔍</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Video Section */}
      {embed_video_url && (
        <div className="video-section">
          <h3 className="video-title">🎥 فيديو الخدمة</h3>
          <div className="video-wrapper">
            <iframe
              src={embed_video_url}
              title={displayTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
      
      {/* Tags Section */}
      {tags && tags.length > 0 && (
        <div className="tags-section">
          <h4 className="tags-title">🏷️ الوسوم</h4>
          <div className="tags-list">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/services?tag=${tag.slug}`} className="tag-item">
                {tag.name_ar}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
          <img src={selectedImage} alt={displayTitle} onClick={(e) => e.stopPropagation()} />
          <div className="lightbox-counter">
            {allImages.indexOf(selectedImage) + 1} / {allImages.length}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .service-detail {
          max-width: 100%;
        }
        
        .service-content-wrapper {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        
        .main-image {
          margin-bottom: 2rem;
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .main-image img {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .service-content {
          color: #475569;
          line-height: 1.9;
        }
        
        .service-content :global(h2) {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 1.5rem 0 1rem;
        }
        
        .service-content :global(h3) {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a365d;
          margin: 1.25rem 0 0.75rem;
        }
        
        .service-content :global(p) {
          margin-bottom: 1rem;
        }
        
        .service-content :global(ul), .service-content :global(ol) {
          padding-right: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .service-content :global(li) {
          margin-bottom: 0.5rem;
        }
        
        /* Gallery Section */
        .gallery-section {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        
        .gallery-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }
        
        .gallery-item {
          aspect-ratio: 1/1;
          border-radius: 0.75rem;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          border: none;
          padding: 0;
          background: transparent;
        }
        
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .gallery-item:hover img {
          transform: scale(1.05);
        }
        
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          font-size: 1.5rem;
        }
        
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
        
        /* Video Section */
        .video-section {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        
        .video-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        /* Tags Section */
        .tags-section {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        
        .tags-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        
        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .tag-item {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background: #f1f5f9;
          color: #1a365d;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .tag-item:hover {
          background: #ed8936;
          color: white;
        }
        
        /* Lightbox */
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .lightbox img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 0.5rem;
        }
        
        .lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          color: white;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .lightbox-prev, .lightbox-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .lightbox-prev {
          left: 1rem;
        }
        
        .lightbox-next {
          right: 1rem;
        }
        
        .lightbox-prev:hover, .lightbox-next:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .lightbox-counter {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
        }
        
        @media (max-width: 640px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}