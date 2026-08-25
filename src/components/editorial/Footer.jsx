import React from 'react';

export default function Footer({ navigateTo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--paper)',
      borderTop: 'var(--border-ink)',
      paddingTop: 'var(--s8)',
      paddingBottom: 'var(--s8)',
      width: '100%'
    }}>
      <div className="container">
        <div className="grid-2col" style={{ alignItems: 'flex-start', marginBottom: 'var(--s7)' }}>
          {/* Left Column: Brand & Positioning */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
            <span className="font-display" style={{ fontSize: '36px', letterSpacing: '-0.04em', color: 'var(--ink)' }}>
              ATH TRIPATHI
            </span>
            <p className="type-body" style={{ maxWidth: '420px', color: 'var(--muted)' }}>
              AI Systems & Software Engineer. Building agents, LLM infrastructure, OCR pipelines, and distributed backends.
            </p>
            <span className="type-meta" style={{ color: 'var(--accent)' }}>
              LUCKNOW · INDIA · CSE / AI SPECIALIZATION
            </span>
          </div>

          {/* Right Column: Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--s5)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
              <span className="type-section-num">SECTIONS</span>
              <a href="#/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} className="type-meta">HOME</a>
              <a href="#/work" onClick={(e) => { e.preventDefault(); navigateTo('/work'); }} className="type-meta">SELECTED WORK</a>
              <a href="#/about" onClick={(e) => { e.preventDefault(); navigateTo('/about'); }} className="type-meta">ABOUT & TIMELINE</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
              <span className="type-section-num">CONNECT</span>
              <a href="https://github.com/ath34-tech" target="_blank" rel="noopener noreferrer" className="type-meta">GITHUB ↗</a>
              <a href="https://www.linkedin.com/in/ath-tripathi-320115230/" target="_blank" rel="noopener noreferrer" className="type-meta">LINKEDIN ↗</a>
              <a href="mailto:athtripathi@gmail.com" className="type-meta">EMAIL ↗</a>
            </div>
          </div>
        </div>

        <hr className="editorial-rule-muted" style={{ marginBottom: 'var(--s5)' }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--s3)'
        }}>
          <span className="type-meta" style={{ color: 'var(--muted)' }}>
            © {currentYear} ATH TRIPATHI. ALL RIGHTS RESERVED.
          </span>
          <span className="type-meta" style={{ color: 'var(--muted)' }}>
            EDITORIAL BROAD-SHEET ARCHITECTURE
          </span>
        </div>
      </div>
    </footer>
  );
}
