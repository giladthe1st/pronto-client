"use client";

import React, { useState, useEffect, useMemo } from 'react';
import RestaurantRow from './RestaurantRow';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Restaurant } from '@/types/restaurants';

const RestaurantList: React.FC = () => {
  const { restaurants, error } = useRestaurants();

  const maxReviewCount = useMemo(
    () => Math.max(...restaurants.map((r) => r.reviews_count), 0),
    [restaurants]
  );
  const maxRating = 5; // Rating is typically out of 5

  // Filter states
  const [minRating, setMinRating] = useState<number>(0);
  const [minReviews, setMinReviews] = useState<number>(0);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);

  // Update filteredRestaurants when restaurants or filters change
  useEffect(() => {
    if (restaurants.length > 0) {
      const filtered = restaurants.filter((restaurant) => {
        const passesRatingFilter = restaurant.average_rating >= minRating;
        const passesReviewCountFilter = restaurant.reviews_count >= minReviews;
        return passesRatingFilter && passesReviewCountFilter;
      });
      setFilteredRestaurants(filtered);
    }
  }, [minRating, minReviews, restaurants]); // Add restaurants as a dependency

  // Filter change handlers
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinRating(Number(e.target.value));
  };

  const handleReviewCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinReviews(Number(e.target.value));
  };

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center my-8">
        🍔 Restaurant Listings
        <span className="block mt-2 text-lg font-normal">
          Discover delicious deals near you
        </span>
      </h1>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredRestaurants.length} of {restaurants.length} restaurants
      </div>

      {/* Filter controls - horizontal layout */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          {/* Rating filter */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700">
                Min Rating: <span className="text-blue-600">{minRating.toFixed(1)}★</span>
              </label>
            </div>
            <input
              id="rating-filter"
              type="range"
              min="0"
              max={maxRating}
              step="0.1"
              value={minRating}
              onChange={handleRatingChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Review count filter */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="review-count-filter" className="block text-sm font-medium text-gray-700">
                Min Reviews: <span className="text-blue-600">{minReviews}</span>
              </label>
            </div>
            <input
              id="review-count-filter"
              type="range"
              min="0"
              max={maxReviewCount}
              step="1"
              value={minReviews}
              onChange={handleReviewCountChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-5 gap-6 p-4 border rounded mb-4 font-semibold">
        <div>Restaurant</div>
        <div>Deals</div>
        <div>Menu</div>
        <div>Reviews</div>
        <div>Location</div>
      </div>

      {/* Restaurant rows */}
      <div className="divide-y divide-gray-200">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantRow key={restaurant.id} {...restaurant} />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No restaurants match your filters. Try adjusting your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;