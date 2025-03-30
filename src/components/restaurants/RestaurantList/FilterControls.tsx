import React, { useRef, useEffect } from 'react'; // <-- Import useRef, useEffect
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SortDropdown from './SortDropdown';

interface FilterControlsProps {
  filters: {
    minRating: number;
    selectedCategories: string[];
    searchQuery: string;
    sortBy: 'default' | 'price' | 'rating' | 'distance';
  };
  showFilters: boolean;
  showSort: boolean;
  onToggleFilters: () => void;
  onToggleSort: () => void;
  closeSort: () => void; // <-- Add closeSort prop
  onClearFilters: () => void;
  onSelectSort: (sortBy: 'default' | 'price' | 'rating' | 'distance') => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  showSort,
  onToggleFilters,
  onToggleSort,
  closeSort, // <-- Destructure closeSort
  onClearFilters,
  onSelectSort,
}) => {
  const hasActiveFilters =
    filters.minRating > 0 ||
    filters.selectedCategories.length > 0 ||
    filters.searchQuery ||
    filters.sortBy !== 'default';

  // Refs for the button and the dropdown wrapper
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the sort area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the dropdown is open and the click is outside both the button and the dropdown...
      if (
        showSort &&
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target as Node) &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        closeSort(); // ...close the dropdown
      }
    };

    // Add listener when the component mounts (or showSort becomes true)
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener when the component unmounts (or showSort becomes false)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSort, closeSort]); // Re-run effect if showSort or closeSort changes

  const handleSortSelect = (sortBy: 'default' | 'price' | 'rating' | 'distance') => {
      onSelectSort(sortBy);
      closeSort(); // Close dropdown after selecting an option
  }

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex space-x-2">
        <button
          className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
          onClick={onToggleFilters}
        >
          <FunnelIcon className="w-4 h-4 mr-1" />
          Filter
        </button>

        <div className="relative">
          {/* Attach ref to the sort button */}
          <button
            ref={sortButtonRef}
            className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
            onClick={onToggleSort} // Keep using toggle here to open/close by clicking the button
          >
            Sort
          </button>
          {/* Wrap SortDropdown in a div and attach ref */}
          <div ref={sortDropdownRef}>
            <SortDropdown
              isOpen={showSort}
              currentSort={filters.sortBy}
              onSelectSort={handleSortSelect} // Use updated handler
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
            onClick={onClearFilters}
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterControls;