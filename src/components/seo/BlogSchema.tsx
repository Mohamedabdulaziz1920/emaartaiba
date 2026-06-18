// src/components/seo/BlogSchema.tsx
import type { SiteSettings } from '@/lib/settings';
import { toStr, toInt, buildImageUrl, stripHtml } from '@/lib/typeSafe';

// ════════════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════════════
interface BlogAuthor {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  url?: string;
}

interface BlogTag {
  id?: number;
  name_ar: string;
  name_en?: string;
  slug: string;
}

interface BlogCategory {
  id?: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description?: string;
}

interface BlogData {
  id?: number;
  title_ar: string;
  title_en?: string;
  excerpt_ar?: string;
  excerpt_en?: string;
  slug: string;
  featured_image?: string | null;
  gallery?: string[] | null;
  published_at?: string;
  updated_at?: string;
  created_at?: string;
  reading_time?: number;
  views_count?: number;
  content_ar?: string;
  content_en?: string;
  category?: BlogCategory | null;
  tags?: BlogTag[];
  author?: BlogAuthor;
  meta_title_ar?: string;
  meta_description_ar?: string;
  meta_keywords?: string[];
  is_featured?: boolean;
}

interface Props {
  blog: BlogData;
  settings?: SiteSettings;
  /** للمقالات الذات صلة (لتحسين Linking) */
  relatedBlogs?: Array<{ title_ar: string; slug: string; featured_image?: string }>;
  /** للتعليقات (إذا كانت موجودة) */
  commentsCount?: number;
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════

/**
 * حساب عدد الكلمات بدقة
 */
function calculateWordCount(content?: string): number {
  if (!content) return 0;
  const cleanText = content
    .replace(/<[^>]*>/g, ' ')       // إزالة HTML tags
    .replace(/&nbsp;/g, ' ')         // إزالة &nbsp;
    .replace(/[^\u0600-\u06FF\u0750-\u077F\s\w]/g, ' ')  // إبقاء العربية والإنجليزية فقط
    .replace(/\s+/g, ' ')
    .trim();
  
  if (!cleanText) return 0;
  return cleanText.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * حساب وقت القراءة بدقة (للعربية والإنجليزية)
 */
function calculateReadingTime(wordCount: number, customReadingTime?: number): number {
  if (customReadingTime && customReadingTime > 0) return customReadingTime;
  // 200 كلمة في الدقيقة للعربية
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * استخراج البيانات بأمان مع fallback
 */
function getBlogTitle(blog: BlogData): string {
  return toStr(blog.title_ar) || toStr(blog.title_en) || 'مقال';
}

function getBlogDescription(blog: BlogData): string {
  return toStr(blog.meta_description_ar) || 
         toStr(blog.excerpt_ar) || 
         toStr(blog.excerpt_en) || 
         stripHtml(blog.content_ar, 160) ||
         '';
}

function getBlogImages(blog: BlogData): string[] {
  const images: string[] = [];
  
  // الصورة المميزة
  if (blog.featured_image) {
    const url = buildImageUrl(blog.featured_image);
    if (url) images.push(url);
  }
  
  // معرض الصور
  if (Array.isArray(blog.gallery)) {
    blog.gallery.forEach((img) => {
      const url = buildImageUrl(img);
      if (url && !images.includes(url)) images.push(url);
    });
  }
  
  return images;
}

function getKeywords(blog: BlogData): string[] {
  const fromTags = (blog.tags || [])
    .map(t => toStr(t.name_ar))
    .filter(Boolean);
  
  const fromMeta = Array.isArray(blog.meta_keywords)
    ? blog.meta_keywords.map(k => toStr(k)).filter(Boolean)
    : [];
  
  return [...new Set([...fromTags, ...fromMeta])];
}

// ════════════════════════════════════════════════
// 🎯 Main Component
// ════════════════════════════════════════════════
export default function BlogSchema({ 
  blog, 
  settings = {}, 
  relatedBlogs = [],
  commentsCount,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/blog/${blog.slug}`;
  
  // ─── معلومات الموقع ───
  const siteName = toStr(settings.site_name_ar) || 
                   toStr(settings.site_name) || 
                   'شركة البناء المتميز';
  
  const siteLogo = buildImageUrl(settings.site_logo);
  
  // ─── البيانات الأساسية ───
  const title = getBlogTitle(blog);
  const description = getBlogDescription(blog);
  const images = getBlogImages(blog);
  const keywords = getKeywords(blog);
  
  // ─── حسابات ───
  const wordCount = calculateWordCount(blog.content_ar);
  const readingTime = calculateReadingTime(wordCount, blog.reading_time);
  
  // ─── التواريخ ───
  const publishedDate = blog.published_at 
    ? new Date(blog.published_at).toISOString() 
    : (blog.created_at ? new Date(blog.created_at).toISOString() : new Date().toISOString());
  
  const modifiedDate = blog.updated_at 
    ? new Date(blog.updated_at).toISOString() 
    : publishedDate;
  
  // ─── المؤلف ───
  const authorName = toStr(blog.author?.name) || siteName;
  const authorUrl = toStr(blog.author?.url) || baseUrl;
  const authorAvatar = blog.author?.avatar ? buildImageUrl(blog.author.avatar) : null;
  const authorBio = toStr(blog.author?.bio);
  const hasIndividualAuthor = !!blog.author?.name;

  // ═══════════════════════════════════════════════════
  // 1️⃣ BlogPosting Schema (الرئيسي)
  // ═══════════════════════════════════════════════════
  const blogPostingSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    
    // العنوان والوصف
    headline: title,
    ...(blog.title_en && { alternativeHeadline: toStr(blog.title_en) }),
    description,
    
    // الرابط
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    
    // اللغة
    inLanguage: 'ar-SA',
    
    // التواريخ
    datePublished: publishedDate,
    dateModified: modifiedDate,
    
    // الإحصائيات
    wordCount,
    timeRequired: `PT${readingTime}M`,
    
    // المؤلف
    author: hasIndividualAuthor ? {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
      ...(authorAvatar && {
        image: {
          '@type': 'ImageObject',
          url: authorAvatar,
        },
      }),
      ...(authorBio && { description: authorBio }),
    } : {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
      url: baseUrl,
    },
    
    // الناشر (دائماً المنظمة)
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
      url: baseUrl,
      ...(siteLogo && {
        logo: {
          '@type': 'ImageObject',
          url: siteLogo,
          width: 600,
          height: 60,
        },
      }),
    },
    
    // الصور
    ...(images.length > 0 && {
      image: images.map((img, i) => ({
        '@type': 'ImageObject',
        url: img,
        width: 1200,
        height: 630,
        caption: i === 0 ? title : `${title} - صورة ${i + 1}`,
        ...(i === 0 && { representativeOfPage: true }),
      })),
    }),
    
    // التصنيف
    ...(blog.category?.name_ar && {
      articleSection: blog.category.name_ar,
      about: [{
        '@type': 'Thing',
        name: blog.category.name_ar,
        ...(blog.category.slug && { 
          url: `${baseUrl}/blog?category=${blog.category.slug}` 
        }),
      }],
    }),
    
    // الكلمات المفتاحية
    ...(keywords.length > 0 && {
      keywords: keywords.join(', '),
    }),
    
    // الجمهور المستهدف
    audience: {
      '@type': 'Audience',
      audienceType: 'العملاء المهتمون بالمقاولات والبناء',
      geographicArea: {
        '@type': 'Country',
        name: 'المملكة العربية السعودية',
      },
    },
    
    // إحصائيات التفاعل
    interactionStatistic: [
      ...(blog.views_count && blog.views_count > 0 ? [{
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'ReadAction' },
        userInteractionCount: blog.views_count,
      }] : []),
      ...(commentsCount && commentsCount > 0 ? [{
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'CommentAction' },
        userInteractionCount: commentsCount,
      }] : []),
    ].filter(Boolean),
    
    // الجزء من المدونة
    isPartOf: {
      '@type': 'Blog',
      '@id': `${baseUrl}/blog#blog`,
      name: `مدونة ${siteName}`,
      url: `${baseUrl}/blog`,
      publisher: { '@id': `${baseUrl}/#organization` },
    },
    
    // الترخيص (اختياري)
    license: `${baseUrl}/terms`,
    
    // هل المقال مميز؟
    ...(blog.is_featured && {
      additionalType: 'https://schema.org/FeaturedArticle',
    }),
  };

  // إزالة الحقول الفارغة
  Object.keys(blogPostingSchema).forEach(key => {
    if (blogPostingSchema[key] === undefined || 
        blogPostingSchema[key] === null ||
        (Array.isArray(blogPostingSchema[key]) && blogPostingSchema[key].length === 0)) {
      delete blogPostingSchema[key];
    }
  });

  // ═══════════════════════════════════════════════════
  // 2️⃣ Article Schema (Generic - أوسع نطاقاً)
  // ═══════════════════════════════════════════════════
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description,
    url,
    image: images,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    inLanguage: 'ar-SA',
    isPartOf: { '@id': `${url}#blogposting` },
  };

  // ═══════════════════════════════════════════════════
  // 3️⃣ ImageObject Schemas (للصور الأساسية فقط)
  // ═══════════════════════════════════════════════════
  const featuredImageSchema = images.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${url}#featured-image`,
    url: images[0],
    contentUrl: images[0],
    name: title,
    caption: title,
    description,
    inLanguage: 'ar-SA',
    representativeOfPage: true,
    width: 1200,
    height: 630,
    author: { '@id': `${baseUrl}/#organization` },
    copyrightHolder: { '@id': `${baseUrl}/#organization` },
    creditText: siteName,
    license: `${baseUrl}/terms`,
  } : null;

