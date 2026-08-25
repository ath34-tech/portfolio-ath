import React from 'react';

export default function NotFoundPage({ navigateTo }) {
  return (
    <div className="not-found-page" style={{
      paddingTop: 'var(--s10)',
      paddingBottom: 'var(--s11)',
      textAlign: 'center'
    }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <span className="type-section-num" style={{ fontSize: '18px', display: 'block', marginBottom: 'var(--s3)' }}>
          404 ERROR
        </span>

        <h1 className="type-heading-1" style={{ fontSize: 'clamp(48px, 9vw, 96px)', marginBottom: 'var(--s4)' }}>
          WRONG TURN.
        </h1>

        <p className="type-body-lg" style={{ color: 'var(--muted)', marginBottom: 'var(--s6)' }}>
          The page or system case study you are looking for doesn't exist or has moved.
        </p>

        <button
          className="btn-primary"
          onClick={() => navigateTo('/')}
        >
          BACK TO HOME PAGE →
        </button>
      </div>
    </div>
  );
}
