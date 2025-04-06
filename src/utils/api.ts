// src/utils/api.ts
const API_BASE_URL_LOCAL = 'http://localhost:3001/api';
const API_BASE_URL_PROD = 'https://pronto-server.vercel.app/api';

// Simple check (can be improved based on environment variables)
const IS_LOCAL = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const API_BASE_URL = IS_LOCAL ? API_BASE_URL_LOCAL : API_BASE_URL_PROD;

// Helper to handle fallback logic and basic fetch options
export async function fetchWithFallback(path: string, options?: RequestInit): Promise<Response> {
  const urlLocal = `${API_BASE_URL_LOCAL}${path}`;
  const urlProd = `${API_BASE_URL_PROD}${path}`;

  try {
    // Try local first if applicable, otherwise go straight to prod
    const response = await fetch(IS_LOCAL ? urlLocal : urlProd, options);
    // If the first attempt failed and it was local, try production
    if (!response.ok && IS_LOCAL) {
        console.warn(`Local fetch failed (${urlLocal}), trying production (${urlProd})...`);
        return await fetch(urlProd, options);
    }
    return response;
  } catch (error) {
    // If local fetch threw an error (e.g., network error) and we are local, try production
    if (IS_LOCAL) {
        console.warn(`Local fetch error (${urlLocal}), trying production (${urlProd})...`, error);
        return await fetch(urlProd, options);
    }
    // If production fetch failed or we weren't local, rethrow the error
    throw error;
  }
}

// Example usage within hooks:
// import { fetchWithFallback } from '@/utils/api';
// const response = await fetchWithFallback(`/restaurants/${restaurantId}/deals`);