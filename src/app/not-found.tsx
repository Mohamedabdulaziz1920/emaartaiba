import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight:'90vh', display:'flex',
      alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #0f1729 0%, #1a365d 100%)',
      color:'white', padding:'2rem'
    }}>
      <div style={{textAlign:'center', maxWidth:'32rem'}}>
        <div style={{
          fontSize:'clamp(8rem, 20vw, 12rem)',
          fontWeight:'900', lineHeight:'1',
          background:'linear-gradient(135deg, #ed8936, #f6ad55)',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor:'transparent',
          marginBottom:'1rem'
        }}>
          404
        </div>
        <h1 style={{fontSize:'1.75rem', fontWeight:'800', marginBottom:'0.75rem'}}>
          عذراً، الصفحة غير موجودة
        </h1>
        <p style={{color:'#cbd5e0', marginBottom:'2rem', fontSize:'1.0625rem', lineHeight:'1.7'}}>
          الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو لم تكن موجودة من الأساس
        </p>
        <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
          <Link href="/" className="btn btn-secondary">
            🏠 العودة للرئيسية
          </Link>
          <Link href="/contact" className="btn btn-outline">
            📞 تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}
