import React from 'react';

export default function DisplayBanner({ textLine1 = "SYSTEMS", textLine2 = "NOT", textLine3 = "SLIDES", subtitle }) {
  return (
    <section className="display-banner-section" style={{
      backgroundColor: 'var(--ink)',
      color: 'var(--paper)',
      paddingTop: 'var(--s8)',
      paddingBottom: 'var(--s8)',
      width: '100%',
      overflow: 'hidden',
      borderTop: '1px solid var(--black)',
      borderBottom: '1px solid var(--black)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        {subtitle && (
          <span className="type-meta" style={{ color: 'var(--accent)', marginBottom: 'var(--s3)' }}>
            {subtitle}
          </span>
        )}
        
        <div className="animate-paper-unfold" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <h2 className="type-display-banner">{textLine1}</h2>
          {textLine2 && <h2 className="type-display-banner" style={{ color: 'var(--paper-deep)' }}>{textLine2}</h2>}
          {textLine3 && <h2 className="type-display-banner">{textLine3}</h2>}
        </div>
      </div>
    </section>
  );
}
