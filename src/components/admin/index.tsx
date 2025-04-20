// pages/admin/index.tsx
import React from 'react';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { useAuth } from '@/context/AuthContext';

const AdminDashboardPage = () => {
    const { user } = useAuth();

  return (
    <AdminProtectedRoute> {/* Protect this page */}
      
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-lg">Welcome, <span className='font-semibold'>{user?.email ?? 'Admin'}</span>!</p>
            <p className="text-gray-600 mt-2">
                Select an option from the sidebar to manage restaurants, deals, or perform bulk uploads.
            </p>
            {/* Add dashboard widgets here later */}
        </div>      
    </AdminProtectedRoute>
  );
};

export default AdminDashboardPage;