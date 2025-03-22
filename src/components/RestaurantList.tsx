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

      <div className="flex gap-8">
        {/* Filter controls - moved to side */}
        <div className="w-64 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="space-y-6">
            {/* Rating filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Rating:
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(star)}
                    className={`p-2 rounded-full ${
                      minRating >= star
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 text-gray-500'
                    } hover:bg-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredRestaurants.length} of {restaurants.length} restaurants
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
      </div>
    </div>
  );
};

export default RestaurantList;