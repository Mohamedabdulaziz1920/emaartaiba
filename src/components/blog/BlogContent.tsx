'use client';

import { useEffect, useState } from 'react';

interface Props {
  content: string;
  className?: string;
}

export default function BlogContent({ content, className = '' }: Props) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById('blog-content');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max((scrolled / total) * 100, 0), 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* شريط التقدم في القراءة */}
      <div style={{
        position:'fixed',
        top:0, left:0, right:0,
        height:'4px',
        background:'rgba(0,0,0,0.05)',
        zIndex:99
      }}>
        <div style={{
          height:'100%',
          width:`${readingProgress}%`,
          background:'linear-gradient(90deg, #ed8936, #f6ad55)',
          transition:'width 0.1s ease'
        }}/>
      </div>

      <div
        id="blog-content"
        className={`blog-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style>{`
        .blog-content {
          color: #1f2937;
          font-size: 1.0625rem;
          line-height: 1.9;
        }

        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4 {
          color: #0f172a;
          font-weight: 800;
          line-height: 1.3;
          margin: 2rem 0 1rem;
        }

        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 {
          font-size: 1.625rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f1f5f9;
        }
        .blog-content h3 { font-size: 1.375rem; color: #1a365d; }
        .blog-content h4 { font-size: 1.125rem; color: #1a365d; }

        .blog-content p {
          color: #475569;
          margin-bottom: 1.25rem;
        }

        .blog-content strong {
          color: #0f172a;
          font-weight: 700;
        }

        .blog-content a {
          color: #1a365d;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .blog-content a:hover {
          color: #ed8936;
        }

        .blog-content ul,
        .blog-content ol {
          padding-right: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .blog-content li {
          color: #475569;
          line-height: 1.8;
          margin-bottom: 0.5rem;
          padding-right: 0.5rem;
        }

        .blog-content ul li::marker {
          color: #ed8936;
        }

        .blog-content ol li::marker {
          color: #1a365d;
          font-weight: 700;
        }

        .blog-content blockquote {
          border-right: 4px solid #ed8936;
          padding: 1.25rem 1.5rem;
          margin: 2rem 0;
          background: linear-gradient(135deg, #fff7ed, #ffedd5);
          border-radius: 0.75rem;
          font-style: italic;
          color: #92400e;
          font-size: 1.0625rem;
          font-weight: 500;
        }

        .blog-content blockquote p {
          color: #92400e;
          margin: 0;
        }

        .blog-content code {
          background: #f1f5f9;
          color: #1a365d;
          padding: 0.125rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.9em;
          font-family: 'Consolas', monospace;
          direction: ltr;
          display: inline-block;
        }

        .blog-content pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1.25rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          direction: ltr;
        }

        .blog-content pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2rem auto;
          display: block;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .blog-content figure {
          margin: 2rem 0;
        }

        .blog-content figcaption {
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
          margin-top: 0.75rem;
          font-style: italic;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .blog-content table th,
        .blog-content table td {
          padding: 0.875rem 1rem;
          text-align: right;
          border-bottom: 1px solid #f1f5f9;
        }

        .blog-content table th {
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          font-weight: 700;
        }

        .blog-content table tr:hover td {
          background: #f8faff;
        }

        .blog-content hr {
          border: none;
          height: 2px;
          background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
          margin: 2rem 0;
        }

        @media (max-width: 768px) {
          .blog-content { font-size: 1rem; line-height: 1.85; }
          .blog-content h1 { font-size: 1.625rem; }
          .blog-content h2 { font-size: 1.375rem; }
          .blog-content h3 { font-size: 1.25rem; }
          .blog-content blockquote {
            padding: 1rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
