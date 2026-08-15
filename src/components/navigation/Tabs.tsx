import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  onChange,
  className = '',
}) => {
  const [selected, setSelected] = useState(activeTabId || tabs[0]?.id || '');

  const handleSelect = (id: string) => {
    setSelected(id);
    if (onChange) onChange(id);
  };

  const currentTab = activeTabId !== undefined ? activeTabId : selected;

  return (
    <div className={`inline-flex items-center gap-1 p-1 sm:p-1.5 rounded-2xl sm:rounded-full border border-[var(--primary)] bg-white shadow-xs max-w-full overflow-x-auto horizontal-scrollbar flex-nowrap pb-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === currentTab;
        return (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            className={`px-3.5 sm:px-6 md:px-8 py-1.5 sm:py-2.5 text-[11px] sm:text-xs md:text-sm font-extrabold rounded-xl sm:rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-[var(--primary)] text-white shadow-md scale-100'
                : 'text-[var(--dark)] hover:text-[var(--primary)] hover:bg-blue-50/60'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
