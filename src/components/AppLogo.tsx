import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number | string;
  showSquircle?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 32,
  showSquircle = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        <linearGradient id="waAppLogoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4CE876" />
          <stop offset="50%" stopColor="#3CD56B" />
          <stop offset="100%" stopColor="#23BD5E" />
        </linearGradient>
      </defs>

      {/* Optional squircle background */}
      {showSquircle && (
        <rect width="512" height="512" rx="115" fill="url(#waAppLogoGrad)" />
      )}

      {/* Speech bubble outline with gap at top right and speech tail at bottom left */}
      <path
        d="M 296 155 
           C 200 152, 134 220, 134 300 
           C 134 330, 144 354, 160 376 
           L 133 425 
           L 194 407 
           C 216 418, 240 424, 266 424 
           C 346 424, 412 360, 412 280 
           C 412 254, 405 230, 392 210"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Horizontal Minus / Pill Bar at Top Right */}
      <rect x="318" y="170" width="80" height="24" rx="12" fill="#FFFFFF" />

      {/* Phone Receiver Handle Centered inside bubble */}
      <path
        fill="#FFFFFF"
        d="M 226 205
           C 218 205, 206 211, 201 219
           C 193 232, 195 258, 218 296
           C 241 334, 266 348, 281 349
           C 292 349, 302 342, 309 332
           C 313 326, 319 313, 314 306
           C 310 299, 296 290, 287 285
           C 278 280, 273 282, 268 288
           C 264 293, 258 299, 252 297
           C 246 295, 235 287, 225 272
           C 215 257, 213 247, 216 242
           C 219 237, 227 234, 230 228
           C 233 222, 230 209, 226 205 Z"
      />
    </svg>
  );
};
