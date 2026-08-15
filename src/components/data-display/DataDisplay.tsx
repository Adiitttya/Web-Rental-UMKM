import React, { useState } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'glass';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = true,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg shadow-gray-200/50 dark:shadow-none',
    outline: 'border-2 border-gray-200 dark:border-slate-700 bg-transparent',
    glass: 'glass',
  };

  const hoverClasses = hoverEffect
    ? 'hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300'
    : '';

  return (
    <div
      className={`rounded-2xl p-6 ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  React.useEffect(() => {
    if (openId && !items.some((i) => i.id === openId)) {
      setOpenId(null);
    }
  }, [items, openId]);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-none"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-semibold text-base sm:text-lg text-[var(--primary)] cursor-pointer hover:bg-blue-50/40 transition-colors duration-200"
            >
              <span className="pr-4 text-[var(--primary)] font-semibold leading-snug">{item.question}</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <svg
                  className={`w-5 h-5 text-[var(--primary)] transition-transform duration-300 ease-in-out ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed border-t border-blue-50">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
