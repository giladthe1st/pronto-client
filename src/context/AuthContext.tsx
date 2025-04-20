"use client"; // context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabaseClient';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isAdmin: boolean; // Derived state indicating if the user is an admin
  loading: boolean; // Loading state for initial auth check
  logout: () => Promise<void>;
  // Add signIn if you build a custom form: signIn: (credentials) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Define a type for your user profile data from the backend/database
interface UserProfile {
    id: number; // Your app's user ID
    email: string;
    role: {
        id: number;
        role_type: string; // e.g., 'Admin', 'User'
    };
    // Add other profile fields if needed
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const supabase = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Start loading until checked

   // Fetch extended user profile including role AFTER Supabase auth confirms user
   const fetchUserProfile = async (authUser: User | null): Promise<UserProfile | null> => {
        console.log('[AuthContext] fetchUserProfile called with:', authUser?.email);

        if (!authUser) return null;

        // This requires an API endpoint to get the current user's profile
        // Let's assume you create GET /api/users/me (or similar) protected by Supabase auth
        // *Alternatively*, you could call the `getUserAppRole` logic directly from the frontend,
        // but it's generally better practice to have a dedicated backend endpoint.

        // Placeholder: You need to implement this backend endpoint
        // It should verify the JWT and return the user's data from your `Users` table.
        console.warn("AuthContext: fetchUserProfile needs a backend endpoint like GET /api/users/me");
        // try {
        //    const response = await fetchWithAuth('/users/me'); // Your function to call protected API
        //    if (!response.ok) throw new Error('Failed to fetch profile');
        //    const profile: UserProfile = await response.json();
        //    return profile;
        // } catch (error) {
        //    console.error("Failed to fetch user profile:", error);
        //    return null;
        // }
        // --- Temporary Mock ---
        // Simulating fetching role based on email for demo - replace with real API call!
        if (authUser.email === 'gilad.rodov@gmail.com') {
            console.log('[AuthContext] Mocking admin user:', authUser.email);
            return { id: 1, email: authUser.email, role: { id: 2, role_type: 'Admin' } };
        } else {
            console.log('[AuthContext] Mocking regular user:', authUser.email);
            return { id: 10, email: authUser.email || '', role: { id: 1, role_type: 'User' } };
        }
        // --- End Temporary Mock ---
   };


  useEffect(() => {
    setLoading(true);
    // 1. Check for initial session synchronously if possible
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log('[AuthContext] Initial session:', session?.user?.email);

       // 2. Fetch profile and determine admin status based on initial session
       fetchUserProfile(session?.user ?? null).then(profile => {
            const isAdmin = profile?.role?.role_type === 'Admin';
            setIsAdmin(isAdmin);
            setLoading(false); // Initial check complete
            console.log('[AuthContext] Profile:', profile, 'isAdmin:', isAdmin);
       });
    });

    // 3. Listen for auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('[AuthContext] Auth state changed:', _event, session ? session.user.email : 'No session');
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        // Re-fetch profile and update admin status on change
        setLoading(true); // Indicate loading while checking role
        const profile = await fetchUserProfile(currentUser);
        setIsAdmin(profile?.role?.role_type === 'Admin');
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]); // Add supabase as dependency

  const logout = async () => {
    await supabase.auth.signOut();
    // State will update via onAuthStateChange listener
  };

  const value = {
    session,
    user,
    isAdmin,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};