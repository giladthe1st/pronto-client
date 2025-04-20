"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchAdminAPI } from '@/utils/adminApi';

const NewRestaurantPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
    average_rating: '',
    categories: '', // Comma separated
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        average_rating: form.average_rating ? parseFloat(form.average_rating) : undefined,
        categories: form.categories.split(',').map((c) => c.trim()).filter(Boolean),
      };
      const response = await fetchAdminAPI('/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create restaurant');
      }
      toast.success('Restaurant created successfully!');
      router.push('/admin/restaurants');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Add New Restaurant</h1>
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
                name="categories"
                value={form.categories}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Italian, Pizza, Vegan"
              />
              <p className="text-xs text-gray-400 mt-1">Separate categories with commas.</p>
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
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
  );
};

export default NewRestaurantPage;
