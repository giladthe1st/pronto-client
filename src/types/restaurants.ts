// types/restaurants.ts (or wherever your Restaurant type is defined)
export interface Restaurant {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  reviews_count: number;
  average_rating: number;
  address: string;
  maps_url: string;
  latitude: number;
  longitude: number;
  categories: string[];
  menu?: string; // Keep existing optional fields
  distance?: number; // <-- Add this field (optional number for km)
}