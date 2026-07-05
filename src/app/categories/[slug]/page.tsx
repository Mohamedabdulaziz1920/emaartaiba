// frontend/src/app/categories/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 🎯 SEO
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';

// 🛠️ Utilities
import {
  api,
  type Category,
  type BlogPost,
  type Service,
  type Project,
} from '@/lib/api';
import { getSiteSettings, settingsHelpers } from '@/lib/settings';
import { toStr, toInt, buildImageUrl, stripHtml } from '@/lib/typeSafe';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}

type ContentType = 'blog' | 'service' | 'project';

type CategoryStats = {
  posts?: number | string;
  services?: number | string;
  projects?: number | string;
};

type CategoryPageData = Category & {
  name_ar: string;
  slug: string;
  type: string;
  description_ar?: string | null;
  meta_title_ar?: string | null;
  meta_description_ar?: string | null;
  meta_keywords_ar?: string[] | string | null;
  meta_keywords?: string[] | string | null;
  canonical_url?: string | null;
  image?: string | null;
  stats?: CategoryStats | null;
};

type BlogItem = BlogPost & {
  title_ar: string;
  slug: string;
  featured_image?: string | null;
  excerpt_ar?: string | null;
  published_at: string;
  reading_time?: number | string | null;
  is_featured?: boolean;
};

type ServiceItem = Service & {
  title_ar: string;
  slug: string;
  image?: string | null;
  excerpt_ar?: string | null;
  is_featured?: boolean;
};

type ProjectItem = Project & {
  title_ar: string;
  slug: string;
  main_image?: string | null;
  excerpt_ar?: string | null;
  is_featured?: boolean;
};

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════

function normalizeType(value?: string | null): ContentType {
  const v = toStr(value).toLowerCase();

  if (['blog', 'blogs', 'post', 'posts'].includes(v)) return 'blog';
  if (['service', 'services'].includes(v)) return 'service';
  if (['project', 'projects'].includes(v)) return 'project';

  return 'blog';
}

function typeToQuery(type: ContentType): 'blogs' | 'services' | 'projects' {
  if (type === 'service') return 'services';
  if (type === 'project') return 'projects';
  return 'blogs';
}

function getTypeIcon(type: ContentType): string {
  const icons: Record<ContentType, string> = {
    service: '🛠️',
    project: '🏗️',
    blog: '📝',
  };
  return icons[type];
}

function getTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    service: 'خدمة',
    project: 'مشروع',
    blog: 'مقال',
  };
  return labels[type];
}

function getTypePluralLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    service: 'الخدمات',
    project: 'المشاريع',
    blog: 'المقالات',
  };
  return labels[type];
}

function formatDate(date: string) {
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

function parseKeywords(value?: string[] | string | null): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => toStr(item).trim()).filter(Boolean);
  }

  return toStr(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCategoryImage(category: CategoryPageData): string | undefined {
  const image = buildImageUrl(toStr(category.image));
  return image || undefined;
}

function buildCategoryPath(
  slug: string,
  activeType: ContentType,
  currentPage = 1,
  defaultType?: ContentType
): string {
  const params = new URLSearchParams();

  if (activeType !== defaultType) {
    params.set('type', typeToQuery(activeType));
  }

  if (currentPage > 1) {
    params.set('page', String(currentPage));
  }

  const query = params.toString();
  return query ? `/categories/${slug}?${query}` : `/categories/${slug}`;
}

function getStatsCount(
  statsValue?: number | string,
  fallback = 0
): number {
  return toInt(statsValue, fallback);
}

// ════════════════════════════════════════════════
// 📝 SEO Metadata - النظام الموحد الجديد
// ════════════════════════════════════════════════
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ slug }, search] = await Promise.all([params, searchParams]);

  const [categoryRaw, settings] = await Promise.all([
    api.getCategoryBySlug(slug).catch(() => null),
    getSiteSettings(),
  ]);

  const category = categoryRaw as CategoryPageData | null;

  if (!category) {
    return generateSEO({
      settings,
      title: 'التصنيف غير موجود',
      description: 'عذراً، التصنيف الذي تبحث عنه غير متوفر',
      noindex: true,
    });
  }

  const categoryType = normalizeType(category.type);
  const activeType = normalizeType(search?.type || category.type);
  const siteName = settingsHelpers.siteName(settings);

  const currentPage = Math.max(1, toInt(search?.page) || 1);
  const pagePath = buildCategoryPath(category.slug, activeType, currentPage, categoryType);

  const title =
    toStr(category.meta_title_ar) ||
    `${category.name_ar} - ${getTypePluralLabel(activeType)}`;

  const description =
    toStr(category.meta_description_ar) ||
    toStr(category.description_ar) ||
    `تصفح جميع ${getTypePluralLabel(activeType)} المتعلقة بـ ${category.name_ar}`;

  const keywords = [
    category.name_ar,
    getTypeLabel(activeType),
    getTypePluralLabel(activeType),
    ...parseKeywords(category.meta_keywords_ar || category.meta_keywords),
  ].filter(Boolean);

  return generateSEO({
    settings,
    type: 'website',
    title,
    description,
    keywords,
    url: pagePath,
    canonical: toStr(category.canonical_url) || pagePath,
    image: getCategoryImage(category),
  });
}

