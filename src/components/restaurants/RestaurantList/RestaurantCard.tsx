// src/components/restaurants/RestaurantList/RestaurantCard.tsx
import React from 'react';
import { Restaurant } from '@/types/restaurants';
import { StarIcon, MapPinIcon, BoltIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import { formatDistance } from '@/utils/geo'; // Import the utility

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void; // For opening the deals modal
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const formattedRating = restaurant.average_rating ? restaurant.average_rating.toFixed(1) : 'New'; // Use 'New' or similar for 0/null rating
  const distanceText = formatDistance(restaurant.distance); // Use the formatter

  return (
    <article // Use article for semantic meaning of self-contained content
      className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer h-full group focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2"
      onClick={onClick}
      role="button" // Explicitly define role
      aria-label={`View deals for ${restaurant.name}`}
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()} // Allow activation with Enter/Space
    >
      {/* Image/Placeholder Section */}
      <div className="w-full h-36 sm:h-40 bg-gradient-to-br from-gray-200 to-gray-300 relative flex items-center justify-center overflow-hidden">
        {/* Placeholder Icon - Centered */}
        <BuildingStorefrontIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 opacity-80" />
        {/* TODO: Replace with actual Image component if available */}
        {/* <Image src={restaurant.logo_url || '/placeholder-logo.png'} alt={`${restaurant.name} logo`} layout="fill" objectFit="cover" /> */}

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center bg-black bg-opacity-70 rounded-full px-2.5 py-1 text-white shadow-lg z-10">
          <StarIcon className="w-3.5 h-3.5 text-yellow-400 mr-1" />
          <span className="text-xs font-bold tracking-wide">{formattedRating}</span>
        </div>

        {/* Optional: Add Open/Closed status */}
        {/* <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Open</div> */}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow justify-between">
         {/* Top Info: Name, Categories */}
         <div className="mb-3">
           {/* Use title attribute for full name on hover if truncated */}
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1 leading-tight truncate" title={restaurant.name}>
            {restaurant.name}
          </h3>
          {restaurant.categories.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-500 mb-2 capitalize truncate" title={restaurant.categories.join(', ')}>
                 {/* Join with a more distinct separator */}
                {restaurant.categories.join(' · ')}
              </p>
          )}
        </div>

        {/* Middle Info: Deals Tag, Distance */}
        <div className="mb-4 space-y-2">
            {/* Deals Available Tag */}
            {/* Consider making this conditional based on actual deal data if available at this stage */}
            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
               <BoltIcon className="w-3 h-3 mr-1 -ml-0.5" />
               Deals Available
            </span>

            {/* Distance Info */}
            {distanceText && ( // Only render if distanceText is not empty
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
                <span>{distanceText}</span>
              </div>
            )}
        </div>


        {/* Action Button */}
        <div className="mt-auto"> {/* Pushes button to bottom */}
          <button
            // Make button non-interactive for keyboard users navigating the card itself
            tabIndex={-1}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-200 ease-in-out shadow group-hover:shadow-md focus:outline-none" // Removed focus styles as focus is on the card
          >
            See Deals
          </button>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;