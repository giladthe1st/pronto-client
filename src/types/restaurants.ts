export interface Restaurant {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  average_rating: number;
  reviews_count: number;
  address: string;
  maps_url: string;
  // These fields need backend implementation or should be removed
  menu?: string;
  distance?: number;
}