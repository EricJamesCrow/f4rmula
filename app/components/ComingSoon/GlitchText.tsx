import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  textClassName?: string;
  glitchColor1?: string;
  glitchColor2?: string;
  animate?: boolean;
  ariaLabel?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  textClassName = 'text-5xl md:text-7xl lg:text-8xl',
  glitchColor1 = 'text-cyan-400',
  glitchColor2 = 'text-pink-400',
  animate = true,
  ariaLabel,
}) => {
  return (
    <div className={`relative ${className}`}>
      <h1
        className="font-bold text-white tracking-wider text-center relative"
        aria-label={ariaLabel || text}
      >
        <span
          className={`relative inline-block ${textClassName} ${animate ? 'animate-glitch' : ''}`}
        >
          {text}
          <span
            className={`absolute top-0 left-0 ${textClassName} ${glitchColor1} opacity-70 ${animate ? 'animate-glitch-1' : ''}`}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className={`absolute top-0 left-0 ${textClassName} ${glitchColor2} opacity-70 ${animate ? 'animate-glitch-2' : ''}`}
            aria-hidden="true"
          >
            {text}
          </span>
        </span>
      </h1>
    </div>
  );
};

export default GlitchText;
