// src/app/sitemap.ts
import { MetadataRoute } from 'next';

// ═══════════════════════════════════════════════════
// ⚙️ Constants
// ═══════════════════════════════════════════════════
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const CONFIG = {
  MAX_URLS_PER_SITEMAP: 45000,
  MAX_BLOG_PAGINATION_PAGES: 10,
  DEFAULT_PRIORITY: 0.7,
  DEFAULT_FREQUENCY: 'monthly' as const,
  CACHE_DURATION: 3600, // 1 ساعة
} as const;

export const revalidate = CONFIG.CACHE_DURATION;

// ═══════════════════════════════════════════════════
// 🎯 Types
// ═══════════════════════════════════════════════════
type ChangeFrequency = 
  | 'always' 
  | 'hourly' 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly' 
  | 'never';

interface PageConfig {
  priority: number;
  frequency: ChangeFrequency;
}

interface DynamicItem {
  slug: string;
  is_active?: boolean;
  is_featured?: boolean;
  updated_at?: string;
  created_at?: string;
  published_at?: string;
}

// ═══════════════════════════════════════════════════
// 🛠️ Helpers
// ═══════════════════════════════════════════════════

/**
 * ✅ جلب البيانات من API مع معالجة أخطاء متقدمة
 */
async function fetchData<T = any>(path: string): Promise<T[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 ثواني timeout

    const res = await fetch(`${API}${path}`, {
      next: { revalidate: CONFIG.CACHE_DURATION },
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`⚠️ Sitemap fetch failed [${path}]: ${res.status}`);
      return [];
    }

    const json = await res.json();

    // ✅ دعم بنى متعددة للـ response
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.data?.data)) return json.data.data;
    if (Array.isArray(json.data?.items)) return json.data.items;
    if (Array.isArray(json.data?.results)) return json.data.results;
    if (Array.isArray(json.items)) return json.items;
    if (Array.isArray(json.results)) return json.results;

    return [];
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`⏱️ Sitemap timeout [${path}]`);
    } else {
      console.error(`❌ Sitemap fetch error [${path}]:`, error.message);
    }
    return [];
  }
}

/**
 * ✅ تنسيق التاريخ بشكل آمن - لا يعطي تواريخ مستقبلية
 */
function formatDate(date: any): Date {
  if (!date) return new Date();
  
  try {
    const parsed = new Date(date);
    
    // ✅ التحقق من صحة التاريخ
    if (isNaN(parsed.getTime())) return new Date();
    
    // ✅ لا نسمح بتواريخ مستقبلية
    const now = new Date();
    return parsed > now ? now : parsed;
  } catch {
    return new Date();
  }
}

/**
 * ✅ التحقق من صحة الـ slug
 */
function isValidSlug(slug: any): slug is string {
  return typeof slug === 'string' && 
         slug.length > 0 && 
         slug.length < 200 &&
         !/[<>"']/g.test(slug);
}

/**
 * ✅ فلترة العناصر النشطة فقط
 */
function filterActiveItems<T extends DynamicItem>(items: T[]): T[] {
  return items.filter(item => 
    item && 
    isValidSlug(item.slug) && 
    item.is_active !== false
  );
}

/**
 * ✅ الحصول على أولوية وتردد الصفحة
 */
function getPagePriority(path: string): PageConfig {
  const priorities: Record<string, PageConfig> = {
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
    '/testimonials/add': { priority: 0.5, frequency: 'monthly' },
  };
  
  return priorities[path] || { 
    priority: CONFIG.DEFAULT_PRIORITY, 
    frequency: CONFIG.DEFAULT_FREQUENCY 
  };
}

/**
 * ✅ حساب أولوية ديناميكية للمحتوى
 */
function calculateDynamicPriority(item: any, basePriority: number): number {
  let priority = basePriority;
  
  // ✅ زيادة الأولوية للمحتوى المميز
  if (item.is_featured) priority += 0.05;
  
  // ✅ زيادة الأولوية للمحتوى الحديث
  if (item.published_at || item.created_at) {
    const created = new Date(item.published_at || item.created_at);
    const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSince < 7) priority += 0.05;      // أقل من أسبوع
    else if (daysSince < 30) priority += 0.03; // أقل من شهر
  }
  
  // ✅ زيادة الأولوية للمحتوى الشائع
  if (item.views_count > 1000) priority += 0.02;
  
  // ✅ الحد الأقصى 1.0
  return Math.min(priority, 1.0);
}

