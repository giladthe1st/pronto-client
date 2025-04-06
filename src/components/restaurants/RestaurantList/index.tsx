// src/components/restaurants/RestaurantList/index.tsx
"use client"; // Keep client directive if using App Router features relying on client hooks
import React from 'react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useRestaurantFilters } from '@/hooks/useRestaurantFilters';
import Header from './Header';
import FilterControls from './FilterControls';
import FilterPanel from './FilterPanel';
import RestaurantSections from './RestaurantSections';
import DealsModal from './DealsModal';
import { MapPinIcon, ExclamationTriangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Optional: Add a dedicated Loading Skeleton component for the entire page
const ListSkeletonLoader: React.FC = () => (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-10 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-16 border-b border-gray-200 py-4 flex items-center justify-between">
             <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-300"></div><div className="h-5 bg-gray-300 rounded w-24"></div></div>
             <div className="h-9 bg-gray-300 rounded-full w-48"></div>
             <div className="h-9 bg-gray-300 rounded-full w-28"></div>
        </div>
        {/* Filter Controls Skeleton */}
        <div className="py-4 flex gap-2">
            <div className="h-8 bg-gray-300 rounded-full w-20"></div>
            <div className="h-8 bg-gray-300 rounded-full w-20"></div>
        </div>
         {/* Ad Space Skeleton */}
        <div className="bg-gray-200 rounded-lg h-40 my-8"></div>
        {/* Restaurant Card Skeletons */}
        <div className="mb-4 h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-xl shadow-sm bg-white p-4 space-y-3">
                    <div className="h-36 bg-gray-300 rounded"></div>
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                     <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-9 bg-gray-300 rounded-lg mt-4"></div>
                </div>
            ))}
        </div>
    </div>
);

const RestaurantList: React.FC = () => {
  // 1. Fetch initial restaurant data
  const {
      restaurants: initialRestaurants,
      error: restaurantsError,
      loading: restaurantsLoading
  } = useRestaurants();

  // 2. Initialize filters and apply them to the initial data
  const {
    filteredRestaurants,
    filters,
    allCategories,
    hasActiveFilters,
    showFiltersPanel,
    showSortDropdown,
    selectedRestaurantForModal,
    locationError,
    locationLoading,
    // dealPricesLoading, // Can be used for finer-grained loading state during sort
    handleSearch,
    toggleFiltersPanel,
    toggleSortDropdown,
    closeSortDropdown,
    setMinRating,
    toggleCategory,
    setSortBy,
    clearFilters,
    handleRestaurantClick,
    closeDealsModal,
  } = useRestaurantFilters(initialRestaurants); // Pass fetched restaurants to the filter hook

  // --- Render Logic ---

  // Initial Loading State (Skeleton)
  if (restaurantsLoading) {
    return <ListSkeletonLoader />;
  }

  // Initial Data Fetching Error
  if (restaurantsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-4">We couldn&apos;t load the restaurant data.</p>
         <p className="text-sm text-gray-500 bg-red-50 p-2 rounded border border-red-100">Error: {restaurantsError}</p>
         {/* Optional: Retry button */}
         {/* <button onClick={() => window.location.reload()} className="mt-4 ...">Retry</button> */}
      </div>
    );
  }

  // Location Status Message (Displayed below Header/Filters)
  let locationStatusMessage = null;
  if (locationLoading) {
      // Subtle loading indicator for location
      locationStatusMessage = (
          <div className="text-xs text-center text-gray-500 py-2 animate-pulse">Finding your location...</div>
      );
  } else if (locationError) {
      // More prominent warning if location failed
      locationStatusMessage = (
          <div className="flex items-center justify-center gap-2 text-sm text-orange-700 bg-orange-50 p-2.5 rounded-md my-3 border border-orange-200">
              <MapPinIcon className="w-4 h-4 flex-shrink-0" />
              <span>Could not get location: {locationError}. Distance sorting may be inaccurate.</span>
          </div>
      );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 min-h-screen"> {/* Ensure min height */}
      <Header onSearch={handleSearch} />

      <FilterControls
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        showSortDropdown={showSortDropdown}
        onToggleFiltersPanel={toggleFiltersPanel}
        onToggleSortDropdown={toggleSortDropdown}
        closeSortDropdown={closeSortDropdown}
        onClearFilters={clearFilters}
        onSelectSort={setSortBy}
      />

       {/* Display location status here */}
       {locationStatusMessage}

      {/* Conditionally render Filter Panel */}
      {showFiltersPanel && (
        <FilterPanel
          minRating={filters.minRating}
          selectedCategories={filters.selectedCategories}
          allCategories={allCategories}
          onSetMinRating={setMinRating}
          onToggleCategory={toggleCategory}
        />
      )}

      {/* Ad Space Placeholder */}
      <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg h-32 sm:h-40 my-6 sm:my-8 flex items-center justify-center text-gray-400 text-sm">
        Advertisement Area
      </div>

      {/* Main Content: Restaurant List or No Results */}
      <main>
        {filteredRestaurants.length > 0 ? (
            <RestaurantSections
              restaurants={filteredRestaurants}
              onRestaurantClick={handleRestaurantClick}
            />
        ) : (
            <div className="text-center py-16 text-gray-500">
                <MagnifyingGlassIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="font-semibold text-lg text-gray-600">No restaurants found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                {hasActiveFilters && (
                     <button
                         onClick={clearFilters}
                         className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium"
                     >
                        Clear all filters
                     </button>
                )}
            </div>
        )}
      </main>


      {/* Ad Space Placeholder */}
       <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg h-32 sm:h-40 mt-8 mb-8 flex items-center justify-center text-gray-400 text-sm">
           Advertisement Area
       </div>

      {/* Deals Modal (Rendered conditionally by parent state) */}
      <DealsModal
        restaurant={selectedRestaurantForModal}
        onClose={closeDealsModal}
      />
    </div>
  );
};

export default RestaurantList;