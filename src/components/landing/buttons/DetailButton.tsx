import React from 'react';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

export interface DetailButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  textColor?: string;
}

export const DetailButton: React.FC<DetailButtonProps> = ({
  label = 'Detail',
  textColor = 'text-white',
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 font-extrabold text-sm sm:text-base cursor-pointer transition-all duration-200 group-hover:translate-x-1 bg-transparent border-0 p-0 ${textColor} ${className}`}
      {...props}
    >
      <span>{label}</span>
      <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
};
