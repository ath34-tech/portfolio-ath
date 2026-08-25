import React from 'react';

export default function ProjectCard({ project, navigateTo }) {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'LIVE': return 'badge-live';
      case 'BUILDING': return 'badge-building';
      default: return 'badge-archived';
    }
  };

  return (
    <article
      className="project-card-interactive paper-surface-clean"
      onClick={() => navigateTo(`/work/${project.id}`)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        border: 'var(--border-ink)',
        padding: 'var(--s5)',
        cursor: 'pointer',
        transition: 'transform var(--transition-base), border-color var(--transition-base)',
        position: 'relative'
      }}
    >
      <div>
        {/* Card Header: Number & Status Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s4)' }}>
          <span className="type-section-num" style={{ fontSize: '14px' }}>
            {project.number}
          </span>
          <span className={`type-badge ${getBadgeClass(project.status)}`}>
            {project.status === 'LIVE' && <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--paper)', display: 'inline-block' }}></span>}
            {project.status}
          </span>
        </div>

        {/* Technical Graphic / Visual Representative Box */}
        <div style={{
          width: '100%',
          height: '160px',
          backgroundColor: 'var(--paper)',
          border: 'var(--border-ink)',
          marginBottom: 'var(--s4)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.05) saturate(0.95)'
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              padding: 'var(--s3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span className="type-meta" style={{ fontSize: '10px' }}>SYSTEM GRAPHIC //{project.id.toUpperCase()}</span>
                <span className="type-meta" style={{ fontSize: '10px', color: 'var(--accent)' }}>ARCH // {project.year}</span>
              </div>
            </div>
          )}

          {/* Paper Fold Corner Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 18px 18px 0',
            borderColor: 'transparent var(--ink) transparent transparent',
            opacity: 0.85,
            zIndex: 3
          }} />
        </div>

        {/* Title & Tagline */}
        <h4 className="type-heading-2" style={{ marginBottom: 'var(--s2)', fontSize: '28px' }}>
          {project.title}
        </h4>

        <p className="type-body" style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: 'var(--s4)', lineHeight: 1.45 }}>
          {project.tagline}
        </p>
      </div>

      {/* Card Footer: Stack & CTA */}
      <div style={{ borderTop: 'var(--border-muted)', paddingTop: 'var(--s3)', marginTop: 'var(--s3)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--s4)' }}>
          {project.stack.map((tech, idx) => (
            <span key={idx} className="type-meta" style={{
              fontSize: '11px',
              backgroundColor: 'rgba(29, 29, 27, 0.06)',
              padding: '2px 6px',
              border: '1px solid rgba(29, 29, 27, 0.12)'
            }}>
              {tech}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="type-meta" style={{ color: 'var(--accent)', fontWeight: '600' }}>
            VIEW CASE STUDY
          </span>
          <span className="type-meta" style={{ color: 'var(--accent)' }}>→</span>
        </div>
      </div>
    </article>
  );
}