export const revalidate = 60;

// ════════════════════════════════════════════════
// 🖥️ Main Component
// ════════════════════════════════════════════════
export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const currentPage = Math.max(1, toInt(search?.page, 1));

  // ─── جلب البيانات الأساسية ───
  const [categoryRaw, settings] = await Promise.all([
    api.getCategoryBySlug(slug).catch(() => null),
    getSiteSettings(),
  ]);

  const category = categoryRaw as CategoryPageData | null;
  if (!category) notFound();

  const categoryType = normalizeType(category.type);
  const activeType = normalizeType(search?.type || category.type);

  const siteUrl =
    toStr(settings.site_url) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  const categoryPath = buildCategoryPath(
    category.slug,
    activeType,
    currentPage,
    categoryType
  );

  const pageUrl = `${siteUrl}${categoryPath}`;
  const categoryImage = getCategoryImage(category);

  // ─── جلب المحتوى حسب النوع الفعلي فقط ───
  let blogs: BlogItem[] = [];
  let blogsTotal = 0;
  let blogsLastPage = 1;
  let services: ServiceItem[] = [];
  let projects: ProjectItem[] = [];

  if (activeType === 'blog') {
    try {
      const blogsData = await api.getCategoryPosts(slug, currentPage, 9);
      blogs = ((blogsData?.data || []) as BlogItem[]) ?? [];
      blogsTotal = toInt(blogsData?.total) || 0;
      blogsLastPage = Math.max(1, toInt(blogsData?.last_page) || 1);
    } catch (error) {
      console.error('Error fetching category blogs:', error);
    }
  }

  if (activeType === 'service') {
    try {
      services = api.getCategoryServices
        ? (((await api.getCategoryServices(slug)) || []) as ServiceItem[])
        : [];
    } catch (error) {
      console.error('Error fetching category services:', error);
    }
  }

  if (activeType === 'project') {
    try {
      projects = api.getCategoryProjects
        ? (((await api.getCategoryProjects(slug)) || []) as ProjectItem[])
        : [];
    } catch (error) {
      console.error('Error fetching category projects:', error);
    }
  }

  // ─── Breadcrumbs ───
  const breadcrumbs = buildBreadcrumb(
    { name: 'التصنيفات', url: '/categories' },
    { name: category.name_ar, url: `/categories/${category.slug}` }
  );

  // ─── معلومات النوع ───
  const typeIcon = getTypeIcon(activeType);
  const typeLabel = getTypeLabel(activeType);
  const typePluralLabel = getTypePluralLabel(activeType);

  // ─── الإحصائيات ───
  const postsCount = getStatsCount(
    category.stats?.posts,
    activeType === 'blog' ? blogsTotal : 0
  );
  const servicesCount = getStatsCount(
    category.stats?.services,
    activeType === 'service' ? services.length : 0
  );
  const projectsCount = getStatsCount(
    category.stats?.projects,
    activeType === 'project' ? projects.length : 0
  );

  const hasMultipleTypes =
    [postsCount, servicesCount, projectsCount].filter((count) => count > 0)
      .length > 1;

  // ─── Collection Items للـ Schema ───
  const itemListElement =
    activeType === 'blog'
      ? blogs.slice(0, 10).map((blog, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'BlogPosting',
            '@id': `${siteUrl}/blog/${blog.slug}`,
            url: `${siteUrl}/blog/${blog.slug}`,
            headline: blog.title_ar,
            ...(blog.featured_image && {
              image: buildImageUrl(blog.featured_image),
            }),
            ...(blog.published_at && {
              datePublished: blog.published_at,
            }),
          },
        }))
      : activeType === 'service'
      ? services.slice(0, 10).map((service, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Service',
            '@id': `${siteUrl}/services/${service.slug}`,
            url: `${siteUrl}/services/${service.slug}`,
            name: service.title_ar,
            ...(service.image && {
              image: buildImageUrl(service.image),
            }),
          },
        }))
      : projects.slice(0, 10).map((project, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'CreativeWork',
            '@id': `${siteUrl}/projects/${project.slug}`,
            url: `${siteUrl}/projects/${project.slug}`,
            name: project.title_ar,
            ...(project.main_image && {
              image: buildImageUrl(project.main_image),
            }),
          },
        }));

  // ─── CollectionPage Schema ───
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#collection`,
    name: `${category.name_ar} - ${typePluralLabel}`,
    description:
      toStr(category.description_ar) ||
      `تصفح ${typePluralLabel} في تصنيف ${category.name_ar}`,
    url: pageUrl,
    inLanguage: 'ar-SA',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: settingsHelpers.siteName(settings),
    },
    breadcrumb: {
      '@id': `${pageUrl}#breadcrumb`,
    },
    about: {
      '@type': 'Thing',
      name: category.name_ar,
      ...(category.description_ar && {
        description: toStr(category.description_ar),
      }),
    },
    ...(categoryImage && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: categoryImage,
      },
    }),
    ...(itemListElement.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        name: `${typePluralLabel} - ${category.name_ar}`,
        numberOfItems: itemListElement.length,
        itemListElement,
      },
    }),
  };

  return (
    <>
      {/* Organization + Website + WebPage + Breadcrumbs */}
      <JsonLd
        settings={settings}
        pageType="about"
        pageTitle={category.name_ar}
        pageDescription={toStr(category.description_ar) || undefined}
        pageUrl={categoryPath}
        pageImage={categoryImage}
        breadcrumbs={breadcrumbs}
      />

      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema, null, 0),
        }}
      />

      {/* ═══════════════════════════════════════
          🎨 Hero Section
          ═══════════════════════════════════════ */}
      <section className="category-hero">
        {categoryImage && (
          <div className="category-hero-bg">
            <img src={categoryImage} alt={category.name_ar} />
            <div className="category-hero-overlay" />
          </div>
        )}

        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />

          <div className="category-hero-content">
            <span className="category-hero-icon">{typeIcon}</span>

            <span className="category-type-badge">{typeLabel}</span>

            <h1 className="category-hero-title">{category.name_ar}</h1>

            {category.description_ar && (
              <p className="category-hero-desc">{category.description_ar}</p>
            )}

            {(postsCount > 0 || servicesCount > 0 || projectsCount > 0) && (
              <div className="category-stats">
                {postsCount > 0 && (
                  <span className="stat-item">
                    <span className="stat-icon">📝</span>
                    <strong>{postsCount}</strong> مقال
                  </span>
                )}
                {servicesCount > 0 && (
                  <span className="stat-item">
                    <span className="stat-icon">🛠️</span>
                    <strong>{servicesCount}</strong> خدمة
                  </span>
                )}
                {projectsCount > 0 && (
                  <span className="stat-item">
                    <span className="stat-icon">🏗️</span>
                    <strong>{projectsCount}</strong> مشروع
                  </span>
                )}
              </div>
            )}

            {/* Type Switcher */}
            {hasMultipleTypes && (
              <div className="type-switcher">
                {postsCount > 0 && (
                  <Link
                    href={buildCategoryPath(category.slug, 'blog', 1, categoryType)}
                    className={`type-btn ${activeType === 'blog' ? 'active' : ''}`}
                  >
                    📝 المقالات ({postsCount})
                  </Link>
                )}

                {servicesCount > 0 && (
                  <Link
                    href={buildCategoryPath(category.slug, 'service', 1, categoryType)}
                    className={`type-btn ${activeType === 'service' ? 'active' : ''}`}
                  >
                    🛠️ الخدمات ({servicesCount})
                  </Link>
                )}

                {projectsCount > 0 && (
                  <Link
                    href={buildCategoryPath(category.slug, 'project', 1, categoryType)}
                    className={`type-btn ${activeType === 'project' ? 'active' : ''}`}
                  >
                    🏗️ المشاريع ({projectsCount})
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="category-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path
              d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z"
              fill="#f8faff"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          📄 Content Section
          ═══════════════════════════════════════ */}
      <section className="category-content">
        <div className="container-custom">
          {/* ━━━ Blogs ━━━ */}
          {activeType === 'blog' && (
            <div className="content-section">
              <h2 className="section-title">
                📝 المقالات
                {blogsTotal > 0 && <span className="count-badge">{blogsTotal}</span>}
              </h2>

              {blogs.length > 0 ? (
                <>
                  <div className="items-grid">
                    {blogs.map((blog) => {
                      const imageUrl = buildImageUrl(blog.featured_image);

                      return (
                        <Link
                          key={blog.id}
                          href={`/blog/${blog.slug}`}
                          className="item-card"
                        >
                          <div className="item-card-image">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={blog.title_ar}
                                className="item-image"
                                loading="lazy"
                              />
                            ) : (
                              <div className="image-placeholder">📝</div>
                            )}

                            {blog.is_featured && (
                              <span className="featured-badge">⭐ مميز</span>
                            )}
                          </div>

                          <div className="item-card-content">
                            <div className="item-meta">
                              <span>📅 {formatDate(blog.published_at)}</span>
                              {blog.reading_time && (
                                <span>⏱️ {blog.reading_time} د</span>
                              )}
                            </div>

                            <h3 className="item-title">{blog.title_ar}</h3>

                            {blog.excerpt_ar && (
                              <p className="item-excerpt">
                                {stripHtml(blog.excerpt_ar, 100)}
                              </p>
                            )}

                            <span className="read-more">
                              قراءة المقال
                              <svg
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                              </svg>
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {blogsLastPage > 1 && (
                    <div className="pagination">
                      {currentPage > 1 && (
                        <Link
                          href={buildCategoryPath(
                            category.slug,
                            'blog',
                            currentPage - 1,
                            categoryType
                          )}
                          className="pagination-btn pagination-prev"
                        >
                          → السابق
                        </Link>
                      )}

                      <span className="pagination-current">
                        الصفحة {currentPage} من {blogsLastPage}
                      </span>

                      {currentPage < blogsLastPage && (
                        <Link
                          href={buildCategoryPath(
                            category.slug,
                            'blog',
                            currentPage + 1,
                            categoryType
                          )}
                          className="pagination-btn pagination-next"
                        >
                          التالي ←
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <h3>لا توجد مقالات</h3>
                  <p>لا توجد مقالات في هذا التصنيف حالياً</p>
                  <Link href="/blog" className="empty-cta">
                    تصفح جميع المقالات
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ━━━ Services ━━━ */}
          {activeType === 'service' && (
            <div className="content-section">
              <h2 className="section-title">
                🛠️ الخدمات
                {services.length > 0 && (
                  <span className="count-badge">{services.length}</span>
                )}
              </h2>

              {services.length > 0 ? (
                <div className="items-grid">
                  {services.map((service) => {
                    const imageUrl = buildImageUrl(service.image);

                    return (
                      <Link
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="item-card"
                      >
                        <div className="item-card-image">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={service.title_ar}
                              className="item-image"
                              loading="lazy"
                            />
                          ) : (
                            <div className="image-placeholder">🛠️</div>
                          )}

                          {service.is_featured && (
                            <span className="featured-badge">⭐ مميز</span>
                          )}
                        </div>

                        <div className="item-card-content">
                          <h3 className="item-title">{service.title_ar}</h3>

                          {service.excerpt_ar && (
                            <p className="item-excerpt">
                              {stripHtml(service.excerpt_ar, 100)}
                            </p>
                          )}

                          <span className="read-more">
                            تفاصيل الخدمة
                            <svg
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <h3>لا توجد خدمات</h3>
                  <p>لا توجد خدمات في هذا التصنيف حالياً</p>
                  <Link href="/services" className="empty-cta">
                    تصفح جميع الخدمات
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ━━━ Projects ━━━ */}
          {activeType === 'project' && (
            <div className="content-section">
              <h2 className="section-title">
                🏗️ المشاريع
                {projects.length > 0 && (
                  <span className="count-badge">{projects.length}</span>
                )}
              </h2>

              {projects.length > 0 ? (
                <div className="items-grid">
                  {projects.map((project) => {
                    const imageUrl = buildImageUrl(project.main_image);

                    return (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="item-card"
                      >
                        <div className="item-card-image">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={project.title_ar}
                              className="item-image"
                              loading="lazy"
                            />
                          ) : (
                            <div className="image-placeholder">🏗️</div>
                          )}

                          {project.is_featured && (
                            <span className="featured-badge">⭐ مميز</span>
                          )}
                        </div>

                        <div className="item-card-content">
                          <h3 className="item-title">{project.title_ar}</h3>

                          {project.excerpt_ar && (
                            <p className="item-excerpt">
                              {stripHtml(project.excerpt_ar, 100)}
                            </p>
                          )}

                          <span className="read-more">
                            تفاصيل المشروع
                            <svg
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <h3>لا توجد مشاريع</h3>
                  <p>لا توجد مشاريع في هذا التصنيف حالياً</p>
                  <Link href="/projects" className="empty-cta">
                    تصفح جميع المشاريع
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .category-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 3rem 0 5rem;
          position: relative;
          overflow: hidden;
        }

        .category-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .category-hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.2;
          filter: blur(2px);
        }

        .category-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15, 23, 41, 0.95) 0%, rgba(43, 108, 176, 0.85) 100%);
        }

        .container-custom {
          position: relative;
          z-index: 1;
        }

        .category-hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          margin-top: 2rem;
        }

        .category-hero-icon {
          display: inline-block;
          font-size: 4rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 8px 20px rgba(237, 137, 54, 0.5));
        }

        .category-type-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: rgba(237, 137, 54, 0.2);
          color: #fbd38d;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 800;
          margin-bottom: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(237, 137, 54, 0.4);
        }

        .category-hero-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 900;
          margin: 0 0 1.2rem;
          background: linear-gradient(135deg, #fff, #fbd38d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .category-hero-desc {
          color: #cbd5e0;
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.85;
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .category-stats {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          font-size: 0.95rem;
          font-weight: 700;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .stat-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .stat-icon {
          font-size: 1.1rem;
        }

        .stat-item strong {
          color: #fbd38d;
          font-size: 1.1rem;
        }

        .type-switcher {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.65rem;
          margin-top: 2rem;
        }

        .type-btn {
          padding: 0.6rem 1.25rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          color: #cbd5e0;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .type-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          transform: translateY(-2px);
        }

        .type-btn.active {
          background: linear-gradient(135deg, #ed8936, #f59e0b);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 20px rgba(237, 137, 54, 0.35);
        }

        .category-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          line-height: 0;
        }

        .category-wave svg {
          display: block;
          width: 100%;
          height: 60px;
        }

        .category-content {
          padding: 4rem 0 5rem;
          background: #f8faff;
          min-height: 60vh;
        }

        .section-title {
          font-size: clamp(1.4rem, 2.5vw, 1.8rem);
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 2rem;
          height: 2rem;
          padding: 0 0.7rem;
          background: linear-gradient(135deg, #ed8936, #f59e0b);
          color: white;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .item-card {
          background: white;
          border-radius: 1.25rem;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.5);
        }

        .item-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(237, 137, 54, 0.15);
          border-color: rgba(237, 137, 54, 0.3);
        }

        .item-card-image {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .item-card:hover .item-image {
          transform: scale(1.08);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          font-size: 3.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .featured-badge {
          position: absolute;
          top: 0.85rem;
          right: 0.85rem;
          padding: 0.35rem 0.8rem;
          background: linear-gradient(135deg, #ed8936, #f56565);
          color: white;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 800;
          box-shadow: 0 6px 15px rgba(237, 137, 54, 0.4);
        }

        .item-card-content {
          padding: 1.5rem;
        }

        .item-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #94a3b8;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          flex-wrap: wrap;
        }

        .item-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.65rem;
          line-height: 1.45;
          transition: color 0.3s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-card:hover .item-title {
          color: #ed8936;
        }

        .item-excerpt {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.7;
          margin: 0 0 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more {
          color: #1a365d;
          font-weight: 800;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.3s;
        }

        .item-card:hover .read-more {
          gap: 0.6rem;
          color: #ed8936;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .pagination-btn {
          padding: 0.65rem 1.4rem;
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.65rem;
          text-decoration: none;
          color: #1a365d;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .pagination-btn:hover {
          background: linear-gradient(135deg, #ed8936, #f59e0b);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(237, 137, 54, 0.3);
        }

        .pagination-current {
          padding: 0.65rem 1.2rem;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          border-radius: 0.65rem;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 6px 15px rgba(26, 54, 93, 0.25);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 1.5rem;
          color: #64748b;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .empty-icon {
          display: inline-block;
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem;
        }

        .empty-state p {
          margin: 0 0 1.5rem;
          color: #64748b;
        }

        .empty-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.8rem;
          background: linear-gradient(135deg, #ed8936, #f59e0b);
          color: white;
          border-radius: 0.85rem;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 8px 20px rgba(237, 137, 54, 0.3);
        }

        .empty-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(237, 137, 54, 0.4);
        }

        @media (max-width: 768px) {
          .category-hero {
            padding: 2rem 0 4rem;
          }

          .category-hero-icon {
            font-size: 3rem;
          }

          .category-content {
            padding: 2.5rem 0 4rem;
          }

          .items-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .pagination {
            gap: 0.5rem;
          }

          .pagination-btn {
            padding: 0.55rem 1rem;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .type-switcher {
            flex-direction: column;
            align-items: stretch;
          }

          .type-btn {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}