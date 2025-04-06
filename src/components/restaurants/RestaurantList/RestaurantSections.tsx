// src/components/restaurants/RestaurantList/RestaurantSections.tsx
import React from 'react';
import { Restaurant } from '@/types/restaurants';
import RestaurantCard from './RestaurantCard';
import { ChevronRightIcon } from '@heroicons/react/24/outline'; // Use outline

interface RestaurantSectionsProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  // Optional: Define explicit sections or pass them as props if logic changes
}

// Simple section definition for demonstration
// In a real app, this logic might be more complex or data-driven
const SECTIONS_CONFIG = [
    { title: "Featured Restaurants", size: 4 }, // Example: first 4 are 'Featured'
    { title: "More Places Nearby", size: 8 },  // Example: next 8 are 'More'
    // Add more sections as needed
];


const RestaurantSections: React.FC<RestaurantSectionsProps> = ({
  restaurants,
  onRestaurantClick
}) => {
  if (!restaurants || restaurants.length === 0) {
     // Handled by the parent component, but good practice to check
    return null;
  }

  // Create sections based on the configuration
  const sections: { title: string; restaurants: Restaurant[] }[] = [];
  let startIndex = 0;
  for (const config of SECTIONS_CONFIG) {
      const sectionRestaurants = restaurants.slice(startIndex, startIndex + config.size);
      if (sectionRestaurants.length > 0) { // Only add section if it has restaurants
          sections.push({ title: config.title, restaurants: sectionRestaurants });
          startIndex += config.size;
      }
      // Stop creating sections if we run out of restaurants
       if (startIndex >= restaurants.length) {
           break;
       }
  }

  // Add remaining restaurants to a generic 'All Restaurants' section if any are left
  const remainingRestaurants = restaurants.slice(startIndex);
   if (remainingRestaurants.length > 0) {
       // Check if the last section already covers these (if SECTIONS_CONFIG is exhaustive)
       // If not, add a final section. Adjust title as needed.
       if (sections.length === 0 || sections[sections.length - 1].restaurants.slice(-1)[0]?.id !== remainingRestaurants.slice(-1)[0]?.id) {
          sections.push({ title: "All Restaurants", restaurants: remainingRestaurants });
       }
   }

  return (
    <div className="space-y-8 md:space-y-10">
      {sections.map((section, index) => (
        <section key={section.title + index} aria-labelledby={`section-title-${index}`}>
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4 md:mb-5">
            <h2 id={`section-title-${index}`} className="text-lg md:text-xl font-bold text-gray-800">
                {section.title}
            </h2>
            {/* "See all" button - functionality depends on requirements */}
            {/* Maybe links to a page with *all* restaurants matching the current filter? */}
            <button className="flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors">
              See all <ChevronRightIcon className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          {/* Restaurant Grid */}
           {/* Responsive grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {section.restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => onRestaurantClick(restaurant)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default RestaurantSections;