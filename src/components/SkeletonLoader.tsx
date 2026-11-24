import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export default function SkeletonLoader({ className = 'h-12 w-full rounded-xl', count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`relative overflow-hidden bg-white/5 border border-white/5 rounded-xl ${className}`}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  );
}
