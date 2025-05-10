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
    profile: {
        appUserId: string;
        email: string;
        roleId: string;
        roleType: string; // e.g., 'Admin', 'User'
        // Add other profile fields if needed
    }
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const supabase = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Start loading until checked

   // Fetch extended user profile including role AFTER Supabase auth confirms user
   const fetchUserProfile = React.useCallback(async (authUser: User | null): Promise<UserProfile | null> => {
        console.log('[AuthContext] fetchUserProfile called with:', authUser?.email);

        if (!authUser) return null;

        // This requires an API endpoint to get the current user's profile
        // Let's assume you create GET /api/users/me (or similar) protected by Supabase auth
        // *Alternatively*, you could call the `getUserAppRole` logic directly from the frontend,
        // but it's generally better practice to have a dedicated backend endpoint.

        // Call the backend endpoint to get the current user's profile and role
        try {
            // Get the current session to retrieve the access token
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;
            if (!accessToken) throw new Error('No access token found');

            // Determine the correct API base URL
            const API_BASE_URL = 'https://pronto-server.vercel.app'

            // Call your backend endpoint with the token
            const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                credentials: 'include', // if your backend uses cookies
            });

            if (!response.ok) throw new Error('Failed to fetch profile');
            const profile: UserProfile = await response.json();
            console.log("[AuthContext] Profile fetched from /api/users/me:", profile);
            return profile;
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            return null;
        }
   }, [supabase]);


  useEffect(() => {
    setLoading(true);
    // 1. Check for initial session synchronously if possible
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log('[AuthContext] Initial session:', session?.user?.email);

       // 2. Fetch profile and determine admin status based on initial session
       fetchUserProfile(session?.user ?? null)
         .then(profile => {
            const isAdmin = profile?.profile?.roleType === 'Admin';
            setIsAdmin(isAdmin);
            console.log('[AuthContext] Profile:', profile, 'isAdmin:', isAdmin);
         })
         .catch(error => {
            console.error('Error fetching profile:', error);
         })
         .finally(() => {
            setLoading(false); // Always set loading to false
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
        fetchUserProfile(currentUser)
          .then(profile => {
            setIsAdmin(profile?.profile?.roleType === 'Admin');
            console.log('[AuthContext] After Auth Change\nProfile: ' + JSON.stringify(profile) + '\nisAdmin: ' + (profile?.profile?.roleType === 'Admin'));
          })
          .catch(error => {
            console.error('Error fetching profile after auth change:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase, fetchUserProfile]); // Add supabase and fetchUserProfile as dependencies

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