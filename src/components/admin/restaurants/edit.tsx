"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';

import toast from 'react-hot-toast';
import { fetchAdminAPI } from '@/utils/adminApi';
import { Restaurant } from '@/types/restaurants';
import { RestaurantCategoryList } from '@/types/restaurantCategories';

const EditRestaurantPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
    average_rating: '',
    categories: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await fetchAdminAPI(`/restaurants/${id}`);
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || 'Failed to fetch restaurant');
        }
        const data: Restaurant = await response.json();
        setForm({
          name: data.name || '',
          address: data.address || '',
          average_rating: data.average_rating?.toString() || '',
          categories: Array.isArray(data.categories) ? data.categories : [],
        });
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch restaurant');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'categories') {
      const selected = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setForm({ ...form, categories: selected });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        average_rating: form.average_rating ? parseFloat(form.average_rating) : undefined,
        categories: form.categories,
      };
      const response = await fetchAdminAPI(`/restaurants/${id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to update restaurant');
      }
      toast.success('Restaurant updated successfully!');
      router.push('/admin/restaurants');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminProtectedRoute>
        <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow text-center">
          Loading restaurant data...
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Restaurant</h1>
        {form.categories.length > 0 && (
          <div className="mb-4">
            <span className="font-medium">Current Categories: </span>
            {form.categories.map(cat => (
              <span key={cat} className="inline-block bg-gray-200 rounded px-2 py-1 text-sm mr-2">{cat}</span>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Average Rating</label>
              <input
                type="number"
                name="average_rating"
                value={form.average_rating}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min={0}
                max={5}
                step={0.1}
                placeholder="e.g. 4.5"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Categories</label>
              <input
                type="text"
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                placeholder="Search categories"
                className="border rounded px-2 py-1 mb-2 w-full"
              />
              <ul className="divide-y divide-gray-200">
                {RestaurantCategoryList.filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase())).map(cat => (
                  <li key={cat} className="flex items-center justify-between py-1">
                    <span>{cat}</span>
                    {form.categories.includes(cat) ? (
                      <span className="flex items-center">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs mr-2">Assigned</span>
                        <button
                          type="button"
                          className="text-red-500 hover:underline text-xs"
                          onClick={() => setForm({ ...form, categories: form.categories.filter(c => c !== cat) })}
                        >Delete</button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="text-blue-500 hover:underline text-xs"
                        onClick={() => setForm({ ...form, categories: [...form.categories, cat] })}
                      >Add</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => router.push('/admin/restaurants')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
    </AdminProtectedRoute>
  );
};

export default EditRestaurantPage;