'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FolderOpen, 
  FileText, 
  TrendingUp, 
  Star,
  Sparkles,
  Grid3x3
} from 'lucide-react';
import { api, type Category } from '@/lib/api';

/* ═══════════════════════════════════════════════════
   🎯 Types
   ═══════════════════════════════════════════════════ */
interface Props {
  title?: string;
  subtitle?: string;
  badge?: string;
  limit?: number;
  showViewAll?: boolean;
  type?: 'blog' | 'service' | 'project';
}

/* ═══════════════════════════════════════════════════
   🎨 Category Icons Map
   ═══════════════════════════════════════════════════ */
const CATEGORY_ICONS: Record<string, string> = {
  'الأخبار': '📰',
  'المقالات': '📝',
  'الدروس': '📚',
  'النصائح': '💡',
  'الأدلة': '📖',
  'التقنية': '💻',
  'التصميم': '🎨',
  'التسويق': '📊',
  'الأعمال': '💼',
  'الصحة': '🏥',
  'التعليم': '🎓',
  'الرياضة': '⚽',
  'السفر': '✈️',
  'الطعام': '🍽️',
  'الموضة': '👔',
  'البناء': '🏗️',
  'الديكور': '🛋️',
  'الدهانات': '🎨',
  'التشطيبات': '🔨',
};

const DEFAULT_ICONS = ['📁', '📂', '🗂️', '📋', '📑', '📊'] as const;

/* ═══════════════════════════════════════════════════
   🎨 Gradients
   ═══════════════════════════════════════════════════ */
