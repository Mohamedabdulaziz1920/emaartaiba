// src/app/services/[slug]/twitter-image.tsx
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '0',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* الصورة الجانبية */}
      {validImageUrl ? (
        <div
          style={{
            width: '45%',
            height: '100%',
            backgroundImage: `url(${validImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <div
          style={{
            width: '45%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
            fontSize: 80,
          }}
        >
          🛠️
        </div>
      )}

      {/* المحتوى */}
      <div
        style={{
          width: '55%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '40px 50px',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: 12,
            lineHeight: 1.2,
            maxWidth: '100%',
          }}
        >
          {title}
        </div>

        {excerpt && (
          <div
            style={{
              fontSize: 20,
              color: '#475569',
              marginBottom: 20,
              lineHeight: 1.4,
              maxWidth: '100%',
            }}
          >
            {excerpt.length > 120 ? excerpt.substring(0, 120) + '...' : excerpt}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 16,
            color: '#94a3b8',
          }}
        >
          <span style={{ fontWeight: 600, color: '#0f172a' }}>
            {siteName || 'لمسات جيزان'}
          </span>
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
      </div>
    </div>,
    size
  );
}
