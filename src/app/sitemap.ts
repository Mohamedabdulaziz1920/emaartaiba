// src/app/sitemap.ts
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const MAX_URLS_PER_SITEMAP = 45000;
const MAX_BLOG_PAGINATION_PAGES = 10;

export const revalidate = 3600;

// ═══════════════════════════════════════════════════
// 🛠️ Helpers
// ═══════════════════════════════════════════════════
async function fetchData(path: string): Promise<any[]> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      console.warn(`⚠️ Sitemap fetch failed [${path}]: ${res.status}`);
      return [];
    }

    const json = await res.json();

    if (Array.isArray(json)) return json;
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.data?.data)) return json.data.data;
    if (Array.isArray(json.data?.items)) return json.data.items;
    if (Array.isArray(json.data?.results)) return json.data.results;
    if (Array.isArray(json.items)) return json.items;
    if (Array.isArray(json.results)) return json.results;

    return [];
  } catch (error) {
    console.error(`❌ Sitemap fetch error [${path}]:`, error);
    return [];
  }
}

function formatDate(date: any): Date {
  if (!date) return new Date();
  try {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  } catch {
    return new Date();
  }
}

function getPagePriority(path: string): { priority: number; frequency: any } {
  const priorities: Record<string, { priority: number; frequency: any }> = {
    '/': { priority: 1.0, frequency: 'daily' },
    '/about': { priority: 0.8, frequency: 'monthly' },
    '/services': { priority: 0.95, frequency: 'weekly' },
    '/projects': { priority: 0.95, frequency: 'weekly' },
    '/blog': { priority: 0.9, frequency: 'daily' },
    '/categories': { priority: 0.85, frequency: 'weekly' },
    '/tags': { priority: 0.85, frequency: 'weekly' },
    '/areas': { priority: 0.85, frequency: 'weekly' },
    '/faq': { priority: 0.7, frequency: 'monthly' },
    '/contact': { priority: 0.85, frequency: 'monthly' },
    '/gallery': { priority: 0.8, frequency: 'weekly' },
    '/partners': { priority: 0.6, frequency: 'monthly' },
    '/testimonials': { priority: 0.65, frequency: 'monthly' },
    '/privacy': { priority: 0.3, frequency: 'yearly' },
    '/terms': { priority: 0.3, frequency: 'yearly' },
  };
  
  return priorities[path] || { priority: 0.7, frequency: 'monthly' };
}

// ═══════════════════════════════════════════════════
// 📄 Blog Pagination
// ═══════════════════════════════════════════════════
async function generateBlogPaginationPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API}/blogs?per_page=1`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const totalCount: number = json?.total || json?.data?.total || 0;

    if (totalCount === 0) return [];

    const postsPerPage = 12;
    const totalPages = Math.ceil(totalCount / postsPerPage);
    const pages: MetadataRoute.Sitemap = [];

    for (let i = 2; i <= Math.min(totalPages, MAX_BLOG_PAGINATION_PAGES); i++) {
      pages.push({
        url: `${BASE_URL}/blog?page=${i}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    return pages;
  } catch (error) {
    console.error('❌ Blog pagination error:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════
// 🗺️ Main Sitemap
// ═══════════════════════════════════════════════════
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const startTime = Date.now();
  
  // ─── جلب البيانات ───
  const [services, projects, blogs] = await Promise.all([
    fetchData('/services'),
    fetchData('/projects'),
    fetchData('/blogs/latest?limit=1000'),
  ]);

  const now = new Date();

  // ═══ Static Pages ═══
  const staticPaths = [
    '', '/about', '/services', '/projects', '/blog',
    '/categories', '/tags', '/areas', '/faq', '/contact', 
    '/gallery', '/partners', '/testimonials', '/privacy', '/terms'
  ];
  
  const staticPages: MetadataRoute.Sitemap = staticPaths.map(path => {
    const fullPath = path || '/';
    const { priority, frequency } = getPagePriority(fullPath);
    return {
      url: `${BASE_URL}${fullPath}`,
      lastModified: now,
      changeFrequency: frequency,
      priority,
    };
  });

  // ═══ Dynamic Pages ═══
  const servicePages: MetadataRoute.Sitemap = services
    .filter((s: any) => s && s.slug && s.is_active !== false)
    .map((s: any) => ({
      url: `${BASE_URL}/services/${s.slug}`,
      lastModified: formatDate(s.updated_at || s.created_at),
      changeFrequency: 'monthly',
      priority: s.is_featured ? 0.9 : 0.85,
    }));

  const projectPages: MetadataRoute.Sitemap = projects
    .filter((p: any) => p && p.slug && p.is_active !== false)
    .map((p: any) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: formatDate(p.updated_at || p.created_at),
      changeFrequency: 'monthly',
      priority: p.is_featured ? 0.9 : 0.85,
    }));

  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((b: any) => b && b.slug && b.is_active !== false)
    .map((b: any) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: formatDate(b.updated_at || b.published_at || b.created_at),
      changeFrequency: 'weekly',
      priority: b.is_featured ? 0.85 : 0.8,
    }));

  // ═══ Pagination ═══
  const paginationPages = await generateBlogPaginationPages();

  // ═══ تجميع وتنظيف ═══
  const allPages = [
    ...staticPages,
    ...servicePages,
    ...projectPages,
    ...blogPages,
    ...paginationPages,
  ];

  // إزالة المكررات
  const uniquePages = allPages.filter((page, index, self) => 
    index === self.findIndex(p => p.url === page.url)
  );

  // ترتيب حسب الأولوية
  uniquePages.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const finalPages = uniquePages.slice(0, MAX_URLS_PER_SITEMAP);

  const duration = Date.now() - startTime;

  console.log(`\n✅ Sitemap generated in ${duration}ms`);
  console.log(`📊 Total URLs: ${finalPages.length}`);

  return finalPages;
}
