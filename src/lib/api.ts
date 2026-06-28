// src/lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ════════════════════════════════════════════
// 🎨 دالة مساعدة للحصول على رابط الصورة
// ════════════════════════════════════════════
export function getImageUrl(image: string | null | undefined): string {
  if (!image) return '';

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  if (image.startsWith('/storage')) {
    return `${backendUrl}${image}`;
  }

  if (image.startsWith('storage/')) {
    return `${backendUrl}/${image}`;
  }

  if (image.startsWith('blogs/')) {
    return `${backendUrl}/storage/${image}`;
  }

  return `${backendUrl}/storage/${image.replace(/^\/+/, '')}`;
}

// ════════════════════════════════════════════
// 🎨 استيراد DesignSettings من colors.ts
// ════════════════════════════════════════════
import type { DesignSettings } from './colors';

// ════════════════════════════════════════════
// 📋 TYPES
// ════════════════════════════════════════════
export interface HeroSlideDesign {
  title_color: string;
  subtitle_color: string;
  description_color: string;
  title_size: string;
  subtitle_size: string;
  description_size: string;
  title_weight: string;
  font_family: string;
  text_align: 'right' | 'center' | 'left';
  content_position: 'right' | 'center' | 'left';
  vertical_position: 'top' | 'center' | 'bottom';
  content_max_width: number;
  overlay_type: 'none' | 'solid' | 'gradient';
  overlay_color: string;
  overlay_opacity: number;
  button_bg_color: string;
  button_text_color: string;
  button_hover_color: string;
  transition_effect: 'fade' | 'slide' | 'zoom' | 'flip';
  enable_ken_burns: boolean;
  display_duration: number;
  show_decoration: boolean;
  decoration_color: string;
}

export interface ContactInfo {
  id: number;
  phone_1: string;
  phone_2: string | null;
  whatsapp: string | null;
  email_1: string;
  email_2: string | null;
  address_ar: string;
  address_en: string | null;
  working_days_ar: string;
  working_days_en: string | null;
  working_hours: string;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  map_embed_code: string | null;
  latitude: string | null;
  longitude: string | null;
}

// ════════════════════════════════════════════
// 📝 Blog Types
// ════════════════════════════════════════════
export interface BlogCategory {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  posts_count?: number;
}

export interface BlogTag {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  is_active?: boolean;
  posts_count?: number;
}

