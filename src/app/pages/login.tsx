// pages/login.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared'; // Or create your own theme
import { getSupabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const supabase = getSupabase();
  const { session, loading } = useAuth();
  const router = useRouter();
  const redirectPath = router.query.redirect as string || '/admin'; // Default redirect to admin dashboard

  useEffect(() => {
    // If user is already logged in and tries to access /login, redirect them
    if (!loading && session) {
      router.replace(redirectPath);
    }
  }, [session, loading, router, redirectPath]);

  // Don't render Auth form if session exists (avoids flash)
  if (loading || session) {
      return <div className="flex justify-center items-center h-screen">Checking session...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Admin Login
        </h2>
        {/* Supabase Auth UI */}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }} // Use Supabase's theme
          // theme="dark" // Example: Dark theme
          providers={['google', 'github']} // Optional: Add social providers if configured in Supabase
          redirectTo={process.env.NEXT_PUBLIC_SITE_URL + redirectPath} // Redirect after successful login (used by OAuth)
          // view='sign_in' // Can default to sign_in or sign_up
          // onlyThirdPartyProviders // Set to true if you ONLY want social logins
        />
      </div>
    </div>
  );
};

export default LoginPage;