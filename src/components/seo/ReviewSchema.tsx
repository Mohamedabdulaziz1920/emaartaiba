// src/components/seo/ReviewSchema.tsx
interface Review {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewed?: {
    name: string;
    type?: 'Product' | 'Service' | 'LocalBusiness';
  };
}

interface Props {
  review: Review;
  /** معرّف فريد للمراجعة */
  reviewId?: string | number;
}

export default function ReviewSchema({ review, reviewId }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type':    'Review',
    // ✅ ID فريد لكل مراجعة
    '@id':      `${baseUrl}/review${reviewId ? `-${reviewId}` : ''}`,
    author: {
      '@type': 'Person',
      name:    review.author,
    },
    reviewRating: {
      '@type':       'Rating',
      ratingValue:   review.rating,
      bestRating:    '5',
      worstRating:   '1',
    },
    reviewBody:    review.reviewBody,
    datePublished: review.datePublished,
  };

  // ✅ itemReviewed فقط إذا كان موجوداً (بدلاً من undefined)
  if (review.itemReviewed) {
    schema.itemReviewed = {
      '@type': review.itemReviewed.type || 'LocalBusiness',
      name:    review.itemReviewed.name,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}