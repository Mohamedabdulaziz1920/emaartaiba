import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  blog: {
    id: number;
    title_ar: string;
    slug: string;
    excerpt_ar: string;
    featured_image?: string | null;
    reading_time?: number;
    views_count?: number;
    published_at: string;
    is_featured?: boolean;
    category?: {
      id: number;
      name_ar: string;
      slug: string;
    } | null;
  };
  variant?: 'default' | 'compact' | 'featured';
  priority?: boolean; // للصور المهمة التي تظهر في الجزء المرئي من الصفحة
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return date;
  }
}

// ============================================
// 🖼️ مكون الصورة المحسن - مخصص لكل نوع من البطاقات
// ============================================
function OptimizedImage({ 
  src, 
  alt, 
  variant, 
  priority = false 
}: { 
  src: string; 
  alt: string; 
  variant: 'default' | 'compact' | 'featured';
  priority?: boolean;
}) {
  // تحديد أبعاد الصورة حسب نوع البطاقة
  const dimensions = {
    compact: { width: 80, height: 80, className: 'compact-image' },
    default: { width: 400, height: 260, className: 'default-image' },
    featured: { width: 600, height: 400, className: 'featured-image' }
  };

  const dim = dimensions[variant];

  return (
    <div className={`image-wrapper ${dim.className}`}>
      <Image
        src={src}
        alt={alt}
        width={dim.width}
        height={dim.height}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={
          variant === 'compact' ? '80px' :
          variant === 'featured' ? '(max-width: 768px) 100vw, 50vw' :
          '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        }
        className="blog-image"
      />
      <style jsx>{`
        .image-wrapper {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .compact-image {
          width: 5rem;
          height: 5rem;
          border-radius: 0.625rem;
          flex-shrink: 0;
        }
        .default-image {
          height: 13rem;
          width: 100%;
        }
        .featured-image {
          min-height: 18rem;
          width: 100%;
        }
        .blog-image {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .image-wrapper:hover .blog-image {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

// ============================================
// 🎨 مكون البطاقة المدمجة (للشريط الجانبي)
// ============================================
function CompactCard({ blog }: { blog: BlogCardProps['blog'] }) {
  const img = blog.featured_image || null;

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="blog-card-compact"
    >
      {img ? (
        <OptimizedImage
          src={img}
          alt={blog.title_ar}
          variant="compact"
        />
      ) : (
        <div className="compact-placeholder">
          📝
        </div>
      )}
      
      <div className="compact-content">
        <h4 className="compact-title line-clamp-2">
          {blog.title_ar}
        </h4>
        <p className="compact-date">
          <span>📅 {formatDate(blog.published_at)}</span>
        </p>
      </div>

      <style jsx>{`
        .blog-card-compact {
          display: flex;
          gap: 0.875rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          text-decoration: none;
          transition: all 0.2s ease;
          background: transparent;
        }
        
        .blog-card-compact:hover {
          background: #f8faff;
        }
        
        .compact-placeholder {
          flex-shrink: 0;
          width: 5rem;
          height: 5rem;
          border-radius: 0.625rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        
        .compact-content {
          flex: 1;
          min-width: 0;
        }
        
        .compact-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
          line-height: 1.4;
          transition: color 0.2s;
        }
        
        .blog-card-compact:hover .compact-title {
          color: #ed8936;
        }
        
        .compact-date {
          color: #9ca3af;
          font-size: 0.6875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </Link>
  );
}

// ============================================
// ⭐ مكون البطاقة المميزة (للصفحة الرئيسية)
// ============================================
function FeaturedCard({ blog }: { blog: BlogCardProps['blog'] }) {
  const img = blog.featured_image || null;

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="featured-blog-card"
    >
      <div className="featured-image-area">
        {img ? (
          <OptimizedImage
            src={img}
            alt={blog.title_ar}
            variant="featured"
            priority
          />
        ) : (
          <div className="featured-placeholder">
            📝
          </div>
        )}
        <span className="featured-badge">⭐ مميز</span>
      </div>
      
      <div className="featured-content">
        {blog.category?.name_ar && (
          <span className="featured-category">
            {blog.category.name_ar}
          </span>
        )}
        
        <h2 className="featured-title">
          {blog.title_ar}
        </h2>
        
        <p className="featured-excerpt line-clamp-3">
          {blog.excerpt_ar}
        </p>
        
        <div className="featured-footer">
          <div className="featured-meta">
            <span>📅 {formatDate(blog.published_at)}</span>
            {blog.reading_time && <span>⏱️ {blog.reading_time} د</span>}
          </div>
          <span className="featured-link">
            قراءة المقال ←
          </span>
        </div>
      </div>

      <style jsx>{`
        .featured-blog-card {
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: 1fr;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .featured-blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .featured-image-area {
          min-height: 18rem;
          position: relative;
          background: linear-gradient(135deg, #667eea, #764ba2);
          overflow: hidden;
        }
        
        .featured-placeholder {
          width: 100%;
          height: 100%;
          min-height: 18rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        
        .featured-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
          z-index: 2;
        }
        
        .featured-content {
          padding: 2rem;
        }
        
        .featured-category {
          display: inline-block;
          margin-bottom: 0.75rem;
          padding: 0.375rem 0.875rem;
          background: #eff6ff;
          color: #1a365d;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        
        .featured-title {
          font-size: clamp(1.25rem, 3vw, 1.625rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.875rem;
          line-height: 1.3;
          transition: color 0.2s;
        }
        
        .featured-blog-card:hover .featured-title {
          color: #ed8936;
        }
        
        .featured-excerpt {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        
        .featured-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.25rem;
          border-top: 1px solid #f1f5f9;
        }
        
        .featured-meta {
          display: flex;
          gap: 1rem;
          color: #9ca3af;
          font-size: 0.75rem;
        }
        
        .featured-link {
          color: #1a365d;
          font-weight: 700;
          font-size: 0.875rem;
          transition: gap 0.2s;
        }
        
        .featured-blog-card:hover .featured-link {
          gap: 0.5rem;
          color: #ed8936;
        }
        
        @media (min-width: 768px) {
          .featured-blog-card {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </Link>
  );
}

// ============================================
// 📝 مكون البطاقة الافتراضية (لشبكة المقالات)
// ============================================
function DefaultCard({ blog, priority = false }: { blog: BlogCardProps['blog']; priority?: boolean }) {
  const img = blog.featured_image || null;

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="default-blog-card"
    >
      <div className="default-image-area">
        {img ? (
          <OptimizedImage
            src={img}
            alt={blog.title_ar}
            variant="default"
            priority={priority}
          />
        ) : (
          <div className="default-placeholder">
            📝
          </div>
        )}
        
        {blog.category?.name_ar && (
          <span className="default-category">
            {blog.category.name_ar}
          </span>
        )}
        
        {blog.is_featured && (
          <span className="default-featured-badge">
            ⭐
          </span>
        )}
      </div>
      
      <div className="default-content">
        <div className="default-meta">
          <span>📅 {formatDate(blog.published_at)}</span>
          {blog.reading_time && <span>⏱️ {blog.reading_time} دقائق</span>}
          {(blog.views_count ?? 0) > 0 && <span>👁️ {blog.views_count}</span>}
        </div>
        
        <h3 className="default-title">
          {blog.title_ar}
        </h3>
        
        <p className="default-excerpt line-clamp-3">
          {blog.excerpt_ar}
        </p>
        
        <span className="default-link">
          قراءة المقال ←
        </span>
      </div>

      <style jsx>{`
        .default-blog-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .default-blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .default-image-area {
          height: 13rem;
          position: relative;
          background: linear-gradient(135deg, #667eea, #764ba2);
          overflow: hidden;
        }
        
        .default-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        
        .default-category {
          position: absolute;
          top: 0.875rem;
          right: 0.875rem;
          padding: 0.375rem 0.875rem;
          background: rgba(255, 255, 255, 0.95);
          color: #1a365d;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          backdrop-filter: blur(4px);
          z-index: 2;
        }
        
        .default-featured-badge {
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
        
        .default-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .default-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          color: #9ca3af;
          font-size: 0.75rem;
          flex-wrap: wrap;
        }
        
        .default-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.625rem;
          line-height: 1.4;
          transition: color 0.2s;
        }
        
        .default-blog-card:hover .default-title {
          color: #ed8936;
        }
        
        .default-excerpt {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          flex: 1;
        }
        
        .default-link {
          color: #1a365d;
          font-weight: 700;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          transition: gap 0.2s;
        }
        
        .default-blog-card:hover .default-link {
          gap: 0.625rem;
          color: #ed8936;
        }
      `}</style>
    </Link>
  );
}

// ============================================
// 🎯 المكون الرئيسي
// ============================================
export default function BlogCard({ blog, variant = 'default', priority = false }: BlogCardProps) {
  if (variant === 'compact') {
    return <CompactCard blog={blog} />;
  }
  
  if (variant === 'featured') {
    return <FeaturedCard blog={blog} />;
  }
  
  return <DefaultCard blog={blog} priority={priority} />;
}