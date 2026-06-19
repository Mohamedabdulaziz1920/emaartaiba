// src/app/gallery/[slug]/GalleryDetailClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // ✅ إضافة
import { X, ArrowRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  image: string;
}

interface GalleryData {
  id: number;
  title_ar: string;
  slug: string;
  description_ar: string | null;
  category: string | null;
  image: string | null;
  gallery_images: string[] | null;
  images: GalleryImage[];
  total_images: number;
  is_featured: boolean;
  is_active: boolean;
}

interface Props {
  gallery: GalleryData;
}

export default function GalleryDetailClient({ gallery }: Props) {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const openLightbox = (imageUrl: string, title: string) => {
    setSelectedImage({ url: imageUrl, title });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // ✅ توليد Alt Text محسن
  const getImageAlt = (image: GalleryImage, index: number): string => {
    return `${gallery.title_ar} - ${image.title || `صورة ${index + 1}`}`;
  };

  if (!gallery.images || gallery.images.length === 0) {
    return (
      <section style={{ padding: '3rem 1rem', background: '#f8faff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
          <p>لا توجد صور في هذا المعرض حالياً</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a365d, #2b6cb0)',
        color: 'white',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <Link href="/gallery" style={{ 
            color: 'rgba(255,255,255,0.8)', 
            textDecoration: 'none', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1rem' 
          }}>
            <ArrowRight size={16} /> العودة للمعرض
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: '800', marginBottom: '1rem' }}>
            {gallery.title_ar}
          </h1>
          {gallery.description_ar && (
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}>
              {gallery.description_ar}
            </p>
          )}
          <p style={{ marginTop: '1rem', color: '#fbd38d' }}>
            📸 {gallery.total_images || gallery.images?.length || 0} صورة
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={{ padding: '3rem 1rem', background: '#f8faff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="gallery-grid">
            {gallery.images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(image.image, image.title)}
                className="gallery-item"
                style={{
                  cursor: 'pointer',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  animation: `fadeInUp 0.5s forwards ${index * 0.03}s`,
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img 
                    src={image.image} 
                    alt={getImageAlt(image, index)} // ✅ Alt محسن
                    className="gallery-image"
                    loading="lazy" // ✅ Lazy loading
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      transition: 'transform 0.5s' 
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/f59e0b/white?text=صورة';
                    }}
                  />
                  <div className="image-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                    <div style={{ textAlign: 'center', color: 'white', padding: '1rem' }}>
                      <h3 style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {image.title}
                      </h3>
                      <span style={{ display: 'inline-block', fontSize: '0.75rem', background: '#f59e0b', padding: '0.25rem 0.75rem', borderRadius: '50px', color: 'white' }}>
                        🔍 عرض الصورة
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: '1rem'
        }} onClick={closeLightbox}>
          <button style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s',
            zIndex: 10000
          }} 
          onClick={closeLightbox}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
            <X size={28} color="white" />
          </button>
          <div style={{ maxWidth: '95vw', maxHeight: '90vh', position: 'relative' }}>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '85vh', 
                width: 'auto',
                height: 'auto',
                objectFit: 'contain', 
                borderRadius: '0.5rem' 
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImage.title && (
              <div style={{ 
                position: 'absolute', 
                bottom: '-2.5rem', 
                left: 0, 
                right: 0, 
                textAlign: 'center', 
                color: 'white',
                fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                padding: '0.5rem',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '0.5rem'
              }}>
                {selectedImage.title}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        
        @media (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
          }
        }
        
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem;
          }
          
          .image-overlay {
            opacity: 1 !important;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent) !important;
            top: auto !important;
            height: auto !important;
            bottom: 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem;
          }
        }
        
        .gallery-item:hover .gallery-image {
          transform: scale(1.05);
        }

        /* ✅ تحسين اللمس للجوال */
        @media (max-width: 768px) {
          .gallery-item {
            cursor: default !important;
          }
          .gallery-item:active {
            transform: scale(0.98) !important;
          }
        }

        /* ✅ منع overflow */
        .gallery-item {
          opacity: 0;
        }
      `}</style>
    </>
  );
}