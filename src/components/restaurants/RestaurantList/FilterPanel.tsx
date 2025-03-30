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
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Filter */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Minimum Rating</h3>
          <div className="flex items-center space-x-2">
            {[0, 1, 2, 3, 4].map((rating) => (
              <button
                key={rating}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  minRating === rating ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => onSetMinRating(rating)}
              >
                {rating === 0 ? 'All' : rating}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategories.includes(category)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => onToggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;