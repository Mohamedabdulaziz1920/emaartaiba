// src/app/tags/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { api, type Tag, type BlogPost, type Service, type Project } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd }    from '@/components/seo/JsonLd'; // ✅ مضاف
import Breadcrumb    from '@/components/seo/Breadcrumb';
import { getImageUrl } from '@/lib/image';  // ✅ من المكتبة
import { toStr }       from '@/lib/typeSafe';

// ✅ ISR بدون force-dynamic
export const revalidate   = 300;
export const dynamicParams = true;

interface Props {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════
function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return date; }
}

function truncate(text: string | null | undefined, max = 100): string {
  if (!text) return '';
  return text.length > max ? text.substring(0, max) + '...' : text;
}

// ════════════════════════════════════════════════
// 📝 generateMetadata
// ════════════════════════════════════════════════
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [tag, settings] = await Promise.all([
    api.tag(slug).catch(() => null),
    getSiteSettings(),
  ]);

  if (!tag) {
    return generateSEO({
      settings,
      title:       'الوسم غير موجود',
      description: 'عذراً، الوسم الذي تبحث عنه غير موجود',
      noindex:     true,
    });
  }

  const tagName    = toStr(tag.name_ar) || toStr(tag.name_en) || tag.slug;
  // ✅ لا defaults خاصة بنشاط
  const siteName   = toStr(settings?.site_name_ar) || toStr(settings?.site_name) || '';
  const title      = tag.meta_title ||
                     (siteName ? `${tagName} | ${siteName}` : tagName) ||
                     tagName;
  const description = tag.meta_description || tag.description || tagName || '';

  return generateSEO({
    settings,
    title,
    description,
    keywords: [tagName, toStr(tag.name_en)].filter(Boolean) as string[],
    url:      `/tags/${tag.slug}`,
    type:     'website',
  });
}

