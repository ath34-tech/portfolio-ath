import React from 'react';

export default function NewsTicker() {
  const tickerItems = [
    "EXTRA! EXTRA!",
    "ATH TRIPATHI RELEASES PIXIE AI DESKTOP AGENT",
    "ROUTELLMESH GATEWAY ONLINE",
    "OCR PIPELINE VERIFIED",
    "700+ COMPETITIVE PROGRAMMING PROBLEMS SOLVED",
    "TECHNICAL ASSESSMENT REVIEWER AT VCRIATE",
    "CODEFORCES PUPIL 1356 · CODECHEF 3★",
    "SPRING BOOT & KAFKA EVENT STREAMING COPILOT LIVE"
  ];

  const fullContent = [...tickerItems, ...tickerItems].join(" /// ");

  return (
    <div className="ticker-wrapper" style={{ width: '100%', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
      <div className="ticker-content type-meta" style={{ color: 'var(--paper)', fontSize: '11px', fontWeight: '600' }}>
        <span>/// {fullContent} /// </span>
        <span>/// {fullContent} /// </span>
      </div>
    </div>
  );
}