const GRADIENTS = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#667eea' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#f5576c' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#4facfe' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#43e97b' },
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fa709a' },
  { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', color: '#30cfd0' },
  { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#a8edea' },
  { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#ff9a9e' },
] as const;

/* ═══════════════════════════════════════════════════
   🛠️ Helpers
   ═══════════════════════════════════════════════════ */
function getCategoryIcon(name: string, index: number): string {
  // ابحث عن أيقونة مطابقة لاسم التصنيف
  for (const [key, value] of Object.entries(CATEGORY_ICONS)) {
    if (name.includes(key)) {
      return value;
    }
  }
  return DEFAULT_ICONS[index % DEFAULT_ICONS.length];
}

function getGradient(index: number) {
  return GRADIENTS[index % GRADIENTS.length];
}

function truncate(text: string, max = 65): string {
  if (!text) return '';
  return text.length > max ? `${text.substring(0, max)}...` : text;
}

/* ═══════════════════════════════════════════════════
   🎯 Main Component
   ═══════════════════════════════════════════════════ */
export default function CategoriesSection({
  title = 'اكتشف',
  subtitle = 'تصفح المحتوى حسب التصنيف الذي يهمك',
  badge = '📂 تصفح المحتوى',
  limit = 6,
  showViewAll = true,
  type = 'blog',
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await api.categories(type);
        const list = Array.isArray(data) ? data : [];

        const filtered = list
          .filter((cat: Category) => cat.is_active === true)
          .sort((a, b) => (b.stats?.posts || 0) - (a.stats?.posts || 0));

        setCategories(filtered);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('حدث خطأ في تحميل التصنيفات');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [type]);

  const displayCategories = useMemo(() => {
    return categories.slice(0, limit);
  }, [categories, limit]);

  /* ═══ Loading State ═══ */
  if (loading) {
    return (
      <section className="cats-section">
        <div className="cats-container">
          <div className="cats-header">
            <div className="skeleton skeleton-badge" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-desc" />
          </div>
          <div className="cats-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        </div>
        <style jsx>{`
          .cats-section {
            padding: 4rem 0;
            background: var(--color-bg-light, #f8faff);
            font-family: var(--font-family, 'Cairo'), sans-serif;
          }
          .cats-container {
            max-width: 1320px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }
          .cats-header {
            text-align: center;
            margin-bottom: 3rem;
          }
          .skeleton {
            background: linear-gradient(90deg, #e2e8f0, #f1f5f9, #e2e8f0);
            background-size: 200% 100%;
            animation: skeleton-shimmer 1.5s infinite;
            border-radius: 9999px;
          }
          .skeleton-badge {
            width: 120px;
            height: 32px;
            margin: 0 auto 1rem;
          }
          .skeleton-title {
            width: 280px;
            height: 40px;
            border-radius: 0.5rem;
            margin: 0 auto 1rem;
          }
          .skeleton-desc {
            width: 320px;
            height: 20px;
            border-radius: 0.5rem;
            margin: 0 auto;
          }
          .skeleton-card {
            height: 280px;
            border-radius: 1.25rem;
          }
          .cats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }
          @keyframes skeleton-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </section>
    );
  }

  /* ═══ Error State ═══ */
  if (error) {
    return (
      <section className="cats-section">
        <div className="cats-container">
          <div className="cats-error">
            <div className="cats-error-icon">⚠️</div>
            <h3>حدث خطأ</h3>
            <p>{error}</p>
          </div>
        </div>
        <style jsx>{`
          .cats-section {
            padding: 4rem 0;
            background: var(--color-bg-light, #f8faff);
          }
          .cats-container {
            max-width: 1320px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }
          .cats-error {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--color-text-muted, #64748b);
          }
          .cats-error-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .cats-error h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--color-text-dark, #0f172a);
            margin-bottom: 0.5rem;
          }
        `}</style>
      </section>
    );
  }

  /* ═══ Empty State ═══ */
  if (!displayCategories.length) return null;

  return (
    <section className="cats-section" dir="rtl" suppressHydrationWarning>
      {/* ═══ Background Decorations ═══ */}
      <div className="cats-decoration cats-decoration--1" aria-hidden="true" />
      <div className="cats-decoration cats-decoration--2" aria-hidden="true" />

      <div className="cats-container">
        {/* ═══ Header ═══ */}
        <motion.div
          className="cats-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="cats-badge">
            <Grid3x3 size={16} />
            <span>{badge.replace('📂 ', '')}</span>
          </span>
          
          <h2 className="cats-title">
            {title}{' '}
            <span className="cats-title-highlight">
              المقالات حسب التصنيف
            </span>
          </h2>
          
          <p className="cats-desc">
            {subtitle}
          </p>
          
          <div className="cats-divider">
            <span className="divider-line" />
            <Sparkles size={14} className="divider-icon" />
            <span className="divider-line" />
          </div>
        </motion.div>

        {/* ═══ Grid ═══ */}
        <div className="cats-grid">
          {displayCategories.map((category, index) => {
            const postsCount = category.stats?.posts || 0;
            const isPopular = postsCount > 10;
            const gradient = getGradient(index);
            const icon = getCategoryIcon(category.name_ar, index);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="cat-card"
                  aria-label={`تصفح ${category.name_ar}`}
                >
                  {/* Featured Badge */}
                  {isPopular && (
                    <div className="cat-featured-badge">
                      <Star size={12} fill="currentColor" />
                      <span>الأكثر قراءة</span>
                    </div>
                  )}

                  {/* Icon Section */}
                  <div 
                    className="cat-card-icon"
                    style={{ background: gradient.bg }}
                  >
                    <div className="cat-icon-emoji">{icon}</div>
                    <FolderOpen 
                      size={32} 
                      className="cat-icon-svg"
                      strokeWidth={1.5}
                    />
                    <div className="cat-icon-pattern" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div className="cat-card-content">
                    <h3 className="cat-card-title">
                      {category.name_ar}
                    </h3>

                    {category.description_ar && (
                      <p className="cat-card-desc">
                        {truncate(category.description_ar, 65)}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="cat-card-stats">
                      <span className="stat-item">
                        <FileText size={14} />
                        <span>{postsCount} مقال</span>
                      </span>
                      
                      {isPopular && (
                        <span className="stat-badge">
                          <TrendingUp size={12} />
                          <span>رائج</span>
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="cat-card-cta">
                      <span className="cat-card-link">
                        استكشف المحتوى
                      </span>
                      <ArrowLeft 
                        size={16} 
                        className="cat-card-arrow"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ═══ View All Button ═══ */}
        {showViewAll && (
          <motion.div 
            className="cats-view-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/categories" className="view-all-btn">
              <span>عرض جميع التصنيفات</span>
              <ArrowLeft size={18} strokeWidth={2.5} />
            </Link>
          </motion.div>
        )}
      </div>

      {/* ═══════════════════ Styles ═══════════════════ */}
      <style jsx>{`
        /* ═══ Base ═══ */
        .cats-section {
          padding: clamp(3rem, 6vw, 5rem) 0;
          background: var(--color-bg-light, #f8faff);
          position: relative;
          overflow: hidden;
          font-family: var(--font-family, 'Cairo'), sans-serif;
        }

        /* ═══ Background Decorations ═══ */
        .cats-decoration {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          z-index: 0;
        }
        
        .cats-decoration--1 {
          top: -10%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(
            circle,
            rgba(212, 175, 55, 0.08),
            transparent 70%
          );
        }
        
        .cats-decoration--2 {
          bottom: -10%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(102, 126, 234, 0.08),
            transparent 70%
          );
        }

        /* ═══ Container ═══ */
        .cats-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 1;
        }

        /* ═══ Header ═══ */
        .cats-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .cats-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.15),
            rgba(212, 175, 55, 0.05)
          );
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 9999px;
          color: var(--color-secondary, #D4AF37);
          font-weight: 700;
          font-size: 0.875rem;
        }

        .cats-title {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          margin: 1rem 0;
          color: var(--color-text-dark, #0f172a);
          line-height: 1.3;
          font-family: var(--font-family-headings, var(--font-family, 'Cairo')), sans-serif;
        }

        .cats-title-highlight {
          background: linear-gradient(
            135deg,
            var(--color-secondary, #D4AF37),
            var(--color-accent, #FFD700)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cats-desc {
          color: var(--color-text-muted, #64748b);
          font-size: 1rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .cats-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .divider-line {
          width: 50px;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--color-secondary, #D4AF37),
            transparent
          );
        }

        .divider-icon {
          color: var(--color-secondary, #D4AF37);
          animation: divider-spin 4s linear infinite;
        }

        @keyframes divider-spin {
          to { transform: rotate(360deg); }
        }

        /* ═══ Grid ═══ */
        .cats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        /* ═══ Card ═══ */
        .cat-card {
          background: var(--color-bg-card, #ffffff);
          border-radius: 1.25rem;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .cat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(212, 175, 55, 0.2);
        }

        /* ═══ Featured Badge ═══ */
        .cat-featured-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(
            135deg,
            var(--color-secondary, #D4AF37),
            var(--color-secondary-dark, #B8960F)
          );
          color: #ffffff;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
          animation: badge-pulse 2s ease-in-out infinite;
        }

        @keyframes badge-pulse {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
          }
          50% {
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
          }
        }

        /* ═══ Icon Section ═══ */
        .cat-card-icon {
          position: relative;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s ease;
          overflow: hidden;
        }

        .cat-icon-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .cat-icon-emoji {
          font-size: 3.5rem;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
          transition: transform 0.4s ease;
        }

        .cat-icon-svg {
          position: absolute;
          bottom: 15px;
          left: 15px;
          color: rgba(255, 255, 255, 0.5);
          z-index: 1;
        }

        .cat-card:hover .cat-icon-emoji {
          transform: scale(1.15) rotate(-5deg);
        }

        .cat-card:hover .cat-card-icon {
          filter: brightness(1.05);
        }

        /* ═══ Content ═══ */
        .cat-card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cat-card-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--color-text-dark, #0f172a);
          margin: 0 0 0.5rem 0;
          transition: color 0.3s ease;
          font-family: var(--font-family-headings, var(--font-family, 'Cairo')), sans-serif;
          line-height: 1.4;
        }

        .cat-card:hover .cat-card-title {
          color: var(--color-secondary, #D4AF37);
        }

        .cat-card-desc {
          color: var(--color-text-muted, #64748b);
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0 0 1rem 0;
          flex: 1;
        }

        /* ═══ Stats ═══ */
        .cat-card-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-text-dark, #475569);
          background: rgba(0, 0, 0, 0.04);
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: linear-gradient(
            135deg,
            #fef3c7,
            #fde68a
          );
          color: #d97706;
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.7rem;
        }

        /* ═══ CTA ═══ */
        .cat-card-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px dashed rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .cat-card-link {
          color: var(--color-primary, #1a365d);
          font-weight: 700;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .cat-card-arrow {
          color: var(--color-primary, #1a365d);
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .cat-card:hover .cat-card-link {
          color: var(--color-secondary, #D4AF37);
        }

        .cat-card:hover .cat-card-arrow {
          transform: translateX(-4px);
          color: var(--color-secondary, #D4AF37);
        }

        /* ═══ View All Button ═══ */
        .cats-view-all {
          text-align: center;
          margin-top: 3rem;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background: linear-gradient(
            135deg,
            var(--color-primary, #1a365d),
            var(--color-primary-light, #2b6cb0)
          );
          color: #ffffff;
          border-radius: 9999px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.9375rem;
          box-shadow: 0 8px 20px rgba(26, 54, 93, 0.25);
        }

        .view-all-btn:hover {
          transform: translateY(-2px);
          gap: 0.75rem;
          background: linear-gradient(
            135deg,
            var(--color-secondary, #D4AF37),
            var(--color-secondary-dark, #B8960F)
          );
          color: #0f172a;
          box-shadow: 0 12px 28px rgba(212, 175, 55, 0.35);
        }

        /* ═══════════════════════════════════════════
           📱 Responsive
           ═══════════════════════════════════════════ */
        
        @media (max-width: 1024px) {
          .cats-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .cats-section {
            padding: 3rem 0;
          }
          
          .cats-header {
            margin-bottom: 2rem;
          }
          
          .cats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          
          .cat-card-icon {
            height: 120px;
          }
          
          .cat-icon-emoji {
            font-size: 3rem;
          }
          
          .cat-card-content {
            padding: 1.25rem;
          }
          
          .cat-card-title {
            font-size: 1rem;
          }
          
          .cat-card-desc {
            font-size: 0.8125rem;
          }
        }

        @media (max-width: 480px) {
          .cats-section {
            padding: 2.5rem 0;
          }
          
          .cats-container {
            padding: 0 1rem;
          }
          
          .cats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .cat-card-icon {
            height: 110px;
          }
          
          .cat-icon-emoji {
            font-size: 2.75rem;
          }
          
          .cat-featured-badge {
            font-size: 0.65rem;
            padding: 0.3rem 0.6rem;
          }
          
          .stat-item,
          .stat-badge {
            font-size: 0.7rem;
          }
        }

        @media (max-width: 360px) {
          .cats-title {
            font-size: 1.5rem;
          }
          
          .cats-desc {
            font-size: 0.9rem;
          }
        }

        /* ═══ Reduced Motion ═══ */
        @media (prefers-reduced-motion: reduce) {
          .cat-card,
          .cat-icon-emoji,
          .cat-card-arrow,
          .view-all-btn,
          .cat-featured-badge {
            animation: none !important;
            transition: none !important;
          }
          
          .cat-card:hover {
            transform: none;
          }
          
          .cat-card:hover .cat-icon-emoji {
            transform: none;
          }
          
          .divider-icon {
            animation: none;
          }
        }

        /* ═══ Print ═══ */
        @media print {
          .cats-decoration,
          .cats-view-all {
            display: none;
          }
          
          .cat-card {
            box-shadow: none;
            border: 1px solid #ddd;
            break-inside: avoid;
          }
        }
      `}</style>
    </section>
  );
}