// ═══════════════════════════════════════════════════
// 📄 Blog Pagination
// ═══════════════════════════════════════════════════
async function generateBlogPaginationPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API}/blogs?per_page=1`, {
      next: { revalidate: CONFIG.CACHE_DURATION },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const totalCount: number = 
      json?.total || 
      json?.data?.total || 
      json?.meta?.total || 
      0;

    if (totalCount === 0) return [];

    const postsPerPage = 12;
    const totalPages = Math.ceil(totalCount / postsPerPage);
    const pages: MetadataRoute.Sitemap = [];

    for (let i = 2; i <= Math.min(totalPages, CONFIG.MAX_BLOG_PAGINATION_PAGES); i++) {
      pages.push({
        url: `${BASE_URL}/blog?page=${i}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7 - (i * 0.05), // أولوية تنقص مع كل صفحة
      });
    }

    return pages;
  } catch (error) {
    console.error('❌ Blog pagination error:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════
// 🏷️ Generate Dynamic Category Pages
// ═══════════════════════════════════════════════════
async function generateCategoryPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const categories = await fetchData('/categories');
    return filterActiveItems(categories).map((cat: any) => ({
      url: `${BASE_URL}/categories/${cat.slug}`,
      lastModified: formatDate(cat.updated_at || cat.created_at),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.75,
    }));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════
// 🏷️ Generate Dynamic Tag Pages
// ═══════════════════════════════════════════════════
async function generateTagPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const tags = await fetchData('/tags');
    return filterActiveItems(tags)
      .slice(0, 100) // ✅ حد أقصى 100 tag
      .map((tag: any) => ({
        url: `${BASE_URL}/tags/${tag.slug}`,
        lastModified: formatDate(tag.updated_at || tag.created_at),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.65,
      }));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════
// 📍 Generate Dynamic Area Pages
// ═══════════════════════════════════════════════════
async function generateAreaPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const areas = await fetchData('/areas');
    return filterActiveItems(areas).map((area: any) => ({
      url: `${BASE_URL}/areas/${area.slug}`,
      lastModified: formatDate(area.updated_at || area.created_at),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════
// 🗺️ Main Sitemap Generator
// ═══════════════════════════════════════════════════
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const startTime = Date.now();
  
  console.log('\n🚀 Generating sitemap...');

  try {
    // ─── جلب كل البيانات بالتوازي ───
    const [
      services, 
      projects, 
      blogs,
      categoryPages,
      tagPages,
      areaPages,
      paginationPages,
    ] = await Promise.all([
      fetchData('/services'),
      fetchData('/projects'),
      fetchData('/blogs/latest?limit=1000'),
      generateCategoryPages(),
      generateTagPages(),
      generateAreaPages(),
      generateBlogPaginationPages(),
    ]);

    const now = new Date();

    // ═══ الصفحات الثابتة ═══
    const staticPaths = [
      '', '/about', '/services', '/projects', '/blog',
      '/categories', '/tags', '/areas', '/faq', '/contact', 
      '/gallery', '/partners', '/testimonials', '/testimonials/add',
      '/privacy', '/terms'
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

    // ═══ صفحات الخدمات ═══
    const servicePages: MetadataRoute.Sitemap = filterActiveItems(services)
      .map((s: any) => ({
        url: `${BASE_URL}/services/${s.slug}`,
        lastModified: formatDate(s.updated_at || s.created_at),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: calculateDynamicPriority(s, 0.85),
      }));

    // ═══ صفحات المشاريع ═══
    const projectPages: MetadataRoute.Sitemap = filterActiveItems(projects)
      .map((p: any) => ({
        url: `${BASE_URL}/projects/${p.slug}`,
        lastModified: formatDate(p.updated_at || p.created_at),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: calculateDynamicPriority(p, 0.85),
      }));

    // ═══ صفحات المدونة ═══
    const blogPages: MetadataRoute.Sitemap = filterActiveItems(blogs)
      .map((b: any) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: formatDate(b.updated_at || b.published_at || b.created_at),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: calculateDynamicPriority(b, 0.8),
      }));

    // ═══ تجميع كل الصفحات ═══
    const allPages = [
      ...staticPages,
      ...servicePages,
      ...projectPages,
      ...blogPages,
      ...categoryPages,
      ...tagPages,
      ...areaPages,
      ...paginationPages,
    ];

    // ═══ إزالة المكررات ═══
    const uniquePages = allPages.filter((page, index, self) => 
      index === self.findIndex(p => p.url === page.url)
    );

    // ═══ ترتيب حسب الأولوية ═══
    uniquePages.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // ═══ تطبيق الحد الأقصى ═══
    const finalPages = uniquePages.slice(0, CONFIG.MAX_URLS_PER_SITEMAP);

    const duration = Date.now() - startTime;
    
    // ═══ سجلات الإحصائيات ═══
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   🗺️  SITEMAP GENERATION COMPLETE        ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║ ⏱️  Duration:      ${String(duration + 'ms').padEnd(22)} ║`);
    console.log(`║ 📄 Static Pages:  ${String(staticPages.length).padEnd(22)} ║`);
    console.log(`║ 🛠️  Services:      ${String(servicePages.length).padEnd(22)} ║`);
    console.log(`║ 🏗️  Projects:      ${String(projectPages.length).padEnd(22)} ║`);
    console.log(`║ 📰 Blog Posts:    ${String(blogPages.length).padEnd(22)} ║`);
    console.log(`║ 📂 Categories:    ${String(categoryPages.length).padEnd(22)} ║`);
    console.log(`║ 🏷️  Tags:          ${String(tagPages.length).padEnd(22)} ║`);
    console.log(`║ 📍 Areas:         ${String(areaPages.length).padEnd(22)} ║`);
    console.log(`║ 📚 Pagination:    ${String(paginationPages.length).padEnd(22)} ║`);
    console.log(`║ 📊 Total URLs:    ${String(finalPages.length).padEnd(22)} ║`);
    console.log('╚══════════════════════════════════════════╝\n');

    return finalPages;
    
  } catch (error) {
    console.error('❌ Fatal sitemap error:', error);
    
    // ✅ في حالة الفشل التام، أرجع الصفحات الثابتة على الأقل
    const fallbackPages: MetadataRoute.Sitemap = [
      '', '/about', '/services', '/projects', '/blog', '/contact'
    ].map(path => ({
      url: `${BASE_URL}${path || '/'}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.8,
    }));
    
    return fallbackPages;
  }
}