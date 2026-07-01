// src/app/blog/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 🎯 SEO
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';

// 🛠️ Utilities
import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { extractArray, toStr } from '@/lib/typeSafe';

// ════════════════════════════════════════════════
// ⚙️ Config
// ════════════════════════════════════════════════
export const revalidate = 300;

// ════════════════════════════════════════════════
// 🎨 Skeleton
// ════════════════════════════════════════════════
function BlogSkeleton() {
  return (
    <div className="blog-card animate-pulse">
      <div className="blog-card-image-area bg-gray-200" />
      <div className="blog-card-content">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-1" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// 📝 Metadata
// ════════════════════════════════════════════════
interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const settings = await getSiteSettings();
  const params = await searchParams;
  const { category, search } = params;

  let title = 'المدونة';
  let description = 'اقرأ أحدث المقالات والنصائح في عالم البناء والمقاولات';

  if (search) {
    title = `نتائج البحث عن: "${search}"`;
    description = `نتائج البحث عن "${search}" في مدونتنا`;
  } else if (category) {
    title = `تصنيف: ${category}`;
    description = `أحدث المقالات في تصنيف ${category}`;
  }

  return generateSEO({
    title,
    description,
    keywords: ['مدونة', 'مقالات', 'بناء', 'مقاولات', category || '', search || ''],
    url: `/blog${search ? `?search=${search}` : ''}${category ? `?category=${category}` : ''}`,
    settings,
  });
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════
function getImageUrl(image: string | null | undefined): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const clean = image.replace(/^\/+/, '');

  if (clean.startsWith('storage/')) return `${backendUrl}/${clean}`;
  return `${backendUrl}/storage/${clean}`;
}

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

function BlogCard({ blog, priority = false }: { blog: any; priority?: boolean }) {
  const imageUrl = getImageUrl(blog.featured_image);

  return (
    <Link href={`/blog/${blog.slug}`} className="blog-card">
      <div className="blog-card-image-area">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={blog.title_ar || 'صورة المقال'}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="blog-card-image"
            unoptimized={imageUrl.includes('localhost')}
          />
        ) : (
          <div className="blog-card-placeholder">📝</div>
        )}
        {blog.category?.name_ar && (
          <span className="blog-card-category">{blog.category.name_ar}</span>
        )}
        {blog.is_featured && (
          <span className="blog-card-featured">⭐ مميز</span>
        )}
      </div>
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>📅 {formatDate(blog.published_at)}</span>
          {blog.reading_time && <span>⏱️ {blog.reading_time} د</span>}
          {(blog.views_count ?? 0) > 0 && (
           <span suppressHydrationWarning>👁️ {blog.views_count.toLocaleString('ar-SA')}</span>

          )}
        </div>
        <h2 className="blog-card-title">{blog.title_ar}</h2>
        <p className="blog-card-excerpt">{blog.excerpt_ar}</p>
        <span className="blog-card-link">قراءة المقال ←</span>
      </div>
    </Link>
  );
}

