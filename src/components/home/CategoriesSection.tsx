'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderOpen, FileText, TrendingUp, Star } from 'lucide-react';
import { api, Category } from '@/lib/api';
import { buildImageUrl } from '@/lib/typeSafe';

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categories();
        // تصفية التصنيفات النشطة ومن نوع blog فقط
        const filtered = (data || [])
          .filter((cat: Category) => cat.type_label === 'blog' && cat.is_active === true)
          .sort((a, b) => (b.stats?.posts || 0) - (a.stats?.posts || 0));
        setCategories(filtered);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // عرض أول 6 تصنيفات فقط في الصفحة الرئيسية
  const displayCategories = categories.slice(0, 6);

  // دالة للحصول على لون الخلفية المميز للتصنيف
  const getCategoryGradient = (name: string): string => {
    const gradients: Record<string, string> = {
      'مقاولات': 'linear-gradient(135deg, #1a365d, #2b6cb0)',
      'دهانات': 'linear-gradient(135deg, #c2410c, #ea580c)',
      'ديكورات': 'linear-gradient(135deg, #7c2d12, #b45309)',
      'ترميم': 'linear-gradient(135deg, #475569, #64748b)',
      'تشطيب': 'linear-gradient(135deg, #166534, #22c55e)',
      'بناء': 'linear-gradient(135deg, #1a365d, #2b6cb0)',
      'عوازل': 'linear-gradient(135deg, #0f766e, #14b8a6)',
      'سباكة': 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      'كهرباء': 'linear-gradient(135deg, #713f12, #eab308)',
      'جبس': 'linear-gradient(135deg, #78350f, #d97706)',
      'سيراميك': 'linear-gradient(135deg, #2d3748, #4a5568)',
      'رخام': 'linear-gradient(135deg, #451a03, #78350f)',
      'أخبار': 'linear-gradient(135deg, #86198f, #d946ef)',
      'نصائح': 'linear-gradient(135deg, #0c4a6e, #0284c7)',
    };
    for (const [key, gradient] of Object.entries(gradients)) {
      if (name.includes(key)) return gradient;
    }
    return 'linear-gradient(135deg, #1a365d, #2b6cb0)';
  };

  // دالة للحصول على أيقونة مميزة لكل تصنيف
  const getCategoryIconJSX = (name: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      'مقاولات': <span className="category-icon">🏗️</span>,
      'دهانات': <span className="category-icon">🎨</span>,
      'ديكورات': <span className="category-icon">🪞</span>,
      'ترميم': <span className="category-icon">🔨</span>,
      'تشطيب': <span className="category-icon">🏠</span>,
      'بناء': <span className="category-icon">🏗️</span>,
      'عوازل': <span className="category-icon">🧱</span>,
      'سباكة': <span className="category-icon">🚰</span>,
      'كهرباء': <span className="category-icon">⚡</span>,
      'جبس': <span className="category-icon">🎭</span>,
      'سيراميك': <span className="category-icon">🔲</span>,
      'رخام': <span className="category-icon">💎</span>,
      'أخبار': <span className="category-icon">📰</span>,
      'نصائح': <span className="category-icon">💡</span>,
    };
    for (const [key, icon] of Object.entries(icons)) {
      if (name.includes(key)) return icon;
    }
    return <FolderOpen size={32} className="category-icon-svg" />;
  };

  if (loading) {
    return (
      <section className="categories-section">
        <div className="container-custom">
          <div className="section-header">
            <div className="skeleton-badge"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-desc"></div>
          </div>
          <div className="categories-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        </div>
        <style jsx>{`
          .categories-section {
            padding: 5rem 0;
            background: #f8faff;
          }
          .skeleton-badge,
          .skeleton-title,
          .skeleton-desc,
          .skeleton-card {
            background: linear-gradient(90deg, #e2e8f0, #f1f5f9, #e2e8f0);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 9999px;
          }
          .skeleton-badge { width: 100px; height: 32px; margin: 0 auto; }
          .skeleton-title { width: 250px; height: 40px; border-radius: 0.5rem; margin: 1rem auto; }
          .skeleton-desc { width: 300px; height: 20px; border-radius: 0.5rem; margin: 0 auto; }
          .skeleton-card { height: 260px; border-radius: 1rem; }
          .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @media (max-width: 768px) {
            .categories-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
          }
          @media (max-width: 640px) {
            .categories-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </section>
    );
  }

  if (!displayCategories.length) return null;

  return (
    <section className="categories-section">
      <div className="container-custom">
        <div className="section-header">
          <span className="section-badge">📂 تصفح المحتوى</span>
          <h2 className="section-title">
            اكتشف <span className="text-gradient">المقالات حسب التصنيف</span>
          </h2>
          <p className="section-desc">
            محتوى متنوع في مجالات البناء والمقاولات والديكورات
          </p>
          <div className="title-divider">
            <span className="divider-line"></span>
            <span className="divider-diamond">◆</span>
            <span className="divider-line"></span>
          </div>
        </div>

        <div className="categories-grid">
          {displayCategories.map((category) => {
            // ✅ استخدام description بدلاً من description_ar
            // ✅ إزالة image لأنها غير موجودة في Category
            const postsCount = category.stats?.posts || 0;
            const isPopular = postsCount > 10;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="category-card"
              >
                <div 
                  className="category-card-icon"
                  style={{ background: getCategoryGradient(category.name_ar) }}
                >
                  {getCategoryIconJSX(category.name_ar)}
                </div>

                <div className="category-card-content">
                  <h3 className="category-card-title">{category.name_ar}</h3>
                  
                  {category.description && (
                    <p className="category-card-desc">
                      {category.description.substring(0, 65)}...
                    </p>
                  )}

                  <div className="category-card-stats">
                    <span className="stat-item">
                      <FileText size={14} />
                      {postsCount} مقال
                    </span>
                    {isPopular && (
                      <span className="stat-badge hot">
                        <TrendingUp size={12} /> رائج
                      </span>
                    )}
                  </div>

                  <span className="category-card-link">
                    استكشف المحتوى ←
                  </span>
                </div>

                {isPopular && (
                  <div className="featured-badge">
                    <Star size={12} /> الأكثر قراءة
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="view-all-wrapper">
          <Link href="/categories" className="view-all-btn">
            جميع التصنيفات
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .categories-section {
          padding: 5rem 0;
          background: #f8faff;
          position: relative;
          overflow: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 9999px;
          color: #D4AF37;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          margin-top: 1rem;
          margin-bottom: 1rem;
          color: #0f172a;
        }

        .text-gradient {
          background: linear-gradient(135deg, #D4AF37, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-desc {
          color: #64748b;
          font-size: 1rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .title-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .divider-line {
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
        }
        .divider-diamond {
          color: #D4AF37;
          font-size: 0.6rem;
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        @media (max-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }
          .categories-section {
            padding: 3rem 0;
          }
        }

        .category-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
        }

        .category-card-icon {
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
          position: relative;
        }

        .category-card:hover .category-card-icon {
          transform: scale(1.02);
        }

        .category-icon {
          font-size: 3.5rem;
          filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.2));
        }

        .category-icon-svg {
          color: #FFD700;
          stroke-width: 1.5;
        }

        .category-card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .category-card-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }

        .category-card:hover .category-card-title {
          color: #D4AF37;
        }

        .category-card-desc {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          flex: 1;
        }

        .category-card-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.75rem;
        }

        .stat-item {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #475569;
          background: #f1f5f9;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
        }

        .stat-badge {
          background: #fef3c7;
          color: #d97706;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .category-card-link {
          color: #1a365d;
          font-weight: 700;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          transition: gap 0.2s, color 0.2s;
        }

        .category-card:hover .category-card-link {
          gap: 0.5rem;
          color: #D4AF37;
        }

        .featured-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          z-index: 2;
        }

        .view-all-wrapper {
          text-align: center;
          margin-top: 3rem;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.8rem;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          border-radius: 9999px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .view-all-btn:hover {
          transform: translateY(-2px);
          gap: 0.8rem;
          background: linear-gradient(135deg, #D4AF37, #FFD700);
          color: #0f172a;
        }
      `}</style>
    </section>
  );
}
