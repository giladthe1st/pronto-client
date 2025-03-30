import React from 'react';

interface SortDropdownProps {
  isOpen: boolean;
  currentSort: string;
  onSelectSort: (sortBy: 'default' | 'price' | 'rating' | 'distance') => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ isOpen, currentSort, onSelectSort }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
      <button
        className={`block px-4 py-2 text-sm w-full text-left ${
          currentSort === 'default' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => onSelectSort('default')}
      >
        Default
      </button>
      <button
        className={`block px-4 py-2 text-sm w-full text-left ${
          currentSort === 'price' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => onSelectSort('price')}
      >
        By Deal Price
      </button>
      <button
        className={`block px-4 py-2 text-sm w-full text-left ${
          currentSort === 'rating' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => onSelectSort('rating')}
      >
        By Rating
      </button>
      <button
        className={`block px-4 py-2 text-sm w-full text-left ${
          currentSort === 'distance' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => onSelectSort('distance')}
      >
        By Distance
      </button>
    </div>
  );
};

export default SortDropdown;