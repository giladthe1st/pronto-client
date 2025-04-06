// src/components/restaurants/RestaurantList/FilterControls.tsx
import React, { useRef, useEffect } from 'react';
import { FunnelIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'; // Use outline consistently
import SortDropdown from './SortDropdown';
import { FiltersState, SortByType } from '@/types/filters'; // Import types

interface FilterControlsProps {
  filters: FiltersState;
  hasActiveFilters: boolean; // Pass this pre-calculated boolean
  showSortDropdown: boolean; // Changed name for clarity
  onToggleFiltersPanel: () => void; // Changed name for clarity
  onToggleSortDropdown: () => void; // Changed name for clarity
  closeSortDropdown: () => void;
  onClearFilters: () => void;
  onSelectSort: (sortBy: SortByType) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  hasActiveFilters,
  showSortDropdown,
  onToggleFiltersPanel,
  onToggleSortDropdown,
  closeSortDropdown,
  onClearFilters,
  onSelectSort,
}) => {
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler for Sort Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSortDropdown &&
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target as Node) &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        closeSortDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown, closeSortDropdown]);


  return (
    // Add some vertical padding/margin if needed, or handle in parent
    <div className="flex items-center justify-between py-3 md:py-4">
      <div className="flex flex-wrap gap-2">
        {/* Filter Button */}
        <button
          className="flex items-center px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors shadow-sm"
          onClick={onToggleFiltersPanel}
          aria-label="Toggle filters panel"
        >
          <FunnelIcon className="w-4 h-4 mr-1.5" />
          Filter
        </button>

        {/* Sort Button & Dropdown */}
        <div className="relative">
          <button
            ref={sortButtonRef}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors shadow-sm"
            onClick={onToggleSortDropdown}
            aria-haspopup="true"
            aria-expanded={showSortDropdown}
            aria-label="Toggle sort options"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1.5" />
            Sort
             {filters.sortBy !== 'default' && ( // Indicate current sort if not default
                <span className="ml-1 text-purple-600 text-xs hidden sm:inline">
                    ({filters.sortBy.charAt(0).toUpperCase() + filters.sortBy.slice(1)})
                </span>
             )}
          </button>
          {/* Wrap SortDropdown for positioning and ref */}
          <div ref={sortDropdownRef} className="absolute left-0 mt-2 z-20">
            <SortDropdown
              isOpen={showSortDropdown}
              currentSort={filters.sortBy}
              onSelectSort={onSelectSort} // Pass handler directly
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClearFilters}
            aria-label="Clear all filters and sorting"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>
      {/* Placeholder for potential view toggle (List/Map) */}
       {/* <div className="hidden md:block"> View Toggle </div> */}
    </div>
  );
};

export default FilterControls;