// ════════════════════════════════════════════════
// 🖥️ Page Component
// ════════════════════════════════════════════════
export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = toStr(params.category);
  const search = toStr(params.search);

  const [settings, data, categories] = await Promise.all([
    getSiteSettings(),
    api.blogs(page, 9, { category, search, tag: '' }).catch(() => ({
      data: [],
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 9,
    })),
    api.blogCategories().catch(() => []),
  ]);

  const blogs = extractArray(data.data);
  const { current_page, last_page, total } = data;

  const breadcrumbs = buildBreadcrumb({ name: 'المدونة', url: '/blog' });

  const pageTitle = search 
    ? `نتائج البحث عن: "${search}"`
    : category 
      ? `تصنيف: ${category}` 
      : 'المدونة';

  const canonical = `/blog${search ? `?search=${search}` : ''}${category ? `?category=${category}` : ''}`;

  return (
    <div className="blog-page">
      <JsonLd 
        settings={settings} 
        pageType="blog"
        pageTitle={pageTitle}
        pageDescription={settings?.meta_description_ar || 'أحدث المقالات والنصائح في عالم البناء'}
        pageUrl={canonical}
      />

      <section className="blog-hero">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <div className="blog-hero-content">
            <span className="blog-hero-badge">📝 المدونة</span>
            <h1 className="blog-hero-title">{pageTitle}</h1>
            <p className="blog-hero-description">
              {search 
                ? `عرض ${total} نتيجة للبحث عن "${search}"`
                : category 
                  ? `أحدث المقالات في تصنيف ${category}`
                  : 'اقرأ أحدث المقالات والنصائح في عالم البناء والمقاولات'}
            </p>
          </div>

          <form action="/blog" method="GET" className="blog-search-form">
            <input
              type="text"
              name="search"
              placeholder="ابحث في المقالات..."
              defaultValue={search}
              className="blog-search-input"
            />
            <button type="submit" className="blog-search-btn">🔍 بحث</button>
            {(search || category) && (
              <Link href="/blog" className="blog-search-clear">✕ إلغاء</Link>
            )}
          </form>
        </div>
        <div className="blog-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
          </svg>
        </div>
      </section>

      {categories.length > 0 && !search && (
        <div className="blog-categories-filter">
          <div className="container-custom">
            <div className="categories-scroll">
              <Link href="/blog" className={`category-chip ${!category ? 'active' : ''}`}>الكل</Link>
              {extractArray(categories).map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`category-chip ${category === cat.slug ? 'active' : ''}`}
                >
                  {cat.name_ar}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="blog-content-section">
        <div className="container-custom">
          {total > 0 && (
            <div className="blog-results-count">عرض {blogs.length} من {total} مقال</div>
          )}

          {blogs.length > 0 ? (
            <>
              <div className="blog-grid">
                {blogs.map((blog: any, index: number) => (
                  <Suspense key={blog.id} fallback={<BlogSkeleton />}>
                    <BlogCard blog={blog} priority={index === 0 && current_page === 1} />
                  </Suspense>
                ))}
              </div>

              {last_page > 1 && (
                <div className="blog-pagination">
                  {current_page > 1 && (
                    <Link
                      href={{ pathname: '/blog', query: { page: current_page - 1, ...(category && { category }), ...(search && { search }) } }}
                      className="pagination-btn pagination-prev"
                    >
                      → السابق
                    </Link>
                  )}
                  <div className="pagination-pages">
                    {Array.from({ length: Math.min(5, last_page) }, (_, i) => {
                      const p = i + 1;
                      return p === current_page ? (
                        <span key={p} className="pagination-number active">{p}</span>
                      ) : (
                        <Link
                          key={p}
                          href={{ pathname: '/blog', query: { page: p, ...(category && { category }), ...(search && { search }) } }}
                          className="pagination-number"
                        >
                          {p}
                        </Link>
                      );
                    })}
                    {last_page > 5 && <span className="pagination-dots">...</span>}
                    {last_page > 5 && (
                      <Link
                        href={{ pathname: '/blog', query: { page: last_page, ...(category && { category }), ...(search && { search }) } }}
                        className="pagination-number"
                      >
                        {last_page}
                      </Link>
                    )}
                  </div>
                  {current_page < last_page && (
                    <Link
                      href={{ pathname: '/blog', query: { page: current_page + 1, ...(category && { category }), ...(search && { search }) } }}
                      className="pagination-btn pagination-next"
                    >
                      التالي ←
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="blog-empty">
              <div className="blog-empty-icon">📝</div>
              <h2 className="blog-empty-title">لا توجد مقالات</h2>
              <p className="blog-empty-text">
                {search 
                  ? `لم نجد نتائج للبحث عن "${search}"`
                  : category 
                    ? `لا توجد مقالات في تصنيف "${category}"` 
                    : 'لم يتم إضافة أي مقالات بعد'}
              </p>
              <Link href="/blog" className="blog-empty-btn">العودة إلى المدونة</Link>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .blog-page { background: #f8faff; min-height: 100vh; }
        .blog-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 3rem 0 5rem;
          position: relative;
          overflow: hidden;
        }
        .blog-hero-content { text-align: center; max-width: 800px; margin: 0 auto; }
        .blog-hero-badge {
          display: inline-block;
          padding: 0.375rem 1rem;
          background: rgba(237, 137, 54, 0.15);
          color: #fbd38d;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .blog-hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          margin-bottom: 1rem;
        }
        .blog-hero-description {
          color: #cbd5e0;
          font-size: 1.125rem;
          max-width: 40rem;
          margin: 0 auto;
          line-height: 1.8;
        }
        .blog-search-form {
          display: flex;
          gap: 0.75rem;
          max-width: 550px;
          margin: 2.5rem auto 0;
          justify-content: center;
        }
        .blog-search-input {
          flex: 1;
          padding: 0.875rem 1.25rem;
          border: none;
          border-radius: 9999px;
          font-size: 1rem;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          outline: none;
          transition: box-shadow 0.2s;
        }
        .blog-search-input:focus { box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.5); }
        .blog-search-btn {
          padding: 0.875rem 1.75rem;
          background: #ed8936;
          border: none;
          border-radius: 9999px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .blog-search-btn:hover { background: #dd6b20; }
        .blog-search-clear {
          padding: 0.875rem 1.25rem;
          background: rgba(255,255,255,0.2);
          color: white;
          border-radius: 9999px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        .blog-search-clear:hover { background: rgba(255,255,255,0.3); }
        .blog-wave { position: absolute; bottom: 0; left: 0; right: 0; line-height: 0; }
        .blog-wave svg { display: block; width: 100%; height: 60px; }
        .blog-categories-filter {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 80px;
          z-index: 40;
        }
        .categories-scroll {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding: 1rem 0;
          scrollbar-width: thin;
        }
        .categories-scroll::-webkit-scrollbar { height: 4px; }
        .category-chip {
          padding: 0.5rem 1.25rem;
          background: #f1f5f9;
          color: #1f2937;
          border-radius: 9999px;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .category-chip:hover { background: #e2e8f0; }
        .category-chip.active { background: linear-gradient(135deg, #1a365d, #2b6cb0); color: white; }
        .blog-content-section { padding: 3rem 0 5rem; }
        .blog-results-count { text-align: center; color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }
        .blog-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          height: 100%;
        }
        .blog-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
        .blog-card-image-area {
          height: 13rem;
          position: relative;
          background: linear-gradient(135deg, #667eea, #764ba2);
          overflow: hidden;
        }
        .blog-card-image { object-fit: cover; }
        .blog-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .blog-card-category {
          position: absolute;
          top: 0.875rem;
          right: 0.875rem;
          padding: 0.375rem 0.875rem;
          background: rgba(255,255,255,0.95);
          color: #1a365d;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 2;
        }
        .blog-card-featured {
          position: absolute;
          top: 0.875rem;
          left: 0.875rem;
          padding: 0.375rem 0.625rem;
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
          border-radius: 9999px;
          font-size: 0.6875rem;
          font-weight: 700;
          z-index: 2;
        }
        .blog-card-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          color: #9ca3af;
          font-size: 0.75rem;
          flex-wrap: wrap;
        }
        .blog-card-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.625rem;
          line-height: 1.4;
          transition: color 0.2s;
        }
        .blog-card:hover .blog-card-title { color: #ed8936; }
        .blog-card-excerpt {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card-link {
          color: #1a365d;
          font-weight: 700;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          transition: gap 0.2s;
        }
        .blog-card:hover .blog-card-link { gap: 0.625rem; color: #ed8936; }
        .blog-empty { text-align: center; padding: 4rem 2rem; background: white; border-radius: 1rem; }
        .blog-empty-icon { font-size: 5rem; margin-bottom: 1rem; }
        .blog-empty-title { font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem; }
        .blog-empty-text { color: #64748b; margin-bottom: 1.5rem; }
        .blog-empty-btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .blog-empty-btn:hover { transform: translateY(-2px); }
        .blog-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }
        .pagination-btn {
          padding: 0.625rem 1.25rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          text-decoration: none;
          color: #1a365d;
          font-weight: 600;
          transition: all 0.2s;
        }
        .pagination-btn:hover { background: #1a365d; color: white; border-color: #1a365d; }
        .pagination-pages { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
        .pagination-number {
          min-width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          text-decoration: none;
          color: #1f2937;
          font-weight: 500;
          transition: all 0.2s;
        }
        .pagination-number:hover { background: #f1f5f9; border-color: #1a365d; }
        .pagination-number.active { background: linear-gradient(135deg, #1a365d, #2b6cb0); color: white; border-color: #1a365d; }
        .pagination-dots { color: #64748b; padding: 0 0.25rem; }
        @media (max-width: 768px) {
          .blog-hero { padding: 2rem 0 4rem; }
          .blog-search-form { flex-wrap: wrap; padding: 0 1rem; }
          .blog-search-input { width: 100%; }
          .blog-grid { gap: 1.5rem; }
          .blog-pagination { gap: 0.5rem; }
          .pagination-btn, .pagination-number { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
        }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr; }
          .categories-scroll { padding: 0.75rem 0; }
          .category-chip { padding: 0.375rem 1rem; font-size: 0.8125rem; }
        }
      `}</style>
    </div>
  );
}
