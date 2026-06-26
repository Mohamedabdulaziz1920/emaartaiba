// src/app/services/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { toStr } from '@/lib/typeSafe';
import { getImageUrl } from '@/lib/image';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'صورة الخدمة';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [serviceResponse, settings] = await Promise.all([
    api.service(slug).catch(() => null),
    getSiteSettings(),
  ]);

  // ✅ استخراج البيانات من الاستجابة
  const service = serviceResponse?.data;

  const title = toStr(service?.title_ar) || toStr(settings?.site_name_ar) || '';
  const siteName = toStr(settings?.site_name_ar) || '';
  const primaryColor = toStr(settings?.primary_color) || '#1a365d';
  const secondaryColor = toStr(settings?.secondary_color) || '#D4AF37';
  const excerpt = toStr(service?.excerpt_ar) || toStr(service?.meta_description_ar) || toStr(settings?.site_description_ar) || '';
  const imageUrl = service?.image ? getImageUrl(service.image) : null;

  // ✅ التحقق من وجود صورة صالحة
  const validImageUrl = imageUrl && imageUrl.startsWith('http') ? imageUrl : null;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
        color: 'white',
        padding: '40px',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {validImageUrl && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
            backgroundImage: `url(${validImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 48 }}>
        🛠️
      </div>

      <div
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 12,
          maxWidth: '85%',
          background: `linear-gradient(135deg, #ffffff, ${secondaryColor})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      {excerpt && (
        <div
          style={{
            fontSize: 24,
            textAlign: 'center',
            opacity: 0.8,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '75%',
            lineHeight: 1.4,
          }}
        >
          {excerpt.length > 120 ? excerpt.substring(0, 120) + '...' : excerpt}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 40,
          fontSize: 18,
          opacity: 0.6,
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span>{siteName || 'لمسات جيزان'}</span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${secondaryColor}00, ${secondaryColor}, ${secondaryColor}dd, ${secondaryColor}00)`,
        }}
      />
    </div>,
    size
  );
}
