'use client';

import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { buildBreadcrumb } from '@/lib/seo';
import Link from 'next/link';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ServiceCard from '@/components/services/ServiceCard';
import { useEffect, useState, useCallback } from 'react';

// ============================================
// 🎯 Types
// ============================================
interface Category {
  id: number;
  name_ar: string;
  slug: string;
}

interface Service {
  id: number;
  title: string;
  title_ar: string;
  title_en?: string;
  slug: string;
  excerpt: string;
  excerpt_ar: string;
  excerpt_en?: string;
  content?: string;
  content_ar?: string;
  icon: string | null;
  icon_html?: string;
  image_url: string | null;
  background_image_url?: string | null;
  is_featured: boolean;
  sort_order: number;
  category: Category | null;
  url: string;
}

interface ApiResponse {
  success: boolean;
  data: Service[];
  message?: string;
}

// ============================================
// 🖥️ Main Component
// ============================================
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);
  
  // الفلاتر
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // جلب الخدمات
        const response: unknown = await api.services();
        
        let servicesData: Service[] = [];
        
        if (response && typeof response === 'object') {
          if (Array.isArray(response)) {
            servicesData = response as Service[];
          } 
          else if ('success' in response && (response as ApiResponse).success === true && 'data' in response) {
            const data = (response as ApiResponse).data;
            if (Array.isArray(data)) {
              servicesData = data;
            }
          } 
          else if ('data' in response) {
            const data = (response as { data: Service[] }).data;
            if (Array.isArray(data)) {
              servicesData = data;
            }
          }
        }
        
        setServices(servicesData);
        setFilteredServices(servicesData);
        
        // استخراج التصنيفات الفريدة
        const uniqueCategories = servicesData
          .map(s => s.category)
          .filter((cat): cat is Category => cat !== null && cat !== undefined)
          .filter((cat, index, self) => 
            self.findIndex(c => c.id === cat.id) === index
          );
        setCategories(uniqueCategories);
        
        // جلب الإعدادات
        const siteSettings = await getSiteSettings();
        setSettings(siteSettings);
        
        // بناء Breadcrumb
        setBreadcrumbs(buildBreadcrumb({ name: 'الخدمات', url: '/services' }));
        
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('حدث خطأ في تحميل الخدمات');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    let filtered = [...services];
    
    // فلتر حسب التصنيف
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category?.id.toString() === selectedCategory);
    }
    
    // فلتر المميز فقط
    if (showFeaturedOnly) {
      filtered = filtered.filter(s => s.is_featured);
    }
    
    // فلتر البحث
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.title_ar.toLowerCase().includes(term) ||
        s.excerpt.toLowerCase().includes(term) ||
        s.excerpt_ar.toLowerCase().includes(term)
      );
    }
    
    // ترتيب النتائج (المميزة أولاً ثم حسب الترتيب)
    filtered.sort((a, b) => {
      if (a.is_featured === b.is_featured) {
        return (a.sort_order || 0) - (b.sort_order || 0);
      }
      return a.is_featured ? -1 : 1;
    });
    
    setFilteredServices(filtered);
  }, [services, selectedCategory, showFeaturedOnly, searchTerm]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('all');
    setShowFeaturedOnly(false);
    setSearchTerm('');
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>جاري تحميل الخدمات...</p>
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid var(--color-secondary, #ed8936);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>حدث خطأ</h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#ed8936',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        color: 'white',
        padding: '4rem 0 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          {breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} variant="dark" />
          )}

          <div style={{ textAlign: 'center' }}>
            <span className="section-badge"
                  style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}>
              ⚡ خدماتنا
            </span>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: '900',
              marginBottom: '1rem',
              color: 'white'
            }}>
              خدمات <span className="text-gradient-orange">مقاولات شاملة</span>
            </h1>
            <p style={{
              color: '#cbd5e0',
              fontSize: '1.125rem',
              maxWidth: '40rem',
              margin: '0 auto'
            }}>
              نقدم مجموعة متكاملة من خدمات المقاولات العامة بأعلى معايير الجودة
            </p>
          </div>
        </div>
        
        {/* Wave Decoration */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
               style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding" style={{ background: '#f8faff' }}>
        <div className="container-custom">
          {/* Filter Bar */}
          <div className="filter-bar">
            {/* Search Input */}
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
            
            {/* Category Filter */}
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
            
            {/* Featured Filter */}
            <label className="featured-checkbox">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              />
              <span>المميزة فقط</span>
            </label>
            
            {/* Results Count */}
            <div className="results-count">
              <span>{filteredServices.length}</span> خدمة
            </div>
          </div>
          
          {/* Reset Filters Button */}
          {(selectedCategory !== 'all' || showFeaturedOnly || searchTerm) && (
            <div className="reset-filters">
              <button onClick={handleResetFilters} className="reset-btn">
                ✕ إلغاء جميع الفلاتر
              </button>
            </div>
          )}

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">لا توجد نتائج</h3>
              <p className="empty-desc">
                لم نعثر على خدمات تطابق معايير البحث. حاول تغيير الفلاتر.
              </p>
              <button onClick={handleResetFilters} className="empty-btn">
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="services-grid">
            {filteredServices.map((service) => (
  <ServiceCard
    key={service.id}
    id={service.id}
    title={service.title}
    title_ar={service.title_ar}
    slug={service.slug}
    excerpt={service.excerpt}
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
        </div>
      </section>

      <style jsx>{`
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.625rem 1rem;
          padding-right: 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #ed8936;
          box-shadow: 0 0 0 2px rgba(237, 137, 54, 0.1);
        }
        
        .search-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1rem;
        }
        
        .category-select {
          padding: 0.625rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
          min-width: 160px;
        }
        
        .category-select:focus {
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
          padding: 0.375rem 0.875rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
        }
        
        .results-count span {
          color: #ed8936;
          font-size: 0.875rem;
        }
        
        .reset-filters {
          text-align: left;
          margin-bottom: 1.5rem;
        }
        
        .reset-btn {
          padding: 0.375rem 1rem;
          background: #f1f5f9;
          border: none;
          border-radius: 2rem;
          font-size: 0.75rem;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .reset-btn:hover {
          background: #ed8936;
          color: white;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 1rem;
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .empty-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        
        .empty-desc {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        
        .empty-btn {
          padding: 0.625rem 1.25rem;
          background: #ed8936;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .empty-btn:hover {
          background: #dd6b20;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-wrapper {
            width: 100%;
          }
          
          .category-select {
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