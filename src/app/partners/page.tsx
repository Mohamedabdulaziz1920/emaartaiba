'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, Partner } from '@/lib/api';
import { getImageUrl } from '@/lib/image';

export default function PartnersPageClient() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    async function fetchPartners() {
      try {
        setLoading(true);
        const data = await api.partners();
        setPartners(data);
        setFilteredPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  useEffect(() => {
    let filtered = [...partners];

    if (showFeaturedOnly) {
      filtered = filtered.filter(p => p.is_featured);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => {
        const name = p.name_ar || p.name_en || '';
        return name.toLowerCase().includes(term);
      });
    }

    setFilteredPartners(filtered);
  }, [partners, searchTerm, showFeaturedOnly]);

  if (loading) {
    return (
      <div className="partners-loading">
        <div className="spinner" />
        <p>جاري تحميل الشركاء...</p>
      </div>
    );
  }

  return (
    <div className="partners-page">
      <section className="partners-hero">
        <div className="container-custom">
          <div className="partners-hero-content">
            <h1 className="partners-hero-title">شركاؤنا</h1>
            <p className="partners-hero-desc">
              نفتخر بشراكتنا مع نخبة من الشركات والمؤسسات الرائدة في المجال
            </p>
          </div>

          <div className="partners-filters">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="ابحث عن شريك..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <label className="featured-checkbox">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              />
              <span>المميزين فقط</span>
            </label>

            <div className="results-count">
              <span>{filteredPartners.length}</span> شريك
            </div>
          </div>
        </div>
      </section>

      <section className="partners-content">
        <div className="container-custom">
          {filteredPartners.length > 0 ? (
            <div className="partners-grid">
              {filteredPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🤝</div>
              <h3>لا توجد نتائج</h3>
              <p>لم نعثر على شركاء تطابق معايير البحث</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .partners-page {
          min-height: 100vh;
          background: #f8faff;
        }

        .partners-hero {
          background: linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%);
          color: white;
          padding: 4rem 0 5rem;
          position: relative;
        }

        .partners-hero-content {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .partners-hero-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        .partners-hero-desc {
          color: #cbd5e0;
          font-size: 1.125rem;
        }

        .partners-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          max-width: 700px;
          margin: 2rem auto 0;
          padding: 1rem 1.5rem;
          background: rgba(255,255,255,0.08);
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
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
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: rgba(255,255,255,0.12);
          color: white;
          transition: all 0.3s;
        }

        .search-input::placeholder {
          color: rgba(255,255,255,0.5);
        }

        .search-input:focus {
          outline: none;
          background: rgba(255,255,255,0.2);
          box-shadow: 0 0 0 2px rgba(237,137,54,0.3);
        }

        .search-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.5);
        }

        .featured-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
        }

        .featured-checkbox input {
          width: 1rem;
          height: 1rem;
          cursor: pointer;
          accent-color: #ed8936;
        }

        .results-count {
          background: rgba(255,255,255,0.12);
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }

        .results-count span {
          color: #fbd38d;
        }

        .partners-content {
          padding: 3rem 0 5rem;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 1rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .partners-loading {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #ed8936;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .partners-hero {
            padding: 3rem 0 4rem;
          }

          .partners-filters {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }

          .search-wrapper {
            width: 100%;
          }

          .featured-checkbox {
            justify-content: flex-start;
          }

          .results-count {
            text-align: center;
          }

          .partners-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .partners-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Partner Card ────────────────────────────────
function PartnerCard({ partner }: { partner: Partner }) {
  const logoUrl = partner.logo ? getImageUrl(partner.logo) : null;

  return (
    <Link href={partner.website || '#'} className="partner-card" target={partner.website ? '_blank' : undefined}>
      <div className="partner-card-image">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={partner.name_ar || partner.name_en || 'شريك'}
            width={120}
            height={120}
            className="partner-logo"
            unoptimized={logoUrl.includes('localhost')}
          />
        ) : (
          <div className="partner-placeholder">🤝</div>
        )}
        {partner.is_featured && (
          <span className="partner-featured">⭐ مميز</span>
        )}
      </div>

      <div className="partner-card-content">
        <h3 className="partner-card-title">{partner.name_ar || partner.name_en}</h3>
        {partner.description_ar && (
          <p className="partner-card-desc">{partner.description_ar}</p>
        )}
        {partner.website && (
          <span className="partner-card-link">زيارة الموقع ←</span>
        )}
      </div>

      <style>{`
        .partner-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .partner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .partner-card-image {
          position: relative;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8faff;
          padding: 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .partner-logo {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .partner-placeholder {
          font-size: 4rem;
          opacity: 0.4;
        }

        .partner-featured {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .partner-card-content {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .partner-card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .partner-card:hover .partner-card-title {
          color: #ed8936;
        }

        .partner-card-desc {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 0.75rem;
          flex: 1;
        }

        .partner-card-link {
          color: #1a365d;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .partner-card:hover .partner-card-link {
          color: #ed8936;
        }
      `}</style>
    </Link>
  );
}
