import React from 'react';

// FIX: Added 'as const' to ensure TypeScript infers literal types for SVG properties.
const iconProps = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

export const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export const ExpandIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg>
);

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

export const ResetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} className="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

export const SwapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} className="lucide lucide-arrow-left-right"><path d="m17 3 4 4-4 4"/><path d="M21 7H9"/><path d="m7 21-4-4 4-4"/><path d="M3 17h12"/></svg>
);

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export const SelectAllIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} className="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
);

export const DeselectAllIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} className="lucide lucide-x-square"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

export const UploadCloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} className="lucide lucide-cloud-upload"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
);