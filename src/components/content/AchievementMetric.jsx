import React from 'react';

export default function AchievementMetric({ achievements, secondaryAchievements }) {
  return (
    <div className="achievement-metric-component" style={{ width: '100%' }}>
      {/* Primary Numbers Grid */}
      <div className="grid-3col" style={{ gap: 'var(--s5)', marginBottom: 'var(--s6)' }}>
        {achievements.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: 'var(--s5)',
              border: 'var(--border-ink)',
              backgroundColor: 'var(--paper-deep)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span className="type-metric-num">{item.number}</span>
              <h4 className="type-section-num" style={{ color: 'var(--ink)', marginTop: 'var(--s2)', fontSize: '13px' }}>
                {item.label}
              </h4>
            </div>
            <p className="type-caption" style={{ marginTop: 'var(--s3)', fontSize: '13px' }}>
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary Recognition List */}
      {secondaryAchievements && (
        <div style={{
          borderTop: 'var(--border-ink)',
          paddingTop: 'var(--s5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--s3)'
        }}>
          <span className="type-section-num">ADDITIONAL RECOGNITIONS & CONTRIBUTIONS</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s4)' }}>
            {secondaryAchievements.map((rec, rIdx) => (
              <div key={rIdx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--s2)',
                backgroundColor: 'var(--paper)',
                padding: '8px 16px',
                border: 'var(--border-muted)'
              }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent)', borderRadius: '50%' }}></span>
                <span className="type-body" style={{ fontSize: '14px', fontWeight: '500' }}>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
