// hooks/useRestaurantFilters.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Restaurant } from '@/types/restaurants';
import { useDealPrices } from './useDealPrices';
import { useUserLocation } from './useUserLocation'; // <-- Import location hook
import { calculateDistance } from '@/utils/geo'; // <-- Import distance calculator

export const useRestaurantFilters = (initialRestaurants: Restaurant[]) => {
  const [filters, setFilters] = useState({
    minRating: 0,
    selectedCategories: [] as string[],
    searchQuery: '',
    sortBy: 'default' as 'default' | 'price' | 'rating' | 'distance',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [processedRestaurants, setProcessedRestaurants] = useState<Restaurant[]>([]); // Restaurants with distance calculated
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);

  const { dealPrices } = useDealPrices(initialRestaurants, filters.sortBy);
  const { location: userLocation, error: locationError, loading: locationLoading } = useUserLocation(); // <-- Use location hook

  // Calculate all unique categories once
  const allCategories = useMemo(() =>
    Array.from(new Set(initialRestaurants.flatMap(r => r.categories))).sort()
  , [initialRestaurants]);

  // Effect to calculate distances when initialRestaurants or userLocation changes
  useEffect(() => {
    if (initialRestaurants.length > 0 && !locationLoading) { // Process when location is determined (or failed)
      const restaurantsWithDistances = initialRestaurants.map(restaurant => {
        let distance: number | undefined = undefined;
        if (userLocation && restaurant.latitude && restaurant.longitude) {
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
        return {
          ...restaurant,
          distance: distance // distance will be undefined if no userLocation or error
        };
      });
      setProcessedRestaurants(restaurantsWithDistances);
    } else {
       // Set initial state or handle loading case if needed
       setProcessedRestaurants(initialRestaurants.map(r => ({ ...r, distance: undefined })));
    }
  }, [initialRestaurants, userLocation, locationLoading]); // Depend on loading state too

  // Log location errors
  useEffect(() => {
      if (locationError) {
          console.warn("Could not get user location:", locationError);
          // Optionally, show a message to the user
      }
  }, [locationError]);


  const applyFiltersAndSort = useCallback(() => {
    // Start filtering from the list that potentially has distances
    let filtered = processedRestaurants.filter(restaurant => {
      const passesRating = restaurant.average_rating >= filters.minRating;
      const passesCategories = filters.selectedCategories.length === 0 ||
        restaurant.categories.some(cat => filters.selectedCategories.includes(cat));
      const passesSearch = filters.searchQuery === '' ||
        restaurant.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        restaurant.categories.some(cat =>
          cat.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );

      return passesRating && passesCategories && passesSearch;
    });

    // Apply sorting
    if (filters.sortBy === 'price') {
      filtered = filtered.sort((a, b) => {
        const priceA = dealPrices[a.id] ?? Infinity; // Use ?? for nullish coalescing
        const priceB = dealPrices[b.id] ?? Infinity;
        return priceA - priceB;
      });
    } else if (filters.sortBy === 'rating') {
      filtered = filtered.sort((a, b) => b.average_rating - a.average_rating);
    } else if (filters.sortBy === 'distance') {
       // Sort by distance, putting restaurants without a calculated distance last
      filtered = filtered.sort((a, b) => {
        const distA = a.distance ?? Infinity; // Treat undefined/null distance as Infinity
        const distB = b.distance ?? Infinity;
        // Handle cases where both are Infinity (e.g., no location permission) - keep original relative order
        if (distA === Infinity && distB === Infinity) {
          return 0;
        }
        return distA - distB;
      });
    }
    // Add default sort if needed (e.g., by ID or name) to ensure stability if 'default' is selected
    // else if (filters.sortBy === 'default') { ... }

    setFilteredRestaurants(filtered);
  }, [processedRestaurants, filters, dealPrices]); // Depend on processedRestaurants now

  useEffect(() => {
    // Re-apply filters and sort whenever dependencies change
    applyFiltersAndSort();
  }, [applyFiltersAndSort]); // applyFiltersAndSort includes all its dependencies

  // --- Rest of the hook remains largely the same ---

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
    if (!showFilters) setShowSort(false);
  };

  const toggleSort = () => {
    setShowSort(prev => !prev);
    if (!showSort) setShowFilters(false);
  };

  const closeSort = () => {
    setShowSort(false);
  };

  const setMinRating = (rating: number) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  const setSortBy = (sortBy: 'default' | 'price' | 'rating' | 'distance') => {
     // Optional: Maybe prevent selecting 'distance' if location failed?
     // if (sortBy === 'distance' && locationError) {
     //    console.warn("Cannot sort by distance: Location unavailable.");
     //    // Optionally show a user message here
     //    return;
     // }
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const clearFilters = () => {
    setFilters({
      minRating: 0,
      selectedCategories: [],
      searchQuery: '',
      sortBy: 'default',
    });
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const closeDealsModal = () => {
    setSelectedRestaurant(null);
  };

  return {
    filteredRestaurants,
    filters: { ...filters, allCategories }, // Pass calculated categories
    showFilters,
    showSort,
    selectedRestaurant,
    handleSearch,
    toggleFilters,
    toggleSort,
    setMinRating,
    toggleCategory,
    setSortBy,
    clearFilters,
    handleRestaurantClick,
    closeDealsModal,
    closeSort,
    locationError, // Expose location error if needed by UI
    locationLoading, // Expose loading state
  };
};