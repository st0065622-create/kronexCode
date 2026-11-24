import React, { useRef, useState } from 'react';
import { soundManager } from '../utils/sound';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  soundType?: 'click' | 'toggle' | 'deploy' | 'notification' | 'success';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export default function MagneticButton({
  children,
  onClick,
  className = '',
  soundType = 'click',
  disabled = false,
  type = 'button',
  title
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Soft magnetic pull capped at 6px max
    setPosition({
      x: Math.max(-6, Math.min(6, distanceX * 0.15)),
      y: Math.max(-6, Math.min(6, distanceY * 0.15))
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Play synthesized UI sound effect based on type
    if (soundType === 'click') soundManager.playClick();
    else if (soundType === 'toggle') soundManager.playToggle();
    else if (soundType === 'deploy') soundManager.playDeploy();
    else if (soundType === 'notification') soundManager.playNotification();
    else if (soundType === 'success') soundManager.playSuccess();

    // Spawn click ripple
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const rippleX = e.clientX - rect.left;
      const rippleY = e.clientY - rect.top;
      const newRipple = { x: rippleX, y: rippleY, id: Date.now() };

      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      title={title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative overflow-hidden transition-transform duration-200 ease-out cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
    >
      {/* Expanding Ripple Rings */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '120px',
            height: '120px',
            transform: 'translate(-50%, -50%)',
            animationDuration: '0.6s'
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
