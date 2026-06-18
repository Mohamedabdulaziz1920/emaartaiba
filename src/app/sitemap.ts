// src/app/sitemap.ts
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// حد Google الأقصى
const MAX_URLS_PER_SITEMAP = 45000;
const MAX_BLOG_PAGINATION_PAGES = 10;

// ═══════════════════════════════════════════════════
// 🛠️ Helpers
// ═══════════════════════════════════════════════════
async function fetchData(path: string): Promise<any[]> {
  try {
    const res = await fetch(`${API}${path}`, { 
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) {
      console.warn(`⚠️ Sitemap fetch failed [${path}]: ${res.status}`);
      return [];
    }
    
    const json = await res.json();
    
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json)) return json;
    if (json.data?.data && Array.isArray(json.data.data)) return json.data.data;
    if (json.data?.items && Array.isArray(json.data.items)) return json.data.items;
    return [];
  } catch (error) {
    console.error(`❌ Failed to fetch sitemap data for ${path}:`, error);
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

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function getPagePriority(path: string): { priority: number; frequency: ChangeFreq } {
  const priorities: Record<string, { priority: number; frequency: ChangeFreq }> = {
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
    const response = await fetch(`${API}/blogs?per_page=1`, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) return [];
    
    const json = await response.json();
    let totalCount = 0;
    
    if (json.data && typeof json.data === 'object') {
      totalCount = json.data.total || json.total || 0;
    } else if (json.total) {
      totalCount = json.total;
    } else if (Array.isArray(json.data)) {
      totalCount = json.data.length;
    } else if (Array.isArray(json)) {
      totalCount = json.length;
    }
    
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
    console.error('❌ Error generating blog pagination pages:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════
// 📂 Categories
// ═══════════════════════════════════════════════════
async function generateCategoryPages(): Promise<MetadataRoute.Sitemap> {
  const categories = await fetchData('/categories');
  
  return categories
    .filter((cat: any) => cat && cat.slug && cat.is_active !== false)
    .map((cat: any) => ({
      url: `${BASE_URL}/categories/${cat.slug}`,
      lastModified: formatDate(cat.updated_at || cat.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
}

// ═══════════════════════════════════════════════════
// 🏷️ Tags
// ═══════════════════════════════════════════════════
async function generateTagPages(): Promise<MetadataRoute.Sitemap> {
  const tags = await fetchData('/tags?per_page=100');
  
  return tags
    .filter((tag: any) => tag && tag.slug && tag.is_active !== false)
    .slice(0, 100)  // أعلى 100 وسم
    .map((tag: any) => ({
      url: `${BASE_URL}/tags/${tag.slug}`,
      lastModified: formatDate(tag.updated_at || tag.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
}

// ═══════════════════════════════════════════════════
// 🤝 Partners
// ═══════════════════════════════════════════════════
async function generatePartnerPages(): Promise<MetadataRoute.Sitemap> {
  const partners = await fetchData('/partners');
  
  return partners
    .filter((p: any) => p && p.slug)
    .map((p: any) => ({
      url: `${BASE_URL}/partners/${p.slug}`,
      lastModified: formatDate(p.updated_at || p.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
}

// ═══════════════════════════════════════════════════
// 🗺️ Main Sitemap
// ═══════════════════════════════════════════════════
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const startTime = Date.now();
  
  // جلب البيانات بالتوازي
  const [
    services, 
    projects, 
    blogs, 
    areas, 
    galleries,
    paginationPages,
    categoryPages,
    tagPages,
    partnerPages,
  ] = await Promise.all([
    fetchData('/services'),
    fetchData('/projects'),
    fetchData('/blogs?per_page=200'),
    fetchData('/areas'),
    fetchData('/galleries').catch(() => []),
    generateBlogPaginationPages(),
    generateCategoryPages(),
    generateTagPages(),
    generatePartnerPages(),
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
      changeFrequency: 'monthly' as const,
      priority: s.is_featured ? 0.9 : 0.85,
    }));

  const projectPages: MetadataRoute.Sitemap = projects
    .filter((p: any) => p && p.slug && p.is_active !== false)
    .map((p: any) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: formatDate(p.updated_at || p.created_at),
      changeFrequency: 'monthly' as const,
      priority: p.is_featured ? 0.9 : 0.85,
    }));

  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((b: any) => b && b.slug && b.is_active !== false)
    .map((b: any) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: formatDate(b.updated_at || b.published_at || b.created_at),
      changeFrequency: 'weekly' as const,
      priority: b.is_featured ? 0.85 : 0.8,
    }));

  const areaPages: MetadataRoute.Sitemap = areas
    .filter((a: any) => a && a.slug && a.is_active !== false)
    .map((a: any) => ({
      url: `${BASE_URL}/areas/${a.slug}`,
      lastModified: formatDate(a.updated_at || a.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));

  const galleryPages: MetadataRoute.Sitemap = galleries
    .filter((g: any) => g && (g.slug || g.id) && g.is_active !== false)
    .map((g: any) => ({
      url: `${BASE_URL}/gallery/${g.slug || g.id}`,
      lastModified: formatDate(g.updated_at || g.created_at),
      changeFrequency: 'weekly' as const,
      priority: g.is_featured ? 0.8 : 0.75,
    }));

  // ═══ تجميع وتنظيف ═══
  const allPages = [
    ...staticPages,
    ...servicePages,
    ...projectPages,
    ...blogPages,
    ...areaPages,
    ...galleryPages,
    ...categoryPages,
    ...tagPages,
    ...partnerPages,
    ...paginationPages,
  ];

  // إزالة المكررات
  const uniquePages = allPages.filter((page, index, self) => 
    index === self.findIndex(p => p.url === page.url)
  );

  // ترتيب حسب الأولوية (الأهم أولاً)
  uniquePages.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  // حد Google الأقصى
  const finalPages = uniquePages.slice(0, MAX_URLS_PER_SITEMAP);

  const duration = Date.now() - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('\n═══════════════════════════════════════════');
    console.log(`✅ Sitemap generated in ${duration}ms`);
    console.log('═══════════════════════════════════════════');
    console.log(`📊 Total URLs: ${finalPages.length} / ${uniquePages.length}`);
    console.log('───────────────────────────────────────────');
    console.log(`📄 Static:     ${staticPages.length}`);
    console.log(`🛠️  Services:   ${servicePages.length}`);
    console.log(`🏢 Projects:    ${projectPages.length}`);
    console.log(`📝 Blogs:       ${blogPages.length}`);
    console.log(`📍 Areas:       ${areaPages.length}`);
    console.log(`🖼️  Galleries:  ${galleryPages.length}`);
    console.log(`📂 Categories:  ${categoryPages.length}`);
    console.log(`🏷️  Tags:       ${tagPages.length}`);
    console.log(`🤝 Partners:    ${partnerPages.length}`);
    console.log(`📑 Pagination:  ${paginationPages.length}`);
    console.log('═══════════════════════════════════════════\n');
    
    if (uniquePages.length > MAX_URLS_PER_SITEMAP) {
      console.warn(`⚠️ Sitemap truncated: ${uniquePages.length - MAX_URLS_PER_SITEMAP} URLs removed`);
    }
  }

  return finalPages;
}

export const revalidate = 3600;