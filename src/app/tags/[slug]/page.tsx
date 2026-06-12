import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, Tag, BlogPost, Service, Project } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
// ✅ تغيير: استيراد من metadata الجديد
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import Breadcrumb from '@/components/seo/Breadcrumb';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}

// دالة مساعدة لتحويل null إلى undefined
function toUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

// دالة مساعدة للحصول على رابط الصورة
function getImageUrl(image: string | null | undefined): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/storage')) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${backendUrl}${image}`;
  }
  if (image.startsWith('storage/')) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${backendUrl}/${image}`;
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return `${backendUrl}/storage/${image.replace(/^\/+/, '')}`;
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch { return date; }
}

// ════════════════════════════════════════════════
// 📝 SEO Metadata - النظام الجديد الموحد
// ════════════════════════════════════════════════
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [tag, settings] = await Promise.all([
    api.tag(slug),
    getSiteSettings(),
  ]);

  if (!tag) {
    return generateSEO({
      settings,
      title: 'الوسم غير موجود',
      description: 'عذراً، الوسم الذي تبحث عنه غير موجود',
      noindex: true,
    });
  }

  const tagName = tag.name_ar || tag.name_en || tag.slug;
  const tagDescription = tag.description || `تصفح جميع المحتويات المتعلقة بالوسم "${tagName}" في مدونة البناء المتميز. مقالات، خدمات، ومشاريع.`;

  return generateSEO({
    settings,
    title: tag.meta_title || `${tagName} | وسوم مدونة البناء المتميز`,
    description: tag.meta_description || tagDescription,
    keywords: [tagName, tag.name_en].filter(Boolean) as string[],
    url: `/tags/${tag.slug}`,
    type: 'website',
  });
}

export const revalidate = 60;

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page, type } = await searchParams;
  const currentPage = Number(page) || 1;
  const activeType = type || 'blogs';

  // جلب بيانات الوسم
  const tag = await api.tag(slug);
  if (!tag) notFound();

  // جلب المحتوى حسب النوع
  const [blogsData, servicesData, projectsData] = await Promise.all([
    api.blogs(currentPage, 6, { tag: slug }),
    api.searchServices(slug).catch(() => []),
    api.searchProjects(slug).catch(() => ({ data: [] })),
  ]);

  const blogs = blogsData.data || [];
  const blogsTotal = blogsData.total || 0;
  const services = servicesData as Service[];
  const projects = (projectsData as any)?.data || [];

  // Breadcrumbs
  const breadcrumbs = buildBreadcrumb(
    { name: 'الوسوم', url: '/tags' },
    { name: tag.name_ar || tag.slug, url: `/tags/${tag.slug}` },
  );

  return (
    <>
      {/* Hero Section */}
      <section className="tag-hero">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />
          
          <div className="tag-hero-content">
            <span className="tag-hero-icon">🏷️</span>
            <h1 className="tag-hero-title">{tag.name_ar}</h1>
            {tag.description && (
              <p className="tag-hero-desc">{tag.description}</p>
            )}
            <div className="tag-stats">
              <span>📝 {blogsTotal} مقال</span>
              <span>🛠️ {services.length} خدمة</span>
              <span>🏗️ {projects.length} مشروع</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tag-content">
        <div className="container-custom">
          {/* Tabs Navigation */}
          <div className="tag-tabs">
            <Link
              href={`/tags/${tag.slug}?type=blogs`}
              className={`tab-btn ${activeType === 'blogs' ? 'active' : ''}`}
            >
              📝 المقالات ({blogsTotal})
            </Link>
            <Link
              href={`/tags/${tag.slug}?type=services`}
              className={`tab-btn ${activeType === 'services' ? 'active' : ''}`}
            >
              🛠️ الخدمات ({services.length})
            </Link>
            <Link
              href={`/tags/${tag.slug}?type=projects`}
              className={`tab-btn ${activeType === 'projects' ? 'active' : ''}`}
            >
              🏗️ المشاريع ({projects.length})
            </Link>
          </div>

          {/* مقالات */}
          {activeType === 'blogs' && (
            <div className="content-section">
              {blogs.length > 0 ? (
                <>
                  <div className="items-grid">
                    {blogs.map((blog: BlogPost) => {
                      const imageUrl = getImageUrl(blog.featured_image);
                      return (
                        <Link key={blog.id} href={`/blog/${blog.slug}`} className="item-card">
                          <div className="item-card-image">
                            {imageUrl ? (
                              <div className="image-wrapper">
                                <img
                                  src={imageUrl}
                                  alt={blog.title_ar}
                                  className="item-image"
                                />
                              </div>
                            ) : (
                              <div className="image-placeholder">📝</div>
                            )}
                          </div>
                          <div className="item-card-content">
                            <div className="item-meta">
                              <span>📅 {formatDate(blog.published_at)}</span>
                              {blog.reading_time && <span>⏱️ {blog.reading_time} د</span>}
                            </div>
                            <h3 className="item-title">{blog.title_ar}</h3>
                            <p className="item-excerpt">{blog.excerpt_ar?.substring(0, 100)}...</p>
                            <span className="read-more">قراءة المقال ←</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  
                  {/* Pagination للمقالات */}
                  {(blogsData as any).last_page > 1 && (
                    <div className="pagination">
                      {currentPage > 1 && (
                        <Link href={`/tags/${tag.slug}?type=blogs&page=${currentPage - 1}`} className="pagination-prev">
                          → السابق
                        </Link>
                      )}
                      <span className="pagination-current">
                        الصفحة {currentPage} من {(blogsData as any).last_page}
                      </span>
                      {currentPage < (blogsData as any).last_page && (
                        <Link href={`/tags/${tag.slug}?type=blogs&page=${currentPage + 1}`} className="pagination-next">
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

          {/* خدمات */}
          {activeType === 'services' && (
            <div className="content-section">
              {services.length > 0 ? (
                <div className="items-grid">
                  {services.map((service: Service) => {
                    const imageUrl = getImageUrl(service.image);
                    return (
                      <Link key={service.id} href={`/services/${service.slug}`} className="item-card">
                        <div className="item-card-image">
                          {imageUrl ? (
                            <div className="image-wrapper">
                              <img
                                src={imageUrl}
                                alt={service.title_ar}
                                className="item-image"
                              />
                            </div>
                          ) : (
                            <div className="image-placeholder">🛠️</div>
                          )}
                        </div>
                        <div className="item-card-content">
                          <h3 className="item-title">{service.title_ar}</h3>
                          <p className="item-excerpt">{service.excerpt_ar?.substring(0, 100)}...</p>
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

          {/* مشاريع */}
          {activeType === 'projects' && (
            <div className="content-section">
              {projects.length > 0 ? (
                <div className="items-grid">
                  {projects.map((project: Project) => {
                    const imageUrl = getImageUrl(project.main_image);
                    return (
                      <Link key={project.id} href={`/projects/${project.slug}`} className="item-card">
                        <div className="item-card-image">
                          {imageUrl ? (
                            <div className="image-wrapper">
                              <img
                                src={imageUrl}
                                alt={project.title_ar}
                                className="item-image"
                              />
                            </div>
                          ) : (
                            <div className="image-placeholder">🏗️</div>
                          )}
                        </div>
                        <div className="item-card-content">
                          <h3 className="item-title">{project.title_ar}</h3>
                          <p className="item-excerpt">{project.excerpt_ar?.substring(0, 100)}...</p>
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

      <style>{`
        .tag-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 3rem 0 4rem;
        }

        .tag-hero-content {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .tag-hero-icon {
          display: inline-block;
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .tag-hero-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 900;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fff, #fbd38d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tag-hero-desc {
          color: #cbd5e0;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto;
        }

        .tag-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          backdrop-filter: blur(10px);
          width: fit-content;
          margin-inline: auto;
        }

        .tag-stats span {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .tag-content {
          padding: 4rem 0;
          background: #f8faff;
          min-height: 60vh;
        }

        .tag-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 0.75rem 2rem;
          background: white;
          border-radius: 9999px;
          text-decoration: none;
          color: #1a365d;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.3s;
          border: 1px solid #e5e7eb;
        }

        .tab-btn:hover {
          background: #ed8936;
          color: white;
          border-color: #ed8936;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          border-color: transparent;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .item-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .item-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }

        .item-card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .item-card:hover .item-image {
          transform: scale(1.05);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .item-card-content {
          padding: 1.5rem;
        }

        .item-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #9ca3af;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .item-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          transition: color 0.2s;
        }

        .item-card:hover .item-title {
          color: #ed8936;
        }

        .item-excerpt {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more {
          color: #1a365d;
          font-weight: 700;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          transition: gap 0.2s;
        }

        .item-card:hover .read-more {
          gap: 0.5rem;
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
        }

        .pagination-prev,
        .pagination-next {
          padding: 0.5rem 1.25rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          text-decoration: none;
          color: #1a365d;
          font-weight: 600;
          transition: all 0.2s;
        }

        .pagination-prev:hover,
        .pagination-next:hover {
          background: #ed8936;
          color: white;
          border-color: #ed8936;
        }

        .pagination-current {
          padding: 0.5rem 1rem;
          background: #1a365d;
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 1rem;
          color: #64748b;
        }

        @media (max-width: 640px) {
          .items-grid {
            grid-template-columns: 1fr;
          }
          .tag-stats {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          .tag-tabs {
            gap: 0.5rem;
          }
          .tab-btn {
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}