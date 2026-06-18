'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Gallery {
  id: number;
  title_ar: string;
  slug: string;
  category_ar: string;
  image_url: string;
  image?: string;
  gallery_images: string[];
  description_ar: string;
  is_featured: boolean;
}

const getFullImageUrl = (path: string | null | undefined): string => {
  if (!path || typeof path !== 'string') return '';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
  return `${baseUrl}/storage/${path.replace(/^\/storage\//, '')}`;
};

export default function GallerySection() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${baseUrl}/galleries`);
        const result = await response.json();
        console.log('📸 Galleries API response:', result);
        
        if (result.success && result.data && result.data.length > 0) {
          const processedData = result.data.map((gallery: Gallery) => ({
            ...gallery,
            image_url: getFullImageUrl(gallery.image_url || gallery.image),
          }));
          setGalleries(processedData);
          console.log('✅ Galleries loaded:', processedData.length);
        } else {
          console.log('⚠️ No galleries found');
        }
      } catch (error) {
        console.error('❌ Error fetching galleries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const categories = [...new Set(galleries.map(g => g.category_ar).filter(Boolean))];

  const filteredGalleries = activeFilter === 'all' 
    ? galleries 
    : galleries.filter(g => g.category_ar === activeFilter);

  const getImageCount = (gallery: Gallery): number => {
    let count = 0;
    if (gallery.image_url) count++;
    if (gallery.gallery_images && Array.isArray(gallery.gallery_images)) {
      count += gallery.gallery_images.length;
    }
    return count;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        background: 'linear-gradient(170deg, #0a0e1a 0%, #0f172a 50%, #0a0e1a 100%)',
        color: '#fff',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
          <div>جاري تحميل المعارض...</div>
        </div>
      </div>
    );
  }

  if (!galleries || galleries.length === 0) {
    return null;
  }

  return (
    <section style={{
      padding: '5rem 0',
      background: 'linear-gradient(170deg, #0a0e1a 0%, #0f172a 50%, #0a0e1a 100%)',
      direction: 'rtl'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        
        {/* ════════════════════════════════════════ */}
        {/* قسم العنوان - مبسط ومضمون الظهور */}
        {/* ════════════════════════════════════════ */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          
          {/* شارة علوية */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '999px',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '1.1rem' }}>📸</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFD700' }}>
              معرض الأعمال
            </span>
          </div>
<br/>
          {/* العنوان الرئيسي - حجم كبير وواضح */}
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '900',
            margin: '0 0 1rem',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}>
            معرض أعمالنا
          </h2>

          {/* النص الوصفي */}
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#B0B0B0',
            maxWidth: '600px',
            margin: '1rem auto 0',
            fontWeight: '500'
          }}>
            استعرض أحدث مشاريعنا وأعمالنا المميزة بتصميم فاخر وجودة عالية
          </p>

          {/* خط زخرفي بسيط */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '1.5rem'
          }}>
            <span style={{
              width: '50px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #FFD700, transparent)'
            }}></span>
            <span style={{ color: '#FFD700', fontSize: '0.7rem' }}>✦</span>
            <span style={{
              width: '50px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #FFD700, transparent)'
            }}></span>
          </div>
        </div>

        {/* ════════════════════════════════════════ */}
        {/* الفلاتر */}
        {/* ════════════════════════════════════════ */}
        {categories.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '0.6rem 1.2rem',
                background: activeFilter === 'all' 
                  ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                  : 'rgba(255,255,255,0.05)',
                border: activeFilter === 'all' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '999px',
                color: activeFilter === 'all' ? '#0f172a' : '#cbd5e1',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              الكل ({galleries.length})
            </button>
            {categories.map(cat => {
              const count = galleries.filter(g => g.category_ar === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    background: activeFilter === cat 
                      ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                      : 'rgba(255,255,255,0.05)',
                    border: activeFilter === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '999px',
                    color: activeFilter === cat ? '#0f172a' : '#cbd5e1',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════════════ */}
        {/* شبكة المعارض */}
        {/* ════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {filteredGalleries.slice(0, 6).map((gallery) => {
            const imageCount = (gallery.gallery_images?.length || 0) + 1;
            
            return (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'linear-gradient(160deg, #1a2235 0%, #0f172a 100%)',
                  border: '2px solid rgba(255, 215, 0, 0.25)',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.25)';
                }}>
                  
                  {/* صورة المعرض */}
                  <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img
                      src={gallery.image_url || '/placeholder.jpg'}
                      alt={gallery.title_ar}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                    
                    {/* عدد الصور */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <span>🖼️</span> {imageCount} صور
                    </div>
                    
                    {/* شارة مميز */}
                    {gallery.is_featured && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        padding: '0.35rem 0.8rem',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        color: '#0f172a'
                      }}>
                        ⭐ مميز
                      </div>
                    )}
                  </div>

                  {/* محتوى البطاقة */}
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    {gallery.category_ar && (
                      <div style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.8rem',
                        background: 'rgba(255, 215, 0, 0.12)',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        color: '#FFD700',
                        marginBottom: '0.75rem'
                      }}>
                        {gallery.category_ar}
                      </div>
                    )}
                    
                    <h3 style={{
                      fontSize: '1.15rem',
                      fontWeight: '900',
                      color: '#fff',
                      margin: '0 0 0.5rem',
                      lineHeight: '1.4'
                    }}>
                      {gallery.title_ar}
                    </h3>
                    
                    {gallery.description_ar && (
                      <p style={{
                        fontSize: '0.85rem',
                        lineHeight: '1.7',
                        color: '#94a3b8',
                        margin: '0 0 1rem'
                      }}>
                        {gallery.description_ar.length > 80
                          ? `${gallery.description_ar.substring(0, 80)}...`
                          : gallery.description_ar}
                      </p>
                    )}
                    
                    {/* زر العرض */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 1.5rem',
                      background: '#fff',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      color: '#1e293b',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                      e.currentTarget.style.color = '#0f172a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.color = '#1e293b';
                    }}>
                      <span>🔍</span> استعراض المعرض
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}