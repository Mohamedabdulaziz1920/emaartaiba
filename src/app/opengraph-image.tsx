import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'شركة البناء المتميز';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    <div style={{
      fontSize: 48,
      background: 'linear-gradient(135deg, #1a365d, #2b6cb0)',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    }}>
      <div style={{ fontSize: 60, fontWeight: 'bold' }}>البناء المتميز</div>
      <div style={{ fontSize: 30, marginTop: 20 }}>شركة مقاولات في السعودية</div>
    </div>,
    size
  );
}
