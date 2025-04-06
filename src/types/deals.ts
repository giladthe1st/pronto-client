// src/types/deals.ts
export interface Deal {
  id: number;
  details: string;
  summarized_deal: string;
  price: number;
  restaurant_name: string;
  restaurant_id: number;
}

export interface DealData {
  id: number;
  created_at: string;
  details: string;
  restaurant_id: number;
  summarized_deal: string;
  price: number;
  restaurant_name: string;
}