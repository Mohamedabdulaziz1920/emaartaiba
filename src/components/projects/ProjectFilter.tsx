'use client';

import { useState, useMemo, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import { 
  Project, 
  getProjectStatusInfo, 
  formatArea 
} from '@/lib/api';

interface ProjectFilterProps {
  projects: Project[];
  categories?: { id: number; name_ar: string; slug: string }[];
  statuses?: string[];
}

export default function ProjectFilter({ 
  projects, 
  categories = [], 
  statuses = ['all', 'completed', 'in_progress', 'planned'] 
}: ProjectFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category?.id?.toString() === selectedCategory ||
        p.category?.slug === selectedCategory
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(p => p.is_featured);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.title_ar.toLowerCase().includes(term) ||
        p.excerpt_ar?.toLowerCase().includes(term) ||
        p.city?.toLowerCase().includes(term) ||
        p.client_name?.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      if (a.is_featured === b.is_featured) {
        return (a.sort_order || 0) - (b.sort_order || 0);
      }
      return a.is_featured ? -1 : 1;
    });

    return filtered;
  }, [projects, selectedCategory, selectedStatus, showFeaturedOnly, searchTerm]);

  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setShowFeaturedOnly(false);
    setSearchTerm('');
  }, []);

  const hasFilters = selectedCategory !== 'all' || selectedStatus !== 'all' || showFeaturedOnly || searchTerm;

  const statusLabels: Record<string, string> = {
    all: 'جميع الحالات',
    completed: 'مكتمل',
    in_progress: 'قيد التنفيذ',
    planned: 'مخطط',
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="ابحث عن مشروع..."
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
            className="filter-select"
          >
            <option value="all">جميع التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name_ar}
              </option>
            ))}
          </select>
        )}

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="filter-select"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status] || status}
            </option>
          ))}
        </select>

        <label className="featured-checkbox">
          <input
            type="checkbox"
            checked={showFeaturedOnly}
            onChange={(e) => setShowFeaturedOnly(e.target.checked)}
          />
          <span>المميزة فقط</span>
        </label>

        <div className="results-count">
          <span>{filteredProjects.length}</span> مشروع
        </div>
      </div>

      {hasFilters && (
        <div className="reset-filters">
          <button onClick={resetFilters} className="reset-btn">✕ إلغاء جميع الفلاتر</button>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">لا توجد نتائج</h3>
          <p className="empty-desc">لم نعثر على مشاريع تطابق معايير البحث</p>
          <button onClick={resetFilters} className="empty-btn">إعادة ضبط الفلاتر</button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="default"
              showCategory={true}
              showStatus={true}
              showLocation={true}
            />
          ))}
        </div>
      )}

      <style>{`
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 180px;
        }
        .search-input {
          width: 100%;
          padding: 0.5rem 1rem;
          padding-right: 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s;
        }
        .search-input:focus {
          outline: none;
          border-color: #ed8936;
          box-shadow: 0 0 0 2px rgba(237,137,54,0.1);
        }
        .search-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .filter-select {
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          min-width: 140px;
          background: white;
          cursor: pointer;
        }
        .filter-select:focus {
          outline: none;
          border-color: #ed8936;
        }
        .featured-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #475569;
        }
        .featured-checkbox input {
          width: 1rem;
          height: 1rem;
          cursor: pointer;
          accent-color: #ed8936;
        }
        .results-count {
          background: #f1f5f9;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
        }
        .results-count span {
          color: #ed8936;
        }
        .reset-filters {
          text-align: left;
          margin-bottom: 1rem;
        }
        .reset-btn {
          padding: 0.25rem 0.75rem;
          background: #f1f5f9;
          border: none;
          border-radius: 2rem;
          font-size: 0.75rem;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s;
        }
        .reset-btn:hover {
          background: #ed8936;
          color: white;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .projects-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          background: white;
          border-radius: 1rem;
        }
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 0.75rem;
        }
        .empty-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }
        .empty-desc {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .empty-btn {
          padding: 0.5rem 1rem;
          background: #ed8936;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .empty-btn:hover {
          background: #dd6b20;
        }
        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .search-wrapper {
            width: 100%;
          }
          .filter-select {
            width: 100%;
          }
          .featured-checkbox {
            justify-content: flex-start;
          }
          .results-count {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
