'use client';

import { useState } from 'react';

interface Props {
  url:   string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl   = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name:  'whatsapp',
      label: 'واتساب',
      icon:  '💬',
      color: '#25d366',
      url:   `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name:  'twitter',
      label: 'تويتر',
      icon:  '𝕏',
      color: '#000000',
      url:   `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name:  'facebook',
      label: 'فيسبوك',
      icon:  'f',
      color: '#1877f2',
      url:   `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name:  'linkedin',
      label: 'لينكدإن',
      icon:  'in',
      color: '#0a66c2',
      url:   `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name:  'telegram',
      label: 'تليجرام',
      icon:  '✈️',
      color: '#0088cc',
      url:   `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      display:'flex',
      flexWrap:'wrap',
      gap:'0.5rem',
      alignItems:'center'
    }}>
      {links.map(link => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`مشاركة على ${link.label}`}
          title={link.label}
          style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            width:'2.5rem',
            height:'2.5rem',
            borderRadius:'50%',
            background: link.color,
            color:'white',
            textDecoration:'none',
            fontSize: link.name === 'twitter' || link.name === 'facebook' || link.name === 'linkedin'
              ? '1.125rem'
              : '1.25rem',
            fontWeight:'700',
            transition:'transform 0.2s, box-shadow 0.2s',
            boxShadow:`0 4px 10px ${link.color}40`
          }}
          className="share-btn"
        >
          {link.icon}
        </a>
      ))}

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        aria-label="نسخ الرابط"
        title="نسخ الرابط"
        style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          width: copied ? 'auto' : '2.5rem',
          height:'2.5rem',
          padding: copied ? '0 1rem' : 0,
          borderRadius: copied ? '9999px' : '50%',
          background: copied ? '#10b981' : '#64748b',
          color:'white',
          border:'none',
          cursor:'pointer',
          fontSize: copied ? '0.8125rem' : '1.125rem',
          fontWeight:'700',
          transition:'all 0.3s',
          boxShadow:'0 4px 10px rgba(100,116,139,0.3)',
          fontFamily:'Cairo, sans-serif'
        }}
        className="share-btn"
      >
        {copied ? '✓ تم النسخ!' : '🔗'}
      </button>

      <style>{`
        .share-btn:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
}
