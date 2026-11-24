import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export default function TiltCard({ 
  children, 
  className = '', 
  glowColor = 'rgba(34, 211, 238, 0.15)',
  onClick,
  onMouseEnter
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rY = ((mouseX / width) - 0.5) * 12; // tilt max 6deg
    const rX = ((mouseY / height) - 0.5) * -12;

    setRotate({ x: rX, y: rY });
    setGlarePos({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.25
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out preserve-3d cursor-pointer ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        willChange: 'transform'
      }}
    >
      {/* Dynamic Specular Light Glare Overlay */}
      <div 
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor} 0%, transparent 60%)`,
          opacity: glarePos.opacity
        }}
      />
      {children}
    </div>
  );
}
