import React, { useState, useEffect } from 'react';

export default function EditorialHeader({ currentRoute, navigateTo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (route, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    navigateTo(route);
  };

  return (
    <header className="editorial-header" style={{
      width: '100%',
      backgroundColor: 'var(--paper)',
      borderBottom: 'var(--border-ink)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top Scroll Progress Line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        backgroundColor: 'var(--accent)',
        width: `${scrollProgress}%`,
        transition: 'width 60ms linear',
        zIndex: 101
      }} />
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Brand / Name */}
        <a 
          href="#/" 
          onClick={(e) => handleNavClick('/', e)}
          style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
        >
          <span className="font-display" style={{ fontSize: '24px', letterSpacing: '0em', fontWeight: '800', color: 'var(--ink)' }}>
            ATH TRIPATHI
          </span>
        </a>

        {/* Center Tagline / Status (Desktop Only) */}
        <div className="type-meta desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            display: 'inline-block'
          }}></span>
          <span>AI SYSTEMS / SOFTWARE ENGINEER</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a
            href="#/work"
            onClick={(e) => handleNavClick('/work', e)}
            className="type-meta"
            style={{
              color: currentRoute.startsWith('/work') ? 'var(--accent)' : 'var(--ink)',
              fontWeight: currentRoute.startsWith('/work') ? '600' : '400',
              borderBottom: currentRoute.startsWith('/work') ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'var(--transition-fast)'
            }}
          >
            WORK
          </a>
          <a
            href="#/about"
            onClick={(e) => handleNavClick('/about', e)}
            className="type-meta"
            style={{
              color: currentRoute === '/about' ? 'var(--accent)' : 'var(--ink)',
              fontWeight: currentRoute === '/about' ? '600' : '400',
              borderBottom: currentRoute === '/about' ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'var(--transition-fast)'
            }}
          >
            ABOUT
          </a>
          <a
            href="https://github.com/ath34-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="type-meta"
            style={{ color: 'var(--ink)' }}
          >
            GITHUB ↗
          </a>
          <a
            href="https://www.linkedin.com/in/ath-tripathi-320115230/"
            target="_blank"
            rel="noopener noreferrer"
            className="type-meta"
            style={{ color: 'var(--ink)' }}
          >
            LINKEDIN ↗
          </a>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-only type-meta"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            padding: '8px 12px',
            border: 'var(--border-ink)',
            backgroundColor: mobileMenuOpen ? 'var(--ink)' : 'transparent',
            color: mobileMenuOpen ? 'var(--paper)' : 'var(--ink)'
          }}
        >
          {mobileMenuOpen ? 'CLOSE ✕' : 'MENU ☰'}
        </button>
      </div>

      {/* Mobile Editorial Overlay Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--paper)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'var(--s6) var(--page-padding)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>
            <span className="type-section-num">01 / NAVIGATION</span>
            
            <a
              href="#/"
              onClick={(e) => handleNavClick('/', e)}
              className="font-display"
              style={{ fontSize: '48px', color: currentRoute === '/' ? 'var(--accent)' : 'var(--ink)' }}
            >
              HOME
            </a>
            <a
              href="#/work"
              onClick={(e) => handleNavClick('/work', e)}
              className="font-display"
              style={{ fontSize: '48px', color: currentRoute.startsWith('/work') ? 'var(--accent)' : 'var(--ink)' }}
            >
              SELECTED WORK
            </a>
            <a
              href="#/about"
              onClick={(e) => handleNavClick('/about', e)}
              className="font-display"
              style={{ fontSize: '48px', color: currentRoute === '/about' ? 'var(--accent)' : 'var(--ink)' }}
            >
              ABOUT & EXPERIENCE
            </a>
          </div>

          <div style={{
            borderTop: 'var(--border-ink)',
            paddingTop: 'var(--s4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s2)'
          }}>
            <span className="type-meta">CONNECT</span>
            <div style={{ display: 'flex', gap: 'var(--s5)', flexWrap: 'wrap' }}>
              <a href="https://github.com/ath34-tech" target="_blank" rel="noopener noreferrer" className="type-meta" style={{ color: 'var(--accent)' }}>GITHUB ↗</a>
              <a href="https://www.linkedin.com/in/ath-tripathi-320115230/" target="_blank" rel="noopener noreferrer" className="type-meta" style={{ color: 'var(--accent)' }}>LINKEDIN ↗</a>
              <a href="mailto:athtripathi@gmail.com" className="type-meta" style={{ color: 'var(--accent)' }}>EMAIL ↗</a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </header>
  );
}
