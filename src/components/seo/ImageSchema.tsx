interface Image {
  url: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
  inLanguage?: string;
}

interface Props {
  images: Image[];
  parentUrl?: string;
}

export default function ImageSchema({ images, parentUrl }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const parent = parentUrl || baseUrl;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${parent}#gallery`,
    name: 'معرض صور الأعمال',
    description: 'صور من مشاريعنا وأعمالنا المميزة',
    url: parent,
    image: images.map((img, index) => ({
      '@type': 'ImageObject',
      '@id': `${parent}#image-${index + 1}`,
      url: img.url,
      name: img.title,
      description: img.description,
      width: img.width || 1200,
      height: img.height || 800,
      inLanguage: img.inLanguage || 'ar-SA',
      contentUrl: img.url,
      thumbnail: img.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
