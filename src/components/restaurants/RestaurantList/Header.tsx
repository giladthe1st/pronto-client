// src/components/restaurants/RestaurantList/Header.tsx
import React, { useState, ChangeEvent } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Use outline

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
   // Optional: Add debounce if search triggers API calls directly
   // For client-side filtering, direct onChange is fine.
   const [searchTerm, setSearchTerm] = useState('');

   const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
       const query = event.target.value;
       setSearchTerm(query);
       onSearch(query); // Call the handler passed from the parent
   };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-200 gap-4">
      {/* Logo/Brand */}
      <div className="flex items-center flex-shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg md:text-xl mr-3">
          P
        </div>
        {/* Link to homepage or relevant section */}
        <a href="#" className="font-semibold text-lg text-gray-800 hover:text-purple-600">
            Pronto Deals {/* Or your App name */}
        </a>
        {/* Optional: Tagline */}
        {/* <span className="ml-2 text-sm text-gray-500 hidden md:inline">| Find Restaurant Deals</span> */}
      </div>

      {/* Search Bar */}
      <div className="w-full sm:flex-1 max-w-xl mx-auto sm:mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search-input"
            type="search" // Use type="search" for better semantics/mobile keyboards
            placeholder="Search restaurants or categories..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white sm:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            onChange={handleInputChange}
            value={searchTerm}
            aria-label="Search restaurants or categories"
          />
        </div>
      </div>

      {/* Auth Button */}
      <div className="flex-shrink-0">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1">
          Login / Sign up
        </button>
      </div>
    </header>
  );
};

export default Header;