'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './types';

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser) as User;
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Failed to parse stored user', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('currentUser');
        }
      }
    }
    setIsLoading(false);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

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
