"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchAdminAPI } from '@/utils/adminApi';
import { RestaurantCategoryList } from '@/types/restaurantCategories';

const NewRestaurantPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
    average_rating: '',
    categories: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

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
        categories: form.categories,
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
    } catch (err: unknown) {
      const msg = (typeof err === 'object' && err && 'message' in err) ? String((err as { message?: unknown }).message) : 'Failed to fetch restaurant';
      toast.error(msg);
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
              {form.categories.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Current Categories: </span>
                  {form.categories.map(cat => (
                    <span key={cat} className="inline-block bg-gray-200 rounded px-2 py-1 text-sm mr-2">{cat}</span>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                placeholder="Search categories"
                className="border rounded px-2 py-1 mb-2 w-full"
              />
              <ul className="divide-y divide-gray-200">
                {RestaurantCategoryList.filter((cat: string) => cat.toLowerCase().includes(categorySearch.toLowerCase())).map((cat: string) => (
                  <li key={cat} className="flex items-center justify-between py-1">
                    <span>{cat}</span>
                    {form.categories.includes(cat) ? (
                      <span className="flex items-center">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs mr-2">Assigned</span>
                        <button
                          type="button"
                          className="text-red-500 hover:underline text-xs"
                          onClick={() => setForm({ ...form, categories: form.categories.filter((c: string) => c !== cat) })}
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
