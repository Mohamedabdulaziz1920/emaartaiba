// src/app/twitter-image.tsx
import { ImageResponse } from 'next/og';
import { getSiteSettings } from '@/lib/settings';
import { toStr } from '@/lib/typeSafe';

export const runtime = 'edge';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default async function Image() {
  const settings = await getSiteSettings();
  
  const siteName = toStr(settings?.site_name_ar) || toStr(settings?.site_name) || 'البناء المتميز';
  const siteDescription = toStr(settings?.site_description_ar) || toStr(settings?.site_description) || 'شركة مقاولات عامة في السعودية';
  const primaryColor = toStr(settings?.primary_color) || '#1a365d';
  const secondaryColor = toStr(settings?.secondary_color) || '#D4AF37';
  const logo = toStr(settings?.site_logo);

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
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondaryColor}33, transparent)`,
          opacity: 0.4,
        }}
      />

      {logo ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <img
            src={logo}
            alt={siteName}
            style={{
              width: 80,
              height: 80,
              objectFit: 'contain',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.08)',
              padding: 10,
            }}
          />
        </div>
      ) : (
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏗️</div>
      )}

      <div
        style={{
          fontSize: 56,
          fontWeight: 'bold',
          background: `linear-gradient(135deg, #ffffff, ${secondaryColor})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 10,
          textAlign: 'center',
          maxWidth: '85%',
        }}
      >
        {siteName}
      </div>

      <div
        style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.85)',
          textAlign: 'center',
          maxWidth: '80%',
          opacity: 0.85,
        }}
      >
        {siteDescription}
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

export const alt = 'شركة البناء المتميز - مقاولات عامة في السعودية';