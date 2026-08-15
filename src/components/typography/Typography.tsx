import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  children,
  className = '',
  ...props
}) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const sizeClasses = {
    1: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight',
    2: 'text-3xl sm:text-4xl font-bold tracking-tight',
    3: 'text-2xl sm:text-3xl font-semibold',
    4: 'text-xl sm:text-2xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium',
  };

  return (
    <Tag className={`${sizeClasses[level]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-base text-gray-700 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const Caption: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <span className={`text-xs text-gray-500 dark:text-slate-400 ${className}`} {...props}>
    {children}
  </span>
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <label className={`block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1 ${className}`} {...props}>
    {children}
  </label>
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
