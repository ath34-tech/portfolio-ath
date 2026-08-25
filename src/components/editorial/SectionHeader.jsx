import React from 'react';

export default function SectionHeader({ number = "01", title, subtitle, showRule = true }) {
  return (
    <div className="section-header-component" style={{ marginBottom: 'var(--s6)' }}>
      {showRule && <hr className="editorial-rule" style={{ marginBottom: 'var(--s5)' }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
          <span className="type-section-num">{number}</span>
          <span className="type-meta" style={{ color: 'var(--muted)' }}>/</span>
          <h3 className="type-section-title">{title}</h3>
        </div>
        {subtitle && (
          <p className="type-body" style={{ color: 'var(--muted)', maxWidth: '640px', marginTop: 'var(--s1)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
