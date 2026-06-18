// frontend/src/app/services/[slug]/ServiceDetailClient.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { toStr } from '@/lib/typeSafe';

interface Props {
  service: any;
  relatedServices: any[];
  settings: any;
  breadcrumbs: Array<{ name: string; url: string }>;
}

export default function ServiceDetailClient({ 
  service, 
  relatedServices,
  settings,
  breadcrumbs,
}: Props) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  const mainImage = service.image_url;
  const backgroundImage = service.background_image_url;
  const gallery = service.gallery || [];
  const videoUrl = service.embed_video_url;
  const phone = toStr(settings?.phone) || '+966500000000';
  const whatsapp = toStr(settings?.whatsapp) || phone;
  const whatsappNumber = whatsapp.replace(/[^\d]/g, '');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <>
      {/* ═══════════════════════════════════════
          🎬 Hero Section
          ═══════════════════════════════════════ */}
      <section 
        className="srv-hero"
        style={{
          background: backgroundImage 
            ? `linear-gradient(135deg, #0f1729cc, #1a365dcc), url(${backgroundImage})`
            : 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        }}
      >
        <div className="container-custom srv-hero-content">
          <Breadcrumb items={breadcrumbs} variant="dark" />

          {service.category && (
            <span className="srv-category-badge">
              {service.category.name_ar}
            </span>
          )}

          <h1 className="srv-title">{service.title_ar || service.title}</h1>
          
          {service.excerpt_ar || service.excerpt ? (
            <p className="srv-excerpt">{service.excerpt_ar || service.excerpt}</p>
          ) : null}
        </div>
        
        {/* Wave Decoration */}
        <div className="srv-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          📄 Main Content
          ═══════════════════════════════════════ */}
      <section className="section-padding" style={{ background: '#f8faff' }}>
        <div className="container-custom">
          <div className="srv-grid">
            {/* ━━━ Left Column - Main Content ━━━ */}
            <div className="srv-main">
              {/* Main Image */}
              {mainImage && (
                <div className="srv-main-image">
                  <img 
                    src={mainImage} 
                    alt={service.title_ar || service.title}
                    loading="eager"
                  />
                </div>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="srv-section-block">
                  <h3 className="srv-section-title">🖼️ معرض الصور</h3>
                  <div className="srv-gallery-grid">
                    {gallery.map((img: string, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className="srv-gallery-item"
                      >
                        <img 
                          src={img} 
                          alt={`${service.title_ar || service.title} - صورة ${idx + 1}`}
                          loading="lazy"
                        />
                        <span className="srv-gallery-overlay">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.3-4.3"/>
                            <line x1="11" y1="8" x2="11" y2="14"/>
                            <line x1="8" y1="11" x2="14" y2="11"/>
                          </svg>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {videoUrl && (
                <div className="srv-section-block">
                  <h3 className="srv-section-title">🎥 فيديو الخدمة</h3>
                  <div className="srv-video-wrapper">
                    <iframe
                      src={videoUrl}
                      title={service.title_ar || service.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="srv-content-card">
                {service.content_ar || service.content ? (
                  <div 
                    className="srv-prose"
                    dangerouslySetInnerHTML={{ __html: service.content_ar || service.content }}
                  />
                ) : (
                  <p className="srv-no-content">{service.excerpt_ar || service.excerpt}</p>
                )}

                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                  <div className="srv-tags-section">
                    <h4 className="srv-tags-title">🏷️ الوسوم</h4>
                    <div className="srv-tags-list">
                      {service.tags.map((tag: any) => (
                        <Link 
                          key={tag.id}
                          href={`/services?tag=${tag.slug}`}
                          className="srv-tag"
                        >
                          {tag.name_ar}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <div className="srv-related">
                  <h3 className="srv-section-title">🔗 خدمات ذات صلة</h3>
                  <div className="srv-related-grid">
                    {relatedServices.slice(0, 3).map((rel: any) => (
                      <Link 
                        key={rel.id} 
                        href={`/services/${rel.slug}`}
                        className="srv-related-card"
                      >
                        {rel.image_url && (
                          <div className="srv-related-image">
                            <img src={rel.image_url} alt={rel.title_ar || rel.title} loading="lazy" />
                          </div>
                        )}
                        <div className="srv-related-body">
                          <h4>{rel.title_ar || rel.title}</h4>
                          {(rel.excerpt_ar || rel.excerpt) && (
                            <p>{(rel.excerpt_ar || rel.excerpt).substring(0, 80)}...</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ━━━ Right Column - Sidebar ━━━ */}
            <aside className="srv-sidebar">
              {/* Contact Card */}
              <div className="srv-contact-card">
                <div className="srv-contact-badge">⚡ استشارة مجانية</div>
                <h3>احصل على عرض سعر</h3>
                <p>تواصل معنا الآن للحصول على عرض سعر مجاني ومفصل</p>
                
                <Link href="/contact" className="srv-btn srv-btn-primary">
                  📞 اتصل بنا الآن
                </Link>
                
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن ' + (service.title_ar || service.title))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="srv-btn srv-btn-whatsapp"
                >
                  💬 واتساب
                </a>
                
                <a
                  href={`tel:${phone}`}
                  className="srv-contact-phone"
                >
                  📱 {phone}
                </a>
              </div>

              {/* Features Card */}
              <div className="srv-features-card">
                <h3>✨ مميزات الخدمة</h3>
                <ul>
                  <li>🏆 جودة عالية مضمونة</li>
                  <li>⏰ التزام بالمواعيد</li>
                  <li>👷 فريق متخصص</li>
                  <li>🛡️ ضمان شامل</li>
                  <li>📞 دعم على مدار الساعة</li>
                  <li>⭐ تقييمات ممتازة</li>
                </ul>
              </div>

              {/* Share Card */}
              <div className="srv-share-card">
                <h4>📢 شارك الخدمة</h4>
                <div className="srv-share-buttons">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="srv-share-btn srv-share-facebook"
                    aria-label="مشاركة على فيسبوك"
                  >
                    f
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(service.title_ar || service.title)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="srv-share-btn srv-share-twitter"
                    aria-label="مشاركة على تويتر"
                  >
                    𝕏
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent((service.title_ar || service.title) + ' - ' + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="srv-share-btn srv-share-whatsapp"
                    aria-label="مشاركة على واتساب"
                  >
                    💬
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="srv-share-btn srv-share-linkedin"
                    aria-label="مشاركة على لينكدإن"
                  >
                    in
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          🖼️ Lightbox للصور
          ═══════════════════════════════════════ */}
      {activeImage && (
        <div className="srv-lightbox" onClick={() => setActiveImage(null)}>
          <button className="srv-lightbox-close" aria-label="إغلاق">✕</button>
          <img src={activeImage} alt="عرض كبير" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <style jsx>{`
        /* ═══════════════════════════════════════
           🎨 Hero Section
           ═══════════════════════════════════════ */
        .srv-hero {
          background-size: cover;
          background-position: center;
          color: white;
          padding: 5rem 0 6rem;
          position: relative;
          overflow: hidden;
        }
        .srv-hero-content {
          position: relative;
          z-index: 1;
        }
        .srv-category-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: rgba(237, 137, 54, 0.2);
          color: #fbd38d;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(237, 137, 54, 0.3);
        }
        .srv-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          margin: 0 0 1rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        .srv-excerpt {
          color: #cbd5e0;
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          max-width: 48rem;
          line-height: 1.85;
          margin: 0;
        }
        .srv-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          line-height: 0;
        }
        .srv-wave svg {
          display: block;
          width: 100%;
          height: 60px;
        }

        /* ═══════════════════════════════════════
           📦 Grid
           ═══════════════════════════════════════ */
        .srv-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        @media (min-width: 1024px) {
          .srv-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        /* ═══════════════════════════════════════
           🖼️ Main Image
           ═══════════════════════════════════════ */
        .srv-main-image {
          height: clamp(280px, 45vw, 450px);
          border-radius: 1.5rem;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .srv-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ═══════════════════════════════════════
           🎬 Section Blocks
           ═══════════════════════════════════════ */
        .srv-section-block {
          margin-bottom: 2rem;
        }
        .srv-section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* ═══════════════════════════════════════
           🖼️ Gallery
           ═══════════════════════════════════════ */
        .srv-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }
        .srv-gallery-item {
          position: relative;
          aspect-ratio: 1/1;
          border-radius: 0.75rem;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s;
          border: none;
          padding: 0;
          background: none;
        }
        .srv-gallery-item:hover {
          transform: scale(1.03);
        }
        .srv-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .srv-gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          color: #fff;
          display: grid;
          place-items: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .srv-gallery-item:hover .srv-gallery-overlay {
          opacity: 1;
        }
        .srv-gallery-overlay svg {
          width: 1.75rem;
          height: 1.75rem;
        }

        /* ═══════════════════════════════════════
           🎥 Video
           ═══════════════════════════════════════ */
        .srv-video-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }
        .srv-video-wrapper iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        /* ═══════════════════════════════════════
           📝 Content Card
           ═══════════════════════════════════════ */
        .srv-content-card {
          background: white;
          border-radius: 1.5rem;
          padding: clamp(1.5rem, 4vw, 2.5rem);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .srv-no-content {
          color: #475569;
          line-height: 1.9;
          margin: 0;
        }

        /* ═══════════════════════════════════════
           🏷️ Tags
           ═══════════════════════════════════════ */
        .srv-tags-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }
        .srv-tags-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.75rem;
        }
        .srv-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .srv-tag {
          display: inline-block;
          padding: 0.4rem 0.9rem;
          background: #f1f5f9;
          color: #1a365d;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }
        .srv-tag:hover {
          background: #ed8936;
          color: #fff;
          transform: translateY(-2px);
        }

        /* ═══════════════════════════════════════
           🔗 Related Services
           ═══════════════════════════════════════ */
        .srv-related {
          margin-top: 2.5rem;
        }
        .srv-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }
        .srv-related-card {
          background: #fff;
          border-radius: 1.25rem;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
        }
        .srv-related-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(237, 137, 54, 0.15);
        }
        .srv-related-image {
          aspect-ratio: 16/10;
          overflow: hidden;
        }
        .srv-related-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .srv-related-card:hover .srv-related-image img {
          transform: scale(1.05);
        }
        .srv-related-body {
          padding: 1rem;
        }
        .srv-related-body h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem;
        }
        .srv-related-body p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        /* ═══════════════════════════════════════
           📋 Sidebar
           ═══════════════════════════════════════ */
        .srv-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Contact Card */
        .srv-contact-card {
          background: linear-gradient(135deg, #0f1729, #1a365d, #2b6cb0);
          color: #fff;
          border-radius: 1.5rem;
          padding: 2rem;
          position: sticky;
          top: 6rem;
          box-shadow: 0 15px 40px rgba(15, 23, 41, 0.25);
        }
        .srv-contact-badge {
          display: inline-block;
          padding: 0.4rem 0.9rem;
          background: rgba(237, 137, 54, 0.25);
          color: #fbd38d;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .srv-contact-card h3 {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
        }
        .srv-contact-card p {
          color: #cbd5e0;
          font-size: 0.9rem;
          margin: 0 0 1.5rem;
          line-height: 1.7;
        }
        .srv-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.85rem 1.5rem;
          border-radius: 0.85rem;
          text-decoration: none;
          font-weight: 800;
          margin-bottom: 0.75rem;
          transition: all 0.3s;
        }
        .srv-btn-primary {
          background: #ed8936;
          color: #fff;
        }
        .srv-btn-primary:hover {
          background: #dd6b20;
          transform: translateY(-2px);
        }
        .srv-btn-whatsapp {
          background: #25D366;
          color: #fff;
        }
        .srv-btn-whatsapp:hover {
          background: #1aa550;
          transform: translateY(-2px);
        }
        .srv-contact-phone {
          display: block;
          text-align: center;
          padding: 0.75rem;
          margin-top: 1rem;
          color: #fbd38d;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.05rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          direction: ltr;
        }

        /* Features Card */
        .srv-features-card {
          background: #fff;
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .srv-features-card h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #ed8936;
          display: inline-block;
        }
        .srv-features-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .srv-features-card li {
          padding: 0.75rem 0;
          color: #475569;
          font-size: 0.92rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .srv-features-card li:last-child {
          border-bottom: none;
        }

        /* Share Card */
        .srv-share-card {
          background: #fff;
          border-radius: 1.5rem;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .srv-share-card h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1rem;
        }
        .srv-share-buttons {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
        }
        .srv-share-btn {
          width: 2.6rem;
          height: 2.6rem;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #fff;
          text-decoration: none;
          font-weight: 900;
          transition: all 0.3s;
          font-size: 1rem;
        }
        .srv-share-facebook { background: #1877f2; }
        .srv-share-twitter { background: #000; }
        .srv-share-whatsapp { background: #25D366; }
        .srv-share-linkedin { background: #0a66c2; }
        .srv-share-btn:hover {
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        /* ═══════════════════════════════════════
           📝 Prose (محتوى HTML)
           ═══════════════════════════════════════ */
        .srv-prose :global(h2) {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 1.5rem 0 1rem;
        }
        .srv-prose :global(h3) {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a365d;
          margin: 1.25rem 0 0.75rem;
        }
        .srv-prose :global(p) {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 1rem;
        }
        .srv-prose :global(ul),
        .srv-prose :global(ol) {
          padding-right: 1.5rem;
          margin-bottom: 1rem;
        }
        .srv-prose :global(li) {
          color: #475569;
          line-height: 1.8;
          margin-bottom: 0.5rem;
        }
        .srv-prose :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1rem 0;
        }
        .srv-prose :global(blockquote) {
          border-right: 4px solid #ed8936;
          padding: 1rem 1.5rem;
          background: #fffaf0;
          border-radius: 0.5rem;
          margin: 1rem 0;
          font-style: italic;
        }

        /* ═══════════════════════════════════════
           🖼️ Lightbox
           ═══════════════════════════════════════ */
        .srv-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.92);
          display: grid;
          place-items: center;
          padding: 2rem;
          animation: srv-fade-in 0.25s ease;
          cursor: zoom-out;
        }
        @keyframes srv-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .srv-lightbox img {
          max-width: 95%;
          max-height: 90vh;
          border-radius: 1rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
        }
        .srv-lightbox-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }
        .srv-lightbox-close:hover {
          background: #ef4444;
          transform: rotate(90deg);
        }
      `}</style>
    </>
  );
}