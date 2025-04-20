// app/login/page.tsx
'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { getSupabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const supabase = getSupabase();
  const { session, loading } = useAuth();
  const router = useRouter();
  // For App Router, query params are different, so we just default to /admin
  const redirectPath = '/admin';

  useEffect(() => {
    if (!loading && session) {
      router.replace(redirectPath);
    }
  }, [session, loading, router, redirectPath]);

  if (loading || session) {
    return <div className="flex justify-center items-center h-screen">Checking session...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Home</button>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 text-center w-full">
            Admin Login
          </h2>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']}
          redirectTo={process.env.NEXT_PUBLIC_SITE_URL + '/admin'}
        />
      </div>
    </div>
  );
};

export default LoginPage;
