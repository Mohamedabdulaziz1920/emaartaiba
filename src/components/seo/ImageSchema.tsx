// src/components/seo/ImageSchema.tsx
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
  /** اسم المعرض (ديناميكي) */
  galleryName?: string;
  /** وصف المعرض (ديناميكي) */
  galleryDescription?: string;
}

export default function ImageSchema({
  images,
  parentUrl,
  galleryName,
  galleryDescription,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const parent  = parentUrl || baseUrl;

  // ✅ لا نُظهر schema إذا لم توجد صور
  if (!images || images.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type':    'ImageGallery',
    '@id':      `${parent}#gallery`,
    // ✅ اسم ووصف ديناميكي بدلاً من ثابت
    name:       galleryName        || 'معرض الصور',
    ...(galleryDescription && { description: galleryDescription }),
    url:        parent,
    image: images.map((img, index) => {
      const imageObj: Record<string, any> = {
        '@type':      'ImageObject',
        '@id':        `${parent}#image-${index + 1}`,
        url:          img.url,
        contentUrl:   img.url,
        name:         img.title,
        inLanguage:   img.inLanguage || 'ar-SA',
      };

      // ✅ حقول مشروطة فقط
      if (img.description) imageObj.description = img.description;
      if (img.width)       imageObj.width       = img.width;
      if (img.height)      imageObj.height      = img.height;

      return imageObj;
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}