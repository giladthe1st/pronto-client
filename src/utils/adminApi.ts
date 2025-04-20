// utils/adminApi.ts
import { getSupabase } from "@/lib/supabaseClient";

// Determine base URL like in your existing api.ts
const API_BASE_URL_LOCAL = 'http://localhost:3001/api/admin'; // Note the /admin prefix
const API_BASE_URL_PROD = 'https://pronto-server.vercel.app/api/admin'; // Note the /admin prefix
const IS_LOCAL = typeof window !== 'undefined' && window.location.hostname === 'localhost';
export const ADMIN_API_BASE_URL = IS_LOCAL ? API_BASE_URL_LOCAL : API_BASE_URL_PROD;


// Function to get the current auth token
async function getAuthToken(): Promise<string | null> {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
}


// Fetches data from the admin API with authentication
export async function fetchAdminAPI(path: string, options: RequestInit = {}): Promise<Response> {
    const token = await getAuthToken();
    if (!token) {
        // Handle case where user is not logged in - perhaps redirect or throw specific error
        console.error("Admin API call attempted without auth token.");
        // Returning a mock Response object indicating unauthorized status
        return new Response(JSON.stringify({ error: 'Unauthorized', message: 'No session token found.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const defaultHeaders: Record<string, string> = {
        ...(options.headers as Record<string, string>),
        'Authorization': `Bearer ${token}`,
        // Content-Type might be set automatically by FormData or explicitly for JSON
    };
    // Avoid setting Content-Type for FormData requests (browser handles it)
    if (!(options.body instanceof FormData)) {
       defaultHeaders['Content-Type'] = 'application/json';
    }


    const url = `${ADMIN_API_BASE_URL}${path}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
        });

        // Optional: Centralized handling for 401/403 errors (e.g., trigger logout)
        if (response.status === 401 || response.status === 403) {
            console.warn(`Admin API request to ${path} resulted in ${response.status}. Token might be expired or invalid.`);
            // Potentially trigger a logout or token refresh mechanism here
            // const { logout } = useAuth(); // Can't use hooks here easily
            // Consider event bus or similar if global logout is needed
        }

        return response;
    } catch (error) {
        console.error(`Error fetching Admin API ${url}:`, error);
        throw error; // Re-throw network errors etc.
    }
}

// Example usage:
// const response = await fetchAdminAPI('/restaurants');
// const data = await response.json();

// For file upload:
// const formData = new FormData();
// formData.append('file', fileInputElement.files[0]);
// const uploadResponse = await fetchAdminAPI('/restaurants/bulk-upload', {
//     method: 'POST',
//     body: formData, // Don't set Content-Type header here
// });