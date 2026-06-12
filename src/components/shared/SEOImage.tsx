'use client';

import { useState, useEffect } from 'react';
import { 
  generateAltText, 
  generateImageTitle, 
  getResizedImageUrl, 
  generateSrcSet,
  getImageDimensions,
  isValidImageUrl,
  getPlaceholderImage,
  type ImageSize,
  type ImageType,
  type AltTextOptions,
} from '@/lib/seo-image';

interface SEOImageProps {
  src: string;
  title: string;
  type?: ImageType;
  city?: string;
  category?: string;
  index?: number;
  clientName?: string;
  location?: string;
  year?: string;
  isFeatured?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  width?: number;
  height?: number;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  responsive?: boolean;
  prioritySizes?: ImageSize[];
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
}

export default function SEOImage({
  src,
  title,
  type = 'general',
  city,
  category,
  index,
  clientName,
  location,
  year,
  isFeatured = false,
  className = '',
  style = {},
  loading = 'lazy',
  fetchPriority = 'auto',
  width,
  height,
  sizes,
  quality = 80,
  onLoad,
  onError,
  fallbackSrc,
  responsive = true,
  prioritySizes = ['thumbnail', 'card', 'featured'],
  objectFit = 'cover',
  objectPosition = 'center',
}: SEOImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // التحقق من صحة الرابط
  const isValidSrc = isValidImageUrl(src);
  const placeholderSrc = getPlaceholderImage(width || 600, height || 400, title);

  // توليد النص البديل
  const altOptions: AltTextOptions = {
    title,
    type,
    city,
    category,
    index,
    clientName,
    location,
    year,
    isFeatured,
  };
  const alt = generateAltText(altOptions);
  const imgTitle = generateImageTitle(title, type);

  // توليد الروابط المتجاوبة
  const srcSet = responsive && isValidSrc ? generateSrcSet(src, prioritySizes) : undefined;
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  
  // الحصول على الأبعاد الافتراضية حسب النوع
  const defaultDimensions = getImageDimensions(prioritySizes[prioritySizes.length - 1] || 'featured');
  const finalWidth = width || defaultDimensions.width;
  const finalHeight = height || defaultDimensions.height;

  // معالجة الأخطاء
  useEffect(() => {
    if (!isValidSrc) {
      setImgSrc(fallbackSrc || placeholderSrc);
      setHasError(true);
    }
  }, [src, isValidSrc, fallbackSrc, placeholderSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setImgSrc(fallbackSrc || placeholderSrc);
    onError?.();
  };

  return (
    <div 
      className="seo-image-wrapper"
      style={{
        position: 'relative',
        width: finalWidth ? `${finalWidth}px` : '100%',
        height: finalHeight ? `${finalHeight}px` : 'auto',
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
      }}
    >
      {/* Skeleton Loader */}
      {isLoading && (
        <div 
          className="seo-image-skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-loading 1.5s ease-in-out infinite',
          }}
        />
      )}

      <img
        src={imgSrc}
        alt={alt}
        title={imgTitle}
        loading={loading}
        fetchPriority={fetchPriority}
        width={finalWidth}
        height={finalHeight}
        srcSet={srcSet}
        sizes={responsive ? defaultSizes : undefined}
        className={`seo-image ${className}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit,
          objectPosition,
          transition: 'opacity 0.3s ease',
          opacity: isLoading ? 0 : 1,
          ...style,
        }}
        onLoad={handleLoad}
        onError={handleError}
        itemProp="image"
      />

      <style jsx>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .seo-image {
          transition: transform 0.3s ease;
        }
        
        .seo-image-wrapper:hover .seo-image {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// صورة مصغرة (Thumbnail) - اختصار للاستخدام السريع
// ═══════════════════════════════════════════════════
export function ThumbnailImage(props: Omit<SEOImageProps, 'responsive' | 'prioritySizes'>) {
  return <SEOImage {...props} responsive={false} prioritySizes={['thumbnail']} />;
}

// ═══════════════════════════════════════════════════
// صورة مميزة (Featured) - لـ Open Graph
// ═══════════════════════════════════════════════════
export function FeaturedImage(props: Omit<SEOImageProps, 'responsive' | 'prioritySizes'>) {
  return <SEOImage {...props} prioritySizes={['featured']} fetchPriority="high" loading="eager" />;
}

// ═══════════════════════════════════════════════════
// صورة شخصية (Avatar) - للعملاء والمستخدمين
// ═══════════════════════════════════════════════════
export function AvatarImage(props: Omit<SEOImageProps, 'responsive' | 'prioritySizes' | 'objectFit'>) {
  return (
    <SEOImage 
      {...props} 
      prioritySizes={['avatar']} 
      responsive={false}
      objectFit="cover"
      style={{ borderRadius: '50%', ...props.style }}
    />
  );
}
