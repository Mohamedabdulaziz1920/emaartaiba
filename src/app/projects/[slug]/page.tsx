// frontend/src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  ArrowLeft, Calendar, MapPin, Ruler, User, 
  Clock, Building2, DollarSign, Tag, Eye 
} from 'lucide-react';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import ProjectSchema from '@/components/seo/ProjectSchema';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api, getImageUrl, getProjectStatusInfo, formatArea } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { toStr, toArray } from '@/lib/typeSafe';

// 🧩 Components
import ProjectGallery from '@/components/projects/ProjectGallery';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectDetailClient from './ProjectDetailClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ════════════════════════════════════════════════
// 📝 SEO Metadata - النظام الموحد
// ════════════════════════════════════════════════
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, response] = await Promise.all([
    getSiteSettings(),
    api.project(slug).catch(() => null),
  ]);

  const project = response?.data;

  if (!project || !project.id) {
    return generateSEO({
      settings,
      title: 'المشروع غير موجود',
      description: 'عذراً، المشروع الذي تبحث عنه غير متوفر',
      noindex: true,
    });
  }

  // استخراج البيانات بأمان
  const title = toStr(project.meta_title_ar) || toStr(project.title_ar) || 'مشروع';
  const description = toStr(project.meta_description_ar) || toStr(project.excerpt_ar) || `تعرف على تفاصيل مشروع ${title}`;
  const projectImage = getImageUrl(project.main_image || project.cover_image || project.thumbnail);
  
  const baseKeywords = [
    project.title_ar,
    project.city,
    project.category?.name_ar,
    project.service?.title_ar,
    'مشاريع مقاولات',
    'مشاريع بناء',
  ].filter(Boolean) as string[];
  
  const customKeywords = toArray<string>(project.meta_keywords);
  const allKeywords = [...new Set([...baseKeywords, ...customKeywords])];

  return generateSEO({
    settings,
    type: 'article',
    title: title ?? undefined,
    description: description ?? undefined,
    keywords: allKeywords,
    image: projectImage ?? undefined,
    url: `/projects/${slug}`,
    publishedAt: (project.created_at || project.start_date) ?? undefined,
    modifiedAt: (project.updated_at || project.completion_date) ?? undefined,
    author: (project.client_name || toStr(settings?.site_name_ar) || 'البناء المتميز') ?? undefined,
    section: (project.category?.name_ar || 'مشاريع') ?? undefined,
    tags: baseKeywords,
  });
}

