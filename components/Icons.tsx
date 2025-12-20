import React from 'react';
import { motion } from 'framer-motion';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

const defaultProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconDashboard: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconHistory: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="M12 8v4l3 3" />
    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
  </svg>
);

export const IconAccount: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconLogout: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/**
 * REDESIGNED: Mind Dump
 * Visualizes a funnel distilling a mental cloud into ordered points.
 */
export const IconMindDump: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="M18 4a3 3 0 0 0-3 3c0 2 2 3 2 5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2c0-2 2-3 2-5a3 3 0 0 0-3-3" />
    <path d="M12 14v7" />
    <path d="M10 18h4" />
    <circle cx="12" cy="4" r="1.5" strokeOpacity="0.3" />
  </svg>
);

/**
 * REDESIGNED: Find Words
 * Visualizes a "spark" of clarity appearing inside a speech bubble.
 */
export const IconFindWords: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 3z" />
    <path d="M12 8v1" strokeWidth="2" />
    <path d="M12 15v1" strokeWidth="2" />
    <path d="M8.5 12h-1" strokeWidth="2" />
    <path d="M16.5 12h-1" strokeWidth="2" />
    <path d="M9.5 9.5l.7.7" strokeWidth="2" />
    <path d="M14.5 14.5l-.7-.7" strokeWidth="2" />
    <path d="M9.5 14.5l.7-.7" strokeWidth="2" />
    <path d="M14.5 9.5l-.7.7" strokeWidth="2" />
  </svg>
);

export const IconDecisionHelper: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="m3 12 4-4 4 4" />
    <path d="M7 8v13" />
    <path d="m21 12-4 4-4-4" />
    <path d="M17 16V3" />
  </svg>
);

export const IconWriteHard: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export const IconQuickReset: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

export const IconArrowLeft: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const IconCopy: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} {...defaultProps} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
