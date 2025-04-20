// pages/_app.tsx
import '@/styles/globals.css'; // Your global styles
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext'; // <--- Make sure this import is correct
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 30, // 30 minutes
            retry: 1, // Retry failed requests once
        },
    },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    // 1. QueryClientProvider should be high up
    <QueryClientProvider client={queryClient}>
        {/* 2. AuthProvider MUST WRAP the Component */}
        <AuthProvider>
            {/* 3. Component represents the current page being rendered */}
            <Component {...pageProps} />
            {/* Toaster for notifications */}
            <Toaster position="bottom-right" />
        </AuthProvider>
     </QueryClientProvider>
  );
}