// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getSiteSettings } from '@/lib/settings';
import { toStr } from '@/lib/typeSafe';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const settings = await getSiteSettings();
  
  const siteName = toStr(settings?.site_name_ar) || toStr(settings?.site_name) || 'البناء المتميز';
  const siteDescription = toStr(settings?.site_description_ar) || toStr(settings?.site_description) || 'شركة مقاولات عامة في السعودية';
  const primaryColor = toStr(settings?.primary_color) || '#1a365d';
  const secondaryColor = toStr(settings?.secondary_color) || '#D4AF37';
  const logo = toStr(settings?.site_logo);
  const phone = toStr(settings?.phone);

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
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondaryColor}33, transparent)`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondaryColor}22, transparent)`,
          opacity: 0.3,
        }}
      />

      {logo ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <img
            src={logo}
            alt={siteName}
            style={{
              width: 100,
              height: 100,
              objectFit: 'contain',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.08)',
              padding: 12,
              border: '2px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      ) : (
        <div style={{ fontSize: 80, marginBottom: 20 }}>🏗️</div>
      )}

      <div
        style={{
          fontSize: 64,
          fontWeight: 'bold',
          background: `linear-gradient(135deg, #ffffff, ${secondaryColor})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 12,
          textAlign: 'center',
          maxWidth: '85%',
        }}
      >
        {siteName}
      </div>

      <div
        style={{
          fontSize: 32,
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          marginBottom: 16,
          maxWidth: '80%',
          opacity: 0.9,
        }}
      >
        {siteDescription}
      </div>

      {phone && (
        <div
          style={{
            fontSize: 24,
            color: secondaryColor,
            textAlign: 'center',
            opacity: 0.8,
          }}
        >
          📞 {phone}
        </div>
      )}

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

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 40,
          fontSize: 16,
          opacity: 0.4,
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        {siteName}
      </div>
    </div>,
    size
  );
}

// ✅ alt ثابت (لن يسبب أخطاء)
export const alt = 'شركة البناء المتميز - مقاولات عامة في السعودية';