import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'dark' | 'alt';
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-[var(--background)] text-[var(--foreground)]',
    primary: 'bg-blue-600 text-white',
    dark: 'bg-[#1D242B] text-white',
    alt: 'bg-gray-100 dark:bg-slate-800 text-[var(--foreground)]',
  };

  return (
    <section className={`py-12 sm:py-16 lg:py-24 ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </section>
  );
};