export interface Category {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
  image?: string | null;
  type: 'service' | 'project' | 'blog';
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

export interface CategoryPostsResponse {
  success: boolean;
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
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

export interface TagPostsResponse {
  success: boolean;
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  tag: Tag | null;
  message?: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
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
  category?: BlogCategory;
  tags?: BlogTag[];
  author?: BlogAuthor;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  message?: string;
}

export interface BlogFilters {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

// ════════════════════════════════════════════
// 💬 Testimonial Types
// ════════════════════════════════════════════
export interface Testimonial {
  id: number;
  client_name: string;
  client_position: string | null;
  client_company: string | null;
  client_image: string | null;
  client_photo?: string | null;
  content: string;
  content_ar?: string | null;
  excerpt: string | null;
  rating: number;
  stars_html: string;
  is_featured: boolean;
  status?: string | null;
  is_active?: boolean | null;
  project?: {
    id?: number;
    title_ar?: string;
    slug?: string;
  } | null;
  approved_at: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface TestimonialsApiResponse {
  success: boolean;
  data: Testimonial[];
  total: number;
  message?: string;
}

export interface TestimonialStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface SubmitTestimonialData {
  client_name: string;
  client_email: string;
  client_position?: string;
  client_company?: string;
  rating: number;
  content: string;
  agree_terms: boolean;
}

export interface SubmitTestimonialResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    status: string;
  };
  errors?: Record<string, string[]>;
}

// ════════════════════════════════════════════
// 🧭 Navigation Types
// ════════════════════════════════════════════
export interface NavItem {
  id: number;
  label: string;
  href: string;
  icon?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  parent_id?: number | null;
  children?: NavItem[];
}

export interface HeroSlide {
  id: number;
  subtitle_ar?: string;
  subtitle_en?: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  image: string;
  image_alt_ar?: string;
  image_alt_en?: string;
  button_text_ar: string;
  button_text_en?: string;
  button_link: string;
  show_phone_button: boolean;
  order: number;
  design?: HeroSlideDesign;
}

export interface Partner {
  id: number;
  name: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  logo: string;
  cover_image: string | null;
  website: string | null;
  description: string | null;
  is_featured: boolean;
  sort_order: number;
}

// ════════════════════════════════════════════
// 🛠️ Service Types
// ════════════════════════════════════════════
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
  title_en?: string | null;
  slug: string;
  excerpt_ar: string;
  excerpt_en?: string | null;
  content_ar?: string | null;
  content_en?: string | null;
  icon: string | null;
  icon_html?: string;
  image: string | null;
  image_url: string | null;
  background_image: string | null;
  background_image_url: string | null;
  og_image: string | null;
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

export interface ServicesApiResponse {
  success: boolean;
  data: Service[];
  total?: number;
  message?: string;
}

export interface ServiceApiResponse {
  success: boolean;
  data: Service;
  related?: Service[];
  message?: string;
}

// ════════════════════════════════════════════
// 🖼️ Gallery Types
// ════════════════════════════════════════════
export interface Gallery {
  id: number;
  title_ar: string;
  title_en: string | null;
  slug: string;
  category_ar: string;
  category_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  image: string;
  image_url?: string;
  image_alt_ar: string | null;
  image_alt_en: string | null;
  gallery_images: string[];
  project_link: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  image: string;
  image_url?: string;
  thumbnail: string | null;
  category: string;
  tags: string[] | null;
  location: string | null;
  project_date: string | null;
  client_name: string | null;
  order: number;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  created_at: string;
}

// ════════════════════════════════════════════
// 🏢 Project Types
// ════════════════════════════════════════════
export interface ProjectCategory {
  id: number;
  name_ar: string;
  slug: string;
}

export interface ProjectService {
  id: number;
  title_ar: string;
  slug: string;
}

export interface BeforeAfterImage {
  before: string | null;
  after: string | null;
  title?: string | null;
}

export type ProjectStatus = 'planned' | 'in_progress' | 'completed';

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
  area_sqm?: number | null;
  project_value?: string | null;
  duration?: string | null;
  duration_months?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  completion_date?: string | null;
  status: ProjectStatus;
  status_label?: string;
  status_color?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
  count?: number;
  message?: string;
}

export interface ProjectApiResponse {
  success: boolean;
  data: Project;
  related?: Project[];
  message?: string;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  category_id?: number;
  service_id?: number;
  city?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}

// ════════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════════

async function get<T>(path: string, revalidate = 60): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate },
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      console.warn(`⚠️ API ${path} returned ${res.status}`);
      return [] as unknown as T;
    }

    const json = await res.json();

    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T;
    }

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
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      console.warn(`⚠️ API ${path} returned ${res.status}`);
      return {} as T;
    }

    const json = await res.json();
    return json as T;
  } catch (e: any) {
    console.warn(`⚠️ API Error [${path}]:`, e.message);
    return {} as T;
  }
}

async function getProjectsResponse(
  path: string,
  revalidate = 60
): Promise<ProjectsApiResponse> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate },
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      console.warn(`⚠️ API ${path} returned ${res.status}`);
      return { success: false, data: [], message: 'فشل في جلب البيانات' };
    }

    const json = await res.json();

    if (json && typeof json === 'object' && 'success' in json) {
      return json as ProjectsApiResponse;
    }

    if (Array.isArray(json)) {
      return { success: true, data: json };
    }

    return { success: false, data: [], message: 'صيغة غير متوقعة' };
  } catch (e: any) {
    console.warn(`⚠️ API Error [${path}]:`, e.message);
    return { success: false, data: [], message: e.message };
  }
}

