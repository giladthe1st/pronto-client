"use client";
// pages/admin/restaurants/index.tsx
import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { fetchAdminAPI } from '@/utils/adminApi';
import { Restaurant } from '@/types/restaurants'; // Reuse existing type
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Define query key
const RESTAURANTS_QUERY_KEY = 'adminRestaurants';

const AdminRestaurantsPage = () => {
    const queryClient = useQueryClient();

    // Fetch restaurants using React Query
    const { data: restaurants, error, isLoading, isFetching, refetch } = useQuery<Restaurant[], Error>(
        RESTAURANTS_QUERY_KEY,
        async () => {
            const response = await fetchAdminAPI('/restaurants');
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({})); // Try to parse error
                throw new Error(errorData.message || `Failed to fetch restaurants (${response.status})`);
            }
            return response.json();
        },
        {
            // Optional: configure caching, refetching behavior
             staleTime: 1000 * 60 * 2, // Data considered fresh for 2 minutes
        }
    );

    // Mutation for deleting a restaurant
    const deleteMutation = useMutation(
        (restaurantId: number) => fetchAdminAPI(`/restaurants/${restaurantId}`, { method: 'DELETE' }),
        {
            onSuccess: (response) => {
                if (!response.ok) {
                    // Try to parse error from response body for better feedback
                    response.json().then(err => {
                         toast.error(`Failed to delete: ${err.message || `Server responded with ${response.status}`}`);
                    }).catch(() => {
                         toast.error(`Failed to delete. Server responded with ${response.status}`);
                    });
                } else {
                    toast.success('Restaurant deleted successfully!');
                    // Invalidate and refetch the restaurants list
                    queryClient.invalidateQueries(RESTAURANTS_QUERY_KEY);
                }
            },
            onError: (error: Error) => {
                toast.error(`Error deleting restaurant: ${error.message}`);
            },
        }
    );

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <AdminProtectedRoute>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Restaurants</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className={`p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-600 transition ${isFetching ? 'animate-spin' : ''}`}
                        title="Refresh list"
                    >
                        <ArrowPathIcon className="w-5 h-5"/>
                    </button>
                    <Link href="/admin/restaurants/upload" className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition inline-flex items-center">
                        Bulk Upload
                    </Link>
                    <Link href="/admin/restaurants/new" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition inline-flex items-center">
                        <PlusIcon className="w-5 h-5 mr-1" /> Add New
                    </Link>
                </div>
            </div>

            {isLoading && <div className="text-center py-4">Loading restaurants...</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error.message}</span>
                      </div>}

            {!isLoading && !error && restaurants && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                         {/* TODO: Add Search/Filter controls here */}
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {restaurants.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No restaurants found.</td>
                                    </tr>
                                )}
                                {restaurants.map((resto) => (
                                    <tr key={resto.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resto.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={resto.address}>{resto.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resto.average_rating?.toFixed(1) ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resto.categories?.join(', ') || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link href={`/admin/restaurants/edit/${resto.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                                                <PencilIcon className="w-4 h-4"/>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(resto.id, resto.name)}
                                                disabled={deleteMutation.isLoading && deleteMutation.variables === resto.id}
                                                className={`text-red-600 hover:text-red-900 inline-flex items-center ${deleteMutation.isLoading && deleteMutation.variables === resto.id ? 'opacity-50 cursor-not-allowed': ''}`}
                                                title="Delete"
                                            >
                                               <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* TODO: Add Pagination controls here */}
                    </div>
                </div>
            )}
        </AdminProtectedRoute>
    );
};

export default AdminRestaurantsPage;