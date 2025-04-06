// src/components/restaurants/RestaurantList/DealsModal.tsx
import React from 'react';
import { Restaurant } from '@/types/restaurants';
import { useDeals } from '@/hooks/useDeals'; // Import the new hook
import DealsList from './DealsList';
import { FireIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Use solid XMark

interface DealsModalProps {
  restaurant: Restaurant | null; // Can be null if no restaurant selected
  onClose: () => void;
}

const DealsModal: React.FC<DealsModalProps> = ({ restaurant, onClose }) => {
  // Use the hook to fetch deals for the selected restaurant's ID
  const { deals, loading, error } = useDeals(restaurant?.id ?? null); // Pass ID or null

  // Handle clicks on the overlay to close the modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render the modal if no restaurant is selected
  if (!restaurant) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick}
      aria-labelledby="deals-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Content */}
      <div className="bg-gray-50 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-5 md:p-6 text-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FireIcon className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0" />
              <div>
                <h2 id="deals-modal-title" className="text-xl md:text-2xl font-bold">{restaurant.name}</h2>
                <p className="text-sm md:text-base text-purple-200">Current Deals & Specials</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-purple-200 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close deals modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 md:p-6 overflow-y-auto">
          <DealsList deals={deals} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default DealsModal;