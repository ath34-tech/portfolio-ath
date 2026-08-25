import React from 'react';

export default function TechnicalNote({ title = "TECHNICAL NOTE", content }) {
  return (
    <div className="dark-surface" style={{ marginBottom: 'var(--s5)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--s2)',
        marginBottom: 'var(--s3)',
        borderBottom: '1px solid rgba(226, 222, 219, 0.2)',
        paddingBottom: 'var(--s2)'
      }}>
        <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent)', display: 'inline-block' }}></span>
        <span className="type-meta" style={{ color: 'var(--paper)', fontSize: '11px', letterSpacing: '0.08em' }}>
          {title}
        </span>
      </div>
      <p className="type-body" style={{ color: 'var(--paper)', fontSize: '15px', lineHeight: '1.55' }}>
        {content}
      </p>
    </div>
  );
}
