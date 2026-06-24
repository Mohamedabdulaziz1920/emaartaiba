// src/components/seo/Breadcrumb.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BreadcrumbSchema from './BreadcrumbSchema';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface Props {
  items?: BreadcrumbItem[];
  variant?: 'light' | 'dark';
  homeText?: string;
  separator?: string;
}

// دالة لإنشاء Breadcrumb تلقائياً من URL
function generateBreadcrumbsFromPath(pathname: string, homeText: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ name: homeText, url: '/' }];
  
  let currentPath = '';
  for (const segment of paths) {
    currentPath += `/${segment}`;
    // تنسيق اسم الصفحة (إزالة الـ dash وجعلها مقروءة)
    const name = decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toLocaleUpperCase());
    
    breadcrumbs.push({
      name: name === 'Blog' ? 'المدونة' : 
            name === 'Services' ? 'خدماتنا' :
            name === 'Projects' ? 'مشاريعنا' :
            name === 'Areas' ? 'مناطق خدمتنا' :
            name === 'Contact' ? 'تواصل معنا' :
            name === 'About' ? 'من نحن' :
            name === 'Gallery' ? 'معرض الصور' :
            name === 'Faq' ? 'الأسئلة الشائعة' :
            name === 'Privacy' ? 'سياسة الخصوصية' :
            name === 'Terms' ? 'الشروط والأحكام' : name,
      url: currentPath,
    });
  }
  
  return breadcrumbs;
}

export default function Breadcrumb({ 
  items: propItems, 
  variant = 'light',
  homeText = 'الرئيسية',
  separator = '›'
}: Props) {
  const pathname = usePathname();
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  
  useEffect(() => {
    if (propItems && propItems.length > 0) {
      setItems(propItems);
    } else if (pathname && pathname !== '/') {
      setItems(generateBreadcrumbsFromPath(pathname, homeText));
    } else {
      setItems([{ name: homeText, url: '/' }]);
    }
  }, [pathname, propItems, homeText]);
  
  // ✅ حتى مع عنصر واحد، نظهر الـ Breadcrumb (لكن مخفي)
  if (items.length === 0) {
    return null;
  }
  
  // الألوان حسب التباين
  const colors = variant === 'dark'
    ? { text: '#94a3b8', link: '#90cdf4', linkHover: '#fbd38d', current: '#fbd38d', separator: '#64748b' }
    : { text: '#64748b', link: '#1a365d', linkHover: '#ed8936', current: '#0f172a', separator: '#cbd5e0' };
  
  return (
    <>
      {/* ✅ دائماً نرسل Breadcrumb Schema حتى مع عنصر واحد */}
      <BreadcrumbSchema items={items.length > 0 ? items : [{ name: homeText, url: '/' }]} />
      
      <nav aria-label="Breadcrumb" style={{
        fontSize: '0.8125rem',
        color: colors.text,
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        direction: 'rtl',
      }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const showSeparator = i > 0;
          
          return (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {showSeparator && (
                <span style={{ color: colors.separator, opacity: 0.6, fontSize: '1rem' }}>
                  {separator}
                </span>
              )}
              {isLast ? (
                <span style={{
                  color: colors.current,
                  fontWeight: '600',
                  background: variant === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                }}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  style={{
                    color: colors.link,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                  }}
                  className="breadcrumb-link"
                >
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
      
      <style jsx>{`
        .breadcrumb-link:hover {
          color: ${colors.linkHover};
          background: rgba(0, 0, 0, 0.03);
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}