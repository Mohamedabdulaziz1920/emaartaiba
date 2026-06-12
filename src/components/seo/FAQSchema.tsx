interface FAQ {
  question_ar: string;
  answer_ar: string;
  question_en?: string;
  answer_en?: string;
}

interface Props { 
  faqs: FAQ[];
  title?: string;
  description?: string;
}

export default function FAQSchema({ faqs, title, description }: Props) {
  if (!faqs?.length) return null;

  // تنظيف النص من HTML للحصول على نص عادي
  const cleanText = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '') // إزالة HTML tags
      .replace(/&nbsp;/g, ' ') // استبدال &nbsp;
      .replace(/&amp;/g, '&') // استبدال &amp;
      .replace(/&lt;/g, '<') // استبدال &lt;
      .replace(/&gt;/g, '>') // استبدال &gt;
      .replace(/\s+/g, ' ') // إزالة المسافات الزائدة
      .trim();
  };

  // بناء Schema الـ FAQPage
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': typeof window !== 'undefined' ? `${window.location.origin}/#faq` : '/#faq',
    ...(title && { name: title }),
    ...(description && { description: description }),
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      '@id': `#faq-question-${index + 1}`,
      name: cleanText(faq.question_ar),
      acceptedAnswer: {
        '@type': 'Answer',
        '@id': `#faq-answer-${index + 1}`,
        text: cleanText(faq.answer_ar),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
