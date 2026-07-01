// src/app/loading.tsx
import { getSiteSettings, buildMediaUrl } from '@/lib/settings';

export default async function Loading() {
  // ✅ جلب الإعدادات ديناميكياً
  const settings = await getSiteSettings().catch(() => null);
  
  const siteLogo = settings?.site_logo ? buildMediaUrl(settings.site_logo) : null;
  const siteName = settings?.site_name_ar || settings?.site_name || 'جاري التحميل';
  const siteIcon = (settings?.site_icon as string) || '🏢';
  const primaryColor = (settings?.primary_color as string) || '#1a365d';
  const primaryLight = (settings?.primary_light as string) || '#2b6cb0';

  return (
    <div className="loading-container">
      <div className="loading-content">
        {/* ═══════════════════════════════════════
            🖼️ شعار الشركة - ديناميكي 100%
            ═══════════════════════════════════════ */}
        <div className="loading-logo">
          {siteLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={siteLogo}
              alt={siteName}
              className="loading-logo-image"
              loading="eager"
            />
          ) : (
            <div className="loading-logo-fallback">
              <span>{siteIcon}</span>
            </div>
          )}
        </div>

        {/* Spinner */}
        <div className="loading-spinner" />

        {/* نص التحميل */}
        <p className="loading-text">جاري التحميل...</p>
        
        {/* نقاط متحركة */}
        <div className="loading-dots">
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </div>
      </div>

      <style>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
          direction: rtl;
          padding: 2rem;
        }

        .loading-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .loading-logo {
          width: 5rem;
          height: 5rem;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(26, 54, 93, 0.1);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .loading-logo-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${primaryColor};
          color: white;
          font-size: 2.5rem;
        }

        .loading-spinner {
          width: 3.5rem;
          height: 3.5rem;
          border: 4px solid #e2e8f0;
          border-top: 4px solid ${primaryColor};
          border-right: 4px solid ${primaryLight};
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          box-shadow: 0 4px 20px rgba(26, 54, 93, 0.1);
        }

        .loading-text {
          color: #475569;
          font-weight: 600;
          font-size: 1.0625rem;
          letter-spacing: 0.025em;
          animation: pulse 1.5s ease-in-out infinite;
          margin: 0;
        }

        .loading-dots {
          display: flex;
          gap: 0.5rem;
          font-size: 1.5rem;
          color: ${primaryColor};
        }

        .loading-dots span {
          animation: dotBounce 1.4s ease-in-out infinite;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-spinner {
            animation-duration: 2s;
          }
          .loading-text {
            animation: none;
          }
          .loading-dots span {
            animation: none;
          }
        }

        @media (max-width: 640px) {
          .loading-spinner {
            width: 2.5rem;
            height: 2.5rem;
            border-width: 3px;
          }
          .loading-text {
            font-size: 0.9375rem;
          }
          .loading-logo {
            width: 4rem;
            height: 4rem;
          }
          .loading-logo-fallback {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}