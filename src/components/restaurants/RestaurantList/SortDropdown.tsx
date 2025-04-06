// src/components/restaurants/RestaurantList/SortDropdown.tsx
import React from 'react';
import { SortByType } from '@/types/filters'; // Import type

interface SortDropdownProps {
  isOpen: boolean;
  currentSort: SortByType;
  onSelectSort: (sortBy: SortByType) => void;
}

const SORT_OPTIONS: { value: SortByType; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'price', label: 'By Deal Price' },
    { value: 'rating', label: 'By Rating' },
    { value: 'distance', label: 'By Distance' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ isOpen, currentSort, onSelectSort }) => {
  if (!isOpen) return null;

  return (
    // Added animation
    <div
       className="absolute z-20 mt-1 w-48 origin-top-left bg-white rounded-md shadow-lg py-1 border border-gray-200 focus:outline-none animate-fade-in-scale-up"
       role="menu"
       aria-orientation="vertical"
       aria-labelledby="sort-button" // Assuming the trigger button has id="sort-button" or similar
    >
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-100 ease-in-out
            ${
              currentSort === option.value
                ? 'bg-purple-50 text-purple-700 font-medium' // Highlight selected
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          onClick={() => onSelectSort(option.value)}
          role="menuitem"
          aria-current={currentSort === option.value ? 'true' : 'false'} // Indicate current selection
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SortDropdown;