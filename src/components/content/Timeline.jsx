import React from 'react';

export default function Timeline({ experience }) {
  return (
    <div className="timeline-component" style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s6)' }}>
        {experience.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: 'var(--s5)',
              paddingBottom: 'var(--s6)',
              borderBottom: index < experience.length - 1 ? 'var(--border-muted)' : 'none'
            }}
            className="timeline-row"
          >
            {/* Left: Period & Type */}
            <div>
              <span className="type-section-num" style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                {item.period}
              </span>
              <span className="type-meta" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                {item.type}
              </span>
            </div>

            {/* Right: Role, Company, Location & Bullet points */}
            <div>
              <h4 className="type-heading-2" style={{ fontSize: '24px', marginBottom: 'var(--s1)' }}>
                {item.role}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', marginBottom: 'var(--s4)' }}>
                <span className="type-body" style={{ fontWeight: '600', color: 'var(--accent)' }}>
                  {item.company}
                </span>
                <span className="type-meta" style={{ color: 'var(--muted)' }}>·</span>
                <span className="type-meta" style={{ color: 'var(--muted)' }}>
                  {item.location}
                </span>
              </div>

              <ul style={{ paddingLeft: 'var(--s4)', display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
                {item.highlights.map((bullet, idx) => (
                  <li key={idx} className="type-body" style={{ fontSize: '15px', color: 'var(--ink)' }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-row {
            grid-template-columns: 1fr !important;
            gap: var(--s3) !important;
          }
        }
      `}</style>
    </div>
  );
}