async function getProjectResponse(
  path: string,
  revalidate = 60
): Promise<ProjectApiResponse> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate },
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      console.warn(`⚠️ API ${path} returned ${res.status}`);
      return { success: false, data: {} as Project, message: 'فشل في جلب البيانات' };
    }

    const json = await res.json();

    if (json && typeof json === 'object' && 'success' in json) {
      return json as ProjectApiResponse;
    }

    return { success: true, data: json as Project };
  } catch (e: any) {
    console.warn(`⚠️ API Error [${path}]:`, e.message);
    return { success: false, data: {} as Project, message: e.message };
  }
}

async function getBlogListResponse(
  path: string,
  revalidate = 60
): Promise<BlogListResponse> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate },
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return {
        success: false,
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        message: 'فشل في جلب البيانات',
      };
    }

    const json = await res.json();

    if (json && typeof json === 'object') {
      if ('success' in json && 'data' in json) {
        const responseData = json.data;
        if (responseData && typeof responseData === 'object') {
          return {
            success:      json.success,
            data:         responseData.data     || responseData || [],
            current_page: responseData.current_page || json.current_page || 1,
            last_page:    responseData.last_page    || json.last_page    || 1,
            per_page:     responseData.per_page     || json.per_page     || 12,
            total:        responseData.total        || json.total        || 0,
            message:      json.message,
          };
        }
        return {
          success:      json.success,
          data:         Array.isArray(responseData) ? responseData : [],
          current_page: json.current_page || 1,
          last_page:    json.last_page    || 1,
          per_page:     json.per_page     || 12,
          total:        json.total        || 0,
          message:      json.message,
        };
      }

      if ('data' in json && Array.isArray(json.data)) {
        return {
          success:      true,
          data:         json.data,
          current_page: json.current_page || 1,
          last_page:    json.last_page    || 1,
          per_page:     json.per_page     || 12,
          total:        json.total        || 0,
        };
      }

      if (Array.isArray(json)) {
        return {
          success:      true,
          data:         json,
          current_page: 1,
          last_page:    1,
          per_page:     json.length,
          total:        json.length,
        };
      }
    }

    return {
      success: false,
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 0,
      message: 'صيغة غير متوقعة',
    };
  } catch (e: any) {
    console.warn(`⚠️ API Error [${path}]:`, e.message);
    return {
      success: false,
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 0,
      message: e.message,
    };
  }
}

function buildQueryString(filters?: ProjectFilters): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  if (filters.status)      params.append('status',      filters.status);
  if (filters.category_id) params.append('category_id', String(filters.category_id));
  if (filters.service_id)  params.append('service_id',  String(filters.service_id));
  if (filters.city)        params.append('city',        filters.city);
  if (filters.featured)    params.append('featured',    '1');
  if (filters.search)      params.append('search',      filters.search);
  if (filters.limit)       params.append('limit',       String(filters.limit));

  const query = params.toString();
  return query ? `?${query}` : '';
}

async function post<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.message || 'حدث خطأ في الإرسال');
    }

    return json as T;
  } catch (e: any) {
    console.error(`❌ POST Error [${path}]:`, e.message);
    throw e;
  }
}

