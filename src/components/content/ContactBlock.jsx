import React from 'react';

export default function ContactBlock() {
  return (
    <section className="contact-block-section" style={{
      backgroundColor: 'var(--paper-deep)',
      border: 'var(--border-ink)',
      padding: 'var(--s8) var(--s6)',
      width: '100%',
      marginBottom: 'var(--s8)'
    }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
        <span className="type-section-num" style={{ marginBottom: 'var(--s3)', display: 'block' }}>
          04 / CONTACT & COLLABORATION
        </span>

        <h2 className="type-heading-1" style={{ fontSize: 'clamp(42px, 7vw, 92px)', marginBottom: 'var(--s4)' }}>
          LET'S BUILD<br />SOMETHING.
        </h2>

        <p className="type-body-lg" style={{ color: 'var(--muted)', marginBottom: 'var(--s6)' }}>
          Have a complex system to design, an AI product to engineer, or an interesting engineering problem? Let's connect.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--s4)'
        }}>
          <a href="mailto:athtripathi@gmail.com" className="btn-primary">
            EMAIL ATH →
          </a>
          <a href="https://github.com/ath34-tech" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            GITHUB REPOS ↗
          </a>
          <a href="https://www.linkedin.com/in/ath-tripathi-320115230/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            LINKEDIN ↗
          </a>
        </div>
      </div>
    </section>
  );
}
