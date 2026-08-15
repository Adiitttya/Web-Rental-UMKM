import React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  spacing?: 2 | 4 | 6 | 8;
  align?: 'start' | 'center' | 'end' | 'between';
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  spacing = 4,
  align = 'start',
  className = '',
  ...props
}) => {
  const dirClasses = direction === 'row' ? 'flex flex-row' : 'flex flex-col';
  
  const spaceClasses = {
    2: direction === 'row' ? 'space-x-2' : 'space-y-2',
    4: direction === 'row' ? 'space-x-4' : 'space-y-4',
    6: direction === 'row' ? 'space-x-6' : 'space-y-6',
    8: direction === 'row' ? 'space-x-8' : 'space-y-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    between: 'justify-between items-center',
  };

  return (
    <div className={`${dirClasses} ${spaceClasses[spacing]} ${alignClasses[align]} ${className}`} {...props}>
      {children}
    </div>
  );
};
