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
  relatedBlogs?: Array<{
    title_ar: string;
    slug: string;
    featured_image?: string;
  }>;
  commentsCount?: number;
  /** CSS selectors الفعلية في صفحة المدونة */
  speakableSelectors?: string[];
}

// ════════════════════════════════════════════════
// 🛠️ Helpers
// ════════════════════════════════════════════════

function calculateWordCount(content?: string): number {
  if (!content) return 0;
  const cleanText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/[^\u0600-\u06FF\u0750-\u077F\s\w]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleanText) return 0;
  return cleanText.split(/\s+/).filter(w => w.length > 0).length;
}

function calculateReadingTime(wordCount: number, customReadingTime?: number): number {
  if (customReadingTime && customReadingTime > 0) return customReadingTime;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function getBlogTitle(blog: BlogData): string {
  return toStr(blog.title_ar) || toStr(blog.title_en) || '';
}

function getBlogDescription(blog: BlogData): string {
  return (
    toStr(blog.meta_description_ar) ||
    toStr(blog.excerpt_ar) ||
    toStr(blog.excerpt_en) ||
    stripHtml(blog.content_ar, 160) ||
    ''
  );
}

function getBlogImages(blog: BlogData): string[] {
  const images: string[] = [];
  if (blog.featured_image) {
    const url = buildImageUrl(blog.featured_image);
    if (url) images.push(url);
  }
  if (Array.isArray(blog.gallery)) {
    blog.gallery.forEach(img => {
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

/** حذف الحقول undefined/null/[] من object */
function cleanSchema<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) =>
      v !== undefined &&
      v !== null &&
      !(Array.isArray(v) && v.length === 0) &&
      v !== ''
    )
  ) as T;
}

// ════════════════════════════════════════════════
// 🎯 Main Component
// ════════════════════════════════════════════════
export default function BlogSchema({
  blog,
  settings = {},
  relatedBlogs = [],
  commentsCount,
  speakableSelectors,
}: Props) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/blog/${blog.slug}`;

  // ─── معلومات الموقع ───────────────────────────
  const siteName =
    toStr(settings.site_name_ar) ||
    toStr(settings.site_name) ||
    '';

  const siteLogo = buildImageUrl(settings.site_logo) || '';

  // ─── بيانات المقال ────────────────────────────
  const title       = getBlogTitle(blog);
  const description = getBlogDescription(blog);
  const images      = getBlogImages(blog);
  const keywords    = getKeywords(blog);

  // ─── حسابات ──────────────────────────────────
  const wordCount   = calculateWordCount(blog.content_ar);
  const readingTime = calculateReadingTime(wordCount, blog.reading_time);

  // ─── التواريخ ─────────────────────────────────
  const publishedDate = blog.published_at
    ? new Date(blog.published_at).toISOString()
    : blog.created_at
      ? new Date(blog.created_at).toISOString()
      : new Date().toISOString();

  const modifiedDate = blog.updated_at
    ? new Date(blog.updated_at).toISOString()
    : publishedDate;

  // ─── المؤلف ───────────────────────────────────
  const hasIndividualAuthor = !!blog.author?.name;
  const authorName   = toStr(blog.author?.name) || siteName;
  const authorUrl    = toStr(blog.author?.url)  || baseUrl;
  const authorAvatar = blog.author?.avatar
    ? buildImageUrl(blog.author.avatar)
    : null;
  const authorBio    = toStr(blog.author?.bio);

  // ─── المنطقة الجغرافية من Settings ───────────
  const country =
    toStr(settings.address_country) ||
    toStr(settings.country)         ||
    '';

  const city =
    toStr(settings.address_city) ||
    toStr(settings.city)         ||
    '';

  // ─── Interactions ──────────────────────────────
  const interactions: any[] = [];

  if (blog.views_count && blog.views_count > 0) {
    interactions.push({
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'ReadAction' },
      userInteractionCount: blog.views_count,
    });
  }

  if (commentsCount && commentsCount > 0) {
    interactions.push({
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'CommentAction' },
      userInteractionCount: commentsCount,
    });
  }

  // ═══════════════════════════════════════════════
  // 1️⃣ BlogPosting Schema (الرئيسي)
  // ═══════════════════════════════════════════════
  const blogPostingSchema = cleanSchema({
    '@context': 'https://schema.org',
    '@type':    'BlogPosting',
    '@id':      `${url}#blogposting`,

    headline:              title || undefined,
    alternativeHeadline:   blog.title_en ? toStr(blog.title_en) : undefined,
    description:           description   || undefined,
    url,
    inLanguage:            'ar-SA',

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   url,
    },

    datePublished: publishedDate,
    dateModified:  modifiedDate,

    // ─── الإحصائيات ───────────────────────────
    ...(wordCount > 0 && { wordCount }),
    timeRequired: `PT${readingTime}M`,

    // ─── المؤلف ───────────────────────────────
    author: hasIndividualAuthor
      ? cleanSchema({
          '@type':      'Person',
          name:         authorName,
          url:          authorUrl  || undefined,
          description:  authorBio  || undefined,
          image: authorAvatar
            ? { '@type': 'ImageObject', url: authorAvatar }
            : undefined,
        })
      : {
          '@type': 'Organization',
          '@id':   `${baseUrl}/#organization`,
          name:    siteName || undefined,
          url:     baseUrl,
        },

    // ─── الناشر ───────────────────────────────
    publisher: cleanSchema({
      '@type': 'Organization',
      '@id':   `${baseUrl}/#organization`,
      name:    siteName || undefined,
      url:     baseUrl,
      logo: siteLogo
        ? {
            '@type':  'ImageObject',
            url:      siteLogo,
            width:    600,
            height:   60,
          }
        : undefined,
    }),

    // ─── الصور ────────────────────────────────
    ...(images.length > 0 && {
      image: images.map((img, i) => ({
        '@type': 'ImageObject',
        url:     img,
        caption: i === 0 ? title : `${title} - صورة ${i + 1}`,
        ...(i === 0 && { representativeOfPage: true }),
      })),
    }),

    // ─── التصنيف ──────────────────────────────
    ...(blog.category?.name_ar && {
      articleSection: blog.category.name_ar,
      about: [{
        '@type': 'Thing',
        name:    blog.category.name_ar,
        ...(blog.category.slug && {
          url: `${baseUrl}/blog?category=${blog.category.slug}`,
        }),
      }],
    }),

    // ─── الكلمات المفتاحية ────────────────────
    ...(keywords.length > 0 && {
      keywords: keywords.join(', '),
    }),

    // ─── الجمهور المستهدف (ديناميكي) ─────────
    ...((country || city) && {
      audience: cleanSchema({
        '@type': 'Audience',
        geographicArea: cleanSchema({
          '@type':  country ? 'Country' : 'AdministrativeArea',
          name:     country || city,
          ...(country && city && {
            containsPlace: {
              '@type': 'City',
              name:    city,
            },
          }),
        }),
      }),
    }),

    // ─── Interactions ─────────────────────────
    ...(interactions.length > 0 && {
      interactionStatistic: interactions,
    }),

    // ─── جزء من المدونة ───────────────────────
    isPartOf: {
      '@type':   'Blog',
      '@id':     `${baseUrl}/blog#blog`,
      name:      siteName ? `مدونة ${siteName}` : 'المدونة',
      url:       `${baseUrl}/blog`,
      publisher: { '@id': `${baseUrl}/#organization` },
    },

    // ─── مميز ─────────────────────────────────
    ...(blog.is_featured && {
      additionalType: 'https://schema.org/NewsArticle',
    }),
  });

  // ═══════════════════════════════════════════════
  // 2️⃣ ImageObject Schema (للصورة المميزة فقط)
  // ═══════════════════════════════════════════════
  const featuredImageSchema =
    images.length > 0
      ? cleanSchema({
          '@context':           'https://schema.org',
          '@type':              'ImageObject',
          '@id':                `${url}#featured-image`,
          url:                  images[0],
          contentUrl:           images[0],
          name:                 title || undefined,
          caption:              title || undefined,
          description:          description || undefined,
          inLanguage:           'ar-SA',
          representativeOfPage: true,
          author:               { '@id': `${baseUrl}/#organization` },
          copyrightHolder:      { '@id': `${baseUrl}/#organization` },
          creditText:           siteName || undefined,
        })
      : null;

  // ═══════════════════════════════════════════════
  // 3️⃣ Speakable Schema (ديناميكي من props)
  // ═══════════════════════════════════════════════
  const defaultSelectors = ['h1', 'meta[name="description"]'];
  const cssSelectors = speakableSelectors?.length
    ? speakableSelectors
    : defaultSelectors;

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type':    'WebPage',
    '@id':      `${url}#speakable`,
    url,
    speakable: {
      '@type':      'SpeakableSpecification',
      cssSelector:  cssSelectors,
    },
  };

  // ═══════════════════════════════════════════════
  // 4️⃣ Related Posts Schema
  // ═══════════════════════════════════════════════
  const relatedPostsSchema =
    relatedBlogs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type':    'ItemList',
          '@id':      `${url}#related`,
          name:       'مقالات ذات صلة',
          itemListElement: relatedBlogs
            .slice(0, 5)
            .map((rel, index) =>
              cleanSchema({
                '@type':    'ListItem',
                position:   index + 1,
                item: cleanSchema({
                  '@type':   'BlogPosting',
                  '@id':     `${baseUrl}/blog/${rel.slug}`,
                  url:       `${baseUrl}/blog/${rel.slug}`,
                  headline:  rel.title_ar,
                  image: rel.featured_image
                    ? buildImageUrl(rel.featured_image) || undefined
                    : undefined,
                }),
              })
            ),
        }
      : null;

  // ═══════════════════════════════════════════════
  // 🎯 Render
  // ═══════════════════════════════════════════════
  return (
    <>
      {/* 1. BlogPosting - الرئيسي */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />

      {/* 2. ImageObject - الصورة المميزة */}
      {featuredImageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(featuredImageSchema),
          }}
        />
      )}

      {/* 3. Speakable - القراءة الصوتية */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(speakableSchema),
        }}
      />

      {/* 4. Related Posts */}
      {relatedPostsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(relatedPostsSchema),
          }}
        />
      )}
    </>
  );
}