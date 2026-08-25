import React, { useState } from 'react';

export default function CodeBlock({ label = "CODE FRAGMENT", code, language = "python" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-component" style={{
      backgroundColor: 'var(--ink)',
      border: '1px solid var(--black)',
      marginBottom: 'var(--s6)'
    }}>
      {/* Code Header Bar */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        backgroundColor: '#111110',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></span>
          <span className="type-meta" style={{ color: 'var(--paper)', fontSize: '11px' }}>
            {label} [{language.toUpperCase()}]
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="type-meta"
          style={{
            color: copied ? 'var(--accent)' : 'var(--paper-deep)',
            fontSize: '10px',
            padding: '2px 8px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {copied ? 'COPIED ✓' : 'COPY'}
        </button>
      </div>

      {/* Code Body */}
      <pre style={{
        padding: 'var(--s4)',
        margin: 0,
        overflowX: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        lineHeight: 1.6,
        color: '#E2DEDB',
        whiteSpace: 'pre'
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
