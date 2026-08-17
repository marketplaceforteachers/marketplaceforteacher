import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'white' | 'dark-header';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8.5 h-8.5',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base font-extrabold',
    lg: 'text-base sm:text-lg font-black',
    xl: 'text-lg sm:text-xl font-black',
  };

  const isWhite = variant === 'white' || variant === 'dark-header';

  return (
    <div id="brand-logo-container" className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Professional Vector Logo Icon */}
      <div
        id="brand-logo-icon"
        className={`relative ${iconSizes[size]} rounded-lg ${
          isWhite
            ? 'bg-gradient-to-br from-white to-blue-50 text-blue-900 shadow-sm border border-white/30'
            : 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white shadow-xs border border-blue-800/40'
        } flex items-center justify-center shrink-0 p-1`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Base Open Knowledge Pages / Book */}
          <path
            d="M5 26.5C8.5 24.5 13 24.8 18 27.5C23 24.8 27.5 24.5 31 26.5V11C27.5 9 23 9.3 18 12C13 9.3 8.5 9 5 11V26.5Z"
            fill={isWhite ? '#1e3a8a' : '#ffffff'}
            fillOpacity={isWhite ? '0.12' : '0.18'}
          />
          <path
            d="M5 26.5C8.5 24.5 13 24.8 18 27.5V12C13 9.3 8.5 9 5 11V26.5Z"
            stroke={isWhite ? '#1e3a8a' : '#ffffff'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31 26.5C27.5 24.5 23 24.8 18 27.5V12C23 9.3 27.5 9 31 11V26.5Z"
            stroke={isWhite ? '#1e3a8a' : '#ffffff'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Spine Divider */}
          <line
            x1="18"
            y1="12"
            x2="18"
            y2="28"
            stroke={isWhite ? '#2563eb' : '#60a5fa'}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Stylized Academy Graduation Cap & Golden Star Crest */}
          <path
            d="M18 4L28 9L18 14L8 9L18 4Z"
            fill={isWhite ? '#2563eb' : '#38bdf8'}
          />
          <path
            d="M18 4L28 9L18 14L8 9L18 4Z"
            stroke={isWhite ? '#1e40af' : '#e0f2fe'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Tassel & Ribbon */}
          <path
            d="M26 10V16.5C26 17 25 17.5 25 18"
            stroke={isWhite ? '#dc2626' : '#f87171'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="25"
            cy="18.5"
            r="1.2"
            fill={isWhite ? '#dc2626' : '#ef4444'}
          />
          {/* Center Beacon / Growth Leaf Motif */}
          <circle
            cx="18"
            cy="8.8"
            r="1.5"
            fill={isWhite ? '#f59e0b' : '#fbbf24'}
          />
        </svg>
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1">
            <span
              className={`tracking-tight ${textSizes[size]} ${
                isWhite ? 'text-white' : 'text-slate-900'
              }`}
            >
              Marketplace<span className={isWhite ? 'text-red-400 font-black' : 'text-red-600 font-black'}>ForTeachers</span><span className="text-[10px] font-semibold opacity-75">.com</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider ${
                isWhite ? 'text-blue-200' : 'text-slate-500'
              }`}
            >
              Verified Educator Supply Exchange
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
