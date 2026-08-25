import React from 'react';

export default function SkillMatrix({ skillCategories }) {
  return (
    <div className="skill-matrix-component" style={{ width: '100%' }}>
      <div className="grid-3col" style={{ gap: 'var(--s5)' }}>
        {skillCategories.map((cat, idx) => (
          <div
            key={idx}
            className="paper-surface-clean"
            style={{
              border: 'var(--border-ink)',
              padding: 'var(--s5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span className="type-section-num" style={{ fontSize: '12px', display: 'block', marginBottom: 'var(--s3)' }}>
                0{idx + 1} / {cat.title}
              </span>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s2)', marginTop: 'var(--s2)' }}>
                {cat.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="type-body" style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    {skill}{sIdx < cat.skills.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: 'var(--border-muted)', paddingTop: 'var(--s3)', marginTop: 'var(--s4)' }}>
              <span className="type-meta" style={{ fontSize: '10px', color: 'var(--muted)' }}>
                VERIFIED COMPETENCY
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
