'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from './types';

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Supabase session exists - try to fetch profile
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !error) {
            setCurrentUser(profile as User);
            localStorage.setItem('currentUser', JSON.stringify(profile));
          } else {
            // Supabase session exists but no profile found - clear
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
          }
        } else if (typeof window !== 'undefined') {
          // No Supabase session - check localStorage (for demo/mock login)
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            try {
              setCurrentUser(JSON.parse(storedUser) as User);
            } catch (parseError) {
              console.error('Failed to parse stored user', parseError);
              localStorage.removeItem('currentUser');
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setCurrentUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          // Supabase session exists - use it
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setCurrentUser(profile as User);
            localStorage.setItem('currentUser', JSON.stringify(profile));
          }
        } else if (event === 'SIGNED_OUT') {
          // Explicit sign out - clear everything
          console.log('User signed out, clearing session');
          localStorage.removeItem('currentUser');
          sessionStorage.clear();
          setCurrentUser(null);
        } else if (!session && event !== 'TOKEN_REFRESHED') {
          // No session - try to use localStorage (for demo/mock login)
          if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
              try {
                setCurrentUser(JSON.parse(storedUser) as User);
              } catch (e) {
                console.error('Failed to parse stored user', e);
                localStorage.removeItem('currentUser');
                setCurrentUser(null);
              }
            }
          }
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
}
