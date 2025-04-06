export type SortByType = 'default' | 'price' | 'rating' | 'distance';

export interface FiltersState {
  minRating: number;
  selectedCategories: string[];
  searchQuery: string;
  sortBy: SortByType;
}