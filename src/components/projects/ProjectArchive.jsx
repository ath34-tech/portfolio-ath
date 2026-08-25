import React from 'react';

export default function ProjectArchive({ projects, navigateTo }) {
  return (
    <div className="project-archive-component" style={{ width: '100%' }}>
      <div style={{ borderTop: 'var(--border-ink)' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 2fr 2fr 3fr 100px 40px',
          padding: 'var(--s3) 0',
          borderBottom: 'var(--border-ink)',
          alignItems: 'center'
        }} className="archive-header desktop-only">
          <span className="type-meta">#</span>
          <span className="type-meta">PROJECT</span>
          <span className="type-meta">CATEGORY</span>
          <span className="type-meta">STACK</span>
          <span className="type-meta">STATUS</span>
          <span className="type-meta"></span>
        </div>

        {/* Table Rows */}
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => navigateTo(`/work/${proj.id}`)}
            style={{
              padding: 'var(--s4) 0',
              borderBottom: 'var(--border-muted)',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            className="archive-row"
          >
            {/* Desktop View Grid Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 2fr 2fr 3fr 100px 40px',
              alignItems: 'center'
            }} className="desktop-only">
              <span className="type-section-num" style={{ fontSize: '13px' }}>{proj.number}</span>
              <span className="font-display" style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>{proj.title}</span>
              <span className="type-meta" style={{ color: 'var(--muted)' }}>{proj.category}</span>
              <span className="type-meta" style={{ color: 'var(--ink)' }}>{proj.stack.join(' · ')}</span>
              <div>
                <span className={`type-badge ${proj.status === 'LIVE' ? 'badge-live' : proj.status === 'BUILDING' ? 'badge-building' : 'badge-archived'}`} style={{ fontSize: '10px' }}>
                  {proj.status}
                </span>
              </div>
              <span className="type-meta" style={{ color: 'var(--accent)' }}>→</span>
            </div>

            {/* Mobile View Card Row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }} className="mobile-only">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="type-section-num">{proj.number}</span>
                <span className={`type-badge ${proj.status === 'LIVE' ? 'badge-live' : 'badge-building'}`} style={{ fontSize: '10px' }}>{proj.status}</span>
              </div>
              <span className="font-display" style={{ fontSize: '24px' }}>{proj.title}</span>
              <span className="type-meta" style={{ color: 'var(--muted)' }}>{proj.category}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--s1)' }}>
                <span className="type-meta" style={{ fontSize: '11px' }}>{proj.stack.slice(0, 3).join(' · ')}</span>
                <span className="type-meta" style={{ color: 'var(--accent)' }}>VIEW →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .archive-row:hover {
          background-color: rgba(205, 198, 190, 0.4);
          padding-left: 8px;
          padding-right: 8px;
        }
      `}</style>
    </div>
  );
}
