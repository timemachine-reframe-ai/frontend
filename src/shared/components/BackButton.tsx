import React from 'react';
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label = '뒤로가기' }) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 hover:text-primary-700 transition-all duration-300"
  >
    <ChevronLeftIcon className="w-5 h-5 text-slate-500 group-hover:text-primary-600 transition-colors" />
    <span className="text-sm font-medium text-slate-600 group-hover:text-primary-700 transition-colors">뒤로</span>
  </button>
);

export default BackButton;
