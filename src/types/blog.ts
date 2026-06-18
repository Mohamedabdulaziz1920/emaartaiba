// frontend/src/types/blog.ts

export interface Category {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description?: string;
  posts_count?: number;
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

export interface TagsListResponse {
  success: boolean;
  data: Tag[];
  total: number;
  message?: string;
}

export interface TagPostsResponse {
  success: boolean;
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  tag: Tag;
  message?: string;
}

export interface Author {
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
  
  // SEO Fields
  meta_title_ar?: string;
  meta_description_ar?: string;
  meta_keywords?: string[];
  
  // Relations
  category?: Category;
  tags?: Tag[];
  author?: Author;
}

export interface BlogListResponse {
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

export interface TagsListResponse {
  success: boolean;
  data: Tag[];
  total: number;
  message?: string;
}

export interface TagPostsResponse {
  success: boolean;
  data: BlogPost[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  tag: Tag;
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