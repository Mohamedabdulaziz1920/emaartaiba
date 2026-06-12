'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { imageUrl } from '@/lib/image';
import { api, type Testimonial } from '@/lib/api';
import Link from 'next/link';

interface Props {
  featuredOnly?: boolean;
  limit?: number;
  autoplayInterval?: number;
}

export default function TestimonialsSection({
  featuredOnly = true,
  limit = 12,
  autoplayInterval = 5000,
}: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [inView, setInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // ════════════════════════════════════════
  // 🔭 Intersection Observer
  // ════════════════════════════════════════
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ════════════════════════════════════════
  // 📱 Responsive slides
  // ════════════════════════════════════════
  useEffect(() => {
    const updateSlides = () => {
      const w = window.innerWidth;
      if (w < 768) setSlidesPerView(1);
      else if (w < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
    };
    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  // ════════════════════════════════════════
  // 📡 Fetch Data
  // ════════════════════════════════════════
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = featuredOnly
          ? await api.featuredTestimonials()
          : await api.testimonials();
        setTestimonials(data.slice(0, limit));
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('حدث خطأ في تحميل آراء العملاء');
        setTestimonials(getDefaultTestimonials());
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [featuredOnly, limit]);

  // ════════════════════════════════════════
  // 🎯 Total slides (مع loop)
  // ════════════════════════════════════════
  const maxIndex = useMemo(() => {
    return Math.max(0, testimonials.length - slidesPerView);
  }, [testimonials.length, slidesPerView]);

  // ════════════════════════════════════════
  // ▶️ AutoPlay
  // ════════════════════════════════════════
  useEffect(() => {
    if (!autoPlay || testimonials.length <= slidesPerView) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoplayInterval);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, testimonials.length, slidesPerView, maxIndex, autoplayInterval]);

  // ════════════════════════════════════════
  // 🎮 Controls
  // ════════════════════════════════════════
  const pauseAutoPlay = useCallback(() => {
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  }, []);

  const goToIndex = useCallback(
    (i: number) => {
      const safeIndex = Math.max(0, Math.min(i, maxIndex));
      setCurrentIndex(safeIndex);
      pauseAutoPlay();
    },
    [maxIndex, pauseAutoPlay]
  );

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    pauseAutoPlay();
  }, [maxIndex, pauseAutoPlay]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    pauseAutoPlay();
  }, [maxIndex, pauseAutoPlay]);

  // ════════════════════════════════════════
  // 👆 Touch / Mouse Drag
  // ════════════════════════════════════════
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
    const threshold = 80;
    // في RTL: السحب لليمين = next ، اليسار = prev
    if (dragOffset > threshold) goToNext();
    else if (dragOffset < -threshold) goToPrev();
    setIsDragging(false);
    setDragOffset(0);
  };

  // ════════════════════════════════════════
  // ⌨️ Keyboard
  // ════════════════════════════════════════
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToPrev(); // RTL
      if (e.key === 'ArrowLeft') goToNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goToPrev, goToNext]);

  // ════════════════════════════════════════
  // 🛠️ Helpers
  // ════════════════════════════════════════
  const getDefaultTestimonials = (): Testimonial[] => [
    {
      id: 1, client_name: 'أحمد الغامدي', client_position: 'صاحب فيلا',
      client_company: null, client_image: null,
      content: 'تجربة استثنائية! الجودة عالية والالتزام بالمواعيد ممتاز. أنصح بهم بشدة لأي مشروع بناء.',
      excerpt: 'تجربة استثنائية! الجودة عالية والالتزام بالمواعيد ممتاز.',
      rating: 5, stars_html: '★★★★★', is_featured: true,
      approved_at: new Date().toISOString(), created_at: new Date().toISOString(),
    },
    {
      id: 2, client_name: 'سارة المحمدي', client_position: 'مديرة شركة',
      client_company: null, client_image: null,
      content: 'أفضل شركة مقاولات تعاملت معها. الفريق محترف والنتيجة فاقت التوقعات. شكراً جزيلاً!',
      excerpt: 'أفضل شركة مقاولات تعاملت معها. الفريق محترف والنتيجة فاقت التوقعات.',
      rating: 5, stars_html: '★★★★★', is_featured: true,
      approved_at: new Date().toISOString(), created_at: new Date().toISOString(),
    },
    {
      id: 3, client_name: 'محمد العتيبي', client_position: 'مستثمر عقاري',
      client_company: null, client_image: null,
      content: 'خبرة طويلة في المجال، أسعار منافسة، وجودة لا تُضاهى. شريك حقيقي في النجاح.',
      excerpt: 'خبرة طويلة في المجال، أسعار منافسة، وجودة لا تُضاهى.',
      rating: 5, stars_html: '★★★★★', is_featured: true,
      approved_at: new Date().toISOString(), created_at: new Date().toISOString(),
    },
    {
      id: 4, client_name: 'فاطمة القحطاني', client_position: 'مهندسة معمارية',
      client_company: null, client_image: null,
      content: 'دقة في التنفيذ واهتمام بأدق التفاصيل. تعاون رائع من الفريق وتسليم في الوقت المحدد.',
      excerpt: 'دقة في التنفيذ واهتمام بأدق التفاصيل.',
      rating: 5, stars_html: '★★★★★', is_featured: true,
      approved_at: new Date().toISOString(), created_at: new Date().toISOString(),
    },
    {
      id: 5, client_name: 'خالد الزهراني', client_position: 'رجل أعمال',
      client_company: null, client_image: null,
      content: 'احترافية عالية وخدمة متميزة. النتائج تفوق التوقعات والأسعار مناسبة جداً.',
      excerpt: 'احترافية عالية وخدمة متميزة.',
      rating: 5, stars_html: '★★★★★', is_featured: true,
      approved_at: new Date().toISOString(), created_at: new Date().toISOString(),
    },
  ];

  const getInitial = (name: string | undefined) => {
    if (!name || typeof name !== 'string') return 'ع';
    return name.charAt(0);
  };

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  // ════════════════════════════════════════
  // ⏳ Loading
  // ════════════════════════════════════════
  if (loading) {
    return (
      <section className="tx-section" dir="rtl">
        <div className="tx-loading">
          <div className="tx-loader">
            <span></span><span></span><span></span>
          </div>
          <p>جاري تحميل آراء العملاء...</p>
        </div>
        <style jsx>{loadingStyles}</style>
      </section>
    );
  }

  if (error && testimonials.length === 0) return null;
  if (testimonials.length === 0) return null;

  const slideWidth = 100 / slidesPerView;
  const translateX = -currentIndex * slideWidth;
  const dragPercent = isDragging && trackRef.current
    ? (dragOffset / trackRef.current.offsetWidth) * 100
    : 0;

  // عدد النقاط (dots)
  const totalDots = maxIndex + 1;

  return (
    <section
      className="tx-section"
      dir="rtl"
      ref={sectionRef}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* ═══ BG Effects ═══ */}
      <div className="tx-bg-grid" aria-hidden="true" />
      <div className="tx-bg-orb tx-orb-1" aria-hidden="true" />
      <div className="tx-bg-orb tx-orb-2" aria-hidden="true" />
      <div className="tx-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="tx-particle"
            style={
              {
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--d': `${12 + Math.random() * 16}s`,
                '--s': `${0.4 + Math.random() * 0.7}`,
                '--delay': `${Math.random() * 5}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="tx-container">
        {/* ═══ HEADER ═══ */}
        <header className={`tx-header ${inView ? 'tx-in' : ''}`}>
          <span className="tx-pill">
            <i className="tx-pill-dot" />
            <span className="tx-pill-icon">💬</span>
            آراء عملائنا
          </span>

          <h2 className="tx-h2">
            <span className="tx-h2-grad">ماذا يقول عملاؤنا؟</span>
          </h2>

          <p className="tx-sub">
            ثقة عملائنا هي أعظم إنجازاتنا. اقرأ ما يقولون عن تجربتهم معنا
          </p>

          <i className="tx-hdr-line" aria-hidden="true">
            <b /><em>◆</em><b />
          </i>
        </header>

        {/* ═══ SLIDER ═══ */}
        <div className={`tx-slider-wrap ${inView ? 'tx-in' : ''}`}>
          {/* Arrows */}
          {testimonials.length > slidesPerView && (
            <>
              <button
                className="tx-arrow tx-arrow-prev"
                onClick={goToPrev}
                aria-label="السابق"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <button
                className="tx-arrow tx-arrow-next"
                onClick={goToNext}
                aria-label="التالي"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Track */}
          <div
            className="tx-viewport"
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
              className="tx-track"
              style={{
                transform: `translateX(${translateX + dragPercent}%)`,
                transition: isDragging ? 'none' : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {testimonials.map((t, idx) => (
                <div
                  key={t.id}
                  className="tx-slide"
                  style={{ flex: `0 0 ${slideWidth}%` }}
                >
                  <article
                    className={`tx-card ${idx === currentIndex ? 'tx-active' : ''}`}
                    style={{ '--i': idx } as React.CSSProperties}
                  >
                    {/* Shine */}
                    <i className="tx-shine" aria-hidden="true" />

                    {/* Quote */}
                    <div className="tx-quote" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                      </svg>
                    </div>

                    {/* Featured Badge */}
                    {t.is_featured && (
                      <span className="tx-featured-badge">
                        <span className="tx-star-anim">⭐</span>
                        مميز
                      </span>
                    )}

                    {/* Stars */}
                    <div className="tx-stars">
                      {renderStars(t.rating).split('').map((star, i) => (
                        <span
                          key={i}
                          className={star === '★' ? 'tx-star-fill' : 'tx-star-empty'}
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          {star}
                        </span>
                      ))}
                    </div>

                    {/* Content */}
                    <p className="tx-content">{t.excerpt || t.content}</p>

                    {/* Divider */}
                    <div className="tx-divider">
                      <span></span>
                    </div>

                    {/* Author */}
                    <footer className="tx-author">
                      <div className="tx-avatar-wrap">
                        <div className="tx-avatar">
                          {t.client_image ? (
                            <img src={imageUrl(t.client_image)} alt={t.client_name} />
                          ) : (
                            <span>{getInitial(t.client_name)}</span>
                          )}
                        </div>
                        <span className="tx-avatar-ring" />
                      </div>
                      <div className="tx-author-info">
                        <h4 className="tx-author-name">{t.client_name}</h4>
                        {t.client_position && (
                          <p className="tx-author-position">
                            {t.client_position}
                            {t.client_company && ` - ${t.client_company}`}
                          </p>
                        )}
                      </div>
                    </footer>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {totalDots > 1 && (
            <div className="tx-dots" role="tablist">
              {Array.from({ length: totalDots }).map((_, i) => (
                <button
                  key={i}
                  className={`tx-dot ${i === currentIndex ? 'tx-dot-active' : ''}`}
                  onClick={() => goToIndex(i)}
                  aria-label={`الانتقال إلى الشريحة ${i + 1}`}
                  role="tab"
                >
                  <span className="tx-dot-inner" />
                  <span className="tx-dot-progress" />
                </button>
              ))}
            </div>
          )}

          {/* Counter */}
          <div className="tx-counter">
            <span className="tx-counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="tx-counter-sep">/</span>
            <span className="tx-counter-total">{String(totalDots).padStart(2, '0')}</span>
          </div>
        </div>

        {/* View All Button */}
        {testimonials.length > 0 && (
          <div className={`tx-cta ${inView ? 'tx-in' : ''}`}>
            <Link href="/testimonials" className="tx-btn">
              <span className="tx-btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }} />
                </svg>
              </span>
              <span className="tx-btn-text">عرض جميع الآراء</span>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{styles}</style>
    </section>
  );
}

// ════════════════════════════════════════
// Loading Styles
// ════════════════════════════════════════
const loadingStyles = `
  .tx-section {
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(170deg, #fafaf9 0%, #fff7ed 50%, #fafaf9 100%);
    padding: 4rem 0;
  }
  .tx-loading {
    text-align: center;
  }
  .tx-loader {
    display: flex;
    gap: 0.6rem;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  .tx-loader span {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ed8936, #f59e0b);
    animation: tx-load-bounce 1.4s ease-in-out infinite;
  }
  .tx-loader span:nth-child(2) { animation-delay: 0.16s; }
  .tx-loader span:nth-child(3) { animation-delay: 0.32s; }
  @keyframes tx-load-bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
    40% { transform: scale(1.2); opacity: 1; }
  }
  .tx-loading p {
    color: #c2410c;
    font-weight: 700;
    font-size: 1rem;
    margin: 0;
  }
`;

// ════════════════════════════════════════
// Main Styles
// ════════════════════════════════════════
const styles = `
  /* ══════════════════════════════════════
     🌟 SECTION
  ══════════════════════════════════════ */
  .tx-section {
    position: relative;
    overflow: hidden;
    padding: clamp(4rem, 8vw, 7rem) 0;
    background:
      radial-gradient(ellipse at top right, rgba(237,137,54,0.08), transparent 50%),
      radial-gradient(ellipse at bottom left, rgba(245,158,11,0.06), transparent 50%),
      linear-gradient(170deg, #fafaf9 0%, #fff7ed 35%, #fef3c7 65%, #fafaf9 100%);
    color: #1e293b;
  }

  .tx-container {
    position: relative;
    z-index: 4;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 clamp(1rem, 3vw, 2rem);
  }

  /* Background */
  .tx-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(237,137,54,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(237,137,54,.06) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 25%, transparent);
  }
  .tx-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    z-index: 1;
  }
  .tx-orb-1 {
    width: 550px; height: 550px;
    top: -150px; right: -150px;
    background: radial-gradient(circle, rgba(237,137,54,0.18), transparent 70%);
    animation: tx-drift 18s ease-in-out infinite;
  }
  .tx-orb-2 {
    width: 480px; height: 480px;
    bottom: -150px; left: -120px;
    background: radial-gradient(circle, rgba(245,158,11,0.16), transparent 70%);
    animation: tx-drift 22s ease-in-out infinite reverse;
  }
  @keyframes tx-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(35px, -25px) scale(1.06); }
    66% { transform: translate(-20px, 30px) scale(0.96); }
  }
  .tx-particles {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }
  .tx-particle {
    position: absolute;
    left: var(--x); top: var(--y);
    width: 4px; height: 4px;
    border-radius: 50%;
    background: rgba(237,137,54,0.6);
    box-shadow: 0 0 8px rgba(237,137,54,0.4);
    animation: tx-particle-float var(--d) ease-in-out infinite;
    animation-delay: var(--delay);
    transform: scale(var(--s));
  }
  @keyframes tx-particle-float {
    0%, 100% { transform: scale(var(--s)) translateY(0); opacity: 0.3; }
    50% { transform: scale(var(--s)) translateY(-40px); opacity: 0.9; }
  }

  /* ══════════════════════════════════════
     📌 HEADER
  ══════════════════════════════════════ */
  .tx-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto clamp(3rem, 5vw, 4.5rem);
    opacity: 0;
    transform: translateY(40px);
    transition: all .8s cubic-bezier(.16,1,.3,1);
  }
  .tx-header.tx-in { opacity: 1; transform: none; }

  .tx-pill {
    display: inline-flex;
    align-items: center;
    gap: .55rem;
    padding: .55rem 1.3rem;
    border-radius: 999px;
    font-size: .86rem;
    font-weight: 800;
    color: #c2410c;
    background: rgba(255,255,255,0.8);
    border: 1px solid rgba(237,137,54,0.3);
    margin-bottom: 1.3rem;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(237,137,54,0.1);
  }
  .tx-pill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
    animation: tx-pshine 3.5s ease-in-out infinite;
  }
  @keyframes tx-pshine { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
  .tx-pill-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #ed8936;
    box-shadow: 0 0 10px rgba(237,137,54,.7);
    animation: tx-pdot 2s ease-in-out infinite;
  }
  @keyframes tx-pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  .tx-pill-icon { font-size: 1rem; animation: tx-bounce 2s ease-in-out infinite; }
  @keyframes tx-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }

  .tx-h2 {
    margin: 0 0 1rem;
    font-size: clamp(2rem, 4.5vw, 3.4rem);
    font-weight: 900;
    line-height: 1.2;
    letter-spacing: -.025em;
  }
  .tx-h2-grad {
    background: linear-gradient(135deg, #1e293b 0%, #c2410c 50%, #ed8936 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: #1e293b;
    position: relative;
    display: inline-block;
  }
  .tx-h2-grad::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ed8936, #f59e0b, #ed8936, transparent);
    border-radius: 3px;
  }
  .tx-sub {
    margin: 1.5rem auto 0;
    max-width: 640px;
    font-size: clamp(.97rem, 1.4vw, 1.08rem);
    line-height: 2;
    color: #64748b;
  }
  .tx-hdr-line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .8rem;
    margin-top: 1.4rem;
    font-style: normal;
  }
  .tx-hdr-line b {
    width: 60px; height: 2px; border-radius: 99px;
    background: linear-gradient(90deg, transparent, rgba(237,137,54,.6), transparent);
  }
  .tx-hdr-line em {
    color: #ed8936; font-size: .6rem; font-style: normal;
    animation: tx-spin 7s linear infinite;
  }
  @keyframes tx-spin { to { transform: rotate(360deg); } }

  /* ══════════════════════════════════════
     🎠 SLIDER
  ══════════════════════════════════════ */
  .tx-slider-wrap {
    position: relative;
    opacity: 0;
    transform: translateY(40px);
    transition: all .9s cubic-bezier(.16,1,.3,1) .2s;
  }
  .tx-slider-wrap.tx-in { opacity: 1; transform: none; }

  .tx-viewport {
    overflow: hidden;
    cursor: grab;
    padding: 1.5rem 0.5rem 2rem;
    margin: 0 -0.5rem;
    user-select: none;
  }
  .tx-viewport:active { cursor: grabbing; }

  .tx-track {
    display: flex;
    will-change: transform;
  }

  .tx-slide {
    padding: 0 0.75rem;
    box-sizing: border-box;
  }

  /* ══════════════════════════════════════
     🃏 CARD
  ══════════════════════════════════════ */
  .tx-card {
    --i: 0;
    position: relative;
    height: 100%;
    min-height: 380px;
    padding: 2.5rem 2rem 2rem;
    border-radius: 1.5rem;
    background: linear-gradient(160deg, #ffffff 0%, #fffbf5 100%);
    border: 2px solid rgba(237, 137, 54, 0.15);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.06),
      0 4px 12px rgba(237, 137, 54, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    transition: all .5s cubic-bezier(.34,1.56,.64,1);
  }
  .tx-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ed8936, #f59e0b, #ed8936);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform .5s ease;
  }
  .tx-card:hover {
    transform: translateY(-8px);
    border-color: rgba(237, 137, 54, 0.4);
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.1),
      0 12px 30px rgba(237, 137, 54, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  .tx-card:hover::before { transform: scaleX(1); transform-origin: left; }

  .tx-card.tx-active {
    border-color: rgba(237, 137, 54, 0.35);
  }

  /* Shine */
  .tx-shine {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    overflow: hidden;
    pointer-events: none;
    z-index: 10;
  }
  .tx-shine::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 45%;
    height: 200%;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(237,137,54,.15) 45%,
      rgba(237,137,54,.25) 50%,
      rgba(237,137,54,.15) 55%,
      transparent 70%
    );
    transform: rotate(25deg) translateX(-100%);
    opacity: 0;
  }
  .tx-card:hover .tx-shine::before {
    opacity: 1;
    animation: tx-shine-slide 1.2s ease-out forwards;
  }
  @keyframes tx-shine-slide {
    0% { transform: rotate(25deg) translateX(-100%); }
    100% { transform: rotate(25deg) translateX(320%); }
  }

  /* Quote icon */
  .tx-quote {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    width: 3rem;
    height: 3rem;
    color: #ed8936;
    opacity: 0.15;
    transition: all .4s ease;
    z-index: 1;
  }
  .tx-quote svg {
    width: 100%;
    height: 100%;
  }
  .tx-card:hover .tx-quote {
    opacity: 0.4;
    transform: scale(1.15) rotate(-8deg);
  }

  /* Featured badge */
  .tx-featured-badge {
    position: absolute;
    top: 1.1rem;
    right: 1.1rem;
    display: inline-flex;
    align-items: center;
    gap: .3rem;
    padding: .35rem .85rem;
    border-radius: 999px;
    font-size: .7rem;
    font-weight: 800;
    background: linear-gradient(135deg, #ed8936, #f59e0b);
    color: #fff;
    box-shadow: 0 6px 18px rgba(237,137,54,.4);
    z-index: 2;
    animation: tx-bglow 2s ease-in-out infinite;
  }
  @keyframes tx-bglow {
    0%,100% { box-shadow: 0 6px 18px rgba(237,137,54,.4); }
    50% { box-shadow: 0 8px 28px rgba(237,137,54,.65); }
  }
  .tx-star-anim {
    display: inline-block;
    animation: tx-bounce 1.5s ease-in-out infinite;
  }

  /* Stars */
  .tx-stars {
    display: flex;
    gap: 0.25rem;
    margin: 0.5rem 0 1.25rem;
    font-size: 1.1rem;
    position: relative;
    z-index: 1;
  }
  .tx-star-fill {
    color: #f59e0b;
    text-shadow: 0 0 8px rgba(245,158,11,0.4);
    animation: tx-star-pop .5s ease backwards;
  }
  .tx-star-empty {
    color: #cbd5e0;
  }
  @keyframes tx-star-pop {
    0% { transform: scale(0) rotate(-180deg); opacity: 0; }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }

  /* Content */
  .tx-content {
    flex: 1;
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
    line-height: 1.85;
    color: #475569;
    font-weight: 500;
    position: relative;
    z-index: 1;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Divider */
  .tx-divider {
    display: flex;
    justify-content: center;
    margin-bottom: 1.25rem;
  }
  .tx-divider span {
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(237,137,54,0.3), transparent);
  }

  /* Author */
  .tx-author {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    z-index: 1;
  }
  .tx-avatar-wrap {
    position: relative;
    width: 54px;
    height: 54px;
    flex-shrink: 0;
  }
  .tx-avatar {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #ed8936, #f59e0b);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    font-weight: 900;
    overflow: hidden;
    box-shadow:
      0 6px 18px rgba(237,137,54,0.35),
      inset 0 1px 0 rgba(255,255,255,0.3);
    transition: transform .4s ease;
  }
  .tx-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .tx-avatar-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px dashed rgba(237,137,54,0.4);
    opacity: 0;
    transition: opacity .4s ease;
    animation: tx-spin 8s linear infinite;
  }
  .tx-card:hover .tx-avatar {
    transform: scale(1.08) rotate(-5deg);
  }
  .tx-card:hover .tx-avatar-ring {
    opacity: 1;
  }
  .tx-author-info {
    flex: 1;
    min-width: 0;
  }
  .tx-author-name {
    margin: 0 0 .15rem;
    font-size: .98rem;
    font-weight: 800;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tx-author-position {
    margin: 0;
    font-size: .78rem;
    color: #94a3b8;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ══════════════════════════════════════
     🎯 ARROWS
  ══════════════════════════════════════ */
  .tx-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 50%;
    background: #fff;
    border: 2px solid rgba(237,137,54,0.2);
    color: #c2410c;
    cursor: pointer;
    display: grid;
    place-items: center;
    box-shadow:
      0 10px 30px rgba(0,0,0,0.1),
      0 4px 12px rgba(237,137,54,0.15);
    transition: all .4s cubic-bezier(.34,1.56,.64,1);
  }
  .tx-arrow svg {
    width: 1.3rem;
    height: 1.3rem;
    transition: transform .3s ease;
  }
  .tx-arrow:hover {
    background: linear-gradient(135deg, #ed8936, #f59e0b);
    color: #fff;
    border-color: transparent;
    box-shadow:
      0 15px 40px rgba(237,137,54,0.4),
      0 6px 18px rgba(237,137,54,0.3);
    transform: translateY(-50%) scale(1.1);
  }
  .tx-arrow:active {
    transform: translateY(-50%) scale(0.95);
  }
  .tx-arrow-prev {
    right: -1.5rem;
  }
  .tx-arrow-next {
    left: -1.5rem;
  }
  .tx-arrow:hover.tx-arrow-prev svg {
    transform: translateX(3px);
  }
  .tx-arrow:hover.tx-arrow-next svg {
    transform: translateX(-3px);
  }

  /* ══════════════════════════════════════
     ● DOTS
  ══════════════════════════════════════ */
  .tx-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .6rem;
    margin-top: 2.5rem;
    flex-wrap: wrap;
  }
  .tx-dot {
    position: relative;
    width: 12px;
    height: 12px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    overflow: visible;
  }
  .tx-dot-inner {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(237,137,54,0.25);
    transition: all .4s ease;
  }
  .tx-dot-progress {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: all .4s ease;
  }
  .tx-dot:hover .tx-dot-inner {
    background: rgba(237,137,54,0.5);
    transform: scale(1.2);
  }
  .tx-dot-active .tx-dot-inner {
    background: linear-gradient(135deg, #ed8936, #f59e0b);
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(237,137,54,0.5);
  }
  .tx-dot-active .tx-dot-progress {
    border-color: rgba(237,137,54,0.5);
    animation: tx-dot-pulse 2s ease-in-out infinite;
  }
  @keyframes tx-dot-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0; }
  }

  /* ══════════════════════════════════════
     🔢 COUNTER
  ══════════════════════════════════════ */
  .tx-counter {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: .4rem;
    margin-top: 1.25rem;
    font-weight: 900;
    font-feature-settings: 'tnum';
  }
  .tx-counter-current {
    font-size: 1.6rem;
    background: linear-gradient(135deg, #ed8936, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: #ed8936;
  }
  .tx-counter-sep {
    font-size: 1rem;
    color: #cbd5e0;
  }
  .tx-counter-total {
    font-size: 1rem;
    color: #94a3b8;
  }

  /* ══════════════════════════════════════
     🔘 CTA
  ══════════════════════════════════════ */
  .tx-cta {
    text-align: center;
    margin-top: 3rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all .8s cubic-bezier(.16,1,.3,1) .4s;
  }
  .tx-cta.tx-in { opacity: 1; transform: none; }

  .tx-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: .65rem;
    padding: .85rem 1.75rem .85rem .55rem;
    border-radius: 999px;
    background: #fff;
    color: #1e293b;
    font-size: .95rem;
    font-weight: 800;
    text-decoration: none;
    overflow: hidden;
    isolation: isolate;
    box-shadow:
      0 8px 25px rgba(0,0,0,.1),
      0 4px 12px rgba(237,137,54,.15),
      inset 0 1px 0 rgba(255,255,255,.8);
    transition: all .4s cubic-bezier(.34,1.56,.64,1);
    border: 2px solid rgba(237,137,54,0.2);
  }
  .tx-btn-icon {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #ed8936, #f59e0b);
    color: #fff;
    flex-shrink: 0;
    box-shadow:
      0 4px 12px rgba(237,137,54,.45),
      inset 0 1px 0 rgba(255,255,255,.3);
    transition: all .4s cubic-bezier(.34,1.56,.64,1);
  }
  .tx-btn-icon svg {
    width: 1.05rem;
    height: 1.05rem;
    transition: transform .4s ease;
  }
  .tx-btn-text {
    position: relative;
    z-index: 1;
  }
  .tx-btn::after {
    content: '';
    position: absolute;
    top: -50%; left: -60%;
    width: 40%; height: 200%;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.5) 50%, transparent 60%);
    transform: rotate(25deg) translateX(-100%);
    opacity: 0;
    z-index: 2;
    pointer-events: none;
  }
  .tx-btn:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #ed8936, #f59e0b);
    color: #fff;
    border-color: transparent;
    padding-left: .75rem;
    padding-right: 2rem;
    box-shadow:
      0 15px 35px rgba(237,137,54,.45),
      inset 0 1px 0 rgba(255,255,255,.25);
  }
  .tx-btn:hover::after {
    opacity: 1;
    animation: tx-shine-slide 1s .1s ease-out forwards;
  }
  .tx-btn:hover .tx-btn-icon {
    background: #fff;
    color: #ed8936;
    transform: rotate(-360deg) scale(1.1);
  }

  /* ══════════════════════════════════════
     📱 RESPONSIVE
  ══════════════════════════════════════ */
  @media (max-width: 767px) {
    .tx-section { padding: 3rem 0; }
    .tx-arrow {
      width: 2.75rem;
      height: 2.75rem;
    }
    .tx-arrow-prev { right: -0.5rem; }
    .tx-arrow-next { left: -0.5rem; }
    .tx-card {
      padding: 2.25rem 1.5rem 1.75rem;
      min-height: 340px;
    }
    .tx-slide { padding: 0 0.5rem; }
    .tx-content { font-size: .9rem; }
    .tx-bg-grid { display: none; }
  }

  @media (max-width: 480px) {
    .tx-arrow {
      width: 2.5rem;
      height: 2.5rem;
    }
    .tx-arrow svg {
      width: 1.1rem;
      height: 1.1rem;
    }
    .tx-counter-current { font-size: 1.35rem; }
  }

  /* ══════════════════════════════════════
     ♿ REDUCED MOTION
  ══════════════════════════════════════ */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
    .tx-bg-orb, .tx-particles { display: none; }
  }
`;