'use client';

import Link from 'next/link';
import { imageUrl } from '@/lib/image';
import { 
  Project, 
  getProjectStatusInfo, 
  getProjectImage, 
  formatArea 
} from '@/lib/api';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact' | 'featured';
}

// دالة مساعدة للحصول على رابط الصورة
const getCardImage = (project: Project): string | null => {
  const img = getProjectImage(project);
  if (!img) return null;
  try {
    return imageUrl(img);
  } catch {
    return img;
  }
};

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const cardImage = getCardImage(project);
  const statusInfo = getProjectStatusInfo(project.status);
  const areaFormatted = formatArea(project.area_sqm);

  // ════════════════════════════════════════════
  // 🔹 Compact Variant - للقوائم الجانبية
  // ════════════════════════════════════════════
  if (variant === 'compact') {
    return (
      <Link href={`/projects/${project.slug}`} className="project-card-compact">
        <div className="compact-image-wrapper">
          {cardImage ? (
            <img
              src={cardImage}
              alt={project.image_alt || project.title_ar}
              className="compact-image"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling;
                if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
              }}
            />
          ) : null}
          <div className="compact-placeholder" style={{ display: cardImage ? 'none' : 'flex' }}>
            🏗️
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 className="compact-title">{project.title_ar}</h4>
          <div className="compact-meta">
            {project.city && (
              <span className="compact-meta-item">📍 {project.city}</span>
            )}
            {project.status && (
              <span 
                className="compact-status-dot" 
                style={{ background: statusInfo.color }}
                title={statusInfo.label}
              />
            )}
          </div>
        </div>

        <style jsx>{`
          .project-card-compact {
            display: flex;
            gap: 0.875rem;
            padding: 0.75rem;
            border-radius: 0.75rem;
            text-decoration: none;
            background: transparent;
            transition: background 0.3s ease;
            align-items: center;
          }

          .project-card-compact:hover {
            background: var(--color-bg-light, #f8faff);
          }

          .compact-image-wrapper {
            flex-shrink: 0;
            width: 5rem;
            height: 5rem;
            border-radius: 0.625rem;
            overflow: hidden;
            background: linear-gradient(135deg, var(--color-primary, #1a365d), var(--color-primary-light, #2b6cb0));
            position: relative;
          }

          .compact-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .project-card-compact:hover .compact-image {
            transform: scale(1.08);
          }

          .compact-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            color: white;
          }

          .compact-title {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--color-text-dark, #1f2937);
            margin: 0 0 0.35rem 0;
            line-height: 1.4;
            transition: color 0.3s ease;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .project-card-compact:hover .compact-title {
            color: var(--color-secondary, #ed8936);
          }

          .compact-meta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .compact-meta-item {
            color: var(--color-text-muted, #64748b);
            font-size: 0.75rem;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
          }

          .compact-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
          }
        `}</style>
      </Link>
    );
  }

  // ════════════════════════════════════════════
  // 🌟 Featured Variant - بطاقة كبيرة مميزة
  // ════════════════════════════════════════════
  if (variant === 'featured') {
    return (
      <Link href={`/projects/${project.slug}`} className="project-card-featured">
        <div className="featured-image-wrapper">
          {cardImage ? (
            <img
              src={cardImage}
              alt={project.image_alt || project.title_ar}
              title={project.image_title || project.title_ar}
              className="featured-image"
              loading="lazy"
            />
          ) : (
            <div className="featured-placeholder">🏗️</div>
          )}
          
          <div className="featured-overlay" />
          
          <span className="featured-status" style={{ background: statusInfo.color }}>
            {statusInfo.icon} {statusInfo.label}
          </span>

          <div className="featured-content-overlay">
            {project.category && (
              <span className="featured-category">{project.category.name_ar}</span>
            )}
            <h3 className="featured-title">{project.title_ar}</h3>
            {project.excerpt_ar && (
              <p className="featured-excerpt">{project.excerpt_ar}</p>
            )}
            <div className="featured-meta">
              {project.city && <span>📍 {project.city}</span>}
              {areaFormatted && <span>📐 {areaFormatted}</span>}
              {project.client_name && <span>👤 {project.client_name}</span>}
            </div>
          </div>
        </div>

        <style jsx>{`
          .project-card-featured {
            display: block;
            text-decoration: none;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            transition: all 0.3s ease;
          }

          .project-card-featured:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.18);
          }

          .featured-image-wrapper {
            position: relative;
            height: 450px;
            background: linear-gradient(135deg, var(--color-primary, #1a365d), var(--color-primary-light, #2b6cb0));
            overflow: hidden;
          }

          .featured-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .project-card-featured:hover .featured-image {
            transform: scale(1.1);
          }

          .featured-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6rem;
            color: white;
          }

          .featured-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.9));
          }

          .featured-status {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.85rem;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2;
          }

          .featured-content-overlay {
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            padding: 2rem;
            color: white;
            z-index: 2;
          }

          .featured-category {
            display: inline-block;
            padding: 0.35rem 0.85rem;
            background: rgba(237, 137, 54, 0.9);
            color: white;
            border-radius: 2rem;
            font-size: 0.75rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
          }

          .featured-title {
            font-size: 1.75rem;
            font-weight: 800;
            margin: 0 0 0.75rem 0;
            line-height: 1.3;
            text-shadow: 0 2px 8px rgba(0,0,0,0.5);
          }

          .featured-excerpt {
            font-size: 0.9rem;
            line-height: 1.6;
            opacity: 0.95;
            margin: 0 0 1rem 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .featured-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.85rem;
            opacity: 0.9;
          }

          .featured-meta span {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
          }

          @media (max-width: 768px) {
            .featured-image-wrapper {
              height: 350px;
            }
            .featured-title {
              font-size: 1.4rem;
            }
            .featured-content-overlay {
              padding: 1.5rem;
            }
          }
        `}</style>
      </Link>
    );
  }

  // ════════════════════════════════════════════
  // 🎨 Default Variant - البطاقة العادية
  // ════════════════════════════════════════════
  return (
    <Link href={`/projects/${project.slug}`} className="project-card-default">
      <div className="project-image-wrapper">
        {cardImage ? (
          <img
            src={cardImage}
            alt={project.image_alt || project.title_ar}
            title={project.image_title || project.title_ar}
            className="project-image"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling;
              if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
            }}
          />
        ) : null}
        <div className="project-image-placeholder" style={{ display: cardImage ? 'none' : 'flex' }}>
          🏗️
        </div>

        {/* شارة الحالة */}
        <span 
          className="project-status-badge" 
          style={{ background: statusInfo.color }}
        >
          {statusInfo.icon} {statusInfo.label}
        </span>

        {/* شارة مميز */}
        {project.is_featured && (
          <span className="project-featured-badge" title="مشروع مميز">
            ⭐
          </span>
        )}

        {/* عدد المشاهدات */}
        {project.views_count !== undefined && project.views_count > 0 && (
          <span className="project-views-badge" title="عدد المشاهدات">
            👁️ {project.views_count}
          </span>
        )}

        {/* تأثير التظليل السفلي */}
        <div className="project-overlay" />
      </div>

      <div className="project-content">
        {/* الوسوم */}
        <div className="project-tags">
          {project.category?.name_ar && (
            <span className="project-tag-category">
              {project.category.name_ar}
            </span>
          )}
          {project.city && (
            <span className="project-tag-city">
              📍 {project.city}
            </span>
          )}
        </div>

        {/* العنوان */}
        <h3 className="project-title">{project.title_ar}</h3>

        {/* الوصف المختصر */}
        {project.excerpt_ar && (
          <p className="project-excerpt">
            {project.excerpt_ar.length > 120
              ? `${project.excerpt_ar.substring(0, 120)}...`
              : project.excerpt_ar}
          </p>
        )}

        {/* معلومات العميل */}
        {project.client_name && (
          <div className="project-client">
            <span>👤 العميل:</span> <strong>{project.client_name}</strong>
          </div>
        )}

        {/* المعلومات السفلية */}
        {(areaFormatted || project.completion_date || project.duration) && (
          <div className="project-footer">
            {areaFormatted && (
              <span className="project-footer-item">
                📐 <strong className="project-strong">{areaFormatted}</strong>
              </span>
            )}
            {project.duration && (
              <span className="project-footer-item">
                ⏱️ {project.duration}
              </span>
            )}
            {project.completion_date && !project.duration && (
              <span className="project-footer-item">
                📅 {new Date(project.completion_date).getFullYear()}
              </span>
            )}
          </div>
        )}

        {/* رابط عرض التفاصيل */}
        <div className="project-cta">
          عرض التفاصيل
          <span>←</span>
        </div>
      </div>

      <style jsx>{`
        .project-card-default {
          background: var(--color-bg-card, #ffffff);
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          height: 100%;
          transition: all 0.3s ease;
        }

        .project-card-default:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        /* الصورة */
        .project-image-wrapper {
          height: 14rem;
          position: relative;
          background: linear-gradient(135deg, var(--color-primary, #1a365d), var(--color-primary-light, #2b6cb0));
          overflow: hidden;
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .project-card-default:hover .project-image {
          transform: scale(1.08);
        }

        .project-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          color: white;
        }

        /* الشارات */
        .project-status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 2;
        }

        .project-featured-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          width: 2.25rem;
          height: 2.25rem;
          background: linear-gradient(135deg, #f59e0b, #ed8936);
          color: white;
          border-radius: 50%;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
          z-index: 2;
        }

        .project-views-badge {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          color: white;
          padding: 0.3rem 0.7rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 600;
          z-index: 2;
        }

        /* التظليل */
        .project-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.3));
          pointer-events: none;
        }

        /* المحتوى */
        .project-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* الوسوم */
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.875rem;
        }

        .project-tag-category {
          padding: 0.3rem 0.75rem;
          background: var(--color-bg-light, #f8faff);
          color: var(--color-primary, #1a365d);
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          border: 1px solid rgba(26, 54, 93, 0.1);
        }

        .project-tag-city {
          padding: 0.3rem 0.75rem;
          background: rgba(237, 137, 54, 0.1);
          color: var(--color-secondary-dark, #dd6b20);
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        /* العنوان */
        .project-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-text-dark, #1f2937);
          margin: 0 0 0.625rem 0;
          line-height: 1.4;
          transition: color 0.3s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-card-default:hover .project-title {
          color: var(--color-primary, #1a365d);
        }

        /* الوصف */
        .project-excerpt {
          color: var(--color-text-muted, #64748b);
          font-size: 0.875rem;
          line-height: 1.7;
          margin: 0 0 0.875rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* العميل */
        .project-client {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          color: #475569;
          margin-bottom: 0.875rem;
          align-self: flex-start;
        }

        .project-client strong {
          color: var(--color-text-dark, #1f2937);
          font-weight: 700;
        }

        /* الفوتر */
        .project-footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          padding-top: 1rem;
          margin-top: auto;
          border-top: 1px solid #f1f5f9;
          color: var(--color-text-muted, #64748b);
          font-size: 0.8rem;
        }

        .project-footer-item {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .project-strong {
          color: var(--color-text-dark, #1f2937);
          font-weight: 700;
        }

        /* زر CTA */
        .project-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
          color: var(--color-primary, #1a365d);
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .project-cta span {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .project-card-default:hover .project-cta {
          color: var(--color-secondary, #ed8936);
        }

        .project-card-default:hover .project-cta span {
          transform: translateX(-5px);
        }
      `}</style>
    </Link>
  );
}