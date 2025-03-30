import { useState, useEffect, useCallback } from 'react';
import { Restaurant } from '@/types/restaurants';
import { useDealPrices } from './useDealPrices';

export const useRestaurantFilters = (restaurants: Restaurant[]) => {
  const [filters, setFilters] = useState({
    minRating: 0,
    selectedCategories: [] as string[],
    searchQuery: '',
    sortBy: 'default' as 'default' | 'price' | 'rating' | 'distance',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);

  const { dealPrices } = useDealPrices(restaurants, filters.sortBy);

  const allCategories = Array.from(
    new Set(restaurants.flatMap(r => r.categories))
  ).sort();

  const applyFiltersAndSort = useCallback(() => {
    let filtered = restaurants.filter(restaurant => {
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

    if (filters.sortBy === 'price') {
      filtered = filtered.sort((a, b) => {
        const priceA = dealPrices[a.id] || Infinity;
        const priceB = dealPrices[b.id] || Infinity;
        return priceA - priceB;
      });
    } else if (filters.sortBy === 'rating') {
      filtered = filtered.sort((a, b) => b.average_rating - a.average_rating);
    } else if (filters.sortBy === 'distance') {
      filtered = filtered.sort((a, b) => {
        const distanceA = a.distance || Infinity;
        const distanceB = b.distance || Infinity;
        return distanceA - distanceB;
      });
    }

    setFilteredRestaurants(filtered);
  }, [restaurants, filters, dealPrices]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev); // Toggle behavior
    if (!showFilters) setShowSort(false); // Close sort if opening filters
  };

  const toggleSort = () => {
    setShowSort(prev => !prev); // Toggle behavior
    if (!showSort) setShowFilters(false); // Close filters if opening sort
  };

    // Add this function to explicitly close the sort dropdown
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
    filters: { ...filters, allCategories },
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
    closeSort
  };
};