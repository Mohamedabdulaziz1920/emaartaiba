'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, Ruler, Calendar, Search, X, 
  Eye, User, Clock, Building2, Filter, Star 
} from 'lucide-react';
import { Project, ProjectStatus, getProjectStatusInfo, getProjectImage, formatArea } from '@/lib/api';

interface ProjectFilterProps {
  projects: Project[];
}

type FilterStatus = 'all' | ProjectStatus;

export default function ProjectFilter({ projects }: ProjectFilterProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false);

  // استخراج المدن الفريدة
  const cities = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(projects.map(p => p.city).filter(Boolean))
    ) as string[];
    return uniqueCities.sort();
  }, [projects]);

  // فلترة المشاريع
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // فلتر الحالة
      if (filter !== 'all' && project.status !== filter) return false;

      // فلتر المدينة
      if (selectedCity !== 'all' && project.city !== selectedCity) return false;

      // فلتر المميز
      if (showFeaturedOnly && !project.is_featured) return false;

      // فلتر البحث
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchTitle = project.title_ar?.toLowerCase().includes(search);
        const matchCity = project.city?.toLowerCase().includes(search);
        const matchClient = project.client_name?.toLowerCase().includes(search);
        const matchExcerpt = project.excerpt_ar?.toLowerCase().includes(search);
        
        if (!matchTitle && !matchCity && !matchClient && !matchExcerpt) return false;
      }

      return true;
    });
  }, [projects, filter, searchTerm, selectedCity, showFeaturedOnly]);

  // إحصائيات
  const stats = useMemo(() => ({
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    in_progress: projects.filter(p => p.status === 'in_progress').length,
    planned: projects.filter(p => p.status === 'planned').length,
    featured: projects.filter(p => p.is_featured).length,
  }), [projects]);

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setSelectedCity('all');
    setShowFeaturedOnly(false);
  };

  const hasActiveFilters = filter !== 'all' || searchTerm || selectedCity !== 'all' || showFeaturedOnly;

  // حالة عدم وجود مشاريع
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏗️</div>
        <h3>لا توجد مشاريع حالياً</h3>
        <p>سيتم إضافة المشاريع قريباً، تابعونا!</p>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 5rem 1rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .empty-icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            opacity: 0.6;
          }
          .empty-state h3 {
            font-size: 1.5rem;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 0.5rem;
          }
          .empty-state p {
            color: #64748b;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="projects-filter-container">
      {/* ════════════════════════════════════════════ */}
      {/* شريط الفلترة */}
      {/* ════════════════════════════════════════════ */}
      <div className="filter-bar">
        {/* صف 1: البحث والمدينة */}
        <div className="filter-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="ابحث في العنوان، المدينة، العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="clear-btn" aria-label="مسح">
                <X size={16} />
              </button>
            )}
          </div>

          {cities.length > 0 && (
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="city-select"
            >
              <option value="all">📍 كل المدن</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className={`featured-toggle ${showFeaturedOnly ? 'active' : ''}`}
          >
            <Star size={16} fill={showFeaturedOnly ? 'currentColor' : 'none'} />
            المميزة فقط
          </button>
        </div>

        {/* صف 2: فلاتر الحالة */}
        <div className="status-filters">
          <button
            onClick={() => setFilter('all')}
            className={`status-btn ${filter === 'all' ? 'active' : ''}`}
          >
            <Filter size={14} />
            الكل
            <span className="count-badge">{stats.total}</span>
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`status-btn ${filter === 'completed' ? 'active completed' : ''}`}
          >
            ✅ مكتمل
            <span className="count-badge">{stats.completed}</span>
          </button>

          <button
            onClick={() => setFilter('in_progress')}
            className={`status-btn ${filter === 'in_progress' ? 'active in-progress' : ''}`}
          >
            🔨 قيد التنفيذ
            <span className="count-badge">{stats.in_progress}</span>
          </button>

          <button
            onClick={() => setFilter('planned')}
            className={`status-btn ${filter === 'planned' ? 'active planned' : ''}`}
          >
            📅 مخطط
            <span className="count-badge">{stats.planned}</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* عداد النتائج */}
      {/* ════════════════════════════════════════════ */}
      <div className="results-bar">
        <div className="results-count">
          <Building2 size={16} />
          عرض <strong>{filteredProjects.length}</strong> من <strong>{projects.length}</strong> مشروع
        </div>

        {hasActiveFilters && (
          <button onClick={resetFilters} className="reset-btn">
            <X size={14} /> إعادة تعيين الفلاتر
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* شبكة المشاريع */}
      {/* ════════════════════════════════════════════ */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const statusInfo = getProjectStatusInfo(project.status);
            const imageUrl = getProjectImage(project);

            return (
              <Link
                href={`/projects/${project.slug}`}
                key={project.id}
                className="project-card"
              >
                {/* الصورة */}
                <div className="card-image-wrapper">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={project.image_alt || project.title_ar}
                      title={project.image_title || project.title_ar}
                      className="card-image"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/800x600/1a365d/ed8936?text=' + encodeURIComponent(project.title_ar);
                        e.currentTarget.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="card-image-placeholder">🏗️</div>
                  )}

                  {/* شارة الحالة */}
                  <span 
                    className="status-badge" 
                    style={{ background: statusInfo.color }}
                  >
                    {statusInfo.icon} {statusInfo.label}
                  </span>

                  {/* شارة مميز */}
                  {project.is_featured && (
                    <span className="featured-badge">
                      <Star size={12} fill="currentColor" /> مميز
                    </span>
                  )}

                  {/* عدد المشاهدات */}
                  {project.views_count !== undefined && project.views_count > 0 && (
                    <span className="views-badge">
                      <Eye size={12} /> {project.views_count}
                    </span>
                  )}
                </div>

                {/* المحتوى */}
                <div className="card-content">
                  {/* التصنيف */}
                  {project.category && (
                    <span className="category-tag">
                      {project.category.name_ar}
                    </span>
                  )}

                  {/* العنوان */}
                  <h3 className="card-title">{project.title_ar}</h3>

                  {/* الوصف المختصر */}
                  {project.excerpt_ar && (
                    <p className="card-excerpt">
                      {project.excerpt_ar.length > 120
                        ? `${project.excerpt_ar.substring(0, 120)}...`
                        : project.excerpt_ar}
                    </p>
                  )}

                  {/* العميل */}
                  {project.client_name && (
                    <div className="client-info">
                      <User size={14} /> العميل: <strong>{project.client_name}</strong>
                    </div>
                  )}

                  {/* المعلومات السفلية */}
                  <div className="card-meta">
                    {project.city && (
                      <span className="meta-item">
                        <MapPin size={14} /> {project.city}
                      </span>
                    )}

                    {project.area_sqm && (
                      <span className="meta-item">
                        <Ruler size={14} /> {formatArea(project.area_sqm)}
                      </span>
                    )}

                    {project.duration && (
                      <span className="meta-item">
                        <Clock size={14} /> {project.duration}
                      </span>
                    )}

                    {project.completion_date && (
                      <span className="meta-item">
                        <Calendar size={14} /> {new Date(project.completion_date).getFullYear()}
                      </span>
                    )}
                  </div>

                  {/* رابط التفاصيل */}
                  <div className="card-link">
                    عرض التفاصيل
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* لا توجد نتائج */
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>لا توجد مشاريع مطابقة لبحثك</h3>
          <p>جرّب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
          <button onClick={resetFilters} className="reset-btn-large">
            <X size={16} /> إعادة تعيين الفلاتر
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* الأنماط */}
      {/* ════════════════════════════════════════════ */}
      <style jsx>{`
        .projects-filter-container {
          width: 100%;
        }

        /* شريط الفلترة */
        .filter-bar {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          margin-bottom: 1.5rem;
          border: 1px solid #e8edf5;
        }

        .filter-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 2.75rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s;
          font-family: inherit;
        }

        .search-input:focus {
          border-color: var(--color-secondary, #ed8936);
          box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.1);
        }

        .clear-btn {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: #f1f5f9;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: #ef4444;
          color: white;
        }

        .city-select {
          padding: 0.75rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
          background: white;
          font-family: inherit;
          min-width: 160px;
        }

        .city-select:focus {
          border-color: var(--color-secondary, #ed8936);
        }

        .featured-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          background: white;
          color: #64748b;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .featured-toggle:hover {
          border-color: #f59e0b;
          color: #f59e0b;
        }

        .featured-toggle.active {
          background: linear-gradient(135deg, #f59e0b, #ed8936);
          color: white;
          border-color: #f59e0b;
        }

        /* فلاتر الحالة */
        .status-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .status-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 2rem;
          background: white;
          color: #64748b;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .status-btn:hover {
          border-color: var(--color-primary, #1a365d);
          color: var(--color-primary, #1a365d);
        }

        .status-btn.active {
          background: var(--color-primary, #1a365d);
          color: white;
          border-color: var(--color-primary, #1a365d);
        }

        .status-btn.active.completed {
          background: #10b981;
          border-color: #10b981;
        }

        .status-btn.active.in-progress {
          background: #ed8936;
          border-color: #ed8936;
        }

        .status-btn.active.planned {
          background: #64748b;
          border-color: #64748b;
        }

        .count-badge {
          background: rgba(255,255,255,0.25);
          padding: 0.15rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }

        .status-btn:not(.active) .count-badge {
          background: #f1f5f9;
          color: #64748b;
        }

        /* شريط النتائج */
        .results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .results-count {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .results-count strong {
          color: var(--color-primary, #1a365d);
          font-weight: 800;
        }

        .reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1rem;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .reset-btn:hover {
          background: #dc2626;
          color: white;
        }

        /* شبكة المشاريع */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
        }

        .project-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #e8edf5;
          transition: all 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
        }

        .card-image-wrapper {
          position: relative;
          height: 240px;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .project-card:hover .card-image {
          transform: scale(1.08);
        }

        .card-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          color: white;
        }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: white;
          padding: 0.4rem 0.85rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          z-index: 1;
        }

        .featured-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: linear-gradient(135deg, #f59e0b, #ed8936);
          color: white;
          padding: 0.4rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(237,137,54,0.4);
          z-index: 1;
        }

        .views-badge {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          color: white;
          padding: 0.3rem 0.65rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* المحتوى */
        .card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .category-tag {
          display: inline-block;
          align-self: flex-start;
          padding: 0.3rem 0.75rem;
          background: #fef3c7;
          color: #d97706;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
          transition: color 0.3s;
        }

        .project-card:hover .card-title {
          color: var(--color-primary, #1a365d);
        }

        .card-excerpt {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.7;
          margin: 0 0 1rem 0;
        }

        .client-info {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: #475569;
          margin-bottom: 0.75rem;
          padding: 0.4rem 0.7rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          align-self: flex-start;
        }

        .card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding-top: 1rem;
          margin-top: auto;
          border-top: 1px solid #f1f5f9;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #64748b;
          background: #f8faff;
          padding: 0.3rem 0.65rem;
          border-radius: 0.4rem;
          font-weight: 600;
        }

        .card-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
          color: var(--color-primary, #1a365d);
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .project-card:hover .card-link {
          color: var(--color-secondary, #ed8936);
          gap: 0.75rem;
        }

        /* لا توجد نتائج */
        .no-results {
          text-align: center;
          padding: 5rem 1rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .no-results h3 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .no-results p {
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .reset-btn-large {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, var(--color-primary, #1a365d), var(--color-primary-light, #2b6cb0));
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.9rem;
          font-family: inherit;
          transition: all 0.3s;
        }

        .reset-btn-large:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        /* استجابة الموبايل */
        @media (max-width: 768px) {
          .filter-bar {
            padding: 1rem;
          }

          .search-input-wrapper {
            min-width: 100%;
          }

          .city-select,
          .featured-toggle {
            flex: 1;
          }

          .projects-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .card-image-wrapper {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}