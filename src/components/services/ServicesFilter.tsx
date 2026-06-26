'use client';

import { useState, useMemo } from 'react';
import ServiceCard from './ServiceCard';

interface Category {
  id: number;
  name_ar: string;
  slug: string;
}

interface Service {
  id: number;
  title_ar: string;
  slug: string;
  excerpt_ar: string;
  icon: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  category: Category | null;
}

interface Props {
  services: Service[];
  categories: Category[];
  initialCategory?: string;
}

export default function ServicesFilter({ services, categories, initialCategory = 'all' }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category?.id.toString() === selectedCategory);
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(s => s.is_featured);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(s =>
        s.title_ar.toLowerCase().includes(term) ||
        s.excerpt_ar.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      if (a.is_featured === b.is_featured) {
        return (a.sort_order || 0) - (b.sort_order || 0);
      }
      return a.is_featured ? -1 : 1;
    });

    return filtered;
  }, [services, selectedCategory, showFeaturedOnly, searchTerm]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setShowFeaturedOnly(false);
    setSearchTerm('');
  };

  const hasFilters = selectedCategory !== 'all' || showFeaturedOnly || searchTerm;

  return (
    <div>
      <div className="filter-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="ابحث عن خدمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">جميع التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name_ar}
              </option>
            ))}
          </select>
        )}

        <label className="featured-checkbox">
          <input
            type="checkbox"
            checked={showFeaturedOnly}
            onChange={(e) => setShowFeaturedOnly(e.target.checked)}
          />
          <span>المميزة فقط</span>
        </label>

        <div className="results-count">
          <span>{filteredServices.length}</span> خدمة
        </div>
      </div>

      {hasFilters && (
        <div className="reset-filters">
          <button onClick={resetFilters} className="reset-btn">✕ إلغاء جميع الفلاتر</button>
        </div>
      )}

      {filteredServices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">لا توجد نتائج</h3>
          <p className="empty-desc">لم نعثر على خدمات تطابق معايير البحث</p>
          <button onClick={resetFilters} className="empty-btn">إعادة ضبط الفلاتر</button>
        </div>
      ) : (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title_ar}
              title_ar={service.title_ar}
              slug={service.slug}
              excerpt={service.excerpt_ar}
              excerpt_ar={service.excerpt_ar}
              icon={service.icon}
              image_url={service.image_url}
              is_featured={service.is_featured}
              category={service.category}
              variant="default"
              showCategory={true}
              showFeatured={true}
            />
          ))}
        </div>
      )}

      <style>{`
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .search-wrapper { position: relative; flex: 1; min-width: 200px; }
        .search-input {
          width: 100%;
          padding: 0.625rem 1rem;
          padding-right: 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s;
        }
        .search-input:focus { outline: none; border-color: #ed8936; box-shadow: 0 0 0 2px rgba(237,137,54,0.1); }
        .search-icon { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .category-select {
          padding: 0.625rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          min-width: 160px;
          cursor: pointer;
        }
        .category-select:focus { outline: none; border-color: #ed8936; }
        .featured-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #475569;
        }
        .featured-checkbox input { width: 1rem; height: 1rem; cursor: pointer; accent-color: #ed8936; }
        .results-count {
          background: #f1f5f9;
          padding: 0.375rem 0.875rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
        }
        .results-count span { color: #ed8936; font-size: 0.875rem; }
        .reset-filters { text-align: left; margin-bottom: 1.5rem; }
        .reset-btn {
          padding: 0.375rem 1rem;
          background: #f1f5f9;
          border: none;
          border-radius: 2rem;
          font-size: 0.75rem;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s;
        }
        .reset-btn:hover { background: #ed8936; color: white; }
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .services-grid { grid-template-columns: repeat(3, 1fr); } }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 1rem;
        }
        .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
        .empty-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
        .empty-desc { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
        .empty-btn {
          padding: 0.625rem 1.25rem;
          background: #ed8936;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .empty-btn:hover { background: #dd6b20; transform: translateY(-2px); }
        @media (max-width: 768px) {
          .filter-bar { flex-direction: column; align-items: stretch; }
          .search-wrapper { width: 100%; }
          .category-select { width: 100%; }
          .featured-checkbox { justify-content: flex-start; }
          .results-count { text-align: center; }
        }
      `}</style>
    </div>
  );
}
