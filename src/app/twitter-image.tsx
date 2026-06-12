import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'شركة البناء المتميز - أفضل شركة مقاولات في السعودية';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ✅ يمكنك جلب البيانات ديناميكياً
export default async function Image() {
  // يمكنك إضافة logo أو أيقونات هنا
  const logoUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png` 
    : null;
  
  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ✅ خلفية مزخرفة */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(237, 137, 54, 0.15)',
          display: 'flex',
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
          background: 'rgba(237, 137, 54, 0.1)',
          display: 'flex',
        }}
      />
      
      {/* ✅ الأيقونة أو الـ Logo */}
      <div
        style={{
          fontSize: 80,
          marginBottom: 20,
          display: 'flex',
        }}
      >
        🏗️
      </div>
      
      {/* ✅ العنوان الرئيسي */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ffffff, #fbd38d)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        البناء المتميز
      </div>
      
      {/* ✅ الوصف */}
      <div
        style={{
          fontSize: 28,
          color: '#cbd5e0',
          textAlign: 'center',
          marginBottom: 30,
        }}
      >
        أفضل شركة مقاولات عامة في السعودية
      </div>
      
      {/* ✅ معلومات إضافية */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginTop: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🏗️</span>
          <span style={{ fontSize: 18, color: '#fbd38d' }}>مقاولات</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🎨</span>
          <span style={{ fontSize: 18, color: '#fbd38d' }}>دهانات</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🪞</span>
          <span style={{ fontSize: 18, color: '#fbd38d' }}>ديكورات</span>
        </div>
      </div>
      
      {/* ✅ شريط سفلي */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          background: 'linear-gradient(90deg, #ed8936, #f6ad55, #ed8936)',
          display: 'flex',
        }}
      />
    </div>,
    size
  );
}