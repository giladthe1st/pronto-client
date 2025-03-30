"use client";
import React from 'react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useRestaurantFilters } from '@/hooks/useRestaurantFilters';
import Header from './Header';
import FilterControls from './FilterControls';
import FilterPanel from './FilterPanel';
import RestaurantSections from './RestaurantSections';
import DealsModal from './DealsModal';

const RestaurantList: React.FC = () => {
  const { restaurants, error } = useRestaurants();
  const {
    filteredRestaurants,
    filters,
    showFilters,
    showSort,
    selectedRestaurant,
    handleSearch,
    toggleFilters,
    toggleSort,
    closeSort,
    setMinRating,
    toggleCategory,
    setSortBy,
    clearFilters,
    handleRestaurantClick,
    closeDealsModal,
  } = useRestaurantFilters(restaurants);

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      <Header onSearch={handleSearch} />

      <FilterControls
        filters={filters}
        showFilters={showFilters}
        showSort={showSort}
        onToggleFilters={toggleFilters}
        onToggleSort={toggleSort}
        closeSort={closeSort} // <-- Pass closeSort down
        onClearFilters={clearFilters}
        onSelectSort={setSortBy}
      />

      {showFilters && (
        <FilterPanel
          minRating={filters.minRating}
          selectedCategories={filters.selectedCategories}
          allCategories={filters.allCategories}
          onSetMinRating={setMinRating}
          onToggleCategory={toggleCategory}
        />
      )}

      <div className="bg-gray-200 rounded-lg h-40 mb-8 flex items-center justify-center text-gray-500">
        Ad Space
      </div>

      <RestaurantSections
        restaurants={filteredRestaurants}
        onRestaurantClick={handleRestaurantClick}
      />

      <div className="bg-gray-200 rounded-lg h-40 mb-8 flex items-center justify-center text-gray-500">
        Ad Space
      </div>

      {selectedRestaurant && (
        <DealsModal
          restaurant={selectedRestaurant}
          onClose={closeDealsModal}
        />
      )}
    </div>
  );
};

export default RestaurantList;