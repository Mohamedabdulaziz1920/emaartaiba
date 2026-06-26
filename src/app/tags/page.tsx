import type { Metadata } from 'next';
import Link from 'next/link';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api, Tag } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { extractArray } from '@/lib/typeSafe';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return generateSEO({
    settings,
    type: 'website',
    title: 'الوسوم',
    description: 'تصفح جميع الوسوم في الموقع',
    keywords: ['وسوم', 'تصنيفات', 'مواضيع'],
    url: '/tags',
  });
}

export default async function TagsPage() {
  const [settings, tagsRaw] = await Promise.all([
    getSiteSettings(),
    api.tags().catch(() => []),
  ]);

  // ✅ استخراج المصفوفة بأمان
  const tags = extractArray<Tag>(tagsRaw);
  const breadcrumbs = buildBreadcrumb({ name: 'الوسوم', url: '/tags' });

  return (
    <>
      <JsonLd
        settings={settings}
        pageType="blog"
        pageTitle="الوسوم"
        pageDescription="تصفح جميع الوسوم في الموقع"
        pageUrl="/tags"
        breadcrumbs={breadcrumbs}
      />

      <section className="tags-hero">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <div className="tags-hero-content">
            <span className="tags-hero-icon">🏷️</span>
            <h1 className="tags-hero-title">جميع الوسوم</h1>
            <p className="tags-hero-desc">تصفح المحتوى حسب الوسوم</p>
          </div>
        </div>
      </section>

      <section className="tags-content">
        <div className="container-custom">
          {tags.length > 0 ? (
            <div className="tags-grid">
              {tags.map((tag: Tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`} className="tag-card">
                  <div className="tag-card-icon">#</div>
                  <div className="tag-card-content">
                    <h3 className="tag-card-title">{tag.name_ar}</h3>
                    {tag.description && (
                      <p className="tag-card-desc">{tag.description}</p>
                    )}
                    <span className="tag-card-count">
                      {tag.posts_count || 0} مقال
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>لا توجد وسوم حالياً</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .tags-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 3rem 0 4rem;
        }
        .tags-hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .tags-hero-icon {
          display: inline-block;
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .tags-hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          margin-bottom: 1rem;
        }
        .tags-hero-desc {
          color: #cbd5e0;
          font-size: 1.125rem;
        }
        .tags-content {
          padding: 4rem 0;
          background: #f8faff;
          min-height: 60vh;
        }
        .tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        .tag-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .tag-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
        .tag-card-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ed8936, #f59e0b);
          color: white;
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .tag-card-content {
          flex: 1;
        }
        .tag-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem;
        }
        .tag-card:hover .tag-card-title {
          color: #ed8936;
        }
        .tag-card-desc {
          color: #64748b;
          font-size: 0.8rem;
          margin: 0 0 0.5rem;
        }
        .tag-card-count {
          color: #94a3b8;
          font-size: 0.75rem;
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
          .tags-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
