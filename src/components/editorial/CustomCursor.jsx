import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch desktop screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .project-card-interactive, [role="button"]')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        width: hovered ? '36px' : '14px',
        height: hovered ? '36px' : '14px',
        borderRadius: '50%',
        backgroundColor: hovered ? 'rgba(192, 63, 19, 0.15)' : 'var(--accent)',
        border: hovered ? '1px solid var(--accent)' : 'none',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'width 150ms ease, height 150ms ease, background-color 150ms ease',
        zIndex: 9999
      }}
    />
  );
}
