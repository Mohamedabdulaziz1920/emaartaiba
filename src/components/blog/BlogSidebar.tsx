'use client';

import Link from 'next/link';
import { SITE } from '@/lib/constants';
import { Category } from '@/lib/api';

interface Tag { id?: number; name_ar: string; slug: string; posts_count?: number; }

interface Props {
  relatedBlogs?: any[];
  services?:     any[];
  projects?:     any[];
  tags?:         (Tag | string)[];
  categories?:   Category[];  // ✅ أضف هذا
  currentCategory?: string;    // ✅ أضف هذا
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('ar-SA', {
      year:'numeric', month:'2-digit', day:'2-digit'
    });
  } catch { return date; }
}

export default function BlogSidebar({
  relatedBlogs = [],
  services     = [],
  projects     = [],
  tags         = [],
  categories   = [],      // ✅ أضف هذا
}: Props) {
  const normalizedTags = tags.map((t: any) =>
    typeof t === 'string' ? { name_ar: t, slug: t } : t
  );

  return (
    <aside style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>

      {/* الخدمات */}
      {services.length > 0 && (
        <SidebarBox title="🛠️ خدماتنا">
          <div style={{display:'flex', flexDirection:'column'}}>
            {services.slice(0, 8).map((s: any, i: number, arr: any[]) => (
              <Link key={s.id} href={`/services/${s.slug}`} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'0.875rem 0.5rem',
                borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
                textDecoration:'none', color:'#0f172a',
                fontSize:'0.9375rem', fontWeight:'600',
                transition:'all 0.2s'
              }} className="sidebar-link">
                <span>{s.title_ar}</span>
                <span style={{color:'#ed8936', fontSize:'1.25rem', fontWeight:'700'}}>‹</span>
              </Link>
            ))}
          </div>
        </SidebarBox>
      )}

      {/* التصنيفات - جديد */}
      {categories && categories.length > 0 && (
        <SidebarBox title="📂 التصنيفات">
          <div className="sidebar-categories">
            {categories.filter((cat: Category) => cat.type === 'blog').slice(0, 5).map((cat: Category) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="sidebar-category">
                <span>{cat.name_ar}</span>
                <span className="category-count">{cat.stats?.posts || 0}</span>
              </Link>
            ))}
            <Link href="/categories" className="view-all-categories">
              جميع التصنيفات ←
            </Link>
          </div>
        </SidebarBox>
      )}

      {/* بطاقة الاتصال */}
      <div style={{
        background:'linear-gradient(135deg, #1a365d 0%, #0f172a 100%)',
        borderRadius:'1rem', padding:'2rem 1.5rem', color:'white',
        position:'relative', overflow:'hidden'
      }}>
        <div style={{
          position:'absolute', top:'-50px', right:'-50px',
          width:'200px', height:'200px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(237,137,54,0.2), transparent)',
          pointerEvents:'none'
        }}/>
        <div style={{position:'relative', zIndex:1}}>
          <div style={{
            display:'inline-block', padding:'0.375rem 0.875rem',
            background:'rgba(237,137,54,0.2)', color:'#fbd38d',
            borderRadius:'9999px', fontSize:'0.75rem',
            fontWeight:'700', marginBottom:'1rem'
          }}>
            🏗️ شركة البناء المتميز
          </div>
          <h3 style={{
            fontSize:'1.5rem', fontWeight:'900',
            marginBottom:'0.75rem', lineHeight:'1.3'
          }}>
            البناء و<br/>
            <span className="text-gradient-orange">الترميم والصيانة</span>
          </h3>
          <p style={{color:'#cbd5e0', fontSize:'0.875rem', lineHeight:'1.7', marginBottom:'1.25rem'}}>
            هل تبحث عن مختصي البناء؟<br/>
            <strong style={{color:'#fbd38d'}}>اتصل الآن</strong>
          </p>
          <a href={`tel:${SITE.phone}`} style={{
            display:'flex', alignItems:'center', gap:'0.5rem',
            padding:'0.875rem 1rem', background:'#ed8936', color:'white',
            borderRadius:'0.625rem', textDecoration:'none',
            fontWeight:'800', fontSize:'1.0625rem',
            justifyContent:'center',
            boxShadow:'0 4px 12px rgba(237,137,54,0.4)'
          }} className="sidebar-cta">
            📞 {SITE.phone}
          </a>
        </div>
      </div>

      {/* وسائل التواصل */}
      <SidebarBox title="📱 تابعنا">
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'0.5rem'}}>
          {[
            { name:'whatsapp',  icon:'💬', color:'#25d366', url:`https://wa.me/${SITE.whatsapp}` },
            { name:'twitter',   icon:'𝕏',  color:'#000',    url:'#' },
            { name:'instagram', icon:'📷', color:'#E4405F', url:'#' },
            { name:'facebook',  icon:'f',  color:'#1877F2', url:'#' },
            { name:'youtube',   icon:'▶',  color:'#FF0000', url:'#' },
          ].map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
               aria-label={s.name}
               style={{
                 display:'flex', alignItems:'center', justifyContent:'center',
                 aspectRatio:'1', background:s.color, color:'white',
                 borderRadius:'0.5rem', textDecoration:'none',
                 fontSize:'1rem', fontWeight:'700'
               }} className="social-icon">
              {s.icon}
            </a>
          ))}
        </div>
      </SidebarBox>

      {/* مقالات ذات صلة */}
      {relatedBlogs.length > 0 && (
        <SidebarBox title="📰 قد يهمك">
          <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            {relatedBlogs.map((blog: any) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} style={{
                display:'flex', gap:'0.75rem', textDecoration:'none',
                paddingBottom:'1rem', borderBottom:'1px solid #f1f5f9'
              }} className="related-blog-item">
                <div style={{
                  flexShrink:0, width:'5rem', height:'5rem',
                  borderRadius:'0.5rem', overflow:'hidden',
                  background:'linear-gradient(135deg, #667eea, #764ba2)'
                }}>
                  {blog.featured_image ? (
                    <img src={blog.featured_image} alt={blog.title_ar}
                         style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                  ) : (
                    <div style={{
                      width:'100%', height:'100%',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'1.5rem'
                    }}>📝</div>
                  )}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <h4 className="line-clamp-2" style={{
                    fontSize:'0.8125rem', fontWeight:'700',
                    color:'#0f172a', marginBottom:'0.375rem', lineHeight:'1.4'
                  }}>
                    {blog.title_ar}
                  </h4>
                  <p style={{color:'#9ca3af', fontSize:'0.6875rem'}}>
                    📅 {formatDate(blog.published_at || blog.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </SidebarBox>
      )}

      {/* أحدث المشاريع */}
      {projects.length > 0 && (
        <SidebarBox title="🏗️ أحدث المشاريع">
          <div style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
            {projects.slice(0, 4).map((p: any) => (
              <Link key={p.id} href={`/projects/${p.slug}`} style={{
                display:'flex', gap:'0.75rem', textDecoration:'none',
                padding:'0.5rem', borderRadius:'0.5rem',
                transition:'background 0.2s'
              }} className="related-project-item">
                <div style={{
                  flexShrink:0, width:'4rem', height:'4rem',
                  borderRadius:'0.5rem', overflow:'hidden',
                  background:'linear-gradient(135deg, #1a365d, #2b6cb0)'
                }}>
                  {p.main_image ? (
                    <img src={p.main_image} alt={p.title_ar}
                         style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                  ) : (
                    <div style={{
                      width:'100%', height:'100%',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'1.25rem'
                    }}>🏗️</div>
                  )}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <h4 className="line-clamp-2" style={{
                    fontSize:'0.8125rem', fontWeight:'700',
                    color:'#0f172a', marginBottom:'0.25rem', lineHeight:'1.4'
                  }}>
                    {p.title_ar}
                  </h4>
                  {p.city && (
                    <p style={{color:'#9ca3af', fontSize:'0.6875rem'}}>
                      📍 {p.city}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </SidebarBox>
      )}

      {/* الوسوم الشائعة */}
      {normalizedTags.length > 0 && (
        <SidebarBox title="🏷️ الوسوم الشائعة">
          <div className="sidebar-tags">
            {normalizedTags.slice(0, 15).map((tag: any, i: number) => (
              <Link 
                key={i} 
                href={`/tags/${tag.slug}`} 
                className="sidebar-tag"
              >
                #{tag.name_ar}
                {tag.posts_count && <span>{tag.posts_count}</span>}
              </Link>
            ))}
            <Link href="/tags" className="view-all-tags">
              عرض جميع الوسوم ←
            </Link>
          </div>
        </SidebarBox>
      )}

      {/* ساعات العمل */}
      <SidebarBox title="🕐 ساعات العمل">
        <div style={{display:'flex', flexDirection:'column', gap:'0.625rem'}}>
          {[
            { day:'الأحد - الخميس', hours:'8:00 ص - 5:00 م', open:true  },
            { day:'الجمعة',          hours:'مغلق',           open:false },
            { day:'السبت',           hours:'9:00 ص - 2:00 م', open:true  },
          ].map((d, i) => (
            <div key={i} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'0.625rem 0.75rem',
              background: d.open ? '#f0fdf4' : '#fef2f2',
              borderRadius:'0.5rem',
              border: `1px solid ${d.open ? '#bbf7d0' : '#fecaca'}`
            }}>
              <span style={{fontSize:'0.8125rem', fontWeight:'700', color:'#0f172a'}}>
                {d.day}
              </span>
              <span style={{
                fontSize:'0.75rem', fontWeight:'600',
                color: d.open ? '#15803d' : '#dc2626'
              }}>
                {d.hours}
              </span>
            </div>
          ))}
        </div>
      </SidebarBox>

      <style>{`
        .sidebar-link:hover { background:#f8faff !important; color:#1a365d !important; padding-right:1rem !important; }
        .sidebar-cta:hover { transform:translateY(-2px); }
        .social-icon:hover { transform:translateY(-3px) scale(1.1); }
        .related-blog-item:hover h4,
        .related-project-item:hover h4 { color:#ed8936 !important; }
        .related-project-item:hover { background:#f8faff; }
        
        /* التصنيفات */
        .sidebar-categories {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-category {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          color: #1a365d;
          text-decoration: none;
          border-radius: 0.5rem;
          transition: background 0.2s;
        }
        .sidebar-category:hover {
          background: #f1f5f9;
        }
        .category-count {
          background: #e2e8f0;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .view-all-categories {
          display: block;
          margin-top: 0.5rem;
          padding: 0.5rem;
          text-align: center;
          color: #ed8936;
          font-weight: 600;
          font-size: 0.75rem;
          text-decoration: none;
          border-top: 1px solid #f1f5f9;
        }
        
        /* الوسوم */
        .sidebar-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .sidebar-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.875rem;
          background: #f1f5f9;
          color: #1a365d;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .sidebar-tag:hover {
          background: #ed8936;
          color: white;
          transform: translateY(-2px);
        }
        .sidebar-tag span {
          background: rgba(0,0,0,0.1);
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          font-size: 0.625rem;
        }
        .sidebar-tag:hover span {
          background: rgba(255,255,255,0.2);
        }
        .view-all-tags {
          display: block;
          margin-top: 0.75rem;
          padding: 0.5rem;
          text-align: center;
          color: #1a365d;
          font-weight: 600;
          font-size: 0.75rem;
          text-decoration: none;
          border-top: 1px solid #f1f5f9;
          transition: color 0.2s;
        }
        .view-all-tags:hover {
          color: #ed8936;
        }
      `}</style>
    </aside>
  );
}

function SidebarBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background:'white', borderRadius:'1rem',
      padding:'1.25rem', boxShadow:'0 4px 20px rgba(0,0,0,0.04)',
      border:'1px solid #e5e7eb'
    }}>
      <h3 style={{
        fontSize:'1rem', fontWeight:'800', color:'#0f172a',
        marginBottom:'1rem', paddingBottom:'0.75rem',
        borderBottom:'3px solid #ed8936', display:'inline-block'
      }}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}