// ════════════════════════════════════════════
// 🛠️ Helper Functions
// ════════════════════════════════════════════
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getEmbedUrl(url: string): string {
  if (!url) return '';

  // YouTube - Long URL
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  }

  // YouTube - Short URL
  const ytShortMatch = url.match(/youtu\.be\/([^"&?\/\s]{11})/);
  if (ytShortMatch) {
    return `https://www.youtube.com/embed/${ytShortMatch[1]}?rel=0&modestbranding=1`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

function formatNumber(num: number): string {
  return num.toString();
}

// ════════════════════════════════════════════
// 🏗️ Component
// ════════════════════════════════════════════
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // جلب البيانات بالتوازي
  const [response, settings] = await Promise.all([
    api.project(slug).catch(() => null),
    getSiteSettings(),
  ]);

  if (!response?.success || !response?.data) {
    notFound();
  }

  const project = response.data;
  const relatedProjects = response.related || [];

  // معلومات الحالة
  const statusInfo = getProjectStatusInfo(project.status);

  // جميع الصور (مع معالجة getImageUrl)
  const allImagesRaw = [
    project.main_image,
    project.cover_image,
    project.thumbnail,
    ...(Array.isArray(project.gallery) ? project.gallery : []),
  ].filter(Boolean) as string[];
  
  // إزالة المكررات وتحويل URLs
  const allImages = [...new Set(allImagesRaw)].map(img => getImageUrl(img));

  // Breadcrumbs
  const breadcrumbs = buildBreadcrumb(
    { name: 'المشاريع', url: '/projects' },
    ...(project.category ? [{ 
      name: project.category.name_ar, 
      url: `/projects?category=${project.category.slug}` 
    }] : []),
    { name: project.title_ar, url: `/projects/${slug}` }
  );

  // الصورة الرئيسية
  const mainImageUrl = getImageUrl(project.main_image);
  const coverImageUrl = getImageUrl(project.cover_image || project.main_image);

  return (
    <>
      {/* ═══════════════════════════════════════════
          🎯 SEO Schemas (Server-Side)
          ═══════════════════════════════════════════ */}
      <JsonLd 
        settings={settings}
        pageType="project-detail"
        pageTitle={project.title_ar}
        pageDescription={project.excerpt_ar || undefined}
        pageUrl={`/projects/${slug}`}
        pageImage={mainImageUrl}
        breadcrumbs={breadcrumbs}
      />
      
      {/* Project Schema المتخصص */}
      <ProjectSchema project={project} settings={settings} relatedProjects={relatedProjects}/>

      <div className="project-detail-page">
        {/* ════════════════════════════════════════════ */}
        {/* Hero Section */}
        {/* ════════════════════════════════════════════ */}
        <section className="project-hero">
          <div className="hero-bg">
            {coverImageUrl ? (
              <img 
                src={coverImageUrl} 
                alt={project.image_alt || project.title_ar}
                className="hero-bg-image"
              />
            ) : null}
            <div className="hero-overlay" />
          </div>

          <div className="container-custom hero-content-wrapper">
            <Breadcrumb items={breadcrumbs} variant="dark" />

            <div className="hero-content">
              {/* تصنيف وحالة */}
              <div className="hero-tags">
                {project.category && (
                  <span className="hero-tag-category">
                    <Tag size={14} /> {project.category.name_ar}
                  </span>
                )}
                <span 
                  className="hero-tag-status" 
                  style={{ background: statusInfo.color }}
                >
                  {statusInfo.icon} {statusInfo.label}
                </span>
                {project.is_featured && (
                  <span className="hero-tag-featured">
                    ⭐ مشروع مميز
                  </span>
                )}
              </div>

              {/* العنوان */}
              <h1 className="hero-title">{project.title_ar}</h1>

              {/* الوصف المختصر */}
              {project.excerpt_ar && (
                <p className="hero-excerpt">{project.excerpt_ar}</p>
              )}

              {/* معلومات سريعة */}
              <div className="hero-quick-info">
                {project.city && (
                  <span className="quick-info-item">
                    <MapPin size={16} /> {project.city}
                  </span>
                )}
                {project.area_sqm && (
                  <span className="quick-info-item">
                    <Ruler size={16} /> {formatArea(project.area_sqm)}
                  </span>
                )}
                {project.duration && (
                  <span className="quick-info-item">
                    <Clock size={16} /> {project.duration}
                  </span>
                )}
                {project.views_count !== undefined && project.views_count > 0 && (
                  <span className="quick-info-item">
                    <Eye size={16} /> {formatNumber(project.views_count)} مشاهدة
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="wave-decoration">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
            </svg>
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* المحتوى الرئيسي */}
        {/* ════════════════════════════════════════════ */}
        <section className="project-main-content">
          <div className="container-custom">
            {/* Client Component للأزرار التفاعلية */}
            <ProjectDetailClient project={project} />

            <div className="content-grid">
              {/* ─── العمود الأيمن: المحتوى ─── */}
              <div className="main-column">
                {/* الصورة الرئيسية */}
                {mainImageUrl && (
                  <div className="main-image-card">
                    <img 
                      src={mainImageUrl} 
                      alt={project.image_alt || project.title_ar}
                      title={project.image_title || project.title_ar}
                      className="main-image"
                    />
                  </div>
                )}

                {/* فيديو المشروع */}
                {project.video_url && (
                  <div className="video-card">
                    <h3 className="section-heading">
                      🎬 فيديو المشروع
                    </h3>
                    <div className="video-wrapper">
                      <iframe
                        src={getEmbedUrl(project.video_url)}
                        title={project.title_ar}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* الجولة الافتراضية */}
                {project.virtual_tour_url && (
                  <div className="virtual-tour-card">
                    <h3 className="section-heading">
                      🌐 جولة افتراضية 360°
                    </h3>
                    <div className="video-wrapper">
                      <iframe
                        src={project.virtual_tour_url}
                        title={`جولة افتراضية - ${project.title_ar}`}
                        allow="accelerometer; gyroscope; vr"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* وصف المشروع */}
                {project.description_ar && (
                  <div className="description-card">
                    <h2 className="section-heading">📝 نبذة عن المشروع</h2>
                    <div 
                      className="rich-content"
                      dangerouslySetInnerHTML={{ __html: project.description_ar }}
                    />
                  </div>
                )}

                {/* المحتوى الكامل */}
                {project.content_ar && (
                  <div className="content-card">
                    <h2 className="section-heading">📋 تفاصيل المشروع</h2>
                    <div 
                      className="rich-content"
                      dangerouslySetInnerHTML={{ __html: project.content_ar }}
                    />
                  </div>
                )}

                {/* المعرض */}
                {allImages.length > 0 && (
                  <ProjectGallery 
                    images={allImages} 
                    title={project.title_ar}
                    imageAlt={project.image_alt}
                  />
                )}

                {/* صور قبل/بعد */}
                {project.before_after_images && project.before_after_images.length > 0 && (
                  <div className="before-after-section">
                    <h2 className="section-heading">🔄 قبل وبعد</h2>
                    <div className="before-after-grid">
                      {project.before_after_images.map((pair: { before: string | null; after: string | null; title?: string | null }, idx: number) => (
                        <div key={idx} className="before-after-card">
                          {pair.title && <h4>{pair.title}</h4>}
                          <div className="before-after-images">
                            <div className="ba-image-wrapper">
                              <span className="ba-label">قبل</span>
                              {pair.before && (
                                <img 
                                  src={getImageUrl(pair.before)} 
                                  alt={`قبل - ${pair.title || idx + 1}`} 
                                />
                              )}
                            </div>
                            <div className="ba-image-wrapper">
                              <span className="ba-label after">بعد</span>
                              {pair.after && (
                                <img 
                                  src={getImageUrl(pair.after)} 
                                  alt={`بعد - ${pair.title || idx + 1}`} 
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ─── العمود الأيسر: الشريط الجانبي ─── */}
              <aside className="sidebar-column">
                {/* بطاقة المعلومات */}
                <div className="info-card">
                  <h3 className="info-card-title">
                    <Building2 size={20} /> معلومات المشروع
                  </h3>
                  <div className="info-list">
                    {project.client_name && (
                      <div className="info-item">
                        <div className="info-icon"><User size={18} /></div>
                        <div className="info-content">
                          <span className="info-label">العميل</span>
                          <strong className="info-value">{project.client_name}</strong>
                        </div>
                      </div>
                    )}

                    {(project.city || project.location_ar) && (
                      <div className="info-item">
                        <div className="info-icon"><MapPin size={18} /></div>
                        <div className="info-content">
                          <span className="info-label">الموقع</span>
                          <strong className="info-value">
                            {project.city}
                            {project.location_ar && ` - ${project.location_ar}`}
                          </strong>
                        </div>
                      </div>
                    )}

                    {project.area_sqm && (
                      <div className="info-item">
                        <div className="info-icon"><Ruler size={18} /></div>
                        <div className="info-content">
                          <span className="info-label">المساحة</span>
                          <strong className="info-value">{formatArea(project.area_sqm)}</strong>
                        </div>
                      </div>
                    )}

                    {project.project_value && (
                      <div className="info-item">
                        <div className="info-icon"><DollarSign size={18} /></div>
                        <div className="info-content">
                          <span className="info-label">قيمة المشروع</span>
                          <strong className="info-value">{project.project_value}</strong>
                        </div>
                      </div>
                    )}

                    {project.duration && (
                      <div className="info-item">
                        <div className="info-icon"><Clock size={18} /></div>
                        <div className="info-content">
                          <span className="info-label">مدة التنفيذ</span>
                          <strong className="info-value">{project.duration}</strong>
                        </div>
                      </div>
                    )}

                    {project.start_date && (
                      <div className="info-item">
                        <div className="info-icon"><Calendar size={18} /></div>
                        <div className="info-content">
                          <span className="info-label">تاريخ البدء</span>
                          <strong className="info-value">{formatDate(project.start_date)}</strong>
                        </div>
                      </div>
                    )}

                    {project.completion_date && (
                      <div className="info-item">
                        <div className="info-icon"><Calendar size={18} /></div>
                        <div className="info-content">
                          <span className="info-label">تاريخ الإنجاز</span>
                          <strong className="info-value">{formatDate(project.completion_date)}</strong>
                        </div>
                      </div>
                    )}

                    {project.service && (
                      <div className="info-item">
                        <div className="info-icon"><Tag size={18} /></div>
                        <div className="info-content">
                          <span className="info-label">الخدمة</span>
                          <Link href={`/services/${project.service.slug}`} className="info-link">
                            {project.service.title_ar}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* بطاقة CTA */}
                <div className="cta-card">
                  <div className="cta-icon">💼</div>
                  <h4>هل تريد مشروعاً مشابهاً؟</h4>
                  <p>تواصل معنا اليوم للحصول على استشارة مجانية وعرض سعر مناسب</p>
                  <Link href="/contact" className="cta-btn">
                    📞 اطلب عرض سعر
                  </Link>
                  <Link href="/quote-request" className="cta-btn cta-btn-secondary">
                    📋 طلب خدمة
                  </Link>
                </div>

                {/* بطاقة المشاركة */}
                <div className="share-card">
                  <h4>📢 شارك المشروع</h4>
                  <div className="share-buttons">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn share-facebook"
                      aria-label="مشاركة على فيسبوك"
                    >
                      f
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title_ar)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn share-twitter"
                      aria-label="مشاركة على تويتر"
                    >
                      𝕏
                    </a>
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(project.title_ar + ' - ' + process.env.NEXT_PUBLIC_SITE_URL + '/projects/' + slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn share-whatsapp"
                      aria-label="مشاركة على واتساب"
                    >
                      💬
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn share-linkedin"
                      aria-label="مشاركة على لينكدإن"
                    >
                      in
                    </a>
                  </div>
                </div>
              </aside>
            </div>

            {/* ════════════════════════════════════════════ */}
            {/* المشاريع المرتبطة */}
            {/* ════════════════════════════════════════════ */}
            {relatedProjects.length > 0 && (
              <section className="related-section">
                <div className="related-header">
                  <h2 className="section-heading">🔗 مشاريع مشابهة قد تعجبك</h2>
                  <Link href="/projects" className="view-all-link">
                    عرض الكل <ArrowLeft size={16} />
                  </Link>
                </div>
                <div className="related-grid">
                  {relatedProjects.slice(0, 4).map((rp: any) => (
                    <ProjectCard key={rp.id} project={rp} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* الأنماط */}
      {/* ════════════════════════════════════════════ */}
      <style>{`
        .project-detail-page {
          min-height: 100vh;
          background: #f8faff;
        }

        /* ════════ HERO ════════ */
        .project-hero {
          position: relative;
          min-height: 60vh;
          display: flex;
          align-items: center;
          padding: 4rem 0;
          color: white;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.4);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15, 23, 41, 0.85), rgba(26, 54, 93, 0.75));
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 1;
        }

        .hero-content {
          margin-top: 2rem;
          max-width: 900px;
        }

        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          margin-bottom: 1.5rem;
        }

        .hero-tag-category,
        .hero-tag-status,
        .hero-tag-featured {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.9rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }

        .hero-tag-category {
          background: rgba(237, 137, 54, 0.2);
          color: #fbd38d;
          border: 1px solid rgba(237, 137, 54, 0.4);
        }

        .hero-tag-status {
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .hero-tag-featured {
          background: linear-gradient(135deg, #f59e0b, #ed8936);
          color: white;
          box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
        }

        .hero-title {
          font-size: clamp(1.75rem, 5vw, 3.5rem);
          font-weight: 900;
          margin: 0 0 1.25rem 0;
          line-height: 1.2;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
        }

        .hero-excerpt {
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 2rem 0;
          max-width: 700px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .hero-quick-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.25rem 1.75rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 1rem;
          max-width: fit-content;
        }

        .quick-info-item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* ════════ MAIN CONTENT ════════ */
        .project-main-content {
          padding: 3rem 0 5rem;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2.5rem;
          margin-top: 2rem;
        }

        .main-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          min-width: 0;
        }

        .main-image-card {
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .main-image {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Cards */
        .description-card,
        .content-card,
        .video-card,
        .virtual-tour-card,
        .before-after-section {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .section-heading {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .rich-content {
          color: #475569;
          line-height: 1.9;
          font-size: 1rem;
        }

        .rich-content :global(h2),
        .rich-content :global(h3) {
          color: #1e293b;
          font-weight: 800;
          margin: 1.5rem 0 1rem;
        }

        .rich-content :global(p) {
          margin-bottom: 1rem;
        }

        .rich-content :global(ul),
        .rich-content :global(ol) {
          margin: 1rem 0;
          padding-right: 1.5rem;
        }

        .rich-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1rem 0;
        }

        /* Video */
        .video-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #000;
        }

        .video-wrapper iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Before/After */
        .before-after-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .before-after-card h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .before-after-images {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .ba-image-wrapper {
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #f1f5f9;
          aspect-ratio: 4/3;
        }

        .ba-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ba-label {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(239, 68, 68, 0.95);
          color: white;
          padding: 0.35rem 0.9rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 1;
        }

        .ba-label.after {
          background: rgba(16, 185, 129, 0.95);
        }

        /* ════════ SIDEBAR ════════ */
        .sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 2rem;
          align-self: start;
        }

        .info-card {
          background: white;
          padding: 1.75rem;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .info-card-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .info-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }

        .info-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .info-value {
          font-size: 0.9rem;
          color: #1e293b;
          font-weight: 700;
          word-wrap: break-word;
        }

        .info-link {
          font-size: 0.9rem;
          color: #ed8936;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s;
        }

        .info-link:hover {
          color: #1a365d;
          text-decoration: underline;
        }

        /* CTA Card */
        .cta-card {
          background: linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%);
          color: white;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -30%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(237, 137, 54, 0.3), transparent);
          border-radius: 50%;
        }

        .cta-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .cta-card h4 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 0.75rem 0;
          position: relative;
          z-index: 1;
        }

        .cta-card p {
          font-size: 0.875rem;
          opacity: 0.9;
          margin: 0 0 1.5rem 0;
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }

        .cta-btn {
          display: block;
          width: 100%;
          padding: 0.85rem 1.25rem;
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
          border-radius: 0.6rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          margin-bottom: 0.65rem;
          position: relative;
          z-index: 1;
          box-shadow: 0 6px 15px rgba(237, 137, 54, 0.3);
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(237, 137, 54, 0.4);
        }

        .cta-btn-secondary {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: none;
        }

        .cta-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* Share Card */
        .share-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          text-align: center;
        }

        .share-card h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .share-buttons {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
        }

        .share-btn {
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

        .share-facebook { background: #1877f2; }
        .share-twitter { background: #000; }
        .share-whatsapp { background: #25D366; }
        .share-linkedin { background: #0a66c2; }

        .share-btn:hover {
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        /* ════════ Related Projects ════════ */
        .related-section {
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 2px solid #e2e8f0;
        }

        .related-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .related-header .section-heading {
          margin: 0;
          padding: 0;
          border: none;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #ed8936;
          font-weight: 700;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .view-all-link:hover {
          color: #1a365d;
          gap: 0.75rem;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* ════════ Responsive ════════ */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .sidebar-column {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .project-hero {
            min-height: 50vh;
            padding: 3rem 0;
          }

          .hero-quick-info {
            padding: 1rem;
            width: 100%;
          }

          .before-after-images {
            grid-template-columns: 1fr;
          }

          .description-card,
          .content-card,
          .video-card,
          .virtual-tour-card,
          .before-after-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}