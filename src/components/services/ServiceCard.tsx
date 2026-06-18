// frontend/src/components/services/ServiceCard.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

// ============================================
// 🎯 Types
// ============================================
interface Category {
  id: number;
  name_ar: string;
  slug: string;
}

interface ServiceCardProps {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  excerpt: string;
  excerpt_ar: string;
  icon: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order?: number; // ✅ جعلها اختيارية
  category: Category | null;
  variant?: 'default' | 'compact' | 'horizontal';
  showCategory?: boolean;
  showFeatured?: boolean;
  className?: string;
}

// ============================================
// 🎨 Gradients
// ============================================
const GRADIENTS = [
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#30cfd0 0%,#330867 100%)',
];

// ============================================
// 🛠️ Helper Functions
// ============================================
function getIcon(iconName: string | null | undefined, fallback: string): string {
  if (!iconName) return fallback;
  if (iconName.length <= 4) return iconName;
  
  const map: Record<string, string> = {
    'home': '🏠', 'building': '🏢', 'paint': '🎨', 'tools': '🔧',
    'construction': '🏗️', 'electric': '⚡', 'house': '🏠', 'office': '🏢',
    'renovation': '🔨', 'maintenance': '🛠️', 'plumbing': '🚰', 'painting': '🎨',
    'design': '📐', 'villa': '🏡', 'roof': '🏠', 'flooring': '🪵',
  };
  
  return map[iconName.toLowerCase()] || fallback;
}

function getGradient(seed: number): string {
  return GRADIENTS[seed % GRADIENTS.length];
}

