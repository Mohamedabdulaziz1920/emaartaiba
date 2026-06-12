import { Metadata } from 'next';
import Link from 'next/link';
import { api, Tag } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { generateSEO, buildBreadcrumb } from '@/lib/seo';
import Breadcrumb from '@/components/seo/Breadcrumb';

export const metadata: Metadata = {
  title: 'الوسوم | مدونة البناء المتميز',
  description: 'تصفح جميع الوسوم والكلمات المفتاحية في مدونة البناء المتميز. ابحث عن المقالات حسب الموضوع.',
  keywords: ['وسوم', 'كلمات مفتاحية', 'تصنيفات', 'مواضيع البناء'],
};

export const revalidate = 3600;

export default async function TagsPage() {
  const tags = await api.tags();
  const settings = await getSiteSettings();
  const breadcrumbs = buildBreadcrumb({ name: 'الوسوم', url: '/tags' });

  // ترتيب الوسوم حسب عدد المقالات
  const sortedTags = [...tags].sort((a, b) => (b.posts_count || 0) - (a.posts_count || 0));

  return (
    <>
      <section className="tags-hero">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />
          
          <div className="tags-hero-content">
            <span className="tags-hero-badge">🏷️</span>
            <h1 className="tags-hero-title">جميع الوسوم</h1>
            <p className="tags-hero-desc">
              تصفح المقالات حسب الوسوم والكلمات المفتاحية
            </p>
            <div className="tags-stats">
              <span>{tags.length} وسم</span>
              <span>{sortedTags.reduce((acc, t) => acc + (t.posts_count || 0), 0)} مقال</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tags-content">
        <div className="container-custom">
          {sortedTags.length > 0 ? (
            <div className="tags-cloud">
              {sortedTags.map((tag) => {
                // حساب حجم الخط بناءً على عدد المقالات
                const minSize = 0.875;
                const maxSize = 2.5;
                const minPosts = Math.min(...sortedTags.map(t => t.posts_count || 0));
                const maxPosts = Math.max(...sortedTags.map(t => t.posts_count || 0));
                const fontSize = minSize + ((tag.posts_count || 0) - minPosts) / (maxPosts - minPosts || 1) * (maxSize - minSize);
                
                return (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="tag-item"
                    style={{
                      fontSize: `${fontSize}rem`,
                      padding: `${Math.max(0.25, fontSize * 0.3)}rem ${Math.max(0.5, fontSize * 0.5)}rem`,
                    }}
                  >
                    <span className="tag-name">#{tag.name_ar}</span>
                    <span className="tag-count">{tag.posts_count || 0}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="tags-empty">
              <p>لا توجد وسوم حالياً</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .tags-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 4rem 0;
          position: relative;
          overflow: hidden;
        }

        .tags-hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .tags-hero-badge {
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
          margin-bottom: 1.5rem;
        }

        .tags-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          backdrop-filter: blur(10px);
          width: fit-content;
          margin: 0 auto;
        }

        .tags-stats span {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .tags-content {
          padding: 4rem 0;
          background: #f8faff;
          min-height: 60vh;
        }

        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .tag-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #1a365d;
          text-decoration: none;
          border-radius: 9999px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .tag-item:hover {
          background: linear-gradient(135deg, #ed8936, #f6ad55);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(237, 137, 54, 0.3);
          border-color: transparent;
        }

        .tag-name {
          font-weight: 700;
        }

        .tag-count {
          font-size: 0.7em;
          background: rgba(0, 0, 0, 0.1);
          padding: 0.1rem 0.4rem;
          border-radius: 9999px;
          font-weight: 600;
        }

        .tag-item:hover .tag-count {
          background: rgba(255, 255, 255, 0.2);
        }

        .tags-empty {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 1rem;
          color: #64748b;
        }

        @media (max-width: 640px) {
          .tags-cloud {
            gap: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}