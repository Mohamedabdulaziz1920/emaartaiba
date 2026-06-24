// src/components/seo/BreadcrumbSchema.tsx

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface Props { 
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // ✅ إزالة الشرط items.length <= 1
  // حتى مع عنصر واحد، نظهره
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}