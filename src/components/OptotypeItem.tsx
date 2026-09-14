import React from 'react';
import { OptotypeType } from '../types/snellen';

interface OptotypeItemProps {
  symbol: string; // Letter ('E', 'F', etc.) or Direction ('0', '90', '180', '270') or LEA symbol name
  type: OptotypeType;
  heightPx: number; // Target height in screen pixels
  color?: string;
}

export const OptotypeItem: React.FC<OptotypeItemProps> = ({
  symbol,
  type,
  heightPx,
  color = 'currentColor',
}) => {
  const size = Math.max(heightPx, 12);

  // LEA Pediatric Symbols (Apple, House, Square, Circle)
  // Clinical LEA Hyvärinen standards use hollow outline shapes with 1/5th stroke width ratio
  if (type === 'lea') {
    const sym = symbol.toLowerCase();

    if (sym === 'apple' || sym === 'fruit') {
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block">
          {/* Apple Stem */}
          <path
            d="M50 20 C48 10, 56 4, 52 2 C50 4, 44 10, 48 20 Z"
            fill={color}
          />
          {/* Apple Outline (Hollow Center, 1/5th Stroke Thickness) */}
          <path
            d="M50 22 C22 18 8 36 8 62 C8 86 30 95 50 88 C70 95 92 86 92 62 C92 36 78 18 50 22 Z"
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (sym === 'house') {
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block">
          {/* House Outline (Roof Peak & Base Wall) */}
          <path
            d="M50 12 L88 46 V88 H12 V46 Z"
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
        </svg>
      );
    }

    if (sym === 'square') {
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block">
          {/* Square Outline */}
          <rect
            x="11"
            y="11"
            width="78"
            height="78"
            fill="none"
            stroke={color}
            strokeWidth="18"
            rx="2"
          />
        </svg>
      );
    }

    // Circle Outline (default LEA)
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="18"
        />
      </svg>
    );
  }

  // Tumbling E
  if (type === 'tumbling-e') {
    const rotation = parseInt(symbol, 10) || 0;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 5 5"
        className="inline-block transition-transform duration-150"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <path
          d="M0 0 H5 V1 H1 V2 H4 V3 H1 V4 H5 V5 H0 Z"
          fill={color}
          fillRule="evenodd"
        />
      </svg>
    );
  }

  // Landolt C
  if (type === 'landolt-c') {
    const rotation = parseInt(symbol, 10) || 0;
    return (
      <svg
        width={size}
        height={size}
        viewBox="-2.5 -2.5 5 5"
        className="inline-block transition-transform duration-150"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <path
          d="
            M 1.768 -1.768
            A 2.5 2.5 0 1 0 1.768 1.768
            L 1.061 1.061
            A 1.5 1.5 0 1 1 1.061 -1.061
            Z
          "
          fill={color}
        />
      </svg>
    );
  }

  // Sloan / Snellen / HOTV / ETDRS Standard Letter Rendering
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="inline-block">
      <text
        x="50"
        y="50"
        fontSize="100"
        fontFamily="sans-serif, Arial, Helvetica"
        fontWeight="900"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
      >
        {symbol}
      </text>
    </svg>
  );
};