// ============================================
// 🖥️ Component
// ============================================
export default function ServiceCard({
  id,
  title,
  title_ar,
  slug,
  excerpt,
  excerpt_ar,
  icon,
  image_url,
  is_featured,
  category,
  variant = 'default',
  showCategory = true,
  showFeatured = true,
  className = '',
}: ServiceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const displayTitle = title || title_ar;
  const displayExcerpt = excerpt || excerpt_ar;
  const displayIcon = getIcon(icon, '🔧');
  const gradient = getGradient(id);
  const hasImage = image_url && !imageError;

  // ========== Compact Variant ==========
  if (variant === 'compact') {
    return (
      <Link href={`/services/${slug}`} className={`service-card-compact ${className}`}>
        <div className="compact-image">
          {hasImage ? (
            <img src={image_url!} alt={displayTitle} />
          ) : (
            <span className="compact-icon">{displayIcon}</span>
          )}
        </div>
        <div className="compact-content">
          <h4 className="compact-title">{displayTitle}</h4>
          {category && showCategory && (
            <span className="compact-category">{category.name_ar}</span>
          )}
        </div>
        <style jsx>{`
          .service-card-compact {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: white;
            border-radius: 0.75rem;
            text-decoration: none;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
          }
          .service-card-compact:hover {
            background: #f8fafc;
            border-color: #ed8936;
            transform: translateX(4px);
          }
          .compact-image {
            width: 3rem;
            height: 3rem;
            border-radius: 0.5rem;
            overflow: hidden;
            background: ${gradient};
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .compact-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .compact-icon {
            font-size: 1.5rem;
          }
          .compact-content {
            flex: 1;
            min-width: 0;
          }
          .compact-title {
            font-size: 0.875rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .service-card-compact:hover .compact-title {
            color: #ed8936;
          }
          .compact-category {
            font-size: 0.7rem;
            color: #64748b;
          }
        `}</style>
      </Link>
    );
  }

  // ========== Horizontal Variant ==========
  if (variant === 'horizontal') {
    return (
      <Link href={`/services/${slug}`} className={`service-card-horizontal ${className}`}>
        <div className="horizontal-image">
          {hasImage ? (
            <img src={image_url!} alt={displayTitle} />
          ) : (
            <div className="horizontal-icon" style={{ background: gradient }}>
              <span>{displayIcon}</span>
            </div>
          )}
        </div>
        <div className="horizontal-content">
          {category && showCategory && (
            <span className="horizontal-category">{category.name_ar}</span>
          )}
          <h3 className="horizontal-title">{displayTitle}</h3>
          <p className="horizontal-excerpt">
            {displayExcerpt.length > 80 ? `${displayExcerpt.substring(0, 80)}...` : displayExcerpt}
          </p>
          <span className="horizontal-link">اعرف المزيد ←</span>
        </div>
        <style jsx>{`
          .service-card-horizontal {
            display: flex;
            gap: 1rem;
            background: white;
            border-radius: 1rem;
            overflow: hidden;
            text-decoration: none;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
          }
          .service-card-horizontal:hover {
            transform: translateX(-4px);
            border-color: #ed8936;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .horizontal-image {
            width: 120px;
            flex-shrink: 0;
          }
          .horizontal-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .horizontal-icon {
            width: 120px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
          }
          .horizontal-content {
            padding: 1rem;
            flex: 1;
          }
          .horizontal-category {
            display: inline-block;
            padding: 0.2rem 0.6rem;
            background: #fef3c7;
            color: #d97706;
            border-radius: 2rem;
            font-size: 0.7rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .horizontal-title {
            font-size: 1rem;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 0.5rem;
          }
          .service-card-horizontal:hover .horizontal-title {
            color: #ed8936;
          }
          .horizontal-excerpt {
            font-size: 0.75rem;
            color: #64748b;
            margin: 0 0 0.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .horizontal-link {
            font-size: 0.75rem;
            font-weight: 600;
            color: #1a365d;
          }
          .service-card-horizontal:hover .horizontal-link {
            color: #ed8936;
          }
        `}</style>
      </Link>
    );
  }

  // ========== Default Variant ==========
  return (
    <Link href={`/services/${slug}`} className={`service-card ${className}`}>
      {/* Image Section */}
      <div className="card-image">
        {hasImage ? (
          <>
            {!imageLoaded && <div className="image-loader">📷</div>}
            <img
              src={image_url!}
              alt={displayTitle}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          </>
        ) : (
          <div className="image-placeholder" style={{ background: gradient }}>
            <span>{displayIcon}</span>
          </div>
        )}
        
        {/* Featured Badge */}
        {is_featured && showFeatured && (
          <span className="featured-badge">⭐ مميز</span>
        )}
      </div>
      
      {/* Content Section */}
      <div className="card-content">
        {category && showCategory && (
          <span className="card-category">{category.name_ar}</span>
        )}
        
        <h3 className="card-title">{displayTitle}</h3>
        
        <p className="card-excerpt">
          {displayExcerpt.length > 100 ? `${displayExcerpt.substring(0, 100)}...` : displayExcerpt}
        </p>
        
        <div className="card-footer">
          <span className="read-more">اعرف المزيد</span>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
      
      <style jsx>{`
        .service-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          height: 100%;
        }
        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
          border-color: #ed8936;
        }
        .card-image {
          height: 200px;
          position: relative;
          overflow: hidden;
          background: #f1f5f9;
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .service-card:hover .card-image img {
          transform: scale(1.05);
        }
        .image-loader {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          background: #f1f5f9;
        }
        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
        }
        .featured-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 600;
          z-index: 2;
        }
        .card-content {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-category {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #fef3c7;
          color: #d97706;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          align-self: flex-start;
        }
        .card-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem;
          line-height: 1.4;
          transition: color 0.3s ease;
        }
        .service-card:hover .card-title {
          color: #ed8936;
        }
        .card-excerpt {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0 0 1rem;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
          margin-top: auto;
        }
        .read-more {
          color: #1a365d;
          font-weight: 700;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }
        .service-card:hover .read-more {
          color: #ed8936;
        }
        .arrow-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #1a365d;
          transition: all 0.3s ease;
        }
        .service-card:hover .arrow-icon {
          color: #ed8936;
          transform: translateX(-4px);
        }
      `}</style>
    </Link>
  );
}