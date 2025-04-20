// src/components/restaurants/RestaurantList/Header.tsx
import React, { useState, ChangeEvent } from 'react';
import Link from 'next/link'; // Import Link for navigation
import { useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { MagnifyingGlassIcon, UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'; // Add relevant icons

interface HeaderProps {
  onSearch: (query: string) => void;
}

let dropdownTimeout: ReturnType<typeof setTimeout>;

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { session, isAdmin, loading, logout } = useAuth(); // Get auth state

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    onSearch(query);
  };

  const router = useRouter();
  const handleLogout = async () => {
      await logout();
      // Only redirect if running on the client
      if (typeof window !== 'undefined') {
        router.push('/');
      }
  }

  // --- Determine what the Auth button should show ---
  const renderAuthButton = () => {
    if (loading) {
      // Show a simple loading state for the button area
      return <div className="h-9 w-28 bg-gray-300 rounded-full animate-pulse"></div>;
    }

    if (session) {
      // User is logged in
      return (
        <div
          className="relative"
          onMouseEnter={() => {
            clearTimeout(dropdownTimeout);
            setDropdownOpen(true);
          }}
          onMouseLeave={() => {
            dropdownTimeout = setTimeout(() => setDropdownOpen(false), 120);
          }}
        >
          <button
            className="flex items-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <UserCircleIcon className="w-5 h-5 mr-1.5" />
            Account
          </button>
          {/* Dropdown for logged-in users */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-30"
              onMouseEnter={() => {
                clearTimeout(dropdownTimeout);
                setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeout = setTimeout(() => setDropdownOpen(false), 120);
              }}
            >
              <div className="px-4 py-2 text-sm text-gray-500 border-b truncate" title={session.user.email ?? ''}>
                {session.user.email}
              </div>
              {isAdmin && (
                <Link href="/admin" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  <Cog6ToothIcon className="w-4 h-4 mr-2 inline-block" />
                  Admin Panel
                </Link>
              )}
              {/* <Link href="/account" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">My Profile</Link> */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      // User is logged out - show the Login button
      return (
        <Link
          href="/login"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
        >
          Login / Sign up
        </Link>
        // Alternatively, use router.push for programmatic navigation:
        // <button
        //   onClick={() => router.push('/login')}
        //   className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1">
        //   Login / Sign up
        // </button>
      );
    }
  };


  return (
    <header className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-200 gap-4">
      {/* Logo/Brand */}
      <div className="flex items-center flex-shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg md:text-xl mr-3">
          P
        </div>
        <Link href="/" className="font-semibold text-lg text-gray-800 hover:text-purple-600">
            Pronto Deals
        </Link>
      </div>

      {/* Search Bar */}
      <div className="w-full sm:flex-1 max-w-xl mx-auto sm:mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search-input"
            type="search"
            placeholder="Search restaurants or categories..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white sm:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            onChange={handleInputChange}
            value={searchTerm}
            aria-label="Search restaurants or categories"
          />
        </div>
      </div>

      {/* Auth Button Area - Now dynamically rendered */}
      <div className="flex-shrink-0">
        {renderAuthButton()}
      </div>
    </header>
  );
};

export default Header;