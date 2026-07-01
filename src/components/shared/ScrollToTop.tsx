'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (!mounted || !show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="العودة للأعلى"
      suppressHydrationWarning
      style={{
        position:'fixed',
        bottom:'1rem',
        right:'1rem',
        zIndex:50,
        width:'2.75rem',
        height:'2.75rem',
        background:'#1a365d',
        borderRadius:'50%',
        border:'none',
        cursor:'pointer',
        display:'flex', 
        alignItems:'center', 
        justifyContent:'center',
        color:'white', 
        fontSize:'1.125rem',
        boxShadow:'0 4px 6px rgba(0,0,0,0.1)'
      }}
      className="scroll-top-btn"
    >
      ↑
      <style>{`
        @media (min-width: 768px) {
          .scroll-top-btn {
            bottom: 1.5rem !important;
            right: 1.5rem !important;
            width: 3rem !important;
            height: 3rem !important;
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </button>
  );
}
