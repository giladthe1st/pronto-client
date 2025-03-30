import React from 'react'; // <-- Import React if not already
import { Restaurant } from '@/types/restaurants';
import DealsList from './DealsList';
import { FireIcon } from '@heroicons/react/24/outline';

interface DealsModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const DealsModal: React.FC<DealsModalProps> = ({ restaurant, onClose }) => {

  // Function to handle clicks on the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click target is the overlay element itself (not a child like the modal content)
    if (e.target === e.currentTarget) {
      onClose(); // Call the onClose function passed via props
    }
  };

  return (
    // Add onClick to the main overlay div
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick} // <-- Add the click handler here
    >
      {/* This is the actual modal content. Clicks inside here won't trigger the overlay click handler */}
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FireIcon className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                <p className="text-purple-200">Current Deals & Specials</p>
              </div>
            </div>
            <button
              onClick={onClose} // Keep this button for explicit closing
              className="text-white hover:text-purple-200 p-2 rounded-full hover:bg-purple-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <DealsList restaurantId={restaurant.id} />
        </div>
      </div>
    </div>
  );
};

export default DealsModal;