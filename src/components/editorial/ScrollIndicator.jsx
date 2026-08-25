import React, { useState, useEffect } from 'react';

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(Math.round(progress));
        setVisible(window.scrollY > 250);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button 
      onClick={scrollToTop}
      className="editorial-stamp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99,
        cursor: 'pointer',
        backgroundColor: 'var(--ink)',
        color: 'var(--paper)',
        border: '1px solid var(--black)',
        boxShadow: '3px 3px 0px var(--accent)',
        padding: '8px 14px',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        transform: 'rotate(0deg)'
      }}
      title="Scroll back to top"
    >
      <span style={{ fontWeight: '700', letterSpacing: '0.05em' }}>PAGE TOP ↑</span>
      <span style={{ color: 'var(--accent)', fontSize: '10px', fontWeight: 'bold' }}>[{scrollProgress}%]</span>
    </button>
  );
}
