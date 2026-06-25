// src/components/seo/ProductSchema.tsx
interface Product {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  slug: string;
  image?: string;
  price?: number;
  priceCurrency?: string;
  availability?: string;
  sku?: string;
  brand?: string;
}

interface Props {
  product: Product;
}

export default function ProductSchema({ product }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/products/${product.slug}`;

  // ✅ تنظيف الحقول الفارغة
  const description = product.description_ar?.replace(/<[^>]*>/g, '').trim();

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type':    'Product',
    '@id':      url,
    name:       product.name_ar,
    url,
  };

  // ✅ حقول مشروطة فقط
  if (product.name_en)  schema.alternateName = product.name_en;
  if (description)      schema.description   = description;
  if (product.image)    schema.image         = product.image;
  if (product.sku)      schema.sku           = product.sku;

  // ✅ brand فقط إذا كان موجوداً (بدون default خاص بنشاط)
  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name:    product.brand,
    };
  }

  // ✅ offers فقط إذا كان السعر موجوداً
  if (product.price) {
    schema.offers = {
      '@type':          'Offer',
      price:            product.price,
      priceCurrency:    product.priceCurrency || 'SAR',
      availability:     product.availability  || 'https://schema.org/InStock',
      url,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}