'use client';
// components/auth/AdminProtectedRoute.tsx
import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { session, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      if (typeof window !== 'undefined') {
        router.replace(`/login?redirect=${pathname}`);
      }
    }
  }, [loading, session, isAdmin, pathname, router]);

  if (loading) {
    // Optional: Show a global loading spinner or skeleton
    return <div className="flex justify-center items-center h-screen">Loading Authentication...</div>;
  }

  if (!session || !isAdmin) {
    return <div className="flex justify-center items-center h-screen">Redirecting to login...</div>;
  }

  // If session exists and user is admin, render the children components
  return <>{children}</>;
};

export default AdminProtectedRoute;