  // ═══════════════════════════════════════════════════
  // 4️⃣ Speakable Schema (للقراءة الصوتية - Google Assistant)
  // ═══════════════════════════════════════════════════
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#speakable`,
    url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.blog-title', '.blog-excerpt', '[itemprop="articleBody"] p:first-of-type'],
      xpath: [
        '/html/head/title',
        '/html/head/meta[@name="description"]/@content',
      ],
    },
  };

  // ═══════════════════════════════════════════════════
  // 5️⃣ Related Posts Schema (إذا كانت موجودة)
  // ═══════════════════════════════════════════════════
  const relatedPostsSchema = relatedBlogs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#related`,
    name: 'مقالات ذات صلة',
    itemListElement: relatedBlogs.slice(0, 5).map((rel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/blog/${rel.slug}`,
        url: `${baseUrl}/blog/${rel.slug}`,
        headline: rel.title_ar,
        ...(rel.featured_image && {
          image: buildImageUrl(rel.featured_image),
        }),
      },
    })),
  } : null;

  // ═══════════════════════════════════════════════════
  // 🎯 إرجاع كل الـ Schemas
  // ═══════════════════════════════════════════════════
  return (
    <>
      {/* BlogPosting Schema (الرئيسي) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      
      {/* Article Schema (مكمل) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* ImageObject Schema (للصورة المميزة) */}
      {featuredImageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(featuredImageSchema) }}
        />
      )}
      
      {/* Speakable Schema (للقراءة الصوتية) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      
      {/* Related Posts Schema */}
      {relatedPostsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedPostsSchema) }}
        />
      )}
    </>
  );
}