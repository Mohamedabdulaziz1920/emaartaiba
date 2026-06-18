interface Video {
  title_ar: string;
  description_ar?: string;
  contentUrl: string;
  thumbnailUrl?: string;
  uploadDate: string;
  duration?: string;
}

interface Props {
  video: Video;
}

export default function VideoSchema({ video }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${baseUrl}/video`,
    name: video.title_ar,
    description: video.description_ar?.replace(/<[^>]*>/g, ''),
    thumbnailUrl: video.thumbnailUrl,
    contentUrl: video.contentUrl,
    embedUrl: video.contentUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
