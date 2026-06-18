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
}

export default function ReviewSchema({ review }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${baseUrl}/review`,
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    itemReviewed: review.itemReviewed ? {
      '@type': review.itemReviewed.type || 'LocalBusiness',
      name: review.itemReviewed.name,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
