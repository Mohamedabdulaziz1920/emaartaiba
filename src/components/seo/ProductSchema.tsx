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

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': url,
    name: product.name_ar,
    alternateName: product.name_en,
    description: product.description_ar?.replace(/<[^>]*>/g, ''),
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'البناء المتميز',
    },
    offers: product.price ? {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency || 'SAR',
      availability: product.availability || 'https://schema.org/InStock',
      url: url,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
