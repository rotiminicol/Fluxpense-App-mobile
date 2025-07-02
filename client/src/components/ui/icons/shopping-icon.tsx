import React from "react";
export default function ShoppingIcon({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M6 2l1 7h10l1-7" />
      <rect x="3" y="9" width="18" height="13" rx="2" />
      <path d="M16 13a4 4 0 0 1-8 0" />
    </svg>
  );
} 