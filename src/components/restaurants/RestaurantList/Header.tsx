import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-3">
          P
        </div>
        <span className="font-medium text-gray-700">For Restaurants</span>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for anything"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
        Login / Sign up
      </button>
    </header>
  );
};

export default Header;