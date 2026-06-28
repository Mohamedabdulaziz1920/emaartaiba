import type { Metadata } from 'next';
import Link from 'next/link';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api, Category } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { toStr, extractArray } from '@/lib/typeSafe';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return generateSEO({
    settings,
    type: 'website',
    title: 'التصنيفات',
    description: 'تصفح جميع التصنيفات في الموقع',
    keywords: ['تصنيفات', 'خدمات', 'مشاريع', 'مقالات'],
    url: '/categories',
  });
}

export default async function CategoriesPage() {
  const [settings, categoriesRaw] = await Promise.all([
    getSiteSettings(),
    api.categories().catch(() => []),
  ]);

  const categories = extractArray<Category>(categoriesRaw);
  const breadcrumbs = buildBreadcrumb({ name: 'التصنيفات', url: '/categories' });

  // تقسيم التصنيفات حسب النوع
  const categoriesByType = {
    services: categories.filter((cat: Category) => cat.type_label === 'service'),
    projects: categories.filter((cat: Category) => cat.type_label === 'project'),
    blogs: categories.filter((cat: Category) => cat.type_label === 'blog'),
  };

  const hasCategories = categories.length > 0;

  return (
    <>
      <JsonLd
        settings={settings}
        pageType="blog" // ✅ استخدام نوع مدعوم
        pageTitle="التصنيفات"
        pageDescription="تصفح جميع التصنيفات في الموقع"
        pageUrl="/categories"
        breadcrumbs={breadcrumbs}
      />

      <section className="categories-hero">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <div className="categories-hero-content">
            <span className="categories-hero-badge">📂</span>
            <h1 className="categories-hero-title">جميع التصنيفات</h1>
            <p className="categories-hero-desc">تصفح المحتوى حسب التصنيفات المنظمة</p>
          </div>
        </div>
      </section>

      <section className="categories-content">
        <div className="container-custom">
          {hasCategories ? (
            <>
              {categoriesByType.services.length > 0 && (
                <div className="category-section">
                  <div className="section-header">
                    <h2 className="section-title">🛠️ تصنيفات الخدمات</h2>
                    <p className="section-desc">اكتشف خدماتنا المصنفة حسب التخصص</p>
                  </div>
                  <div className="categories-grid">
                    {categoriesByType.services.map((category: Category) => (
                      <CategoryCard key={category.id} category={category} type="service" />
                    ))}
                  </div>
                </div>
              )}

              {categoriesByType.projects.length > 0 && (
                <div className="category-section">
                  <div className="section-header">
                    <h2 className="section-title">🏗️ تصنيفات المشاريع</h2>
                    <p className="section-desc">أحدث مشاريعنا حسب التصنيف</p>
                  </div>
                  <div className="categories-grid">
                    {categoriesByType.projects.map((category: Category) => (
                      <CategoryCard key={category.id} category={category} type="project" />
                    ))}
                  </div>
                </div>
              )}

              {categoriesByType.blogs.length > 0 && (
                <div className="category-section">
                  <div className="section-header">
                    <h2 className="section-title">📝 تصنيفات المقالات</h2>
                    <p className="section-desc">اقرأ مقالاتنا حسب التخصص</p>
                  </div>
                  <div className="categories-grid">
                    {categoriesByType.blogs.map((category: Category) => (
                      <CategoryCard key={category.id} category={category} type="blog" />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">لا توجد تصنيفات حالياً</div>
          )}
        </div>
      </section>

      <style>{`
        .categories-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 3rem 0 4rem;
        }
        .categories-hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .categories-hero-badge {
          display: inline-block;
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .categories-hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          margin-bottom: 1rem;
        }
        .categories-hero-desc {
          color: #cbd5e0;
          font-size: 1.125rem;
        }
        .categories-content {
          padding: 4rem 0;
          background: #f8faff;
          min-height: 60vh;
        }
        .category-section {
          margin-bottom: 4rem;
        }
        .category-section:last-child { margin-bottom: 0; }
        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
        }
        .section-desc {
          color: #64748b;
          margin-top: 0.5rem;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        .empty-state {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 1rem;
          color: #64748b;
        }
        @media (max-width: 640px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

function CategoryCard({ category, type }: { category: Category; type: string }) {
  const icons: Record<string, string> = {
    service: '🛠️',
    project: '🏗️',
    blog: '📝',
  };
  const colors: Record<string, string> = {
    service: 'linear-gradient(135deg, #667eea, #764ba2)',
    project: 'linear-gradient(135deg, #1a365d, #2b6cb0)',
    blog: 'linear-gradient(135deg, #ed8936, #f6ad55)',
  };

  const icon = icons[type] || '📁';
  const gradient = colors[type] || colors.service;

  return (
    <Link href={`/categories/${category.slug}`} className="category-card">
      <div className="category-card-icon" style={{ background: gradient }}>
        <span>{icon}</span>
      </div>
      <div className="category-card-content">
        <h3 className="category-card-title">{category.name_ar}</h3>
       {(category.description_ar || category.description_en) && (
  <p className="category-card-desc">
    {(category.description_ar || category.description_en || '').substring(0, 80)}...
  </p>
)}
        <span className="category-card-link">استكشف المحتوى ←</span>
      </div>
      <style>{`
        .category-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }
        .category-card-icon {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
        }
        .category-card-content { padding: 1.5rem; flex: 1; }
        .category-card-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .category-card:hover .category-card-title { color: #ed8936; }
        .category-card-desc {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .category-card-link {
          color: #1a365d;
          font-weight: 700;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          transition: gap 0.2s;
        }
        .category-card:hover .category-card-link { gap: 0.5rem; color: #ed8936; }
      `}</style>
    </Link>
  );
}
