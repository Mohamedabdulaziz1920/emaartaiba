// frontend/src/components/services/ServiceFAQ.tsx
'use client';

import { useState } from 'react';

// ============================================
// 🎯 Types
// ============================================
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
}

interface ServiceFAQProps {
  faqs?: FAQItem[];
  serviceName?: string;
  className?: string;
}

// الأسئلة الافتراضية إذا لم يتم توفيرها
const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 1,
    question: 'كم تستغرق مدة تنفيذ الخدمة؟',
    answer: 'تختلف مدة التنفيذ حسب نوع الخدمة وحجم المشروع. سيتم تحديد جدول زمني مفصل بعد دراسة احتياجاتك.',
    order: 1,
  },
  {
    id: 2,
    question: 'هل تقدمون ضمان على الخدمات؟',
    answer: 'نعم، نقدم ضمان شامل على جميع خدماتنا يصل إلى 10 سنوات على الأعمال الإنشائية و5 سنوات على التشطيبات.',
    order: 2,
  },
  {
    id: 3,
    question: 'هل لديكم فريق عمل معتمد؟',
    answer: 'نعم، جميع مهندسينا وفنينا معتمدون وذو خبرة عالية في مجال المقاولات.',
    order: 3,
  },
  {
    id: 4,
    question: 'كيف يمكنني الحصول على عرض سعر؟',
    answer: 'يمكنك التواصل معنا عبر الهاتف أو الواتساب أو نموذج الاتصال، وسنقوم بإرسال عرض سعر مفصل خلال 24 ساعة.',
    order: 4,
  },
  {
    id: 5,
    question: 'هل تقدمون خدمات استشارية؟',
    answer: 'نعم، نقدم خدمات استشارية هندسية متكاملة تشمل التصميم والإشراف وإدارة المشاريع.',
    order: 5,
  },
];

// ============================================
// 🖥️ Component
// ============================================
export default function ServiceFAQ({ faqs = DEFAULT_FAQS, serviceName, className = '' }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const title = serviceName ? `أسئلة شائعة عن ${serviceName}` : 'أسئلة شائعة';
  
  return (
    <div className={`service-faq ${className}`}>
      <div className="faq-header">
        <span className="faq-icon">❓</span>
        <h3 className="faq-title">{title}</h3>
        <p className="faq-desc">
          إجابات على أكثر الأسئلة شيوعاً حول خدماتنا
        </p>
      </div>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={faq.id} 
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
          >
            <button 
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className="faq-question-text">{faq.question}</span>
              <span className="faq-icon-indicator">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="faq-footer">
        <p>لم تجد إجابة لسؤالك؟</p>
        <Link href="/contact" className="faq-contact-btn">
          تواصل معنا
        </Link>
      </div>
      
      <style jsx>{`
        .service-faq {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        
        .faq-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .faq-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .faq-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        
        .faq-desc {
          color: #64748b;
          font-size: 0.875rem;
        }
        
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .faq-item {
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .faq-item.open {
          border-color: #ed8936;
          box-shadow: 0 4px 12px rgba(237, 137, 54, 0.1);
        }
        
        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: white;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          text-align: right;
          transition: all 0.3s ease;
        }
        
        .faq-item.open .faq-question {
          background: #fef3c7;
          color: #ed8936;
        }
        
        .faq-question-text {
          flex: 1;
          text-align: right;
        }
        
        .faq-icon-indicator {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ed8936;
          margin-left: 1rem;
        }
        
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          background: #f8fafc;
        }
        
        .faq-item.open .faq-answer {
          max-height: 300px;
        }
        
        .faq-answer p {
          padding: 1rem 1.25rem;
          color: #475569;
          font-size: 0.875rem;
          line-height: 1.7;
          margin: 0;
          border-top: 1px solid #e2e8f0;
        }
        
        .faq-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .faq-footer p {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }
        
        .faq-contact-btn {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #1a365d, #2b6cb0);
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 2rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .faq-contact-btn:hover {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

// استيراد Link إذا لم يكن موجوداً
import Link from 'next/link';