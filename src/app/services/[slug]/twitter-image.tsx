// src/app/services/[slug]/twitter-image.tsx
import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';
import { getSiteSettings } from '@/lib/settings';
import { toStr } from '@/lib/typeSafe';
import { getImageUrl } from '@/lib/image';

export const runtime = 'edge';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const [service, settings] = await Promise.all([
    api.service(slug).catch(() => null),
    getSiteSettings(),
  ]);

  const title = toStr(service?.title_ar) || toStr(settings?.site_name_ar) || 'البناء المتميز';
  const siteName = toStr(settings?.site_name_ar) || 'البناء المتميز';
  const primaryColor = toStr(settings?.primary_color) || '#1a365d';
  const secondaryColor = toStr(settings?.secondary_color) || '#D4AF37';
  const excerpt = toStr(service?.excerpt_ar) || toStr(service?.meta_description_ar) || toStr(settings?.site_description_ar) || '';
  const category = service?.category?.name_ar || '';
  const imageUrl = service?.image_url || service?.og_image_url || null;

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
      {imageUrl && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: `url(${getImageUrl(imageUrl)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 40 }}>
        🛠️
      </div>

      {category && (
        <div
          style={{
            fontSize: 18,
            opacity: 0.6,
            marginBottom: 6,
            color: 'rgba(255,255,255,0.6)',
            background: 'rgba(255,255,255,0.08)',
            padding: '4px 14px',
            borderRadius: 20,
          }}
        >
          {category}
        </div>
      )}

      <div
        style={{
          fontSize: 40,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 10,
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
            fontSize: 20,
            textAlign: 'center',
            opacity: 0.75,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: '75%',
            lineHeight: 1.3,
          }}
        >
          {excerpt.length > 100 ? excerpt.substring(0, 100) + '...' : excerpt}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 25,
          right: 40,
          fontSize: 16,
          opacity: 0.5,
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        {siteName}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${secondaryColor}00, ${secondaryColor}, ${secondaryColor}dd, ${secondaryColor}00)`,
        }}
      />
    </div>,
    size
  );
}

export const alt = 'صورة الخدمة لتويتر';