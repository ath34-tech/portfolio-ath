import React from 'react';

export default function ArchitectureDiagram({ architecture }) {
  if (!architecture || !architecture.nodes) return null;

  return (
    <div className="architecture-diagram-component" style={{
      backgroundColor: 'var(--paper-deep)',
      border: 'var(--border-ink)',
      padding: 'var(--s6)',
      width: '100%',
      marginBottom: 'var(--s6)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s5)' }}>
        <span className="type-section-num">SYSTEM ARCHITECTURE SCHEMATIC</span>
        <span className="type-meta" style={{ color: 'var(--muted)' }}>VERIFIED PIPELINE</span>
      </div>

      {architecture.description && (
        <p className="type-body" style={{ color: 'var(--ink)', marginBottom: 'var(--s6)', fontSize: '15px' }}>
          {architecture.description}
        </p>
      )}

      {/* Visual Diagram Nodes Grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--s4)',
        padding: 'var(--s5) 0',
        borderTop: 'var(--border-muted)',
        borderBottom: 'var(--border-muted)'
      }}>
        {architecture.nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <div style={{
              backgroundColor: node.active ? 'var(--ink)' : 'var(--paper)',
              color: node.active ? 'var(--paper)' : 'var(--ink)',
              border: node.active ? '1px solid var(--black)' : '1px solid var(--ink)',
              padding: '14px 20px',
              minWidth: '160px',
              textAlign: 'center',
              boxShadow: node.active ? '0 4px 12px rgba(192, 63, 19, 0.2)' : 'none',
              position: 'relative'
            }}>
              {node.active && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px'
                }}>
                  <span className="radar-pulse-dot"></span>
                </div>
              )}
              <span className="type-meta" style={{
                fontSize: '10px',
                color: node.active ? 'var(--accent)' : 'var(--muted)',
                display: 'block',
                marginBottom: '4px'
              }}>
                STEP 0{index + 1}
              </span>
              <span className="type-meta" style={{
                fontSize: '13px',
                fontWeight: '600',
                color: node.active ? 'var(--paper)' : 'var(--ink)'
              }}>
                {node.label}
              </span>
            </div>

            {/* Connector Arrow */}
            {index < architecture.nodes.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent)' }}>
                <span className="type-meta" style={{ fontSize: '20px', fontWeight: 'bold', animation: 'flowPulse 1.5s infinite linear' }}>→</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ marginTop: 'var(--s4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent)', display: 'inline-block' }}></span>
          <span className="type-meta" style={{ fontSize: '11px', color: 'var(--muted)' }}>CORE ORCHESTRATION LAYER</span>
        </div>
        <span className="type-meta" style={{ fontSize: '11px', color: 'var(--muted)' }}>DETERMINISTIC / ASYNCHRONOUS</span>
      </div>
    </div>
  );
}
