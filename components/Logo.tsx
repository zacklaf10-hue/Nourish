import React from 'react';

interface LogoProps {
  className?: string;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-24 h-24", animate = false }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path
        d="M30 80V20L70 80V20"
        stroke="#E87D33"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw" : ""}
        style={{
          strokeDasharray: 200,
          strokeDashoffset: animate ? 200 : 0,
          animation: animate ? 'dash 2s cubic-bezier(0.65, 0, 0.45, 1) forwards' : 'none'
        }}
      />
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </svg>
  );
};