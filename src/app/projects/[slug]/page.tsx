// src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  ArrowLeft, Calendar, MapPin, Ruler, User,
  Clock, Building2, DollarSign, Tag, Eye,
} from 'lucide-react';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import ProjectSchema from '@/components/seo/ProjectSchema';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { getSiteSettings } from '@/lib/settings';
import { toStr, toArray, extractArray } from '@/lib/typeSafe';
import { getProjectStatusInfo, formatArea } from '@/lib/projectHelpers';

// 🧩 Components
import ProjectGallery from '@/components/projects/ProjectGallery';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectDetailClient from './ProjectDetailClient';

// ✅ CSS منفصل
import styles from './project-detail.module.css';

// ════════════════════════════════════════════════
// ⚙️ Config
// ════════════════════════════════════════════════
export const revalidate = 300;

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════
interface BeforeAfterImage {
  before: string | null;
  after: string | null;
  title?: string | null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr || '';
  }
}

function getEmbedUrl(url: string): string {
  if (!url) return '';

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
}

// ════════════════════════════════════════════════
// 📝 generateMetadata
// ════════════════════════════════════════════════
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const [settings, response] = await Promise.all([
    getSiteSettings(),
    api.project(slug).catch(() => null),
  ]);

  const project = response?.data;

  if (!project?.id) {
    return generateSEO({
      settings,
      title: 'المشروع غير موجود',
      description: 'عذراً، المشروع الذي تبحث عنه غير متوفر',
      noindex: true,
    });
  }

  const title = toStr(project.meta_title_ar) || toStr(project.title_ar) || '';
  const description = toStr(project.meta_description_ar) || toStr(project.excerpt_ar) || '';
  const image = getImageUrl(
    project.main_image || project.cover_image || project.thumbnail
  );

  const baseKeywords = [
    project.title_ar,
    project.city,
    project.category?.name_ar,
    project.service?.title_ar,
  ].filter(Boolean) as string[];

  const customKeywords = toArray<string>(project.meta_keywords);
  const allKeywords = [...new Set([...baseKeywords, ...customKeywords])];

  return generateSEO({
    settings,
    type: 'article',
    title: title || undefined,
    description: description || undefined,
    keywords: allKeywords,
    image: image || undefined,
    url: `/projects/${slug}`,
    publishedAt: (project.created_at || project.start_date) || undefined,
    modifiedAt: (project.updated_at || project.completion_date) || undefined,
    author: toStr(project.client_name) ||
            toStr(settings?.site_name_ar) ||
            toStr(settings?.site_name) ||
            undefined,
    section: project.category?.name_ar || undefined,
    tags: baseKeywords,
  });
}

