// components/restaurants/RestaurantList/index.tsx
"use client";
import React from 'react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useRestaurantFilters } from '@/hooks/useRestaurantFilters';
import Header from './Header';
import FilterControls from './FilterControls';
import FilterPanel from './FilterPanel';
import RestaurantSections from './RestaurantSections';
import DealsModal from './DealsModal';
import { MapPinIcon } from '@heroicons/react/24/outline'; // For location error icon

const RestaurantList: React.FC = () => {
  // Get initial restaurants and loading/error state for them
  const { restaurants: initialRestaurants, error: restaurantsError, loading: restaurantsLoading } = useRestaurants();

  // Pass initial restaurants to the filter hook
  const {
    filteredRestaurants,
    filters,
    showFilters,
    showSort,
    selectedRestaurant,
    locationError, // Get location error from filter hook
    locationLoading, // Get location loading state
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
  } = useRestaurantFilters(initialRestaurants);

  // --- Loading States ---
  // Initial load for restaurants themselves
  if (restaurantsLoading) {
     // You can return a more sophisticated skeleton loader here
    return <div className="text-center py-10">Loading restaurants...</div>;
  }

  // Handle error fetching the initial restaurant list
  if (restaurantsError) {
    return <div className="text-center py-8 text-red-500">Error loading restaurants: {restaurantsError}</div>;
  }

  // --- Location Status ---
  // Optional: Show a message while location is being determined or if it failed
  let locationStatusMessage = null;
  if (locationLoading) {
      locationStatusMessage = (
          <div className="text-sm text-gray-500 py-2 text-center">Fetching your location for distance sorting...</div>
      );
  } else if (locationError) {
      locationStatusMessage = (
          <div className="flex items-center justify-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-md my-2">
              <MapPinIcon className="w-4 h-4" />
              <span>Could not get location: {locationError} (Distance sorting may be inaccurate)</span>
          </div>
      );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-10"> {/* Added bottom padding */}
      <Header onSearch={handleSearch} />

      {/* Optional: Display location status */}
      {locationStatusMessage}

      <FilterControls
        filters={filters}
        showFilters={showFilters}
        showSort={showSort}
        onToggleFilters={toggleFilters}
        onToggleSort={toggleSort}
        closeSort={closeSort}
        onClearFilters={clearFilters}
        onSelectSort={setSortBy}
      />

      {showFilters && (
        <FilterPanel
          minRating={filters.minRating}
          selectedCategories={filters.selectedCategories}
          allCategories={filters.allCategories} // Use allCategories from filters object
          onSetMinRating={setMinRating}
          onToggleCategory={toggleCategory}
        />
      )}

      {/* Ad Space - Placeholder */}
      <div className="bg-gray-200 rounded-lg h-40 mb-8 flex items-center justify-center text-gray-500">
        Ad Space
      </div>

      {/* Display Restaurants or a 'No Results' message */}
       {filteredRestaurants.length > 0 ? (
           <RestaurantSections
             restaurants={filteredRestaurants}
             onRestaurantClick={handleRestaurantClick}
           />
       ) : (
           <div className="text-center py-10 text-gray-500">
               No restaurants match your current filters.
           </div>
       )}

      {/* Ad Space - Placeholder */}
      <div className="bg-gray-200 rounded-lg h-40 mt-8 mb-8 flex items-center justify-center text-gray-500">
        Ad Space
      </div>

      {/* Deals Modal */}
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