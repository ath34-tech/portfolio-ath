import React from 'react';

export default function EngineeringDecision({ decision }) {
  if (!decision) return null;

  return (
    <div className="engineering-decision-component" style={{
      backgroundColor: 'var(--paper-deep)',
      border: 'var(--border-ink)',
      padding: 'var(--s6)',
      marginBottom: 'var(--s5)'
    }}>
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        borderBottom: 'var(--border-ink)',
        paddingBottom: 'var(--s3)',
        marginBottom: 'var(--s5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
          <span className="type-section-num">ENGINEERING DECISION #{decision.number}</span>
        </div>
        <span className="type-meta" style={{ color: 'var(--accent)', fontWeight: '600' }}>TRADE-OFF ANALYSIS</span>
      </div>

      <h4 className="type-heading-2" style={{ fontSize: '26px', marginBottom: 'var(--s5)' }}>
        {decision.title}
      </h4>

      <div className="grid-3col" style={{ gap: 'var(--s4)' }}>
        {/* Column 1: Problem */}
        <div style={{
          backgroundColor: 'var(--paper)',
          padding: 'var(--s4)',
          border: 'var(--border-muted)'
        }}>
          <span className="type-section-num" style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: 'var(--s2)' }}>
            01 / THE PROBLEM
          </span>
          <p className="type-body" style={{ fontSize: '14px', lineHeight: 1.5 }}>
            {decision.problem}
          </p>
        </div>

        {/* Column 2: Decision */}
        <div style={{
          backgroundColor: 'var(--paper)',
          padding: 'var(--s4)',
          border: 'var(--border-muted)'
        }}>
          <span className="type-section-num" style={{ fontSize: '11px', color: 'var(--accent)', display: 'block', marginBottom: 'var(--s2)' }}>
            02 / THE DECISION
          </span>
          <p className="type-body" style={{ fontSize: '14px', lineHeight: 1.5, fontWeight: '600' }}>
            {decision.decision}
          </p>
        </div>

        {/* Column 3: Why */}
        <div style={{
          backgroundColor: 'var(--paper)',
          padding: 'var(--s4)',
          border: 'var(--border-muted)'
        }}>
          <span className="type-section-num" style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: 'var(--s2)' }}>
            03 / WHY IT WORKED
          </span>
          <p className="type-body" style={{ fontSize: '14px', lineHeight: 1.5 }}>
            {decision.why}
          </p>
        </div>
      </div>
    </div>
  );
}
