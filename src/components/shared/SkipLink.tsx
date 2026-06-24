// src/components/shared/SkipLink.tsx
'use client'; // ✅ Client Component لأنه يحتاج JS

export default function SkipLink() {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onFocus={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.transform = 'translateY(-100%)';
        }}
      >
        الانتقال للمحتوى الرئيسي
      </a>

      <style jsx>{`
        .skip-link {
          position:     fixed;
          top:          0;
          right:        1rem;
          z-index:      9999;
          padding:      0.75rem 1.5rem;
          background:   var(--color-primary, #1a365d);
          color:        #ffffff;
          border-radius: 0 0 8px 8px;
          font-weight:  600;
          font-size:    0.9375rem;
          text-decoration: none;
          transform:    translateY(-100%);
          transition:   transform 0.2s ease;
        }
        .skip-link:focus {
          transform: translateY(0);
          outline: 3px solid #fff;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}