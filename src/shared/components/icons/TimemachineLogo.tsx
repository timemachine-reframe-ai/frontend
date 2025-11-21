import React from 'react';

const TimemachineLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    {...props}
  >
    <circle cx="32" cy="32" r="24" className="text-violet-700" stroke="currentColor" />
    <circle cx="32" cy="32" r="2.5" className="text-violet-700" stroke="currentColor" />
    <path
      d="M32 16v15l10 7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-violet-700"
      stroke="currentColor"
    />
    <path
      d="M22 12l-4 4M46 12l4 4M22 52l-4-4M46 52l4-4"
      strokeLinecap="round"
      className="text-violet-400"
      stroke="currentColor"
    />
    <path
      d="M22 32h-4M32 22v-4M46 32h4M32 46v4"
      strokeLinecap="round"
      className="text-violet-500"
      stroke="currentColor"
    />
  </svg>
);

export default TimemachineLogo;
