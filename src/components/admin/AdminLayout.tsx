'use client';
// components/admin/AdminLayout.tsx
import React, { ReactNode } from 'react';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeftOnRectangleIcon, BuildingStorefrontIcon, TagIcon, DocumentArrowUpIcon, HomeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'; // Example icons

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/login'); // Redirect to login after logout
  };

  const navItems = [
    // { href: '/admin', label: 'Dashboard', icon: ChartBarIcon },
    { href: '/admin/restaurants', label: 'Restaurants', icon: BuildingStorefrontIcon },
    { href: '/admin/restaurants/upload', label: 'Bulk Upload', icon: DocumentArrowUpIcon },
    { href: '/admin/deals', label: 'Deals', icon: TagIcon },
    // { href: '/admin/users', label: 'Users', icon: UsersIcon }, // Future
  ];

  return (
    <ReactQueryProvider>
      <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col">
        <Link href="/admin" className="p-4 text-xl font-semibold border-b border-gray-700">Admin Panel</Link>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = !!pathname && pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin'); // Handle base path exact match
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
           <div className="text-xs text-gray-400 mb-2 truncate" title={user?.email ?? ''}>
               Logged in as: {user?.email ?? '...'}
           </div>
           {/* Home & Main Website Buttons */}
           <div className="flex gap-2 mb-2">
             <Link
               href="/"
               className="flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-green-600 hover:text-white transition-colors duration-150 ease-in-out border border-gray-600 hover:border-green-600"
             >
               <GlobeAltIcon className="w-5 h-5 mr-2" />
               Main Website
             </Link>
           </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-150 ease-in-out border border-gray-600 hover:border-red-600"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        {/* Wrap children in the protected route logic */}
        {/* No need to wrap here if pages using this layout are already wrapped */}
        {children}
      </main>
    </div>
      </ReactQueryProvider>
  );
};

export default AdminLayout;