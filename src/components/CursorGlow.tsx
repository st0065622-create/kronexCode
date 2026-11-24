import React, { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices and respect reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 rounded-full transition-opacity duration-300 hidden md:block"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: '320px',
        height: '320px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(34, 211, 238, 0.04) 45%, transparent 70%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}
