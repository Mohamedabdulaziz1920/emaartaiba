'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // API call here
      await new Promise(r => setTimeout(r, 1000));
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="newsletter-success">
        ✅ تم الاشتراك بنجاح! شكراً لك
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="بريدك الإلكتروني"
          disabled={status === 'loading'}
          className="newsletter-input"
        />
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="newsletter-btn"
        >
          {status === 'loading' ? '⏳ جاري...' : 'اشترك الآن'}
        </button>
      </form>

      <style jsx>{`
        .newsletter-form {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .newsletter-input {
          flex: 1;
          min-width: 200px;
          padding: 0.875rem 1.25rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-text-light, white);
          border: 1px solid rgba(255, 255, 255, 0.15);
          outline: none;
          font-family: Cairo, sans-serif;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
        }

        .newsletter-input:focus {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.2);
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .newsletter-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* زر الاشتراك */
        .newsletter-btn {
          padding: 0.875rem 1.75rem;
          background: linear-gradient(135deg, 
            var(--btn-primary-bg), 
            var(--btn-primary-hover)
          );
          color: var(--btn-primary-text);
          border: none;
          border-radius: 0.75rem;
          font-family: Cairo, sans-serif;
          font-size: 0.9375rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        .newsletter-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: linear-gradient(135deg, 
            var(--btn-primary-hover), 
            var(--color-secondary-dark)
          );
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        }

        .newsletter-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .newsletter-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* رسالة النجاح */
        .newsletter-success {
          padding: 1rem 1.5rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 0.75rem;
          color: #86efac;
          font-weight: 600;
          text-align: center;
          animation: slideIn 0.4s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-input,
          .newsletter-btn {
            width: 100%;
            min-width: unset;
          }
        }
      `}</style>
    </>
  );
}