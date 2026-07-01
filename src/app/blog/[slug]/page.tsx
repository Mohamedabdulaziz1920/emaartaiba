// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import BlogSchema from '@/components/seo/BlogSchema';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { getSiteSettings } from '@/lib/settings';
import { toStr, toUndefined, extractArray } from '@/lib/typeSafe';

// 🧩 Components
import BlogContent from '@/components/blog/BlogContent';
import ShareButtons from '@/components/blog/ShareButtons';
import BlogSidebar from '@/components/blog/BlogSidebar';
import ProjectGallery from '@/components/projects/ProjectGallery';

// ✅ CSS في ملف منفصل
import styles from './blog-detail.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════
function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date;
  }
}

function timeAgo(date: string): string {
  try {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHrs < 24) return `منذ ${diffHrs} ساعة`;
    if (diffDays < 30) return `منذ ${diffDays} يوم`;
    if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} شهر`;
    return `منذ ${Math.floor(diffDays / 365)} سنة`;
  } catch {
    return '';
  }
}

// ════════════════════════════════════════════════
// 📝 generateMetadata
// ════════════════════════════════════════════════
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [settings, response] = await Promise.all([
    getSiteSettings(),
    api.blog(slug).catch(() => null),
  ]);

  const blog = response;

  if (!blog) {
    return generateSEO({
      settings,
      title: 'المقال غير موجود',
      description: 'عذراً، المقال الذي تبحث عنه غير موجود في مدونتنا',
      noindex: true,
    });
  }

  const tagsKeywords = (blog.tags || [])
    .map((t: any) => toStr(t.name_ar))
    .filter(Boolean);

  const metaKeywords = Array.isArray(blog.meta_keywords)
    ? blog.meta_keywords
    : toStr(blog.meta_keywords)
        .split(',')
        .map((k: string) => k.trim())
        .filter(Boolean);

  const allKeywords = [...new Set([...tagsKeywords, ...metaKeywords])];

  return generateSEO({
    settings,
    type: 'article',
    title: toUndefined(toStr(blog.meta_title_ar) || toStr(blog.title_ar)),
    description: toUndefined(toStr(blog.meta_description_ar) || toStr(blog.excerpt_ar)),
    keywords: allKeywords,
    image: toUndefined(blog.featured_image ? getImageUrl(blog.featured_image) : ''),
    url: `/blog/${blog.slug}`,
    publishedAt: toUndefined(blog.published_at),
    modifiedAt: toUndefined(blog.updated_at),
    author: toUndefined(
      blog.author?.name ||
      toStr(settings?.site_name_ar) ||
      toStr(settings?.site_name)
    ),
    section: toUndefined(blog.category?.name_ar),
    tags: tagsKeywords,
  });
}

// ════════════════════════════════════════════════
// ⚡ Config
// ════════════════════════════════════════════════
export const revalidate = 300;

// ════════════════════════════════════════════════
// 🎯 Page Component
// ════════════════════════════════════════════════
export default async function BlogPage({ params }: Props) {
  const { slug } = await params;

  const [response, allBlogs, services, projects, settings] = await Promise.all([
    api.blog(slug).catch(() => null),
    api.latestBlogs(6).catch(() => []),
    api.services().catch(() => []),
    api.featuredProjects().catch(() => []),
    getSiteSettings(),
  ]);

  const blog = response;

  if (!blog) notFound();

  // ─── Related Blogs ────────────────────────────
  let relatedBlogs = extractArray<any>(allBlogs)
    .filter((b: any) => b.id !== blog.id)
    .slice(0, 4);

  if (relatedBlogs.length < 2 && blog.category?.slug) {
    try {
      const categoryResponse = await api.blogs(1, 3, {
        category: blog.category.slug,
        search: '',
        tag: '', // ✅ إضافة tag مطلوب
      });
      const extra = extractArray<any>(categoryResponse)
        .filter((b: any) => b.id !== blog.id);
      relatedBlogs = [...relatedBlogs, ...extra].slice(0, 4);
    } catch (error) {
      console.error('Error fetching category posts:', error);
    }
  }

  // ─── معالجة البيانات ──────────────────────────
  const img = blog.featured_image ? getImageUrl(blog.featured_image) : '';
  const gallery = Array.isArray(blog.gallery)
    ? blog.gallery.map((g: string) => getImageUrl(g))
    : [];
  const tags = blog.tags || [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${siteUrl}/blog/${blog.slug}`;

  const siteName =
    toStr(settings?.site_name_ar) ||
    toStr(settings?.site_name) ||
    '';

  const wasUpdated =
    blog.updated_at &&
    blog.published_at &&
    new Date(blog.updated_at).getTime() -
    new Date(blog.published_at).getTime() > 60000;

  // ─── Breadcrumbs ──────────────────────────────
  const breadcrumbs = buildBreadcrumb(
    { name: 'المدونة', url: '/blog' },
    ...(blog.category
      ? [{ name: blog.category.name_ar, url: `/blog?category=${blog.category.slug}` }]
      : []),
    { name: blog.title_ar, url: `/blog/${blog.slug}` }
  );

  const projectsList = extractArray<any>(projects);

  // ─── BlogSchema data ──────────────────────────
  const blogForSchema = {
    ...blog,
    featured_image: blog.featured_image ?? undefined,
    gallery: blog.gallery ?? undefined,
  };

  // ════════════════════════════════════════════════
  // 🎨 Render
  // ════════════════════════════════════════════════
  return (
    <>
      {/* ═══ SEO Schemas ═══ */}
      <JsonLd
        settings={settings}
        pageType="blog-detail"
        pageTitle={blog.title_ar}
        pageDescription={blog.excerpt_ar || undefined}
        pageUrl={`/blog/${slug}`}
        pageImage={img || undefined}
        breadcrumbs={breadcrumbs}
      />
      <BlogSchema blog={blogForSchema} settings={settings} />

      {/* ═══ Page Content ═══ */}
      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container-custom">
            <Breadcrumb items={breadcrumbs} variant="dark" />

            <div className={styles.heroContent}>
              {blog.category?.name_ar && (
                <Link
                  href={`/blog?category=${blog.category.slug}`}
                  className={styles.categoryTag}
                >
                  {blog.category.name_ar}
                </Link>
              )}

              <h1 className={styles.title}>{blog.title_ar}</h1>

              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  📅 نُشر: {formatDate(blog.published_at)}
                </span>

                {wasUpdated && (
                  <span className={`${styles.metaItem} ${styles.updated}`}>
                    🔄 آخر تحديث: {timeAgo(blog.updated_at)}
                  </span>
                )}

                {blog.reading_time && (
                  <span className={styles.metaItem}>
                    ⏱️ {blog.reading_time} دقائق قراءة
                  </span>
                )}

                {(blog.views_count ?? 0) > 0 && (
                  <span className={styles.metaItem}>
                    <span suppressHydrationWarning>👁️ {blog.views_count.toLocaleString('ar-SA')} مشاهدة</span>
                  </span>
                )}

                {blog.author?.name && (
                  <span className={styles.metaItem}>
                    ✍️ {blog.author.name}
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

        {/* Content */}
        <section className={styles.contentSection}>
          <div className="container-custom">
            <div className={styles.layout}>
              {/* Article */}
              <article
                className={styles.main}
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                {/* Featured Image */}
                {img && (
                  <div className={styles.featuredImage}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={img}
                        alt={`${blog.title_ar}${siteName ? ` | ${siteName}` : ''}`}
                        fill
                        className={styles.image}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                        quality={90}
                      />
                    </div>
                  </div>
                )}

                {/* Share Top */}
                <div className={styles.shareTop}>
                  <span className={styles.shareLabel}>📤 شارك المقال:</span>
                  <ShareButtons url={shareUrl} title={blog.title_ar} />
                </div>

                {/* Article Body */}
                <div className={styles.articleContainer}>
                  {blog.excerpt_ar && (
                    <div className={styles.excerpt} itemProp="description">
                      <p>💡 {blog.excerpt_ar}</p>
                    </div>
                  )}

                  {blog.content_ar ? (
                    <div itemProp="articleBody">
                      <BlogContent content={blog.content_ar} />
                    </div>
                  ) : (
                    <div className={styles.noContent}>
                      <p>📭 لا يوجد محتوى متاح لهذا المقال حالياً.</p>
                    </div>
                  )}

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className={styles.tagsSection}>
                      <h3 className={styles.tagsTitle}>🏷️ الكلمات المفتاحية</h3>
                      <div className={styles.tagsList} itemProp="keywords">
                        {tags.map((tag: any, i: number) => (
                          <Link
                            key={i}
                            href={`/tags/${tag.slug}`}
                            className={styles.tagLink}
                          >
                            #{tag.name_ar}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Author */}
                  {blog.author && (
                    <div className={styles.authorBox}>
                      <div className={styles.authorAvatar}>
                        {blog.author.avatar ? (
                          <Image
                            src={getImageUrl(blog.author.avatar)}
                            alt={blog.author.name}
                            width={64}
                            height={64}
                          />
                        ) : (
                          <span>✍️</span>
                        )}
                      </div>
                      <div className={styles.authorInfo}>
                        <h4>{blog.author.name}</h4>
                        {blog.author.bio && <p>{blog.author.bio}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery */}
                {gallery.length > 0 && (
                  <div className={styles.gallerySection}>
                    <ProjectGallery images={gallery} title={blog.title_ar} />
                  </div>
                )}

                {/* Share Bottom */}
                <div className={styles.shareBottom}>
                  <h3 className={styles.shareBottomTitle}>
                    📤 شارك المقال مع أصدقائك
                  </h3>
                  <ShareButtons url={shareUrl} title={blog.title_ar} />
                </div>

                {/* Back */}
                <div className={styles.backLink}>
                  <Link href="/blog" className={styles.backButton}>
                    ← العودة إلى المدونة
                  </Link>
                </div>
              </article>

              {/* Sidebar */}
              <aside className={styles.sidebar}>
                <BlogSidebar
                  relatedBlogs={relatedBlogs}
                  services={extractArray<any>(services)}
                  projects={projectsList}
                  tags={tags}
                />
              </aside>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
