// src/hooks/useRestaurantFilters.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Restaurant } from '@/types/restaurants';
import { useDealPrices } from './useDealPrices';
import { useUserLocation } from './useUserLocation';
import { calculateDistance } from '@/utils/geo';
import { FiltersState, SortByType } from '@/types/filters';

export const useRestaurantFilters = (initialRestaurants: Restaurant[]) => {
  const [filters, setFilters] = useState<FiltersState>({
    minRating: 0,
    selectedCategories: [],
    searchQuery: '',
    sortBy: 'default',
  });

  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedRestaurantForModal, setSelectedRestaurantForModal] = useState<Restaurant | null>(null);

  // --- Location Handling ---
  const { location: userLocation, error: locationError, loading: locationLoading } = useUserLocation();

  // --- Restaurants with Distance ---
  // Calculate distances only when location or initial restaurants change
  const restaurantsWithDistance = useMemo(() => {
    if (!userLocation || initialRestaurants.length === 0) {
      // Return initial list with undefined distance if no location
      return initialRestaurants.map(r => ({ ...r, distance: undefined }));
    }
    return initialRestaurants.map(restaurant => {
      let distance: number | undefined = undefined;
      if (restaurant.latitude && restaurant.longitude) {
        try {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            restaurant.latitude,
            restaurant.longitude
          );
        } catch (e) {
          console.error("Error calculating distance for restaurant", restaurant.id, e);
        }
      }
      return { ...restaurant, distance };
    });
  }, [initialRestaurants, userLocation]);

  // --- Deal Price Handling (for sorting) ---
  const { dealPrices, loading: dealPricesLoading, error: dealPricesError } = useDealPrices(
    restaurantsWithDistance, // Fetch prices for the potentially distance-augmented list
    filters.sortBy === 'price' // Only enable fetching when sorting by price
  );

   // Log location errors (optional)
   useEffect(() => {
       if (locationError) {
           console.warn("Could not get user location:", locationError);
       }
   }, [locationError]);

  // --- Filtering and Sorting ---
  const filteredAndSortedRestaurants = useMemo(() => {
    // Start with the list that potentially has distances calculated
    let processedList = [...restaurantsWithDistance];

    // Apply Filters
    processedList = processedList.filter(restaurant => {
      const rating = restaurant.average_rating ?? 0; // Handle potentially null ratings
      const passesRating = rating >= filters.minRating;

      const passesCategories = filters.selectedCategories.length === 0 ||
        restaurant.categories.some(cat => filters.selectedCategories.includes(cat));

      const passesSearch = filters.searchQuery === '' ||
        restaurant.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        restaurant.categories.some(cat =>
          cat.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );

      return passesRating && passesCategories && passesSearch;
    });

    // Apply Sorting
    const { sortBy } = filters;
    if (sortBy === 'price') {
       // Note: Sorting happens even if dealPrices are still loading or errored.
       // Restaurants without prices (or during loading/error) will be treated as Infinity.
      processedList.sort((a, b) => {
        const priceA = dealPrices[a.id] ?? Infinity;
        const priceB = dealPrices[b.id] ?? Infinity;
        return priceA - priceB;
      });
    } else if (sortBy === 'rating') {
      // Sort descending by rating, putting lower/null ratings last
      processedList.sort((a, b) => (b.average_rating ?? -1) - (a.average_rating ?? -1));
    } else if (sortBy === 'distance') {
      // Sort ascending by distance, putting undefined distances last
      processedList.sort((a, b) => {
        const distA = a.distance ?? Infinity;
        const distB = b.distance ?? Infinity;
        if (distA === Infinity && distB === Infinity) return 0; // Keep original relative order if both unknown
        return distA - distB;
      });
    }
    // Add default sort stability if needed (e.g., by ID or name)
    // else if (sortBy === 'default') { ... maybe sort by name or ID ... }

    return processedList;
  }, [restaurantsWithDistance, filters, dealPrices]); // Re-run when base data, filters, or deal prices change

  // --- Event Handlers (memoized) ---
  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const toggleFiltersPanel = useCallback(() => {
    setShowFiltersPanel(prev => !prev);
    if (!showFiltersPanel) setShowSortDropdown(false); // Close sort if opening filters
  }, [showFiltersPanel]);

  const toggleSortDropdown = useCallback(() => {
    setShowSortDropdown(prev => !prev);
     if (!showSortDropdown) setShowFiltersPanel(false); // Close filters if opening sort
  }, [showSortDropdown]);

  const closeSortDropdown = useCallback(() => {
    setShowSortDropdown(false);
  }, []);

  const setMinRating = useCallback((rating: number) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => {
      const currentlySelected = prev.selectedCategories.includes(category);
      const newCategories = currentlySelected
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category];
      return { ...prev, selectedCategories: newCategories };
    });
  }, []);

  const setSortBy = useCallback((sortBy: SortByType) => {
     // Optional: Prevent selecting 'distance' if location failed and no restaurants have distance?
      if (sortBy === 'distance' && locationError && !restaurantsWithDistance.some(r => r.distance !== undefined)) {
         console.warn("Cannot sort by distance: Location unavailable.");
         // Optionally show a user message here instead of just changing state
         // return;
      }
    setFilters(prev => ({ ...prev, sortBy }));
    closeSortDropdown(); // Close dropdown after selection
  }, [closeSortDropdown, locationError, restaurantsWithDistance]); // Include dependencies

  const clearFilters = useCallback(() => {
    setFilters({
      minRating: 0,
      selectedCategories: [],
      searchQuery: '',
      sortBy: 'default',
    });
    setShowFiltersPanel(false); // Also close panel on clear
    setShowSortDropdown(false);
  }, []);

  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurantForModal(restaurant);
  }, []);

  const closeDealsModal = useCallback(() => {
    setSelectedRestaurantForModal(null);
  }, []);

  // --- Derived State ---
  // Calculate all unique categories only once from the initial list
   const allCategories = useMemo(() =>
     Array.from(new Set(initialRestaurants.flatMap(r => r.categories))).sort()
   , [initialRestaurants]);

  const hasActiveFilters = useMemo(() =>
      filters.minRating > 0 ||
      filters.selectedCategories.length > 0 ||
      filters.searchQuery !== '' ||
      filters.sortBy !== 'default'
  , [filters]);

  // --- Return Value ---
  return {
    // Data
    filteredRestaurants: filteredAndSortedRestaurants,
    allCategories,
    // Filter/Sort State
    filters,
    hasActiveFilters,
    // UI State
    showFiltersPanel,
    showSortDropdown,
    // Modal State
    selectedRestaurantForModal,
    // Location Status
    locationError,
    locationLoading,
    // Deal Price Status (optional, for UI feedback during price sort)
    dealPricesLoading,
    dealPricesError,
    // Handlers
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
  };
};

export default useRestaurantFilters;