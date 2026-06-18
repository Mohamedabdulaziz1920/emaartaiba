'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id:    string;
  text:  string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings]   = useState<Heading[]>([]);
  const [activeId, setActiveId]   = useState<string>('');
  const [isOpen, setIsOpen]       = useState(false);

  // استخراج العناوين من محتوى المقال
  useEffect(() => {
    const content = document.querySelector('.blog-content');
    if (!content) return;

    const elements = content.querySelectorAll('h2, h3');
    const list: Heading[] = [];

    elements.forEach((el, i) => {
      const text  = el.textContent || '';
      const id    = `heading-${i}`;
      const level = parseInt(el.tagName.charAt(1));

      el.id = id;
      list.push({ id, text, level });
    });

    setHeadings(list);
  }, []);

  // تحديد العنوان النشط حسب التمرير
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
    setIsOpen(false);
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* زر فتح TOC على الموبايل */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toc-mobile-toggle"
        aria-label="جدول المحتويات"
      >
        📑
      </button>

      {/* TOC Card */}
      <div className={`toc-container ${isOpen ? 'is-open' : ''}`}>
        <div style={{
          background:'white',
          borderRadius:'1rem',
          padding:'1.25rem',
          boxShadow:'0 4px 20px rgba(0,0,0,0.04)',
          border:'1px solid #e5e7eb'
        }}>
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            marginBottom:'1rem'
          }}>
            <h3 style={{
              fontSize:'1rem', fontWeight:'800', color:'#0f172a',
              display:'flex', alignItems:'center', gap:'0.5rem'
            }}>
              📑 محتويات المقال
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="toc-close"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </div>

          <ul style={{
            listStyle:'none',
            display:'flex', flexDirection:'column', gap:'0.25rem'
          }}>
            {headings.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => scrollToHeading(h.id)}
                  style={{
                    width:'100%',
                    textAlign:'right',
                    padding:'0.625rem 0.75rem',
                    paddingRight: h.level === 3 ? '1.5rem' : '0.75rem',
                    background: activeId === h.id
                      ? 'linear-gradient(135deg, #eff6ff, #dbeafe)'
                      : 'transparent',
                    border:'none',
                    borderRight: activeId === h.id
                      ? '3px solid #1a365d'
                      : '3px solid transparent',
                    borderRadius:'0.5rem',
                    cursor:'pointer',
                    color: activeId === h.id ? '#1a365d' : '#64748b',
                    fontSize: h.level === 2 ? '0.875rem' : '0.8125rem',
                    fontWeight: activeId === h.id ? '700' : '500',
                    fontFamily:'Cairo, sans-serif',
                    transition:'all 0.2s',
                    display:'block',
                    lineHeight:'1.5'
                  }}
                  className="toc-item"
                >
                  {h.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Backdrop للموبايل */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="toc-backdrop"
        />
      )}

      <style>{`
        .toc-mobile-toggle {
          display: flex;
          position: fixed;
          bottom: 5rem;
          left: 1rem;
          z-index: 49;
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(26,54,93,0.4);
        }

        .toc-close {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.125rem;
          color: #64748b;
          padding: 0.25rem;
        }

        .toc-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 100;
        }

        .toc-container {
          position: fixed;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%) translateX(120%);
          width: min(20rem, calc(100vw - 2rem));
          max-height: 80vh;
          overflow-y: auto;
          z-index: 101;
          transition: transform 0.3s ease;
        }

        .toc-container.is-open {
          transform: translateY(-50%) translateX(0);
        }

        .toc-item:hover {
          background: #f8faff !important;
          color: #1a365d !important;
        }

        @media (min-width: 1280px) {
          .toc-mobile-toggle,
          .toc-backdrop {
            display: none !important;
          }

          .toc-container {
            position: sticky;
            top: 6rem;
            right: auto;
            transform: none;
            width: 100%;
            max-height: calc(100vh - 8rem);
          }

          .toc-close {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
