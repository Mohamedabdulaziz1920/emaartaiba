'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, Eye, ArrowLeft, Sparkles,
  BookOpen, TrendingUp, ChevronLeft, ChevronRight, Newspaper
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import s from './LatestBlog.module.css';

interface Props {
  blogs: any[];
  autoplayInterval?: number;
}

interface Particle {
  x: string;
  y: string;
  d: string;
  s: string;
  delay: string;
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return date;
  }
}

function getImageUrl(image: string | null | undefined): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  if (image.startsWith('/storage')) return `${backendUrl}${image}`;
  if (image.startsWith('storage/')) return `${backendUrl}/${image}`;
  if (image.startsWith('blogs/')) return `${backendUrl}/storage/${image}`;
  return `${backendUrl}/storage/${image.replace(/^\/+/, '')}`;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    d: `${12 + Math.random() * 18}s`,
    s: `${0.4 + Math.random() * 0.8}`,
    delay: `${Math.random() * 5}s`,
  }));
}

export default function LatestBlog({ blogs, autoplayInterval = 5000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [inView, setInView] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState<Particle[]>([]);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setParticles(generateParticles(25)); }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setSlidesPerView(1);
      else if (w < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = useMemo(() => {
    if (!blogs?.length) return 0;
    return Math.max(0, blogs.length - slidesPerView);
  }, [blogs?.length, slidesPerView]);

  useEffect(() => {
    if (!autoPlay || !blogs?.length || blogs.length <= slidesPerView) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoplayInterval);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [autoPlay, blogs?.length, slidesPerView, maxIndex, autoplayInterval]);

  const pauseAutoPlay = useCallback(() => {
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  }, []);

  const goToIndex = useCallback((i: number) => {
    setCurrentIndex(Math.max(0, Math.min(i, maxIndex)));
    pauseAutoPlay();
  }, [maxIndex, pauseAutoPlay]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    pauseAutoPlay();
  }, [maxIndex, pauseAutoPlay]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    pauseAutoPlay();
  }, [maxIndex, pauseAutoPlay]);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - dragStart);
  };
  const handleDragEnd = () => {
    if (!isDragging) return;
    if (dragOffset > 80) goToNext();
    else if (dragOffset < -80) goToPrev();
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToPrev();
      if (e.key === 'ArrowLeft') goToNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goToPrev, goToNext]);

  const handleImageError = (id: number) =>
    setImageErrors(prev => ({ ...prev, [id]: true }));

  const handleImageLoad = (id: number) =>
    setLoadedImages(prev => new Set(prev).add(id));

  const onCardMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
    setHoveredCard(id);
  };

  if (!blogs?.length) return null;

  const slideWidth = 100 / slidesPerView;
  const translateX = -currentIndex * slideWidth;
  const dragPercent = isDragging && trackRef.current
    ? (dragOffset / trackRef.current.offsetWidth) * 100 : 0;
  const totalDots = maxIndex + 1;

  return (
    <section
      className={s.lbSection}
      dir="rtl"
      ref={sectionRef}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* BG */}
      <div className={s.lbBgGrid} aria-hidden="true" />
      <div className={`${s.lbBgOrb} ${s.lbOrb1}`} aria-hidden="true" />
      <div className={`${s.lbBgOrb} ${s.lbOrb2}`} aria-hidden="true" />
      <div className={`${s.lbBgOrb} ${s.lbOrb3}`} aria-hidden="true" />

      {/* Particles */}
      <div className={s.lbParticles} aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className={s.lbParticle}
            style={{
              '--x': p.x,
              '--y': p.y,
              '--d': p.d,
              '--s': p.s,
              '--delay': p.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className={s.lbContainer}>
        {/* HEADER */}
        <header className={`${s.lbHeader} ${inView ? s.lbHeaderIn : ''}`}>
          <span className={s.lbPill}>
            <i className={s.lbPillDot} />
            <Sparkles size={14} className={s.lbPillIcon} />
            مدونتنا
          </span>
          <h2 className={s.lbH2}>
            <span className={s.lbH2Grad}>أحدث المقالات والنصائح</span>
          </h2>
          <p className={s.lbSub}>
            نصائح وخبرات في مجال البناء والتشييد من خبراء الصناعة
          </p>
          <i className={s.lbHdrLine} aria-hidden="true">
            <b /><em>◆</em><b />
          </i>
        </header>

        {/* SLIDER */}
        <div className={`${s.lbSliderWrap} ${inView ? s.lbSliderWrapIn : ''}`}>
          {blogs.length > slidesPerView && (
            <>
              <button
                className={`${s.lbArrow} ${s.lbArrowPrev}`}
                onClick={goToPrev}
                aria-label="السابق"
                type="button"
              >
                <ChevronRight size={22} />
              </button>
              <button
                className={`${s.lbArrow} ${s.lbArrowNext}`}
                onClick={goToNext}
                aria-label="التالي"
                type="button"
              >
                <ChevronLeft size={22} />
              </button>
            </>
          )}

          <div
            className={s.lbViewport}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            <div
              ref={trackRef}
              className={s.lbTrack}
              style={{
                transform: `translateX(${translateX + dragPercent}%)`,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {blogs.map((blog, idx) => {
                const imageUrl = getImageUrl(blog.featured_image);
                const hasError = imageErrors[blog.id];
                const isImageLoaded = loadedImages.has(blog.id);
                const viewsCount = blog.views_count || 0;
                const isPopular = viewsCount > 500;
                const isHovered = hoveredCard === blog.id;

                return (
                  <div
                    key={blog.id}
                    className={s.lbSlide}
                    style={{ flex: `0 0 ${slideWidth}%` }}
                  >
                    <Link
                      href={`/blog/${blog.slug}`}
                      className={`${s.lbCard} ${isPopular ? s.lbPopular : ''}`}
                      style={{ '--i': idx } as React.CSSProperties}
                      onMouseMove={(e) => onCardMouseMove(e, blog.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Spotlight */}
                      <i
                        className={s.lbSpot}
                        style={{
                          opacity: isHovered ? 1 : 0,
                          background: `radial-gradient(550px circle at ${mousePos.x}% ${mousePos.y}%, rgba(237,137,54,0.25), transparent 40%)`,
                        }}
                      />
                      <i className={s.lbShine} aria-hidden="true" />

                      {/* Image */}
                      <div className={s.lbImageWrap}>
                        <div className={s.lbImageInner}>
                          {imageUrl && !hasError ? (
                            <>
                              {!isImageLoaded && (
                                <div className={s.lbSkel}>
                                  <i className={s.lbSkelBar} />
                                  <BookOpen size={40} />
                                </div>
                              )}
                              <img
                                src={imageUrl}
                                alt={blog.title_ar}
                                className={`${s.lbImg} ${isImageLoaded ? s.lbImgLoaded : ''}`}
                                onError={() => handleImageError(blog.id)}
                                onLoad={() => handleImageLoad(blog.id)}
                                loading="lazy"
                              />
                              <div className={s.lbImgOverlay} />
                            </>
                          ) : (
                            <div className={s.lbPlaceholder}>
                              <Newspaper size={56} />
                            </div>
                          )}

                          <div className={s.lbBadgesTop}>
                            {blog.category?.name_ar && (
                              <span className={s.lbCatBadge}>
                                {blog.category.name_ar}
                              </span>
                            )}
                            {isPopular && (
                              <span className={s.lbPopBadge}>
                                <TrendingUp size={11} />
                                الأكثر قراءة
                              </span>
                            )}
                          </div>

                          {blog.reading_time && (
                            <span className={s.lbReadBadge}>
                              <Clock size={11} />
                              {blog.reading_time} د
                            </span>
                          )}

                          <span className={s.lbNum}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>

                          <div className={s.lbHoverIcon}>
                            <div className={s.lbHoverCircle}>
                              <BookOpen size={22} />
                            </div>
                            <span className={s.lbHoverIconLabel}>اقرأ المقال</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={s.lbContent}>
                        <div className={s.lbMeta}>
                          <span className={s.lbMetaItem}>
                            <Calendar size={13} />
                            {formatDate(blog.published_at)}
                          </span>
                          {viewsCount > 0 && (
                            <span className={s.lbMetaItem}>
                              <Eye size={13} />
                              {formatNumber(viewsCount)}
                            </span>
                          )}
                        </div>

                        <h3 className={s.lbTitle}>{blog.title_ar}</h3>

                        {blog.excerpt_ar && (
                          <p className={s.lbExcerpt}>
                            {blog.excerpt_ar.substring(0, 110)}
                            {blog.excerpt_ar.length > 110 && '...'}
                          </p>
                        )}

                        <div className={s.lbDivider}>
                          <span className={s.lbDividerLine} />
                        </div>

                        <div className={s.lbBtnWrap}>
                          <span className={s.lbBtn}>
                            <span className={s.lbBtnIcon}>
                              <ArrowLeft size={14} />
                            </span>
                            <span>اقرأ المقال</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          {totalDots > 1 && (
            <div className={s.lbDots} role="tablist">
              {Array.from({ length: totalDots }).map((_, i) => (
                <button
                  key={i}
                  className={`${s.lbDot} ${i === currentIndex ? s.lbDotActive : ''}`}
                  onClick={() => goToIndex(i)}
                  aria-label={`الانتقال إلى الشريحة ${i + 1}`}
                  role="tab"
                  type="button"
                >
                  <span className={s.lbDotInner} />
                  <span className={s.lbDotProgress} />
                </button>
              ))}
            </div>
          )}

          {/* Counter */}
          {totalDots > 1 && (
            <div className={s.lbCounter}>
              <span className={s.lbCounterCurrent}>
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className={s.lbCounterSep}>/</span>
              <span className={s.lbCounterTotal}>
                {String(totalDots).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className={`${s.lbCta} ${inView ? s.lbCtaIn : ''}`}>
          <Link href="/blog" className={s.lbViewAll}>
            <span className={s.lbViewIcon}>
              <BookOpen size={16} />
            </span>
            <span className={s.lbViewText}>جميع المقالات</span>
            <span className={s.lbViewArrow}>
              <ArrowLeft size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}