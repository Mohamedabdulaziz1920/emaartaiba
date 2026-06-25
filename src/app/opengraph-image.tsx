// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getSiteSettings } from '@/lib/settings';
import { toStr } from '@/lib/typeSafe';

export const runtime     = 'edge';
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ✅ alt محايد
export const alt = 'Site Open Graph Image';

export default async function Image() {
  const settings = await getSiteSettings();

  // ✅ لا defaults خاصة بنشاط
  const siteName        = toStr(settings?.site_name_ar)        ||
                          toStr(settings?.site_name)           ||
                          '';
  const siteDescription = toStr(settings?.site_description_ar) ||
                          toStr(settings?.site_description)    ||
                          '';
  const primaryColor    = toStr(settings?.primary_color)        || '#1a365d';
  const secondaryColor  = toStr(settings?.secondary_color)      || '#D4AF37';
  const phone           = toStr(settings?.phone);

  // ✅ بناء logo URL كامل
  const logoRaw     = toStr(settings?.site_logo);
  const backendUrl  = process.env.NEXT_PUBLIC_BACKEND_URL ||
                      process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ||
                      'http://localhost:8000';
  const logoUrl = logoRaw
    ? logoRaw.startsWith('http')
      ? logoRaw
      : `${backendUrl}/storage/${logoRaw.replace(/^\/+/, '').replace(/^storage\//, '')}`
    : '';

  return new ImageResponse(
    <div
      style={{
        width:          '100%',
        height:         '100%',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        background:     `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
        color:          'white',
        padding:        '40px',
        position:       'relative',
        fontFamily:     'Arial, sans-serif',
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${secondaryColor}33, transparent)`,
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute', bottom: -100, left: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${secondaryColor}22, transparent)`,
        opacity: 0.3,
      }} />

      {/* Logo or fallback */}
      {logoUrl ? (
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: 20,
        }}>
          <img
            src={logoUrl}
            alt={siteName || 'Logo'}
            style={{
              width: 100, height: 100, objectFit: 'contain',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.08)',
              padding: 12,
              border: '2px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      ) : (
        // ✅ emoji محايد
        <div style={{ fontSize: 80, marginBottom: 20 }}>🌐</div>
      )}

      {/* Site Name */}
      {siteName && (
        <div style={{
          fontSize:    64,
          fontWeight:  'bold',
          // ✅ color عادي بدلاً من gradient text
          color:       secondaryColor,
          marginBottom: 12,
          textAlign:   'center',
          maxWidth:    '85%',
        }}>
          {siteName}
        </div>
      )}

      {/* Description */}
      {siteDescription && (
        <div style={{
          fontSize:   32,
          color:      'rgba(255,255,255,0.9)',
          textAlign:  'center',
          marginBottom: 16,
          maxWidth:   '80%',
          opacity:    0.9,
        }}>
          {siteDescription}
        </div>
      )}

      {/* Phone */}
      {phone && (
        <div style={{
          fontSize:  24,
          color:     secondaryColor,
          textAlign: 'center',
          opacity:   0.8,
        }}>
          📞 {phone}
        </div>
      )}

      {/* Bottom gradient line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
        background: `linear-gradient(90deg, ${secondaryColor}00, ${secondaryColor}, ${secondaryColor}dd, ${secondaryColor}00)`,
      }} />

      {/* Watermark */}
      {siteName && (
        <div style={{
          position: 'absolute', bottom: 20, right: 40,
          fontSize: 16, opacity: 0.4,
          color: 'rgba(255,255,255,0.4)',
        }}>
          {siteName}
        </div>
      )}
    </div>,
    size
  );
}