// src/app/tags/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { api, type Tag, type BlogPost, type Service, type Project } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { getImageUrl } from '@/lib/image';
import { toStr, extractArray } from '@/lib/typeSafe';

export const revalidate = 300;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [tagResponse, settings] = await Promise.all([
    api.tag(slug).catch(() => null),
    getSiteSettings(),
  ]);

  const tag = tagResponse?.data;

  if (!tag) {
    return generateSEO({
      settings,
      title: 'الوسم غير موجود',
      description: 'عذراً، الوسم الذي تبحث عنه غير موجود',
      noindex: true,
    });
  }

  const tagName = toStr(tag.name_ar) || toStr(tag.name_en) || tag.slug;
  const siteName = toStr(settings?.site_name_ar) || toStr(settings?.site_name) || '';
  const title = tag.meta_title || (siteName ? `${tagName} | ${siteName}` : tagName) || tagName;
  const description = tag.meta_description || tag.description || tagName || '';

  return generateSEO({
    settings,
    title,
    description,
    keywords: [tagName, toStr(tag.name_en)].filter(Boolean) as string[],
    url: `/tags/${tag.slug}`,
    type: 'website',
  });
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page, type } = await searchParams;
  const currentPage = Number(page) || 1;
  const activeType = type || 'blogs';

  // ─── جلب البيانات ─────────────────────────────
  const [tagResponse, settings] = await Promise.all([
    api.tag(slug).catch(() => null),
    getSiteSettings(),
  ]);

  const tag = tagResponse?.data;
  if (!tag) notFound();

  // جلب المقالات
  let blogs: BlogPost[] = [];
  let blogsTotal = 0;
  let lastPage = 1;

  if (activeType === 'blogs') {
    try {
      const blogsResult = await api.blogs(currentPage, 6, { tag: slug, category: '', search: '' });
      blogs = extractArray(blogsResult.data);
      blogsTotal = blogsResult.total || 0;
      lastPage = blogsResult.last_page || 1;
    } catch (error) {
      console.error('Error fetching blogs for tag:', error);
    }
  }

  // جلب الخدمات
  let services: Service[] = [];
  if (activeType === 'services') {
    try {
      const servicesResult = await api.services();
      services = extractArray(servicesResult.data)
        .filter((s: any) => s.tags?.some((t: any) => t.slug === slug));
    } catch (error) {
      console.error('Error fetching services for tag:', error);
    }
  }

  // جلب المشاريع
  let projects: Project[] = [];
  if (activeType === 'projects') {
    try {
      const projectsResult = await api.projects();
      projects = extractArray(projectsResult.data)
        .filter((p: any) => p.tags?.some((t: any) => t.slug === slug));
    } catch (error) {
      console.error('Error fetching projects for tag:', error);
    }
  }

  const tagName = toStr(tag.name_ar) || tag.slug;
  const breadcrumbs = buildBreadcrumb(
    { name: 'الوسوم', url: '/tags' },
    { name: tagName, url: `/tags/${tag.slug}` }
  );

  return (
    <>
      <JsonLd
        settings={settings}
        pageType="blog"
        pageTitle={tagName}
        pageDescription={tag.description || undefined}
        pageUrl={`/tags/${tag.slug}`}
        breadcrumbs={breadcrumbs}
      />

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

      <section className="tag-content">
        <div className="container-custom">
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
                            {imgUrl ? (
                              <img src={imgUrl} alt={blog.title_ar} className="item-image" />
                            ) : (
                              <div className="image-placeholder">📝</div>
                            )}
                          </div>
                          <div className="item-card-content">
                            <div className="item-meta">
                              <span>{formatDate(blog.published_at)}</span>
                              {blog.reading_time && <span>{blog.reading_time} د</span>}
                            </div>
                            <h3 className="item-title">{blog.title_ar}</h3>
                            <p className="item-excerpt">{truncate(blog.excerpt_ar)}</p>
                            <span className="read-more">قراءة المقال ←</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {lastPage > 1 && (
                    <div className="pagination">
                      {currentPage > 1 && (
                        <Link href={`/tags/${tag.slug}?type=blogs&page=${currentPage - 1}`} className="pagination-prev">
                          → السابق
                        </Link>
                      )}
                      <span className="pagination-current">{currentPage} / {lastPage}</span>
                      {currentPage < lastPage && (
                        <Link href={`/tags/${tag.slug}?type=blogs&page=${currentPage + 1}`} className="pagination-next">
                          التالي ←
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">لا توجد مقالات مرتبطة بهذا الوسم</div>
              )}
            </div>
          )}

          {activeType === 'services' && (
            <div className="content-section">
              {services.length > 0 ? (
                <div className="items-grid">
                  {services.map((service: Service) => {
                    const imgUrl = getImageUrl((service as any).image ?? '');
                    return (
                      <Link key={service.id} href={`/services/${service.slug}`} className="item-card">
                        <div className="item-card-image">
                          {imgUrl ? (
                            <img src={imgUrl} alt={service.title_ar} className="item-image" />
                          ) : (
                            <div className="image-placeholder">🔧</div>
                          )}
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
                <div className="empty-state">لا توجد خدمات مرتبطة بهذا الوسم</div>
              )}
            </div>
          )}

          {activeType === 'projects' && (
            <div className="content-section">
              {projects.length > 0 ? (
                <div className="items-grid">
                  {projects.map((project: Project) => {
                    const imgUrl = getImageUrl(project.main_image ?? '');
                    return (
                      <Link key={project.id} href={`/projects/${project.slug}`} className="item-card">
                        <div className="item-card-image">
                          {imgUrl ? (
                            <img src={imgUrl} alt={project.title_ar} className="item-image" />
                          ) : (
                            <div className="image-placeholder">📁</div>
                          )}
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
                <div className="empty-state">لا توجد مشاريع مرتبطة بهذا الوسم</div>
              )}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .tag-hero {
          background: linear-gradient(135deg, #0f1729, #1a365d);
          color: white;
          padding: 3rem 0 4rem;
        }
        .tag-hero-content { text-align: center; max-width: 800px; margin: 0 auto; }
        .tag-hero-icon { font-size: 4rem; display: block; margin-bottom: 0.5rem; }
        .tag-hero-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; }
        .tag-hero-desc { color: #cbd5e0; font-size: 1.125rem; margin-top: 0.5rem; }
        .tag-stats { display: flex; gap: 1.5rem; justify-content: center; margin-top: 1rem; color: #94a3b8; }
        .tag-content { padding: 3rem 0; background: #f8faff; min-height: 60vh; }
        .tag-tabs {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .tab-btn {
          padding: 0.5rem 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          text-decoration: none;
          color: #475569;
          font-weight: 600;
          transition: all 0.3s;
        }
        .tab-btn:hover { background: #f1f5f9; }
        .tab-btn.active { background: #ed8936; color: white; border-color: #ed8936; }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .item-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          transition: all 0.3s;
        }
        .item-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
        .item-card-image { height: 180px; background: #f1f5f9; overflow: hidden; }
        .item-image { width: 100%; height: 100%; object-fit: cover; }
        .image-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .item-card-content { padding: 1.25rem; }
        .item-meta { display: flex; gap: 1rem; color: #94a3b8; font-size: 0.75rem; margin-bottom: 0.5rem; }
        .item-title { font-size: 1.125rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }
        .item-excerpt { color: #64748b; font-size: 0.875rem; line-height: 1.6; margin-bottom: 0.75rem; }
        .read-more { color: #ed8936; font-weight: 600; font-size: 0.875rem; }
        .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 1rem; color: #64748b; }
        .pagination {
          display: flex; justify-content: center; align-items: center; gap: 1rem;
          margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;
        }
        .pagination a {
          padding: 0.5rem 1rem; background: white; border: 1px solid #e5e7eb;
          border-radius: 0.5rem; text-decoration: none; color: #1a365d; font-weight: 600;
          transition: all 0.3s;
        }
        .pagination a:hover { background: #1a365d; color: white; }
        .pagination-current { padding: 0.5rem 1rem; font-weight: 600; color: #475569; }
        @media (max-width: 768px) {
          .tag-tabs { gap: 0.5rem; }
          .tab-btn { padding: 0.4rem 1rem; font-size: 0.875rem; }
          .items-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
