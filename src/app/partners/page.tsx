'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, type Partner } from '@/lib/api';

export default function PartnersPageClient() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const data = await api.partners();
        setPartners(data);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError('حدث خطأ في تحميل الشركاء');
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // فلترة الشركاء
  const filteredPartners = partners.filter(partner => {
    if (filter === 'featured' && !partner.is_featured) {
      return false;
    }
    
    if (searchTerm) {
      const name = partner.name || partner.name_ar;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const getPartnerName = (partner: Partner): string => {
    return partner.name || partner.name_ar || 'شريك';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>جاري تحميل الشركاء...</p>
        <style>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #f59e0b;
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
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '1rem' }}>حدث خطأ</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#f59e0b',
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
          <div style={{ textAlign: 'center' }}>
            <span className="section-badge" style={{ background: 'rgba(237,137,54,0.15)', color: '#fbd38d' }}>
              🤝 شركاؤنا
            </span>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '900',
              marginBottom: '1rem',
              color: 'white'
            }}>
              شركاء <span style={{ color: '#f59e0b' }}>النجاح</span>
            </h1>
            <p style={{ color: '#cbd5e0', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto' }}>
              نفخر بشراكتنا مع أبرز المؤسسات والشركات في المجال
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

      {/* Filter Bar */}
      <section style={{ padding: '2rem 0', background: '#f8faff' }}>
        <div className="container-custom">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: filter === 'all' ? '#f59e0b' : '#e2e8f0',
                  color: filter === 'all' ? 'white' : '#475569',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                جميع الشركاء
              </button>
              <button
                onClick={() => setFilter('featured')}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: filter === 'featured' ? '#f59e0b' : '#e2e8f0',
                  color: filter === 'featured' ? 'white' : '#475569',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                ⭐ المميزون
              </button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="ابحث عن شريك..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  paddingRight: '2.5rem',
                  borderRadius: '2rem',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  width: '250px',
                  fontSize: '0.875rem'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}>
                🔍
              </span>
            </div>
          </div>

          {/* Results Count */}
          <p style={{ marginBottom: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            عرض {filteredPartners.length} من {partners.length} شريك
          </p>

          {/* Partners Grid */}
          {filteredPartners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
                لا توجد شركاء مطابقين
              </h3>
              <p style={{ color: '#64748b' }}>حاول تغيير الفلتر أو البحث بكلمة مختلفة</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '2rem'
            }}>
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="partner-card"
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                  }}
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={getPartnerName(partner)}
                      style={{
                        height: '80px',
                        width: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        marginBottom: '1rem'
                      }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const text = document.createElement('div');
                          text.textContent = getPartnerName(partner);
                          text.style.fontWeight = 'bold';
                          text.style.fontSize = '1rem';
                          text.style.color = '#0f172a';
                          parent.insertBefore(text, target);
                        }
                      }}
                    />
                  ) : (
                    <div style={{
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                      marginBottom: '1rem'
                    }}>
                      {getPartnerName(partner).charAt(0)}
                    </div>
                  )}
                  
                  <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    {getPartnerName(partner)}
                  </h3>
                  
                  {partner.is_featured && (
                    <span style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '2rem',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }}>
                      ⭐ مميز
                    </span>
                  )}
                  
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        color: '#f59e0b',
                        fontSize: '0.75rem',
                        textDecoration: 'none'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      زيارة الموقع →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}