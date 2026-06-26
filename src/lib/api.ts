// src/lib/api.ts

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════

export interface NavItem {
  id: number;
  label: string;
  href: string;
  is_active: boolean;
  sort_order: number;
  children: NavItem[];
}

export interface Category {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description?: string;
  type_label: string;
  parent_id?: number | null;
  parent?: {
    id: number;
    name_ar: string;
    slug: string;
  };
  children?: Category[];
  sort_order: number;
  is_active: boolean;
  meta_title_ar?: string;
  meta_title_en?: string;
  meta_description_ar?: string;
  meta_description_en?: string;
  stats?: {
    posts: number;
    services: number;
    projects: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Tag {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  posts_count?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Partner {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  logo: string | null;
  website?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface HeroSlide {
  id: number;
  title_ar: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  description_ar?: string;
  description_en?: string;
  image: string | null;
  image_alt_ar?: string;
  image_alt_en?: string;
  button_text_ar?: string;
  button_text_en?: string;
  button_link?: string;
  badge?: string;
  show_phone_button?: boolean;
  is_active: boolean;
  sort_order: number;
  design?: {
    title_color?: string;
    subtitle_color?: string;
    description_color?: string;
    title_size?: string;
    subtitle_size?: string;
    description_size?: string;
    title_weight?: string;
    font_family?: string;
    text_align?: string;
    content_position?: string;
    vertical_position?: string;
    content_max_width?: number;
    overlay_type?: string;
    overlay_color?: string;
    overlay_opacity?: number;
    button_bg_color?: string;
    button_text_color?: string;
    button_hover_color?: string;
    transition_effect?: string;
    enable_ken_burns?: boolean;
    display_duration?: number;
    show_decoration?: boolean;
    decoration_color?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_email?: string;
  client_photo?: string | null;
  client_image?: string | null;
  client_position?: string | null;
  client_company?: string | null;
  content_ar: string;
  content_en?: string;
  content?: string;
  excerpt?: string;
  rating: number;
  stars_html?: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  is_active: boolean;
  project_id?: number | null;
  project?: {
    id: number;
    title_ar: string;
    slug: string;
  };
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogAuthor {
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  url?: string;
}

export interface BlogTag {
  id: number;
  name_ar: string;
  slug: string;
}

export interface BlogCategory {
  id: number;
  name_ar: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title_ar: string;
  title_en?: string;
  slug: string;
  excerpt_ar: string;
  excerpt_en?: string;
  content_ar: string;
  content_en?: string;
  featured_image: string | null;
  gallery: string[] | null;
  reading_time: number;
  views_count: number;
  is_active: boolean;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_title_ar?: string;
  meta_description_ar?: string;
  meta_keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  image_alt?: string;
  image_title?: string;
  category?: BlogCategory;
  tags?: BlogTag[];
  author?: BlogAuthor;
}

export interface ServiceCategory {
  id: number;
  name_ar: string;
  slug: string;
}

export interface ServiceTag {
  id: number;
  name_ar: string;
  slug: string;
}

export interface Service {
  id: number;
  title_ar: string;
  title_en?: string;
  slug: string;
  excerpt_ar: string;
  excerpt_en?: string;
  content_ar: string;
  content_en?: string;
  image: string | null;
  icon: string | null;
  image_url: string | null;
  og_image_url: string | null;
  gallery: string[] | null;
  gallery_images?: string[] | null;
  video_url: string | null;
  embed_video_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  category: ServiceCategory | null;
  tags: ServiceTag[];
  meta_title_ar?: string | null;
  meta_description_ar?: string | null;
  meta_keywords?: string[] | null;
  canonical_url?: string | null;
  robots?: string;
  views_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface BeforeAfterImage {
  before: string | null;
  after: string | null;
  title?: string | null;
}

export interface ProjectCategory {
  id: number;
  name_ar: string;
  slug?: string;
}

export interface ProjectService {
  id: number;
  title_ar: string;
  slug?: string;
}

export interface Project {
  id: number;
  title_ar: string;
  title_en?: string | null;
  slug: string;
  excerpt_ar?: string | null;
  excerpt_en?: string | null;
  content_ar?: string | null;
  content_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  main_image: string | null;
  thumbnail?: string | null;
  cover_image?: string | null;
  image_alt?: string | null;
  image_title?: string | null;
  gallery?: string[] | null;
  gallery_metadata?: any;
  before_after_images?: BeforeAfterImage[] | null;
  video_url?: string | null;
  virtual_tour_url?: string | null;
  client_name?: string | null;
  city?: string | null;
  location_ar?: string | null;
  location_en?: string | null;
  area_sqm?: number | string | null;
  project_value?: string | null;
  duration?: string | null;
  duration_months?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  completion_date?: string | null;
  status?: 'planned' | 'in_progress' | 'completed' | string;
  status_label?: string;
  is_featured: boolean;
  is_active?: boolean;
  views_count?: number;
  sort_order: number;
  category: ProjectCategory | null;
  service?: ProjectService | null;
  meta_title_ar?: string | null;
  meta_title_en?: string | null;
  meta_description_ar?: string | null;
  meta_description_en?: string | null;
  meta_keywords?: string[] | null;
  schema_data?: any;
  canonical_url?: string | null;
  og_image?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ════════════════════════════════════════════════
// 🛠️ API Functions
// ════════════════════════════════════════════════

async function get<T>(path: string, revalidate = 60): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      console.warn(`⚠️ API ${path} returned ${res.status}`);
      return [] as unknown as T;
    }

    const json = await res.json();
    return json as T;
  } catch (e: any) {
    console.warn(`⚠️ API Error [${path}]:`, e.message);
    return [] as unknown as T;
  }
}

async function getFull<T>(path: string, revalidate = 60): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      console.warn(`⚠️ API ${path} returned ${res.status}`);
      return {} as T;
    }

    return await res.json();
  } catch (e: any) {
    console.warn(`⚠️ API Error [${path}]:`, e.message);
    return {} as T;
  }
}

// ════════════════════════════════════════════════
// 🚀 API Object
// ════════════════════════════════════════════════

export const api = {
  // ─── Navigation ──────────────────────────────
  navigation: () => get<NavItem[]>('/navigation'),

  // ─── Settings ────────────────────────────────
  settings: () => getFull<any>('/settings'),
  designSettings: () => getFull<any>('/design-settings'),

  // ─── About ────────────────────────────────────
  about: () => getFull<any>('/about'),

  // ─── Hero ────────────────────────────────────
  heroSlides: () => get<any[]>('/hero-slides'),

  // ─── Services ────────────────────────────────
  services: () => getFull<ServicesApiResponse>('/services'),
  featuredServices: () => get<Service[]>('/services/featured'),
  latestServices: () => get<Service[]>('/services/latest'),
  service: (slug: string) => getFull<{ success: boolean; data: Service }>(`/services/${slug}`),
  relatedServices: (slug: string) => get<Service[]>(`/services/${slug}/related`),
  serviceByTag: (tagSlug: string) => get<Service[]>(`/services/by-tag/${tagSlug}`),

  // ─── Projects ────────────────────────────────
  projects: () => getFull<ProjectsApiResponse>('/projects'),
  featuredProjects: () => get<Project[]>('/projects/featured'),
  latestProjects: () => get<Project[]>('/projects/latest'),
  project: (slug: string) => getFull<{ success: boolean; data: Project; related?: Project[] }>(`/projects/${slug}`),

  // ─── Blogs ────────────────────────────────────
  blogs: (page = 1, perPage = 9, filters = { category: '', search: '', tag: '' }) =>
    getFull<BlogListResponse>(
      `/blogs?page=${page}&perPage=${perPage}${filters.category ? `&category=${filters.category}` : ''}${filters.search ? `&search=${encodeURIComponent(filters.search)}` : ''}${filters.tag ? `&tag=${encodeURIComponent(filters.tag)}` : ''}`
    ),
  latestBlogs: (limit = 6) => get<BlogPost[]>(`/blogs/latest?limit=${limit}`),
  featuredBlogs: () => get<BlogPost[]>('/blogs/featured'),
  blog: (slug: string) => getFull<{ success: boolean; data: BlogPost }>(`/blogs/${slug}`),
  blogByTag: (tagSlug: string) => get<BlogPost[]>(`/blogs/tag/${tagSlug}`),

  // ─── Categories ───────────────────────────────
  categories: () => get<Category[]>('/categories'),
  blogCategories: () => get<Category[]>('/categories?type=blog'),
  getCategoryBySlug: (slug: string) => getFull<{ success: boolean; data: Category }>(`/categories/${slug}`),
  getCategoryPosts: (slug: string, page = 1, perPage = 9) =>
    getFull<BlogListResponse>(`/categories/${slug}/posts?page=${page}&perPage=${perPage}`),
  getCategoryServices: (slug: string) => get<Service[]>(`/categories/${slug}/services`),
  getCategoryProjects: (slug: string) => get<Project[]>(`/categories/${slug}/projects`),

  // ─── Tags ────────────────────────────────────
  tags: () => get<Tag[]>('/tags'),
  popularTags: () => get<Tag[]>('/tags/popular'),
  tag: (slug: string) => getFull<{ success: boolean; data: Tag }>(`/tags/${slug}`),

  // ─── Partners ────────────────────────────────
  partners: () => get<Partner[]>('/partners'),
  featuredPartners: () => get<Partner[]>('/partners/featured'),

  // ─── Testimonials ────────────────────────────
  testimonials: () => get<Testimonial[]>('/testimonials'),
  featuredTestimonials: () => get<Testimonial[]>('/testimonials/featured'),
  submitTestimonial: (data: any) =>
    fetch(`${API}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // ─── FAQs ────────────────────────────────────
  faqs: () => get<any[]>('/faqs'),

  // ─── Gallery ──────────────────────────────────
  galleryImages: () => get<any[]>('/galleries'),
  featuredGallery: () => get<any[]>('/galleries/featured'),

  // ─── Search ──────────────────────────────────
  search: (query: string) => get<{ data: any[] }>(`/search?q=${encodeURIComponent(query)}`),

  // ─── Areas ────────────────────────────────────
  areas: () => get<any[]>('/areas'),
  area: (slug: string) => getFull<{ data: any }>(`/areas/${slug}`),

  // ─── Contact ──────────────────────────────────
  contact: (data: any) =>
    fetch(`${API}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  submitContact: (data: any) =>
    fetch(`${API}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  contactInfo: () => getFull<any>('/contact-info'),
  quoteRequest: (data: any) =>
    fetch(`${API}/quote-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  newsletter: (data: any) =>
    fetch(`${API}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};

// ════════════════════════════════════════════════
// 📦 Response Types
// ════════════════════════════════════════════════

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ServicesApiResponse {
  success: boolean;
  data: Service[];
  count?: number;
}

export interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
  count?: number;
}

export interface CategoryPostsResponse {
  success: boolean;
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface TagPostsResponse {
  success: boolean;
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ════════════════════════════════════════════════
// 🛠️ Project Helpers
// ════════════════════════════════════════════════

export function getProjectStatusInfo(status?: string): {
  label: string;
  icon: string;
  color: string;
} {
  switch (status) {
    case 'completed':
      return { label: 'مكتمل', icon: '✅', color: '#10b981' };
    case 'in_progress':
      return { label: 'قيد التنفيذ', icon: '🔨', color: '#ed8936' };
    case 'planned':
      return { label: 'مخطط', icon: '📅', color: '#64748b' };
    case 'paused':
      return { label: 'متوقف مؤقتاً', icon: '⏸️', color: '#f59e0b' };
    case 'cancelled':
      return { label: 'ملغي', icon: '❌', color: '#ef4444' };
    default:
      return { label: 'نشط', icon: '🟢', color: '#3b82f6' };
  }
}

export function formatArea(area?: number | string | null): string {
  if (!area) return 'غير محدد';
  const num = typeof area === 'string' ? parseFloat(area) : area;
  if (isNaN(num)) return 'غير محدد';
  return `${num.toLocaleString('ar-SA')} م²`;
}

export function getProjectImage(project: Project): string {
  if (!project) return '';
  return project.main_image || project.cover_image || project.thumbnail || '';
}
