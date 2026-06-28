import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 🎯 SEO
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';

// 🛠️ Utilities
import { api, Category, BlogPost, Service, Project } from '@/lib/api';
import { getSiteSettings, settingsHelpers } from '@/lib/settings';
import { toStr, toInt, buildImageUrl, stripHtml, extractArray } from '@/lib/typeSafe';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}

type ContentType = 'blog' | 'service' | 'project';

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSiteSettings();

  const categories = await api.categories().catch(() => []);
  const category = extractArray(categories).find((c: any) => c.slug === slug);

  if (!category) {
    return generateSEO({
      settings,
      title: 'التصنيف غير موجود',
      noindex: true,
    });
  }

  return generateSEO({
    settings,
    type: 'website',
    title: toStr(category.meta_title_ar) || category.name_ar,
    description:
  toStr(category.meta_description_ar) ||
  toStr(category.description_ar) ||
  toStr(category.description_en) ||
  '',
    url: `/categories/${slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const search = await searchParams;
  const currentPage = Math.max(1, toInt(search?.page, 1));
  const activeType = (search?.type as ContentType) || 'blog';

  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    api.categories().catch(() => []),
  ]);

  const category = extractArray(categories).find((c: any) => c.slug === slug);
  if (!category) notFound();

  // جلب المحتوى حسب النوع
  let blogs: BlogPost[] = [];
  let services: Service[] = [];
  let projects: Project[] = [];
  let blogsTotal = 0;
  let blogsLastPage = 1;

  if (activeType === 'blog') {
    try {
      const postsData = await api.blogs(currentPage, 9, { 
        category: slug, 
        search: '',
        tag: '', // ✅ إضافة tag مطلوب
      });
      blogs = extractArray(postsData.data);
      blogsTotal = postsData.total || 0;
      blogsLastPage = postsData.last_page || 1;
    } catch (error) {
      console.error('Error fetching category blogs:', error);
    }
  }

  if (activeType === 'service') {
    try {
      const servicesData = await api.services();
      services = extractArray(servicesData).filter((s: any) => s.category?.slug === slug);
    } catch (error) {
      console.error('Error fetching category services:', error);
    }
  }

  if (activeType === 'project') {
    try {
      const projectsData = await api.projects();
      projects = extractArray(projectsData.data).filter((p: any) => p.category?.slug === slug);
    } catch (error) {
      console.error('Error fetching category projects:', error);
    }
  }

  const breadcrumbs = buildBreadcrumb(
    { name: 'التصنيفات', url: '/categories' },
    { name: category.name_ar, url: `/categories/${category.slug}` }
  );

  const hasContent = blogs.length > 0 || services.length > 0 || projects.length > 0;

  return (
    <>
      <JsonLd
        settings={settings}
        pageType="blog"
        pageTitle={category.name_ar}
        pageDescription={category.description_ar || category.description_en || ''}
        pageUrl={`/categories/${slug}`}
        breadcrumbs={breadcrumbs}
      />

      <section className="category-hero">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <div className="category-hero-content">
            <h1 className="category-title">{category.name_ar}</h1>
        {(category.description_ar || category.description_en) && (
  <p className="category-desc">
    {category.description_ar || category.description_en}
  </p>
)}
              <div className="category-tabs">
              <Link href={`/categories/${slug}?type=blog`} className={`tab ${activeType === 'blog' ? 'active' : ''}`}>
                📝 المقالات
              </Link>
              <Link href={`/categories/${slug}?type=service`} className={`tab ${activeType === 'service' ? 'active' : ''}`}>
                🛠️ الخدمات
              </Link>
              <Link href={`/categories/${slug}?type=project`} className={`tab ${activeType === 'project' ? 'active' : ''}`}>
                🏗️ المشاريع
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="category-content">
        <div className="container-custom">
          {hasContent ? (
            <>
              <div className="items-grid">
                {activeType === 'blog' && blogs.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="item-card">
                    <div className="item-card-content">
                      <h3>{post.title_ar}</h3>
                      <p>{post.excerpt_ar}</p>
                      <span>اقرأ المقال ←</span>
                    </div>
                  </Link>
                ))}
                {activeType === 'service' && services.map((service) => (
                  <Link key={service.id} href={`/services/${service.slug}`} className="item-card">
                    <div className="item-card-content">
                      <h3>{service.title_ar}</h3>
                      <p>{service.excerpt_ar}</p>
                      <span>تفاصيل الخدمة ←</span>
                    </div>
                  </Link>
                ))}
                {activeType === 'project' && projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.slug}`} className="item-card">
                    <div className="item-card-content">
                      <h3>{project.title_ar}</h3>
                      <p>{project.excerpt_ar}</p>
                      <span>تفاصيل المشروع ←</span>
                    </div>
                  </Link>
                ))}
              </div>

              {activeType === 'blog' && blogsLastPage > 1 && (
                <div className="pagination">
                  {currentPage > 1 && (
                    <Link href={`/categories/${slug}?type=blog&page=${currentPage - 1}`}>← السابق</Link>
                  )}
                  <span>الصفحة {currentPage} من {blogsLastPage}</span>
                  {currentPage < blogsLastPage && (
                    <Link href={`/categories/${slug}?type=blog&page=${currentPage + 1}`}>التالي →</Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">لا يوجد محتوى في هذا التصنيف حالياً</div>
          )}
        </div>
      </section>

      <style>{`
        .category-hero {
          background: linear-gradient(135deg, #0f1729, #1a365d);
          color: white;
          padding: 3rem 0 4rem;
        }
        .category-hero-content { text-align: center; max-width: 800px; margin: 0 auto; }
        .category-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 0.5rem; }
        .category-desc { color: #cbd5e0; font-size: 1.125rem; margin-bottom: 2rem; }
        .category-tabs {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .tab {
          padding: 0.5rem 1.5rem;
          background: rgba(255,255,255,0.1);
          color: #cbd5e0;
          border-radius: 9999px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }
        .tab:hover { background: rgba(255,255,255,0.2); color: white; }
        .tab.active { background: #ed8936; color: white; }
        .category-content { padding: 3rem 0; background: #f8faff; min-height: 60vh; }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .item-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          transition: all 0.3s;
        }
        .item-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
        .item-card h3 { color: #0f172a; font-size: 1.125rem; margin-bottom: 0.5rem; }
        .item-card p { color: #64748b; font-size: 0.875rem; margin-bottom: 1rem; }
        .item-card span { color: #ed8936; font-weight: 600; font-size: 0.875rem; }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }
        .pagination a {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          text-decoration: none;
          color: #1a365d;
          font-weight: 600;
          transition: all 0.3s;
        }
        .pagination a:hover { background: #1a365d; color: white; }
        .empty-state {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 1rem;
          color: #64748b;
        }
        @media (max-width: 768px) {
          .category-tabs { gap: 0.5rem; }
          .tab { padding: 0.4rem 1rem; font-size: 0.875rem; }
          .items-grid { grid-template-columns: 1fr; }
          .pagination { flex-wrap: wrap; }
        }
      `}</style>
    </>
  );
}