// ════════════════════════════════════════════════
// 🏗️ Page Component
// ════════════════════════════════════════════════
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [response, settings] = await Promise.all([
    api.project(slug).catch(() => null),
    getSiteSettings(),
  ]);

  if (!response?.success || !response?.data) notFound();

  const project = response.data;
  const relatedProjects = extractArray<any>(response.related);
  const statusInfo = getProjectStatusInfo(project.status);

  // ─── الصور ────────────────────────────────────
  const allImages = [
    ...new Set([
      project.main_image,
      project.cover_image,
      project.thumbnail,
      ...(Array.isArray(project.gallery) ? project.gallery : []),
    ].filter(Boolean) as string[])
  ].map(img => getImageUrl(img));

  const mainImageUrl = getImageUrl(project.main_image);
  const coverImageUrl = getImageUrl(project.cover_image || project.main_image);

  // ─── URLs ──────────────────────────────────────
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${siteUrl}/projects/${slug}`;

  // ─── Breadcrumbs ──────────────────────────────
  const breadcrumbs = buildBreadcrumb(
    { name: 'المشاريع', url: '/projects' },
    ...(project.category
      ? [{ name: project.category.name_ar, url: `/projects?category=${project.category.slug}` }]
      : []),
    { name: project.title_ar, url: `/projects/${slug}` }
  );

  // ════════════════════════════════════════════════
  // 🎨 Render
  // ════════════════════════════════════════════════
  return (
    <>
      {/* ═══ SEO Schemas ═══ */}
      <JsonLd
        settings={settings}
        pageType="project-detail"
        pageTitle={project.title_ar}
        pageDescription={project.excerpt_ar || undefined}
        pageUrl={`/projects/${slug}`}
        pageImage={mainImageUrl || undefined}
        breadcrumbs={breadcrumbs}
      />
      <ProjectSchema
        project={project}
        settings={settings}
        relatedProjects={relatedProjects}
      />

      {/* ═══ Page ═══ */}
      <div className={styles.page}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            {coverImageUrl && (
              <Image
                src={coverImageUrl}
                alt={project.image_alt || project.title_ar}
                title={project.image_title || project.title_ar}
                fill
                priority
                className={styles.heroBgImage}
                sizes="100vw"
              />
            )}
            <div className={styles.heroOverlay} />
          </div>

          <div className={`container-custom ${styles.heroWrapper}`}>
            <Breadcrumb items={breadcrumbs} variant="dark" />

            <div className={styles.heroContent}>
              <div className={styles.heroTags}>
                {project.category && (
                  <span className={styles.tagCategory}>
                    <Tag size={14} /> {project.category.name_ar}
                  </span>
                )}
                <span
                  className={styles.tagStatus}
                  style={{ background: statusInfo.color }}
                >
                  {statusInfo.icon} {statusInfo.label}
                </span>
                {project.is_featured && (
                  <span className={styles.tagFeatured}>⭐ مشروع مميز</span>
                )}
              </div>

              <h1 className={styles.heroTitle}>{project.title_ar}</h1>

              {project.excerpt_ar && (
                <p className={styles.heroExcerpt}>{project.excerpt_ar}</p>
              )}

              <div className={styles.quickInfo}>
                {project.city && (
                  <span className={styles.quickItem}>
                    <MapPin size={16} /> {project.city}
                  </span>
                )}
                {project.area_sqm && (
                  <span className={styles.quickItem}>
                    <Ruler size={16} /> {formatArea(project.area_sqm)}
                  </span>
                )}
                {project.duration && (
                  <span className={styles.quickItem}>
                    <Clock size={16} /> {project.duration}
                  </span>
                )}
                {(project.views_count ?? 0) > 0 && (
                  <span className={styles.quickItem}>
                    <Eye size={16} /> <span suppressHydrationWarning>{(project.views_count ?? 0).toLocaleString('ar-SA')} مشاهدة</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.wave}>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff" />
            </svg>
          </div>
        </section>

        {/* Main Content */}
        <section className={styles.mainContent}>
          <div className="container-custom">
            <ProjectDetailClient project={project} />

            <div className={styles.grid}>
              {/* ─── Main Column ─── */}
              <div className={styles.mainColumn}>
                {mainImageUrl && (
                  <div className={styles.mainImageCard}>
                    <Image
                      src={mainImageUrl}
                      alt={project.image_alt || project.title_ar}
                      title={project.image_title || project.title_ar} 
                      width={900}
                      height={600}
                      className={styles.mainImage}
                      priority
                    />
                  </div>
                )}

                {project.video_url && (
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>🎬 فيديو المشروع</h3>
                    <div className={styles.videoWrapper}>
                      <iframe
                        src={getEmbedUrl(project.video_url)}
                        title={project.title_ar}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {project.virtual_tour_url && (
                  <div className={styles.card}>
                    <h3 className={styles.cardTitle}>🌐 جولة افتراضية 360°</h3>
                    <div className={styles.videoWrapper}>
                      <iframe
                        src={project.virtual_tour_url}
                        title={`جولة افتراضية - ${project.title_ar}`}
                        allow="accelerometer; gyroscope; vr"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {project.description_ar && (
                  <div className={styles.card}>
                    <h2 className={styles.cardTitle}>📝 نبذة عن المشروع</h2>
                    <div
                      className={styles.richContent}
                      dangerouslySetInnerHTML={{ __html: project.description_ar }}
                    />
                  </div>
                )}

                {project.content_ar && (
                  <div className={styles.card}>
                    <h2 className={styles.cardTitle}>📋 تفاصيل المشروع</h2>
                    <div
                      className={styles.richContent}
                      dangerouslySetInnerHTML={{ __html: project.content_ar }}
                    />
                  </div>
                )}

                {allImages.length > 0 && (
                  <ProjectGallery
                    images={allImages}
                    title={project.title_ar}
                    imageAlt={project.image_alt}
                  />
                )}

                {/* Before / After */}
                {(project.before_after_images?.length ?? 0) > 0 && (
                  <div className={styles.card}>
                    <h2 className={styles.cardTitle}>🔄 قبل وبعد</h2>
                    <div className={styles.beforeAfterGrid}>
                    {(project.before_after_images ?? []).map(
  (pair: BeforeAfterImage, idx: number) => (
    <div key={idx} className={styles.baCard}>
      {pair.title && <h4>{pair.title}</h4>}
      <div className={styles.baImages}>
        <div className={styles.baImageWrapper}>
          <span className={styles.baLabel}>قبل</span>
          {pair.before && (
            <Image
              src={getImageUrl(pair.before)}
              // ✅ Alt محسّن للسيو
              alt={`${project.title_ar} - قبل التنفيذ ${pair.title ? `- ${pair.title}` : `- صورة ${idx + 1}`}`}
              title={pair.title || `${project.title_ar} - قبل`}
              fill
              className={styles.baImage}
            />
          )}
        </div>
        <div className={styles.baImageWrapper}>
          <span className={`${styles.baLabel} ${styles.baLabelAfter}`}>بعد</span>
          {pair.after && (
            <Image
              src={getImageUrl(pair.after)}
              // ✅ Alt محسّن للسيو
              alt={`${project.title_ar} - بعد التنفيذ ${pair.title ? `- ${pair.title}` : `- صورة ${idx + 1}`}`}
              title={pair.title || `${project.title_ar} - بعد`}
              fill
              className={styles.baImage}
            />
          )}
        </div>
      </div>
    </div>
  )
)}
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Sidebar ─── */}
              <aside className={styles.sidebar}>
                {/* معلومات المشروع */}
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>
                    <Building2 size={20} /> معلومات المشروع
                  </h3>
                  <div className={styles.infoList}>
                    {project.client_name && (
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><User size={18} /></div>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>العميل</span>
                          <strong className={styles.infoValue}>{project.client_name}</strong>
                        </div>
                      </div>
                    )}
                    {(project.city || project.location_ar) && (
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><MapPin size={18} /></div>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>الموقع</span>
                          <strong className={styles.infoValue}>
                            {project.city}
                            {project.location_ar && ` - ${project.location_ar}`}
                          </strong>
                        </div>
                      </div>
                    )}
                    {project.area_sqm && (
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><Ruler size={18} /></div>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>المساحة</span>
                          <strong className={styles.infoValue}>{formatArea(project.area_sqm)}</strong>
                        </div>
                      </div>
                    )}
                    {project.project_value && (
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><DollarSign size={18} /></div>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>قيمة المشروع</span>
                          <strong className={styles.infoValue}>{project.project_value}</strong>
                        </div>
                      </div>
                    )}
                    {project.duration && (
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><Clock size={18} /></div>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>مدة التنفيذ</span>
                          <strong className={styles.infoValue}>{project.duration}</strong>
                        </div>
                      </div>
                    )}
                    {project.start_date && (
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><Calendar size={18} /></div>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>تاريخ البدء</span>
                          <strong className={styles.infoValue}>{formatDate(project.start_date)}</strong>
                        </div>
                      </div>
                    )}
                    {project.completion_date && (
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><Calendar size={18} /></div>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>تاريخ الإنجاز</span>
                          <strong className={styles.infoValue}>{formatDate(project.completion_date)}</strong>
                        </div>
                      </div>
                    )}
                    {project.service && (
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}><Tag size={18} /></div>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>الخدمة</span>
                          <Link
                            href={`/services/${project.service.slug}`}
                            className={styles.infoLink}
                          >
                            {project.service.title_ar}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share */}
                <div className={styles.shareCard}>
                  <h4>📢 شارك المشروع</h4>
                  <div className={styles.shareButtons}>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      className={`${styles.shareBtn} ${styles.shareFacebook}`}
                      aria-label="مشاركة على فيسبوك"
                    >f</a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title_ar)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      className={`${styles.shareBtn} ${styles.shareTwitter}`}
                      aria-label="مشاركة على تويتر"
                    >𝕏</a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${project.title_ar} - ${shareUrl}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className={`${styles.shareBtn} ${styles.shareWhatsapp}`}
                      aria-label="مشاركة على واتساب"
                    >💬</a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      className={`${styles.shareBtn} ${styles.shareLinkedin}`}
                      aria-label="مشاركة على لينكدإن"
                    >in</a>
                  </div>
                </div>
              </aside>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <section className={styles.related}>
                <div className={styles.relatedHeader}>
                  <h2 className={styles.cardTitle}>🔗 مشاريع مشابهة</h2>
                  <Link href="/projects" className={styles.viewAll}>
                    عرض الكل <ArrowLeft size={16} />
                  </Link>
                </div>
                <div className={styles.relatedGrid}>
                  {relatedProjects.slice(0, 4).map((rp: any) => (
                    <ProjectCard key={rp.id} project={rp} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
