// src/components/seo/VideoSchema.tsx
interface Video {
  title_ar: string;
  description_ar?: string;
  contentUrl: string;
  thumbnailUrl?: string;
  uploadDate: string;
  duration?: string;
  /** embed URL مختلف عن content URL */
  embedUrl?: string;
}

interface Props {
  video: Video;
  /** معرّف فريد */
  videoId?: string | number;
}

/**
 * استخراج embed URL من YouTube/Vimeo
 */
function getEmbedUrl(url: string, customEmbed?: string): string | undefined {
  if (customEmbed) return customEmbed;

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return undefined;
}

export default function VideoSchema({ video, videoId }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const description = video.description_ar?.replace(/<[^>]*>/g, '').trim();
  const embedUrl    = getEmbedUrl(video.contentUrl, video.embedUrl);

  const schema: Record<string, any> = {
    '@context':    'https://schema.org',
    '@type':       'VideoObject',
    // ✅ ID فريد
    '@id':         `${baseUrl}/video${videoId ? `-${videoId}` : ''}`,
    name:          video.title_ar,
    contentUrl:    video.contentUrl,
    uploadDate:    video.uploadDate,
    inLanguage:    'ar-SA',
  };

  // ✅ حقول مشروطة فقط (لا undefined في JSON)
  if (description)       schema.description  = description;
  if (video.thumbnailUrl) schema.thumbnailUrl = video.thumbnailUrl;
  if (embedUrl)          schema.embedUrl     = embedUrl;
  if (video.duration)    schema.duration     = video.duration;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}