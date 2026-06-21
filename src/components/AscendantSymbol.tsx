/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AscendantSymbolProps {
  className?: string;
  strokeWidth?: number;
}

export const AscendantSymbol: React.FC<AscendantSymbolProps> = ({
  className = "w-full h-full",
  strokeWidth = 1.2
}) => {
  return (
    <svg
      id="ascendant-symbol-svg"
      viewBox="0 0 100 100"
      className={`${className} overflow-hidden`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tilted ellipse matching the exact angle and styling of the uploaded image */}
      <ellipse
        cx="50"
        cy="50"
        rx="46"
        ry="22"
        transform="rotate(-35 50 50)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="opacity-70 transition-all duration-300 group-hover:opacity-100"
      />
      {/* Polished, pinched four-point star (flare/sparkle) */}
      <path
        d="M50 12 C55 38 62 45 88 50 C62 55 55 62 50 88 C45 62 38 55 12 50 C38 45 45 38 50 12 Z"
        fill="currentColor"
        className="transition-all duration-300 hover:scale-105"
      />
    </svg>
  );
};
