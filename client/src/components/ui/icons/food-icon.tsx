import React from "react";
export default function FoodIcon({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M4 2v20" />
      <path d="M8 2v20" />
      <path d="M12 2v20" />
      <path d="M16 2v20" />
      <path d="M20 2v20" />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M7 7h10" />
      <path d="M7 12h10" />
      <path d="M7 17h10" />
    </svg>
  );
} 