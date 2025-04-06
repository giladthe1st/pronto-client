// src/components/restaurants/RestaurantList/FilterPanel.tsx
import React from 'react';

interface FilterPanelProps {
  minRating: number;
  selectedCategories: string[];
  allCategories: string[];
  onSetMinRating: (rating: number) => void;
  onToggleCategory: (category: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  minRating,
  selectedCategories,
  allCategories,
  onSetMinRating,
  onToggleCategory,
}) => {
  return (
    // Added animation for smoother appearance
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 border border-gray-200 animate-fade-in-down"> {/* Added animation class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Filter */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-base">Minimum Rating</h3>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Added '0' explicitly for 'All' */}
            {[0, 1, 2, 3, 4].map((ratingValue) => (
              <button
                key={ratingValue}
                type="button" // Explicitly set button type
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1
                  ${
                    minRating === ratingValue
                      ? 'bg-purple-600 text-white shadow-sm scale-105' // Add slight scale effect for active
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => onSetMinRating(ratingValue)}
                aria-pressed={minRating === ratingValue} // ARIA attribute for pressed state
                aria-label={`Filter by minimum rating ${ratingValue === 0 ? 'All' : ratingValue}`}
              >
                {ratingValue === 0 ? 'All' : `${ratingValue}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-base">Categories</h3>
          {allCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-150 ease-in-out border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1
                    ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-100 text-purple-700 border-purple-300' // Use lighter bg for selected category
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  onClick={() => onToggleCategory(category)}
                  aria-pressed={selectedCategories.includes(category)}
                  aria-label={`Filter by category: ${category}`}
                >
                  {category}
                </button>
              ))}
            </div>
          ) : (
              <p className="text-sm text-gray-500">No categories available to filter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;