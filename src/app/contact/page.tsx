import type { Metadata } from 'next';
import { generateSEO, buildBreadcrumb } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { getSiteSettings } from '@/lib/settings';
import ContactPageClient from './ContactPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateSEO({
    settings,
    type: 'website',
    title: 'اتصل بنا',
    description: 'تواصل مع فريق البناء المتميز للحصول على استشارة مجانية وعرض سعر مناسب لمشروعك',
    keywords: ['اتصل بنا', 'تواصل معنا', 'استشارة مجانية', 'طلب عرض سعر', 'مقاولات'],
    url: '/contact',
  });
}

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const breadcrumbs = buildBreadcrumb({ name: 'اتصل بنا', url: '/contact' });

  return (
    <>
      <JsonLd 
        settings={settings}
        pageType="contact"
        pageTitle="اتصل بنا"
        pageDescription="تواصل مع فريق البناء المتميز للحصول على استشارة مجانية"
        pageUrl="/contact"
        breadcrumbs={breadcrumbs}
      />
      <Breadcrumb items={breadcrumbs} variant="dark" />
      <ContactPageClient />
    </>
  );
}