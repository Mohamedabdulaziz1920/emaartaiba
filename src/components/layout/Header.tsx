'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Search, X, ChevronDown, MessageCircle } from 'lucide-react';
import {
  settingsHelpers,
  getHeaderData,
  buildMediaUrl,
  type SiteSettings,
} from '@/lib/settings';
import type { NavItem } from '@/lib/api';
import TopBar from './TopBar';

interface Props {
  settings?: SiteSettings | null;
  navigation?: NavItem[];
}

export default function Header({ settings = {}, navigation = [] }: Props) {
  const safeSettings = settings || {};

  /* ═══ State ═══ */
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [logoError, setLogoError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ═══ بيانات الهيدر الديناميكية من قاعدة البيانات ═══ */
  const {
    siteName,
    siteTagline,
    siteLogo: siteLogoRaw,
    siteIcon,
    phone,
    whatsapp,
    ctaButtonText,
    searchPlaceholder,
    searchButtonText,
    callButtonText,
    whatsappButtonText,
    whatsappSubtext,
    mobileMenuTitle,
    mobileMenuSubtitle,
  } = getHeaderData(safeSettings);

  const siteLogo = buildMediaUrl(siteLogoRaw);

  /* ═══ معالجة عناصر القائمة ═══ */
  const navItems = useMemo(() => {
    return navigation && navigation.length > 0
      ? navigation
          .filter((item) => item.is_active !== false)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      : [];
  }, [navigation]);

  /* ═══ Effects ═══ */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setOpenDropdowns([]);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  /* ✅ إضافة كلاس loaded لمنع FOUC */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  /* ═══ Handlers ═══ */
  const toggleDropdown = useCallback((href: string) => {
    setOpenDropdowns((p) =>
      p.includes(href) ? p.filter((h) => h !== href) : [...p, href]
    );
  }, []);

  const isActive = useCallback(
    (item: NavItem) => {
      if (item.href === '/') return pathname === '/';
      if (pathname.startsWith(item.href + '/')) return true;
      return pathname === item.href;
    },
    [pathname]
  );

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  /* ═══ Render ═══ */
  return (
    <>
      <TopBar settings={safeSettings} />

      <header 
        className={`site-hdr ${scrolled ? 'site-hdr--scrolled' : ''} ${isLoaded ? 'loaded' : ''}`}
        suppressHydrationWarning
      >
        <div className="site-hdr__wrap">
          <div className="site-hdr__card">
            {/* ═══ Logo ديناميكي ═══ */}
            <Link href="/" className="site-hdr__logo" aria-label={siteName}>
              {!logoError && siteLogo ? (
                <Image
                  src={siteLogo}
                  alt={siteName}
                  width={170}
                  height={48}
                  className="site-hdr__logo-img"
                  priority
                  loading="eager"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="site-hdr__logo-fb">
                  <span className="site-hdr__logo-icon">{siteIcon}</span>
                  <div className="site-hdr__logo-text">
                    <strong>{siteName}</strong>
                    {siteTagline && <small>{siteTagline}</small>}
                  </div>
                </div>
              )}
            </Link>

            {/* ═══ Desktop Nav ═══ */}
            <nav className="site-hdr__nav" role="navigation" aria-label={siteName}>
              <ul className="site-hdr__nav-list">
                {navItems.map((item) => {
                  const active = isActive(item);
                  const hasKids = item.children && item.children.length > 0;
                  return (
                    <li key={item.id} className="site-hdr__nav-item">
                      <Link
                        href={item.href}
                        className={`site-hdr__nav-link ${active ? 'is-active' : ''}`}
                      >
                        <span>{item.label}</span>
                        {hasKids && (
                          <ChevronDown size={12} className="site-hdr__nav-chev" />
                        )}
                      </Link>

                      {hasKids && (
                        <div className="site-hdr__dropdown">
                          <div className="site-hdr__dropdown-inner">
                            {item
                              .children!.filter((c) => c.is_active !== false)
                              .sort(
                                (a, b) =>
                                  (a.sort_order || 0) - (b.sort_order || 0)
                              )
                              .map((child) => (
                                <Link
                                  key={child.id}
                                  href={child.href}
                                  className="site-hdr__dropdown-link"
                                >
                                  <span className="site-hdr__dropdown-dot" />
                                  <span>{child.label}</span>
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ═══ Actions ═══ */}
            <div className="site-hdr__actions">
              <button
                onClick={() => setSearchOpen((s) => !s)}
                className={`site-hdr__act-btn ${searchOpen ? 'is-active' : ''}`}
                aria-label={searchButtonText}
                type="button"
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>

              {phone && (
                <a
                  href={settingsHelpers.phoneLink(phone)}
                  className="site-hdr__cta"
                >
                  <Phone size={14} />
                  <span className="site-hdr__cta-label">{ctaButtonText}</span>
                </a>
              )}

              <button
                onClick={() => setOpen(!open)}
                className="site-hdr__burger"
                aria-label="القائمة"
                type="button"
              >
                <span
                  className={`site-hdr__burger-lines ${open ? 'is-open' : ''}`}
                >
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>

          {/* ═══ Search bar ═══ */}
          <div className={`site-hdr__search ${searchOpen ? 'is-open' : ''}`}>
            <form onSubmit={handleSearch} className="site-hdr__search-form">
              <Search size={18} className="site-hdr__search-icon" />
              <input
                ref={searchRef}
                type="text"
                placeholder={searchPlaceholder}
                className="site-hdr__search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="site-hdr__search-go"
                disabled={!searchQuery.trim()}
              >
                {searchButtonText}
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ═══ Mobile drawer ═══ */}
      <div className={`site-mob ${open ? 'is-open' : ''}`}>
        <div className="site-mob__overlay" onClick={() => setOpen(false)} />

        <aside className="site-mob__panel">
          <div className="site-mob__head">
            <div className="site-mob__brand">
              {!logoError && siteLogo ? (
                <Image
                  src={siteLogo}
                  alt={siteName}
                  width={120}
                  height={40}
                  className="site-mob__brand-img"
                  loading="eager"
                />
              ) : (
                <span className="site-mob__brand-icon">{siteIcon}</span>
              )}
              <div>
                <strong>{mobileMenuTitle}</strong>
                {mobileMenuSubtitle && <small>{mobileMenuSubtitle}</small>}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="site-mob__close"
              aria-label="إغلاق"
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="site-mob__search">
            <Search size={16} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <nav className="site-mob__nav">
            {navItems.map((item) => {
              const active = isActive(item);
              const hasKids = item.children && item.children.length > 0;
              const isExpanded = openDropdowns.includes(item.href);
              return (
                <div key={item.id} className="site-mob__item">
                  <div className="site-mob__row">
                    <Link
                      href={item.href}
                      className={`site-mob__link ${active ? 'is-active' : ''}`}
                      onClick={() => !hasKids && setOpen(false)}
                    >
                      <span
                        className="site-mob__link-dot"
                        style={{ background: active ? '#D4AF37' : 'transparent' }}
                      />
                      {item.label}
                    </Link>
                    {hasKids && (
                      <button
                        onClick={() => toggleDropdown(item.href)}
                        className={`site-mob__expand ${isExpanded ? 'is-open' : ''}`}
                        type="button"
                      >
                        <ChevronDown size={16} />
                      </button>
                    )}
                  </div>

                  {hasKids && (
                    <div
                      className={`site-mob__sub ${isExpanded ? 'is-open' : ''}`}
                    >
                      {item
                        .children!.filter((c) => c.is_active !== false)
                        .sort(
                          (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
                        )
                        .map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="site-mob__sublink"
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="site-mob__foot">
            {phone && (
              <a
                href={settingsHelpers.phoneLink(phone)}
                className="site-mob__foot-btn site-mob__foot-btn--call"
              >
                <Phone size={18} />
                <div>
                  <strong>{callButtonText}</strong>
                  <small>{phone}</small>
                </div>
              </a>
            )}
            {whatsapp && (
              <a
                href={settingsHelpers.whatsappLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="site-mob__foot-btn site-mob__foot-btn--wa"
              >
                <MessageCircle size={18} />
                <div>
                  <strong>{whatsappButtonText}</strong>
                  <small>{whatsappSubtext}</small>
                </div>
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* ═══════════════════ Styles ═══════════════════ */}
      <style jsx global>{`
        /* ───────── منع FOUC (بدون إخفاء العناصر) ───────── */
        .site-hdr {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .site-hdr.loaded {
          opacity: 1;
        }

        /* ⚠️ منع تطبيق opacity على العناصر الداخلية */
        .site-hdr.loaded .site-hdr__nav,
        .site-hdr.loaded .site-hdr__logo,
        .site-hdr.loaded .site-hdr__actions {
          opacity: 1;
        }

        .top-bar {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .top-bar.loaded {
          opacity: 1;
        }

        /* ───────── Header shell ───────── */
        .site-hdr {
          position: relative !important;
          z-index: 90 !important;
          padding: 0.75rem clamp(0.75rem, 2.5vw, 1.75rem) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .site-hdr--scrolled {
          position: sticky !important;
          top: 0 !important;
          padding-top: 0.4rem !important;
          padding-bottom: 0.4rem !important;
          background: rgba(15, 23, 42, 0.92) !important;
          backdrop-filter: blur(18px) saturate(1.6) !important;
          -webkit-backdrop-filter: blur(18px) saturate(1.6) !important;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.06),
            0 12px 40px rgba(0, 0, 0, 0.18) !important;
        }

        .site-hdr__wrap {
          max-width: 1380px !important;
          margin: 0 auto !important;
          position: relative !important;
          width: 100% !important;
        }

        /* ───────── Card - Grid Layout ───────── */
        .site-hdr__card {
          background: #ffffff !important;
          border-radius: 18px !important;
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.04),
            0 12px 40px rgba(0, 0, 0, 0.08) !important;
          padding: 0.5rem 0.6rem 0.5rem 1rem !important;
          display: grid !important;
          grid-template-columns: auto 1fr auto !important;
          align-items: center !important;
          gap: 1rem !important;
          min-height: 70px !important;
          transition: all 0.35s ease !important;
          box-sizing: border-box !important;
        }
        .site-hdr--scrolled .site-hdr__card {
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.06),
            0 8px 24px rgba(0, 0, 0, 0.1) !important;
          min-height: 62px !important;
          border-radius: 16px !important;
        }

        /* ───────── Logo ───────── */
        .site-hdr__logo {
          display: flex !important;
          align-items: center !important;
          text-decoration: none !important;
          flex-shrink: 0 !important;
          padding-inline-start: 0.5rem !important;
          max-width: 170px !important;
        }
        .site-hdr__logo-img {
          height: 48px !important;
          width: auto !important;
          max-width: 100% !important;
          object-fit: contain !important;
          transition: height 0.3s ease !important;
        }
        .site-hdr--scrolled .site-hdr__logo-img {
          height: 42px !important;
        }
        .site-hdr__logo-fb {
          display: flex !important;
          align-items: center !important;
          gap: 0.55rem !important;
          background: linear-gradient(135deg, #1a365d 0%, #0f172a 100%) !important;
          padding: 0.4rem 0.9rem 0.4rem 0.6rem !important;
          border-radius: 12px !important;
        }
        .site-hdr__logo-icon {
          font-size: 1.35rem !important;
        }
        .site-hdr__logo-text {
          display: flex !important;
          flex-direction: column !important;
          line-height: 1.15 !important;
        }
        .site-hdr__logo-text strong {
          font-size: 0.85rem !important;
          font-weight: 800 !important;
          color: #fff !important;
          white-space: nowrap !important;
        }
        .site-hdr__logo-text small {
          font-size: 0.62rem !important;
          color: #FFD700 !important;
          font-weight: 600 !important;
        }

        /* ═══════════ Main Navigation ═══════════ */
        .site-hdr__nav {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 0 !important;
          width: 100% !important;
        }
        .site-hdr__nav-list {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.25rem !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
          flex-wrap: nowrap !important;
        }
        .site-hdr__nav-item {
          position: relative !important;
          flex-shrink: 0 !important;
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .site-hdr__nav-link {
          position: relative !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.3rem !important;
          padding: 0.6rem 1rem !important;
          font-size: 0.875rem !important;
          font-weight: 600 !important;
          color: #334155 !important;
          text-decoration: none !important;
          border-radius: 10px !important;
          transition: all 0.25s ease !important;
          white-space: nowrap !important;
          line-height: 1 !important;
          background: transparent !important;
          border: none !important;
        }
        .site-hdr__nav-link::before {
          content: '' !important;
          position: absolute !important;
          left: 50% !important;
          bottom: 4px !important;
          width: 0 !important;
          height: 3px !important;
          border-radius: 99px !important;
          background: #D4AF37 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          transform: translateX(-50%) !important;
        }
        .site-hdr__nav-link:hover {
          color: #D4AF37 !important;
          background: rgba(212, 175, 55, 0.08) !important;
        }
        .site-hdr__nav-link:hover::before {
          width: 18px !important;
        }
        .site-hdr__nav-link.is-active {
          background: linear-gradient(135deg, #D4AF37 0%, #B8960F 100%) !important;
          color: #0f172a !important;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3) !important;
        }
        .site-hdr__nav-link.is-active::before {
          display: none !important;
        }
        .site-hdr__nav-chev {
          transition: transform 0.3s ease !important;
          opacity: 0.55 !important;
          flex-shrink: 0 !important;
        }
        .site-hdr__nav-item:hover .site-hdr__nav-chev {
          transform: rotate(180deg) !important;
          opacity: 1 !important;
          color: #D4AF37 !important;
        }

        /* ═══════════ Dropdown ═══════════ */
        .site-hdr__dropdown {
          position: absolute !important;
          top: calc(100% + 8px) !important;
          left: 50% !important;
          transform: translateX(-50%) translateY(-8px) !important;
          min-width: 220px !important;
          padding-top: 4px !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          z-index: 100 !important;
          pointer-events: none !important;
        }
        .site-hdr__nav-item:hover .site-hdr__dropdown {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateX(-50%) translateY(0) !important;
          pointer-events: auto !important;
        }
        .site-hdr__dropdown-inner {
          background: #fff !important;
          border-radius: 16px !important;
          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.14),
            0 0 0 1px rgba(0, 0, 0, 0.04) !important;
          padding: 0.5rem !important;
          overflow: hidden !important;
        }
        .site-hdr__dropdown-link {
          display: flex !important;
          align-items: center !important;
          gap: 0.6rem !important;
          padding: 0.65rem 0.95rem !important;
          border-radius: 10px !important;
          text-decoration: none !important;
          font-size: 0.84rem !important;
          font-weight: 500 !important;
          color: #475569 !important;
          transition: all 0.25s ease !important;
          white-space: nowrap !important;
        }
        .site-hdr__dropdown-link:hover {
          background: linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%) !important;
          color: #B8960F !important;
          padding-inline-start: 1.1rem !important;
        }
        .site-hdr__dropdown-dot {
          width: 6px !important;
          height: 6px !important;
          border-radius: 50% !important;
          background: #cbd5e1 !important;
          flex-shrink: 0 !important;
          transition: all 0.25s ease !important;
        }
        .site-hdr__dropdown-link:hover .site-hdr__dropdown-dot {
          background: #D4AF37 !important;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5) !important;
        }

        /* ───────── Actions ───────── */
        .site-hdr__actions {
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          flex-shrink: 0 !important;
        }
        .site-hdr__act-btn {
          width: 38px !important;
          height: 38px !important;
          border-radius: 10px !important;
          background: #f1f5f9 !important;
          color: #475569 !important;
          border: none !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
          padding: 0 !important;
        }
        .site-hdr__act-btn:hover,
        .site-hdr__act-btn.is-active {
          background: rgba(212, 175, 55, 0.15) !important;
          color: #D4AF37 !important;
        }
        .site-hdr__cta {
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.45rem !important;
          padding: 0.55rem 1.1rem !important;
          background: linear-gradient(135deg, #1a365d 0%, #0f172a 100%) !important;
          color: #fff !important;
          font-weight: 700 !important;
          font-size: 0.83rem !important;
          border-radius: 10px !important;
          text-decoration: none !important;
          transition: all 0.35s ease !important;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.22) !important;
          white-space: nowrap !important;
          line-height: 1 !important;
        }
        .site-hdr__cta:hover {
          background: linear-gradient(135deg, #D4AF37 0%, #B8960F 100%) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 18px rgba(212, 175, 55, 0.35) !important;
          color: #0f172a !important;
        }

        /* Burger */
        .site-hdr__burger {
          width: 40px !important;
          height: 40px !important;
          border-radius: 10px !important;
          background: rgba(212, 175, 55, 0.15) !important;
          color: #D4AF37 !important;
          border: none !important;
          cursor: pointer !important;
          display: none !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
          padding: 0 !important;
        }
        .site-hdr__burger:hover {
          background: #D4AF37 !important;
          color: #0f172a !important;
        }
        .site-hdr__burger-lines {
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
          width: 18px !important;
        }
        .site-hdr__burger-lines span {
          display: block !important;
          height: 2px !important;
          background: currentColor !important;
          border-radius: 99px !important;
          transition: all 0.3s ease !important;
          transform-origin: center !important;
        }
        .site-hdr__burger-lines span:nth-child(1) {
          width: 100% !important;
        }
        .site-hdr__burger-lines span:nth-child(2) {
          width: 70% !important;
        }
        .site-hdr__burger-lines span:nth-child(3) {
          width: 85% !important;
        }
        .site-hdr__burger-lines.is-open span:nth-child(1) {
          transform: translateY(6px) rotate(45deg) !important;
        }
        .site-hdr__burger-lines.is-open span:nth-child(2) {
          opacity: 0 !important;
          width: 0 !important;
        }
        .site-hdr__burger-lines.is-open span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg) !important;
          width: 100% !important;
        }

        /* ───────── Search bar ───────── */
        .site-hdr__search {
          max-height: 0 !important;
          opacity: 0 !important;
          overflow: hidden !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .site-hdr__search.is-open {
          max-height: 80px !important;
          opacity: 1 !important;
          margin-top: 0.5rem !important;
        }
        .site-hdr__search-form {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          background: #fff !important;
          border-radius: 16px !important;
          padding: 0.35rem 0.45rem 0.35rem 1rem !important;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.07),
            0 0 0 1px rgba(0, 0, 0, 0.04) !important;
        }
        .site-hdr__search-icon {
          color: #94a3b8 !important;
          flex-shrink: 0 !important;
        }
        .site-hdr__search-input {
          flex: 1 !important;
          padding: 0.6rem 0.4rem !important;
          border: none !important;
          outline: none !important;
          font-size: 0.9rem !important;
          background: transparent !important;
          color: #1e293b !important;
        }
        .site-hdr__search-input::placeholder {
          color: #94a3b8 !important;
        }
        .site-hdr__search-go {
          padding: 0.55rem 1.3rem !important;
          background: linear-gradient(135deg, #D4AF37, #FFD700) !important;
          color: #0f172a !important;
          border: none !important;
          border-radius: 12px !important;
          font-weight: 700 !important;
          font-size: 0.85rem !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          white-space: nowrap !important;
        }
        .site-hdr__search-go:hover:not(:disabled) {
          filter: brightness(1.1) !important;
          transform: scale(1.02) !important;
        }
        .site-hdr__search-go:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

        /* ═══════════════════════════════════════════
           Mobile drawer
           ═══════════════════════════════════════════ */
        .site-mob {
          position: fixed !important;
          inset: 0 !important;
          z-index: 200 !important;
          pointer-events: none !important;
          visibility: hidden !important;
        }
        .site-mob.is-open {
          pointer-events: auto !important;
          visibility: visible !important;
        }
        .site-mob__overlay {
          position: absolute !important;
          inset: 0 !important;
          background: rgba(15, 23, 42, 0.6) !important;
          backdrop-filter: blur(6px) !important;
          opacity: 0 !important;
          transition: opacity 0.35s ease !important;
        }
        .site-mob.is-open .site-mob__overlay {
          opacity: 1 !important;
        }
        .site-mob__panel {
          position: absolute !important;
          top: 0 !important;
          right: 0 !important;
          height: 100% !important;
          width: min(22rem, 88vw) !important;
          background: #fff !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.15) !important;
          transform: translateX(100%) !important;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          overflow-y: auto !important;
          overscroll-behavior: contain !important;
        }
        .site-mob.is-open .site-mob__panel {
          transform: translateX(0) !important;
        }

        .site-mob__head {
          background: linear-gradient(135deg, #1a365d 0%, #0f172a 100%) !important;
          padding: 1.2rem 1.25rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          flex-shrink: 0 !important;
        }
        .site-mob__brand {
          display: flex !important;
          align-items: center !important;
          gap: 0.65rem !important;
          color: #fff !important;
        }
        .site-mob__brand-icon {
          font-size: 1.6rem !important;
        }
        .site-mob__brand-img {
          height: 40px !important;
          width: auto !important;
          max-width: 120px !important;
          object-fit: contain !important;
          background: rgba(255, 255, 255, 0.95) !important;
          padding: 4px 8px !important;
          border-radius: 8px !important;
        }
        .site-mob__brand strong {
          display: block !important;
          font-size: 1rem !important;
          font-weight: 800 !important;
          line-height: 1.2 !important;
          color: #fff !important;
        }
        .site-mob__brand small {
          display: block !important;
          font-size: 0.7rem !important;
          color: #FFD700 !important;
          font-weight: 600 !important;
        }
        .site-mob__close {
          width: 36px !important;
          height: 36px !important;
          border-radius: 10px !important;
          background: rgba(255, 255, 255, 0.12) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
          padding: 0 !important;
        }
        .site-mob__close:hover {
          background: rgba(255, 255, 255, 0.22) !important;
        }

        .site-mob__search {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          margin: 1rem 1rem 0 !important;
          padding: 0.55rem 0.85rem !important;
          background: #f8fafc !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 12px !important;
          transition: border-color 0.3s ease !important;
        }
        .site-mob__search:focus-within {
          border-color: #D4AF37 !important;
          background: #fff !important;
        }
        .site-mob__search input {
          flex: 1 !important;
          border: none !important;
          outline: none !important;
          background: transparent !important;
          font-size: 0.85rem !important;
          color: #334155 !important;
        }
        .site-mob__search input::placeholder {
          color: #94a3b8 !important;
        }

        .site-mob__nav {
          flex: 1 !important;
          padding: 0.75rem 1rem !important;
          overflow-y: auto !important;
        }
        .site-mob__item {
          margin-bottom: 2px !important;
        }
        .site-mob__row {
          display: flex !important;
          gap: 4px !important;
        }
        .site-mob__link {
          flex: 1 !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.6rem !important;
          padding: 0.85rem 1rem !important;
          border-radius: 12px !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          color: #334155 !important;
          transition: all 0.25s ease !important;
        }
        .site-mob__link:hover {
          background: rgba(212, 175, 55, 0.15) !important;
          color: #B8960F !important;
        }
        .site-mob__link.is-active {
          background: linear-gradient(135deg, #D4AF37, #B8960F) !important;
          color: #0f172a !important;
          box-shadow: 0 3px 12px rgba(212, 175, 55, 0.3) !important;
        }
        .site-mob__link-dot {
          width: 6px !important;
          height: 6px !important;
          border-radius: 50% !important;
          flex-shrink: 0 !important;
          transition: background 0.3s ease !important;
        }
        .site-mob__expand {
          width: 42px !important;
          min-width: 42px !important;
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #64748b !important;
          transition: all 0.3s ease !important;
          padding: 0 !important;
        }
        .site-mob__expand:hover {
          background: rgba(212, 175, 55, 0.15) !important;
          border-color: #D4AF37 !important;
          color: #D4AF37 !important;
        }
        .site-mob__expand.is-open {
          background: linear-gradient(135deg, #D4AF37, #B8960F) !important;
          color: #0f172a !important;
          border-color: transparent !important;
          transform: rotate(180deg) !important;
        }

        .site-mob__sub {
          max-height: 0 !important;
          overflow: hidden !important;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .site-mob__sub.is-open {
          max-height: 400px !important;
        }
        .site-mob__sublink {
          display: block !important;
          padding: 0.65rem 1rem 0.65rem 2.8rem !important;
          text-decoration: none !important;
          font-size: 0.84rem !important;
          font-weight: 500 !important;
          color: #64748b !important;
          border-radius: 8px !important;
          transition: all 0.25s ease !important;
          position: relative !important;
        }
        .site-mob__sublink::before {
          content: '' !important;
          position: absolute !important;
          right: 1.6rem !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 4px !important;
          height: 4px !important;
          border-radius: 50% !important;
          background: #cbd5e1 !important;
          transition: all 0.25s ease !important;
        }
        .site-mob__sublink:hover {
          background: rgba(212, 175, 55, 0.15) !important;
          color: #B8960F !important;
        }
        .site-mob__sublink:hover::before {
          background: #D4AF37 !important;
          box-shadow: 0 0 6px rgba(212, 175, 55, 0.5) !important;
        }

        .site-mob__foot {
          padding: 1rem !important;
          border-top: 1px solid #f1f5f9 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0.5rem !important;
          flex-shrink: 0 !important;
        }
        .site-mob__foot-btn {
          display: flex !important;
          align-items: center !important;
          gap: 0.7rem !important;
          padding: 0.75rem 1rem !important;
          border-radius: 14px !important;
          text-decoration: none !important;
          color: #fff !important;
          font-weight: 600 !important;
          transition: all 0.3s ease !important;
        }
        .site-mob__foot-btn div {
          display: flex !important;
          flex-direction: column !important;
          line-height: 1.15 !important;
        }
        .site-mob__foot-btn strong {
          font-size: 0.85rem !important;
          color: #fff !important;
        }
        .site-mob__foot-btn small {
          font-size: 0.7rem !important;
          opacity: 0.85 !important;
          direction: ltr !important;
          unicode-bidi: plaintext !important;
          color: #fff !important;
        }
        .site-mob__foot-btn--call {
          background: linear-gradient(135deg, #1a365d 0%, #0f172a 100%) !important;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2) !important;
        }
        .site-mob__foot-btn--call:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.3) !important;
        }
        .site-mob__foot-btn--wa {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%) !important;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.2) !important;
        }
        .site-mob__foot-btn--wa:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3) !important;
        }

        /* ═══════════════════════════════════════════
           Responsive Breakpoints
           ═══════════════════════════════════════════ */
        @media (min-width: 1440px) {
          .site-hdr__nav-link {
            padding: 0.65rem 1.1rem !important;
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 1280px) {
          .site-hdr__card {
            gap: 0.75rem !important;
          }
          .site-hdr__nav-link {
            padding: 0.58rem 0.85rem !important;
            font-size: 0.84rem !important;
          }
          .site-hdr__logo-img {
            height: 44px !important;
          }
          .site-hdr__logo {
            max-width: 150px !important;
          }
        }

        @media (max-width: 1100px) {
          .site-hdr__card {
            gap: 0.5rem !important;
            padding-inline-end: 0.5rem !important;
          }
          .site-hdr__nav-list {
            gap: 0.15rem !important;
          }
          .site-hdr__nav-link {
            padding: 0.5rem 0.7rem !important;
            font-size: 0.82rem !important;
            gap: 0.2rem !important;
          }
          .site-hdr__cta {
            padding: 0.5rem 0.85rem !important;
            font-size: 0.78rem !important;
          }
        }

        @media (max-width: 1024px) {
          .site-hdr__nav {
            display: none !important;
          }
          .site-hdr__burger {
            display: flex !important;
          }
          .site-hdr__card {
            grid-template-columns: 1fr auto !important;
            gap: 0.5rem !important;
            padding-inline: 0.65rem !important;
          }
        }

        @media (max-width: 640px) {
          .site-hdr {
            padding: 0.5rem 0.65rem !important;
          }
          .site-hdr--scrolled {
            padding: 0.3rem 0.65rem !important;
          }
          .site-hdr__card {
            min-height: 58px !important;
            padding: 0.4rem 0.5rem !important;
            border-radius: 14px !important;
          }
          .site-hdr__logo-img {
            height: 38px !important;
          }
          .site-hdr__logo {
            max-width: 130px !important;
            padding-inline-start: 0.25rem !important;
          }
          .site-hdr__logo-fb {
            padding: 0.35rem 0.7rem 0.35rem 0.5rem !important;
            border-radius: 10px !important;
          }
          .site-hdr__logo-icon {
            font-size: 1.15rem !important;
          }
          .site-hdr__logo-text strong {
            font-size: 0.78rem !important;
          }
          .site-hdr__cta-label {
            display: none !important;
          }
          .site-hdr__cta {
            width: 38px !important;
            height: 38px !important;
            padding: 0 !important;
            justify-content: center !important;
            border-radius: 50% !important;
          }
          .site-hdr__act-btn {
            width: 36px !important;
            height: 36px !important;
          }
          .site-hdr__burger {
            width: 38px !important;
            height: 38px !important;
          }
        }

        @media (max-width: 380px) {
          .site-hdr__actions {
            gap: 0.3rem !important;
          }
          .site-hdr__logo-text small {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .site-hdr,
          .site-hdr__card,
          .site-hdr__nav-link,
          .site-hdr__cta,
          .site-mob__panel,
          .site-mob__overlay,
          .site-mob__sub {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}