// ════════════════════════════════════════════
// 🌐 API ENDPOINTS
// ════════════════════════════════════════════
export const api = {

  // ⚙️ Settings
  settings: () =>
    getFull<{ data: Record<string, string>; grouped: Record<string, Record<string, string>> }>(
      '/settings', 300
    ),
  setting: (key: string) =>
    get<{ key: string; value: string; group: string }>(`/settings/${key}`, 300),

  // 📞 Contact Info
  contactInfo: () => get<ContactInfo[]>('/contact-info', 3600),

  // 🎬 Hero Slides
  heroSlides: () => get<HeroSlide[]>('/hero-slides', 300),

  // 🧭 Navigation
  navigation:       () => get<NavItem[]>('/navigation',        3600),
  navigationFooter: () => get<NavItem[]>('/navigation/footer', 3600),
  navigationMobile: () => get<NavItem[]>('/navigation/mobile', 3600),

  // ════════════════════════════════════════════
  // 🛠️ Services
  // ════════════════════════════════════════════
  services:        () => get<Service[]>('/services',          300),
  featuredServices: () => get<Service[]>('/services/featured', 300),
  service:    (slug: string) => get<Service>(`/services/${slug}`,          300),
  relatedServices: (slug: string) => get<Service[]>(`/services/${slug}/related`, 300),
  servicesByCategory: (categoryId: number) =>
    get<Service[]>(`/services?category_id=${categoryId}`, 300),
  searchServices: (query: string) =>
    get<Service[]>(`/services?search=${encodeURIComponent(query)}`, 60),

  // ════════════════════════════════════════════
  // 🏢 Projects
  // ════════════════════════════════════════════
  projects: (filters?: ProjectFilters) =>
    getProjectsResponse(`/projects${buildQueryString(filters)}`, 300),

  featuredProjects: (limit: number = 6) =>
    getProjectsResponse(`/projects/featured?limit=${limit}`, 300),

  latestProjects: (limit: number = 6) =>
    getProjectsResponse(`/projects/latest?limit=${limit}`, 300),

  project: (slug: string) =>
    getProjectResponse(`/projects/${slug}`, 300),

  searchProjects: (query: string) =>
    getProjectsResponse(`/projects?search=${encodeURIComponent(query)}`, 60),

  projectsByCategory: (categoryId: number, limit?: number) =>
    getProjectsResponse(
      `/projects?category_id=${categoryId}${limit ? `&limit=${limit}` : ''}`,
      300
    ),

  projectsByService: (serviceId: number, limit?: number) =>
    getProjectsResponse(
      `/projects?service_id=${serviceId}${limit ? `&limit=${limit}` : ''}`,
      300
    ),

  // ════════════════════════════════════════════
  // 📰 Blog
  // ════════════════════════════════════════════
  blogs: (
    page: number = 1,
    perPage: number = 12,
    filters?: { category?: string; tag?: string; search?: string; featured?: boolean }
  ) => {
    const params = new URLSearchParams();
    params.append('page',     String(page));
    params.append('per_page', String(perPage));
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tag)      params.append('tag',      filters.tag);
    if (filters?.search)   params.append('search',   filters.search);
    if (filters?.featured) params.append('featured', '1');
    const query = params.toString();
    return getBlogListResponse(`/blogs${query ? `?${query}` : ''}`, 60);
  },

  latestBlogs:   (limit: number = 6) => get<BlogPost[]>(`/blogs/latest?limit=${limit}`,   60),
  featuredBlogs: (limit: number = 3) => get<BlogPost[]>(`/blogs/featured?limit=${limit}`, 60),

  // ✅ بدون view counter - يُستدعى من Client Side فقط
  blog: (slug: string) => get<BlogPost>(`/blogs/${slug}`, 60),

  relatedBlogs: (slug: string, limit: number = 4) =>
    get<BlogPost[]>(`/blogs/${slug}/related?limit=${limit}`, 60),

  searchBlogs: (query: string, limit: number = 20) =>
    getBlogListResponse(
      `/blogs?search=${encodeURIComponent(query)}&per_page=${limit}`,
      0
    ),

  blogsByCategory: (slug: string, page: number = 1, perPage: number = 12) =>
    getBlogListResponse(
      `/blogs?category=${slug}&page=${page}&per_page=${perPage}`,
      60
    ),

  // 📂 Blog Categories
  blogCategories: () => get<BlogCategory[]>('/categories', 3600),
  blogCategory:   (slug: string) => get<BlogCategory>(`/categories/${slug}`, 3600),

  // ════════════════════════════════════════════
  // 🏷️ Tags
  // ════════════════════════════════════════════
  tags: async (): Promise<Tag[]> => {
    const response = await fetch(`${API}/tags?per_page=100`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  },

  tag: async (slug: string): Promise<Tag | null> => {
    const response = await fetch(`${API}/tags/${slug}`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  tagPosts: async (
    slug: string,
    page: number = 1,
    perPage: number = 12
  ): Promise<TagPostsResponse> => {
    const response = await fetch(
      `${API}/tags/${slug}/posts?page=${page}&per_page=${perPage}`,
      { next: { revalidate: 300 }, headers: { 'Accept': 'application/json' } }
    );
    const data = await response.json();
    return {
      success:      data.success      || false,
      data:         data.data         || [],
      current_page: data.current_page || page,
      last_page:    data.last_page    || 1,
      per_page:     data.per_page     || perPage,
      total:        data.total        || 0,
      tag:          data.tag          || null,
      message:      data.message,
    };
  },

  popularTags: async (limit: number = 20): Promise<Tag[]> => {
    const response = await fetch(`${API}/tags/popular?limit=${limit}`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  },

  // ════════════════════════════════════════════
  // 📂 Advanced Categories
  // ════════════════════════════════════════════
  getCategories: async (type?: string): Promise<Category[]> => {
    const url = type ? `/categories?type=${type}` : '/categories';
    const response = await fetch(`${API}${url}`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  },

  getMainCategories: async (type?: string): Promise<Category[]> => {
    const url = type
      ? `/categories?type=${type}&parent_only=true`
      : '/categories?parent_only=true';
    const response = await fetch(`${API}${url}`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    const response = await fetch(`${API}/categories/${slug}`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  getCategoryWithChildren: async (slug: string): Promise<Category | null> => {
    const response = await fetch(`${API}/categories/${slug}?with=children`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  getCategoryPosts: async (
    slug: string,
    page: number = 1,
    perPage: number = 12
  ): Promise<CategoryPostsResponse> => {
    const response = await fetch(
      `${API}/categories/${slug}/posts?page=${page}&per_page=${perPage}`,
      { next: { revalidate: 300 }, headers: { 'Accept': 'application/json' } }
    );
    const data = await response.json();
    return {
      success:      data.success      || false,
      data:         data.data         || [],
      current_page: data.current_page || page,
      last_page:    data.last_page    || 1,
      per_page:     data.per_page     || perPage,
      total:        data.total        || 0,
    };
  },

  getCategoryServices: async (slug: string): Promise<Service[]> => {
    const response = await fetch(`${API}/categories/${slug}/services`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  },

  getCategoryProjects: async (slug: string): Promise<Project[]> => {
    const response = await fetch(`${API}/categories/${slug}/projects`, {
      next:    { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  },

  categories: (type?: string) => {
  const url = type ? `/categories?type=${type}` : '/categories';
  return get<Category[]>(url, 3600);
},
  // ════════════════════════════════════════════
  // 📍 Areas
  // ════════════════════════════════════════════
  areas: () => get<any[]>('/areas', 3600),
  area:  (slug: string) => get<any>(`/areas/${slug}`, 86400),

  // ════════════════════════════════════════════
  // 🖼️ Gallery
  // ════════════════════════════════════════════
  galleries:              () => get<Gallery[]>('/galleries',           300),
  galleryFeatured:        () => get<Gallery[]>('/galleries/featured',  300),
  gallery:     (slug: string) => get<Gallery>(`/galleries/${slug}`,    300),
  galleryImages:          () => get<GalleryImage[]>('/gallery-images',           300),
  galleryImagesFeatured:  () => get<GalleryImage[]>('/gallery-images/featured',  300),
  galleryImagesByCategory: (category: string) =>
    get<GalleryImage[]>(`/gallery-images/category/${category}`, 300),
  galleryImage: (id: number) => get<GalleryImage>(`/gallery-images/${id}`, 300),

  // ════════════════════════════════════════════
  // 💬 Testimonials
  // ════════════════════════════════════════════
  testimonials:         () => get<Testimonial[]>('/testimonials',          300),
  featuredTestimonials: () => get<Testimonial[]>('/testimonials/featured', 300),
  testimonial: (id: number) => get<Testimonial>(`/testimonials/${id}`,     300),
  testimonialsStats:    () => get<TestimonialStats>('/testimonials/stats', 3600),
  submitTestimonial: (data: SubmitTestimonialData) =>
    post<SubmitTestimonialResponse>('/testimonials', data),

  // ════════════════════════════════════════════
  // 🤝 Partners
  // ════════════════════════════════════════════
  partners:         () => get<Partner[]>('/partners',          3600),
  featuredPartners: () => get<Partner[]>('/partners/featured', 3600),
  partner: (slug: string) => get<Partner>(`/partners/${slug}`, 3600),

  // ════════════════════════════════════════════
  // ❓ FAQs
  // ════════════════════════════════════════════
  faqs:             () => get<any[]>('/faqs', 3600),
  faqsByCategory: (categoryId: number) =>
    get<any[]>(`/faqs/category/${categoryId}`, 3600),

  // ════════════════════════════════════════════
  // 📄 About
  // ════════════════════════════════════════════
  about: () => get<any>('/about', 3600),

  // ════════════════════════════════════════════
  // 📤 POST Requests
  // ════════════════════════════════════════════
  submitContact: (data: unknown) => post('/contact',              data),
  submitQuote:   (data: unknown) => post('/quote-request',        data),
  subscribe:     (data: unknown) => post('/newsletter/subscribe', data),

  // ════════════════════════════════════════════
  // 🔍 Search
  // ════════════════════════════════════════════
  search: (query: string) =>
    get<any>(`/search?q=${encodeURIComponent(query)}`, 0),

  // ════════════════════════════════════════════
  // 🤖 SEO & Sitemap
  // ════════════════════════════════════════════
  getRobots:       () => get<any>('/robots',        86400),
  getSitemap:      () => get<any>('/sitemap',       3600),
  getSitemapPages: () => get<any>('/sitemap/pages', 3600),
};

// ════════════════════════════════════════════
// 🎨 PROJECT HELPERS
// ════════════════════════════════════════════

export function getProjectStatusInfo(status: ProjectStatus): {
  label: string;
  color: string;
  icon: string;
} {
  const statusMap: Record<string, { label: string; color: string; icon: string }> = {
    planned: {
      label: 'مخطط',
      color: '#64748b',
      icon:  '📅',
    },
    in_progress: {
      label: 'قيد التنفيذ',
      color: '#ed8936',
      icon:  '🔨',
    },
    completed: {
      label: 'مكتمل',
      color: '#10b981',
      icon:  '✅',
    },
  };

  return statusMap[status] ?? statusMap.completed;
}

export function getProjectImage(project: Project): string | null {
  return (
    project.main_image ??
    project.cover_image ??
    project.thumbnail ??
    (Array.isArray(project.gallery) && project.gallery.length > 0
      ? project.gallery[0]
      : null)
  );
}

export function formatArea(area: number | null | undefined): string {
  if (!area) return '';
  return `${Number(area).toLocaleString('ar-SA')} م²`;
}

export function formatDuration(months: number | null | undefined): string {
  if (!months) return '';
  if (months < 12) return `${months} شهر`;
  const years          = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0)
    return `${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
  return `${years} ${years === 1 ? 'سنة' : 'سنوات'} و ${remainingMonths} شهر`;
}

export function hasGallery(project: Project): boolean {
  return Array.isArray(project.gallery) && project.gallery.length > 0;
}

export function getGalleryCount(project: Project): number {
  return Array.isArray(project.gallery) ? project.gallery.length : 0;
}

export function getServiceImage(service: Service): string | null {
  return service.image ?? service.background_image ?? service.og_image ?? null;
}

export function hasVideo(item: Service | Project): boolean {
  return (
    !!item.video_url ||
    !!('embed_video_url' in item && item.embed_video_url)
  );
}

export function formatBlogDate(date: string | undefined): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('ar-SA', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    });
  } catch {
    return '';
  }
}

export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// إعادة تصدير DesignSettings
export type { DesignSettings };