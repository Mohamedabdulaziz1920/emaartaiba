// frontend/src/app/services/[slug]/not-found.tsx
import Link from 'next/link';

export default function ServiceNotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
      <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>
        الخدمة غير موجودة
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '500px' }}>
        عذراً، الخدمة التي تبحث عنها غير متوفرة أو تم نقلها. يمكنك العودة لقائمة الخدمات.
      </p>
      <Link 
        href="/services" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.9rem 1.8rem',
          background: 'linear-gradient(135deg, #ed8936, #f59e0b)',
          color: '#fff',
          borderRadius: '0.85rem',
          fontWeight: 800,
          textDecoration: 'none',
          boxShadow: '0 10px 25px rgba(237, 137, 54, 0.35)',
        }}
      >
        ← العودة إلى الخدمات
      </Link>
    </div>
  );
}