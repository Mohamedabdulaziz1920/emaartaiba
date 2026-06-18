'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Share2, Heart, Printer, Copy, Check } from 'lucide-react';
import type { Project } from '@/lib/api';

interface Props {
  project: Project;
}

export default function ProjectDetailClient({ project }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: project.title_ar,
      text: project.excerpt_ar || project.title_ar,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      <div className="action-bar">
        <Link href="/projects" className="back-link">
          <ArrowRight size={18} />
          العودة إلى المشاريع
        </Link>

        <div className="action-buttons">
          <button onClick={handleShare} className="action-btn" title="مشاركة">
            <Share2 size={18} />
            <span>مشاركة</span>
          </button>

          <button onClick={handleCopyLink} className="action-btn" title="نسخ الرابط">
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
          </button>

          <button onClick={handlePrint} className="action-btn" title="طباعة">
            <Printer size={18} />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #1a365d;
          font-weight: 700;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .back-link:hover {
          color: #ed8936;
          gap: 0.75rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          background: #f8faff;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.5rem;
          color: #475569;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .action-btn:hover {
          background: #1a365d;
          color: white;
          border-color: #1a365d;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .action-btn span {
            display: none;
          }

          .action-btn {
            padding: 0.55rem 0.7rem;
          }
        }

        @media print {
          .action-bar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}