import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'original';
}

export default function Logo({ className = "h-12 w-auto", variant = "original" }: LogoProps) {
  const filterClass = variant === 'light' 
    ? 'filter brightness-0 invert' 
    : 'filter drop-shadow';

  return (
    <img 
      src="https://file.garden/aeySfh58aX0K8a6A/image_2026-06-13_190708605-removebg-preview.png" 
      alt="Alpine Goat Adventure Logo" 
      className={`${className} object-contain transition-all duration-300 ${filterClass}`}
      style={{ minWidth: '44px', minHeight: '44px' }}
      referrerPolicy="no-referrer"
    />
  );
}
