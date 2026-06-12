import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🔍</div>
        <h1>عذراً، المشروع غير موجود</h1>
        <p>
          المشروع الذي تبحث عنه غير موجود أو تم نقله إلى مكان آخر.
          <br />
          يمكنك تصفح جميع مشاريعنا من خلال الرابط أدناه.
        </p>
        <div className="not-found-actions">
          <Link href="/projects" className="primary-btn">
            <ArrowRight size={18} />
            تصفح جميع المشاريع
          </Link>
          <Link href="/" className="secondary-btn">
            🏠 العودة للرئيسية
          </Link>
        </div>
      </div>

      <style>{`
        .not-found-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: #f8faff;
        }

        .not-found-content {
          text-align: center;
          max-width: 600px;
        }

        .not-found-icon {
          font-size: 6rem;
          margin-bottom: 1.5rem;
          opacity: 0.7;
        }

        .not-found-content h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .not-found-content p {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.8;
          margin: 0 0 2rem 0;
        }

        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          border-radius: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }

        .primary-btn {
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          box-shadow: 0 8px 20px rgba(26, 54, 93, 0.25);
        }

        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(26, 54, 93, 0.35);
        }

        .secondary-btn {
          background: white;
          color: #1e293b;
          border: 2px solid #e2e8f0;
        }

        .secondary-btn:hover {
          border-color: #1a365d;
          color: #1a365d;
        }
      `}</style>
    </div>
  );
}