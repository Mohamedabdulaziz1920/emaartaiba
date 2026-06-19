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
import { toStr, toInt, toUndefined } from '@/lib/typeSafe';

// 🧩 Components
import BlogContent from '@/components/blog/BlogContent';
import ShareButtons from '@/components/blog/ShareButtons';
import BlogSidebar from '@/components/blog/BlogSidebar';
import ProjectGallery from '@/components/projects/ProjectGallery';

interface Props { 
  params: Promise<{ slug: string }> 
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════
function formatNumber(num: number): string {
  return num.toString();
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch { 
    return date; 
  }
}

function timeAgo(date: string) {
  try {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
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
// 📝 DYNAMIC METADATA - النظام الموحد الجديد (تم التحسين)
// ════════════════════════════════════════════════
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [blog, settings] = await Promise.all([
    api.blog(slug).catch(() => null),
    getSiteSettings(),
  ]);

  if (!blog) {
    return generateSEO({
      settings,
      title: 'المقال غير موجود',
      description: 'عذراً، المقال الذي تبحث عنه غير موجود في مدونتنا',
      noindex: true,
    });
  }

  // استخراج الكلمات المفتاحية
  const tagsKeywords = (blog.tags || []).map((t: any) => toStr(t.name_ar)).filter(Boolean);
  const metaKeywords = blog.meta_keywords 
    ? (Array.isArray(blog.meta_keywords) 
        ? blog.meta_keywords 
        : toStr(blog.meta_keywords).split(',').map((k: string) => k.trim()))
    : [];
  
  const allKeywords = [...new Set([...tagsKeywords, ...metaKeywords].filter(Boolean))];

  // الصورة - معالجة آمنة مع toUndefined
  const featuredImage = blog.featured_image 
    ? getImageUrl(blog.featured_image)
    : undefined;

  return generateSEO({
    settings,
    type: 'article',
    title: toUndefined(toStr(blog.meta_title_ar) || toStr(blog.title_ar)),
    description: toUndefined(toStr(blog.meta_description_ar) || toStr(blog.excerpt_ar)),
    keywords: allKeywords,
    image: toUndefined(featuredImage),
    url: `/blog/${blog.slug}`,
    publishedAt: toUndefined(blog.published_at),
    modifiedAt: toUndefined(blog.updated_at),
    author: toUndefined(blog.author?.name || toStr(settings?.site_name_ar) || 'البناء المتميز'),
    section: toUndefined(blog.category?.name_ar),
    tags: tagsKeywords,
  });
}

// ════════════════════════════════════════════════
// ⚡ ISR - تحديث تلقائي
// ════════════════════════════════════════════════
export const revalidate = 60;

// ════════════════════════════════════════════════
// 🎯 الصفحة الرئيسية للمقال
// ════════════════════════════════════════════════
export default async function BlogPage({ params }: Props) {
  const { slug } = await params;

  // ─── جلب جميع البيانات بشكل متوازي ───
  const [blog, allBlogs, services, projects, settings] = await Promise.all([
    api.blog(slug).catch(() => null),
    api.latestBlogs(6).catch(() => []),
    api.services().catch(() => []),
    api.featuredProjects(4).catch(() => ({ data: [] })),
    getSiteSettings(),
  ]);

  // ─── 404 ───
  if (!blog) notFound();

  // ─── جلب المقالات المشابهة ───
  let relatedBlogs = (allBlogs as any[])
    .filter((b: any) => b.id !== blog.id)
    .slice(0, 4);
  
  // إذا لم تكن هناك مقالات كافية، جلب من نفس التصنيف
  if (relatedBlogs.length < 2 && blog.category?.slug) {
    try {
      const categoryPosts = await api.blogs(1, 3, { category: blog.category.slug });
      const categoryData = categoryPosts as any;
      const extraPosts = (categoryData.data || []).filter((b: any) => b.id !== blog.id);
      relatedBlogs = [...relatedBlogs, ...extraPosts].slice(0, 4);
    } catch (error) {
      console.error('Error fetching category posts:', error);
    }
  }

  // ─── معالجة الصور ───
  const img = blog.featured_image ? getImageUrl(blog.featured_image) : '';
  const gallery: string[] = Array.isArray(blog.gallery) 
    ? blog.gallery.map((g: string) => getImageUrl(g)) 
    : [];
  
  const tags = blog.tags || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${siteUrl}/blog/${blog.slug}`;
  const siteName = toStr(settings?.site_name_ar) || toStr(settings?.site_name) || 'البناء المتميز';

  // ─── هل تم التحديث؟ ───
  const wasUpdated = blog.updated_at && blog.published_at &&
    new Date(blog.updated_at).getTime() - new Date(blog.published_at).getTime() > 60000;

  // ─── Breadcrumbs ───
  const breadcrumbs = buildBreadcrumb(
    { name: 'المدونة', url: '/blog' },
    ...(blog.category ? [{ 
      name: blog.category.name_ar, 
      url: `/blog?category=${blog.category.slug}` 
    }] : []),
    { name: blog.title_ar, url: `/blog/${blog.slug}` },
  );

  // ─── تحضير قائمة المشاريع ───
  const projectsList = Array.isArray(projects) ? projects : (projects as any)?.data || [];

  // ─── تحويل البيانات لـ BlogSchema ───
  const blogForSchema = {
    ...blog,
    featured_image: blog.featured_image ?? undefined,
    gallery: blog.gallery ?? undefined,
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          🎯 SEO Schemas (Server-Side)
          ═══════════════════════════════════════ */}
      
      {/* Organization + WebSite + WebPage + Breadcrumbs */}
      <JsonLd 
        settings={settings}
        pageType="blog-detail"
        pageTitle={blog.title_ar}
        pageDescription={blog.excerpt_ar || undefined}
        pageUrl={`/blog/${slug}`}
        pageImage={img || undefined}
        breadcrumbs={breadcrumbs}
      />
      
      {/* Article/BlogPosting Schema المتخصص */}
      <BlogSchema blog={blogForSchema} settings={settings} />

      <div className="single-blog-page">
        {/* ═══════════════════════════════════════
            🎨 Hero Section
            ═══════════════════════════════════════ */}
        <section className="blog-hero">
          <div className="container-custom">
            <Breadcrumb items={breadcrumbs} variant="dark" />

            <div className="blog-hero-content">
              {blog.category?.name_ar && (
                <Link 
                  href={`/blog?category=${blog.category.slug}`}
                  className="blog-category-tag"
                >
                  {blog.category.name_ar}
                </Link>
              )}

              <h1 className="blog-title">{blog.title_ar}</h1>

              <div className="blog-meta">
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  نُشر: {formatDate(blog.published_at)}
                </span>
                
                {wasUpdated && (
                  <span className="meta-item updated">
                    <span className="meta-icon">🔄</span>
                    آخر تحديث: {timeAgo(blog.updated_at)}
                  </span>
                )}
                
                {blog.reading_time && (
                  <span className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    {blog.reading_time} دقائق قراءة
                  </span>
                )}
                
                {(blog.views_count ?? 0) > 0 && (
                  <span className="meta-item">
                    <span className="meta-icon">👁️</span>
                    {formatNumber(blog.views_count)} مشاهدة
                  </span>
                )}

                {blog.author?.name && (
                  <span className="meta-item">
                    <span className="meta-icon">✍️</span>
                    {blog.author.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="blog-wave">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
            </svg>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            📝 Main Content
            ═══════════════════════════════════════ */}
        <section className="blog-content-section">
          <div className="container-custom">
            <div className="blog-layout">
              {/* Main Article */}
              <article className="blog-main" itemScope itemType="https://schema.org/BlogPosting">
                {/* Featured Image */}
                {img && (
                  <div className="blog-featured-image">
                    <div className="featured-image-wrapper">
                      <Image
                        src={img}
                        alt={`${blog.title_ar} | ${siteName}`}
                        fill
                        className="featured-image"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                        quality={90}
                        unoptimized={img.startsWith('http')}
                      />
                    </div>
                  </div>
                )}

                {/* Share Buttons - Top */}
                <div className="blog-share-section">
                  <span className="share-label">📤 شارك المقال:</span>
                  <ShareButtons url={shareUrl} title={blog.title_ar} />
                </div>

                {/* Article Container */}
                <div className="blog-article-container">
                  {/* Excerpt */}
                  {blog.excerpt_ar && (
                    <div className="blog-excerpt" itemProp="description">
                      <p>💡 {blog.excerpt_ar}</p>
                    </div>
                  )}

                  {/* Main Content */}
                  {blog.content_ar ? (
                    <div itemProp="articleBody">
                      <BlogContent content={blog.content_ar} />
                    </div>
                  ) : (
                    <div className="blog-no-content">
                      <p>📭 لا يوجد محتوى متاح لهذا المقال حالياً.</p>
                    </div>
                  )}

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="blog-tags-section">
                      <h3 className="tags-title">🏷️ الكلمات المفتاحية</h3>
                      <div className="tags-list" itemProp="keywords">
                        {tags.map((tag: any, i: number) => (
                          <Link 
                            key={i} 
                            href={`/tags/${tag.slug}`}
                            className="tag-link"
                          >
                            #{tag.name_ar}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Author Box */}
                  {blog.author && (
                    <div className="blog-author-box">
                      <div className="author-avatar">
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
                      <div className="author-info">
                        <h4>{blog.author.name}</h4>
                        {blog.author.bio && <p>{blog.author.bio}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery Section */}
                {gallery.length > 0 && (
                  <div className="blog-gallery-section">
                    <ProjectGallery images={gallery} title={blog.title_ar} />
                  </div>
                )}

                {/* Share Buttons - Bottom */}
                <div className="blog-share-bottom">
                  <h3 className="share-bottom-title">📤 شارك المقال مع أصدقائك</h3>
                  <ShareButtons url={shareUrl} title={blog.title_ar} />
                </div>

                {/* Back to Blog */}
                <div className="blog-back-link">
                  <Link href="/blog" className="back-button">
                    ← العودة إلى المدونة
                  </Link>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="blog-sidebar-wrapper">
                <BlogSidebar
                  relatedBlogs={relatedBlogs}
                  services={services as any[]}
                  projects={projectsList}
                  tags={tags}
                />
              </aside>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .single-blog-page {
          background: #f8faff;
          min-height: 100vh;
        }

        /* ═══════════════════════════════════════
           🎨 Hero Section
           ═══════════════════════════════════════ */
        .blog-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 3rem 0 5rem;
          position: relative;
          overflow: hidden;
        }

        .blog-hero-content {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .blog-category-tag {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: rgba(237, 137, 54, 0.2);
          color: #fbd38d;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-decoration: none;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(237, 137, 54, 0.3);
        }

        .blog-category-tag:hover {
          background: rgba(237, 137, 54, 0.35);
          transform: translateY(-2px);
        }

        .blog-title {
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }

        .blog-meta {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          color: #cbd5e0;
          font-size: 0.9rem;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .meta-icon {
          font-size: 1rem;
        }

        .meta-item.updated {
          color: #fbd38d;
        }

        .blog-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          line-height: 0;
        }

        .blog-wave svg {
          display: block;
          width: 100%;
          height: 60px;
        }

        /* ═══════════════════════════════════════
           📝 Content
           ═══════════════════════════════════════ */
        .blog-content-section {
          padding: 3rem 0 5rem;
        }

        .blog-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .blog-layout {
            grid-template-columns: 1fr 20rem;
            gap: 2.5rem;
          }
        }

        /* Featured Image */
        .blog-featured-image {
          margin-bottom: 2rem;
        }

        .featured-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .featured-image {
          object-fit: cover;
        }

        /* Share Section */
        .blog-share-section {
          background: white;
          padding: 1rem 1.25rem;
          border-radius: 0.875rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .share-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
        }

        /* Article Container */
        .blog-article-container {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        @media (min-width: 768px) {
          .blog-article-container {
            padding: 2.5rem;
          }
        }

        /* Excerpt */
        .blog-excerpt {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border-right: 4px solid #1a365d;
          padding: 1.25rem 1.5rem;
          border-radius: 0.85rem;
          margin-bottom: 2rem;
        }

        .blog-excerpt p {
          font-size: 1.05rem;
          color: #1e40af;
          line-height: 1.85;
          font-weight: 500;
          font-style: italic;
          margin: 0;
        }

        .blog-no-content {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
          background: #f8fafc;
          border-radius: 1rem;
        }

        /* Tags Section */
        .blog-tags-section {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 2px solid #f1f5f9;
        }

        .tags-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag-link {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          border: 1px solid #fcd34d;
          text-decoration: none;
          transition: all 0.3s;
        }

        .tag-link:hover {
          background: linear-gradient(135deg, #fde68a, #fcd34d);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(252, 211, 77, 0.4);
        }

        /* Author Box */
        .blog-author-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #fff7ed, #fffbeb);
          border-radius: 1.25rem;
          margin-top: 2.5rem;
          border: 1px solid #fed7aa;
        }

        .author-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ed8936, #f59e0b);
          display: grid;
          place-items: center;
          color: white;
          font-size: 1.75rem;
          flex-shrink: 0;
          overflow: hidden;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .author-info h4 {
          margin: 0 0 0.25rem;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }

        .author-info p {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
        }

        /* Gallery */
        .blog-gallery-section {
          margin-top: 2rem;
        }

        /* Share Bottom */
        .blog-share-bottom {
          margin-top: 2rem;
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          text-align: center;
        }

        .share-bottom-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        /* Back Link */
        .blog-back-link {
          margin-top: 2rem;
          text-align: center;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.8rem;
          background: white;
          color: #1a365d;
          border-radius: 0.85rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
          border: 2px solid transparent;
        }

        .back-button:hover {
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(26, 54, 93, 0.3);
        }

        /* Sidebar */
        .blog-sidebar-wrapper {
          position: sticky;
          top: 100px;
          align-self: start;
        }

        /* ═══════════════════════════════════════
           📱 Responsive
           ═══════════════════════════════════════ */
        @media (max-width: 768px) {
          .blog-hero {
            padding: 2rem 0 4rem;
          }

          .blog-meta {
            gap: 1rem;
            font-size: 0.78rem;
          }

          .blog-content-section {
            padding: 2rem 0 4rem;
          }

          .blog-article-container {
            padding: 1.25rem;
          }

          .blog-excerpt p {
            font-size: 0.95rem;
          }

          .blog-author-box {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .blog-meta {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .blog-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}