// ════════════════════════════════════════════════
// 🖥️ Page Component
// ════════════════════════════════════════════════
export default async function TagPage({ params, searchParams }: Props) {
  const { slug }         = await params;
  const { page, type }   = await searchParams;
  const currentPage      = Number(page) || 1;
  const activeType       = type || 'blogs';

  // ─── جلب البيانات ─────────────────────────────
  const [tag, settings] = await Promise.all([
    api.tag(slug).catch(() => null),
    getSiteSettings(), // ✅ مضاف
  ]);

  if (!tag) notFound();

  const [blogsRaw, servicesRaw, projectsRaw] = await Promise.all([
    api.blogs(currentPage, 6, { tag: slug }).catch(() => ({})),
    api.searchServices(slug).catch(() => []),
    api.searchProjects(slug).catch(() => ({ data: [] })),
  ]);

  // ─── استخراج البيانات ─────────────────────────
  const blogsResult = blogsRaw as any;
  const blogs       = blogsResult?.data   || blogsResult?.items  || [];
  const blogsTotal  = blogsResult?.total  || blogsResult?.meta?.total || 0;
  const lastPage    = blogsResult?.last_page || blogsResult?.meta?.last_page || 1;
  const services    = Array.isArray(servicesRaw) ? servicesRaw : [] as Service[];
  const projects    = (projectsRaw as any)?.data || [];

  // ─── Breadcrumbs ──────────────────────────────
  const tagName     = toStr(tag.name_ar) || tag.slug;
  const breadcrumbs = buildBreadcrumb(
    { name: 'الوسوم',  url: '/tags' },
    { name: tagName,   url: `/tags/${tag.slug}` }
  );

  // ════════════════════════════════════════════════
  // 🎨 Render
  // ════════════════════════════════════════════════
  return (
    <>
      {/* ═══ SEO ═══ */}
      {/* ✅ JsonLd مضاف */}
      <JsonLd
        settings={settings}
        pageType="blog"
        pageTitle={tagName}
        pageDescription={tag.description || undefined}
        pageUrl={`/tags/${tag.slug}`}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero */}
      <section className="tag-hero">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <div className="tag-hero-content">
            <span className="tag-hero-icon">🏷️</span>
            <h1 className="tag-hero-title">{tagName}</h1>
            {tag.description && (
              <p className="tag-hero-desc">{tag.description}</p>
            )}
            <div className="tag-stats">
              <span>📝 {blogsTotal}</span>
              <span>🔧 {services.length}</span>
              <span>📁 {projects.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="tag-content">
        <div className="container-custom">

          {/* Tabs */}
          <div className="tag-tabs">
            <Link
              href={`/tags/${tag.slug}?type=blogs`}
              className={`tab-btn ${activeType === 'blogs' ? 'active' : ''}`}
            >
              المقالات ({blogsTotal})
            </Link>
            <Link
              href={`/tags/${tag.slug}?type=services`}
              className={`tab-btn ${activeType === 'services' ? 'active' : ''}`}
            >
              الخدمات ({services.length})
            </Link>
            <Link
              href={`/tags/${tag.slug}?type=projects`}
              className={`tab-btn ${activeType === 'projects' ? 'active' : ''}`}
            >
              المشاريع ({projects.length})
            </Link>
          </div>

          {/* ─── Blogs ─── */}
          {activeType === 'blogs' && (
            <div className="content-section">
              {blogs.length > 0 ? (
                <>
                  <div className="items-grid">
                    {blogs.map((blog: BlogPost) => {
                      const imgUrl = getImageUrl(blog.featured_image ?? '');
                      return (
                        <Link key={blog.id} href={`/blog/${blog.slug}`} className="item-card">
                          <div className="item-card-image">
                            {imgUrl
                              ? <img src={imgUrl} alt={blog.title_ar} className="item-image" />
                              : <div className="image-placeholder">📝</div>
                            }
                          </div>
                          <div className="item-card-content">
                            <div className="item-meta">
                              <span>{formatDate(blog.published_at)}</span>
                              {blog.reading_time && <span>{blog.reading_time} د</span>}
                            </div>
                            <h3 className="item-title">{blog.title_ar}</h3>
                            {/* ✅ truncate آمن */}
                            <p className="item-excerpt">{truncate(blog.excerpt_ar)}</p>
                            <span className="read-more">قراءة المقال ←</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {lastPage > 1 && (
                    <div className="pagination">
                      {currentPage > 1 && (
                        <Link
                          href={`/tags/${tag.slug}?type=blogs&page=${currentPage - 1}`}
                          className="pagination-prev"
                        >
                          → السابق
                        </Link>
                      )}
                      <span className="pagination-current">
                        {currentPage} / {lastPage}
                      </span>
                      {currentPage < lastPage && (
                        <Link
                          href={`/tags/${tag.slug}?type=blogs&page=${currentPage + 1}`}
                          className="pagination-next"
                        >
                          التالي ←
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <p>لا توجد مقالات مرتبطة بهذا الوسم</p>
                </div>
              )}
            </div>
          )}

          {/* ─── Services ─── */}
          {activeType === 'services' && (
            <div className="content-section">
              {services.length > 0 ? (
                <div className="items-grid">
                  {services.map((service: Service) => {
                    const imgUrl = getImageUrl((service as any).image ?? '');
                    return (
                      <Link key={service.id} href={`/services/${service.slug}`} className="item-card">
                        <div className="item-card-image">
                          {imgUrl
                            ? <img src={imgUrl} alt={service.title_ar} className="item-image" />
                            : <div className="image-placeholder">🔧</div>
                          }
                        </div>
                        <div className="item-card-content">
                          <h3 className="item-title">{service.title_ar}</h3>
                          <p className="item-excerpt">{truncate(service.excerpt_ar)}</p>
                          <span className="read-more">تفاصيل الخدمة ←</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <p>لا توجد خدمات مرتبطة بهذا الوسم</p>
                </div>
              )}
            </div>
          )}

          {/* ─── Projects ─── */}
          {activeType === 'projects' && (
            <div className="content-section">
              {projects.length > 0 ? (
                <div className="items-grid">
                  {projects.map((project: Project) => {
                    const imgUrl = getImageUrl(project.main_image ?? '');
                    return (
                      <Link key={project.id} href={`/projects/${project.slug}`} className="item-card">
                        <div className="item-card-image">
                          {imgUrl
                            ? <img src={imgUrl} alt={project.title_ar} className="item-image" />
                            : <div className="image-placeholder">📁</div>
                          }
                        </div>
                        <div className="item-card-content">
                          <h3 className="item-title">{project.title_ar}</h3>
                          <p className="item-excerpt">{truncate(project.excerpt_ar)}</p>
                          <span className="read-more">تفاصيل المشروع ←</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <p>لا توجد مشاريع مرتبطة بهذا الوسم</p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </>
  );
}