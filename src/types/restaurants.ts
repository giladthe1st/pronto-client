// src/types/restaurants.ts
export interface Restaurant {
  id: number;
  name: string;
  logo_url?: string;
  website_url?: string;
  reviews_count: number;
  average_rating: number;
  address: string;
  maps_url?: string;
  latitude?: number;
  longitude?: number;
  categories: string[];
  distance?: number;
}


export interface RestaurantApiResponse {
   // Define based on your actual API structure before transformation
   id: number;
   name: string;
   logo_url?: string;
   website_url?: string;
   reviews_count: number;
   average_rating: number;
   address: string;
   maps_url?: string;
   latitude?: number;
   longitude?: number;
   // Categories might come separately
}

export interface CategoryApiResponse {
    restaurant_id: number;
    category_name: string;
}