import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label = '뒤로가기' }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-violet-600 transition"
    aria-label={label}
  >
    <span className="text-xl">&larr;</span>
    {label}
  </button>
);

export default BackButton;
