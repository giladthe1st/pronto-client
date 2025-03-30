import React from 'react';
import { Restaurant } from '@/types/restaurants';
import RestaurantCard from './RestaurantCard';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface RestaurantSectionsProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
}

const RestaurantSections: React.FC<RestaurantSectionsProps> = ({
  restaurants,
  onRestaurantClick
}) => {
  const sections = [
    {
      title: "Closest deals to you",
      restaurants: restaurants.slice(0, 4)
    },
    {
      title: "Most popular places",
      restaurants: restaurants.slice(4, 8)
    }
  ];

  return (
    <>
      {sections.map((section, index) => (
        <section key={index} className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
            <button className="flex items-center text-purple-600 hover:text-purple-800 font-medium">
              See all <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </>
  );
};

export default RestaurantSections;