import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { imageUrl } from '@/lib/image';
import { 
  Project, 
  getProjectStatusInfo, 
  formatArea 
} from '@/lib/api';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact' | 'featured';
  showCategory?: boolean;
  showStatus?: boolean;
  showLocation?: boolean;
  showArea?: boolean;
  featured?: boolean;
}

export default function ProjectCard({ 
  project, 
  variant = 'default',
  showCategory = true,
  showStatus = true,
  showLocation = true,
  showArea = false,
  featured = false,
}: ProjectCardProps) {
  if (!project) return null;

  const mainImage = project.main_image || project.cover_image || project.thumbnail || '';
  const imageSrc = mainImage ? imageUrl(mainImage) : '';
  const statusInfo = getProjectStatusInfo(project.status);
  const isFeatured = featured || project.is_featured;

  const isCompact = variant === 'compact';

  return (
    <Link href={`/projects/${project.slug}`} className="project-card">
      <div className="project-card-image">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={project.image_alt || project.title_ar}
            fill
            className="project-card-img"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="project-card-placeholder">🏗️</div>
        )}
        
        {showStatus && project.status && (
          <span className="project-card-status" style={{ background: statusInfo.color }}>
            {statusInfo.icon} {statusInfo.label}
          </span>
        )}
        
        {isFeatured && (
          <span className="project-card-featured">⭐ مميز</span>
        )}
      </div>

      <div className="project-card-content">
        {showCategory && project.category && (
          <span className="project-card-category">{project.category.name_ar}</span>
        )}
        
        <h3 className="project-card-title">{project.title_ar}</h3>
        
        {!isCompact && project.excerpt_ar && (
          <p className="project-card-excerpt">{project.excerpt_ar}</p>
        )}
        
        <div className="project-card-meta">
          {showLocation && project.city && (
            <span className="project-card-location">📍 {project.city}</span>
          )}
          {showArea && project.area_sqm && (
            <span className="project-card-area">📐 {formatArea(project.area_sqm)}</span>
          )}
        </div>
        
        <span className="project-card-link">
          {isFeatured ? 'عرض المشروع ←' : 'تفاصيل المشروع ←'}
        </span>
      </div>

      <style>{`
        .project-card {
          display: block;
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          height: 100%;
        }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }
        .project-card-image {
          height: 200px;
          position: relative;
          background: #f1f5f9;
          overflow: hidden;
        }
        .project-card-img {
          object-fit: cover;
        }
        .project-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        .project-card-status {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          z-index: 2;
        }
        .project-card-featured {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
        }
        .project-card-content {
          padding: 1rem 1.25rem 1.25rem;
        }
        .project-card-category {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #ed8936;
          background: #fef3e8;
          padding: 0.125rem 0.75rem;
          border-radius: 9999px;
          margin-bottom: 0.5rem;
        }
        .project-card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem;
          line-height: 1.3;
          transition: color 0.2s;
        }
        .project-card:hover .project-card-title {
          color: #ed8936;
        }
        .project-card-excerpt {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .project-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .project-card-location,
        .project-card-area {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .project-card-link {
          display: inline-block;
          font-weight: 600;
          font-size: 0.875rem;
          color: #1a365d;
          transition: all 0.2s;
        }
        .project-card:hover .project-card-link {
          color: #ed8936;
          transform: translateX(-4px);
        }
        @media (max-width: 768px) {
          .project-card-image {
            height: 180px;
          }
        }
      `}</style>
    </Link>
  );
}
