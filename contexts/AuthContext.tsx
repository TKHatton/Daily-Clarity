import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { dbService } from '../services/dbService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await dbService.getProfile(session.user.id);
          if (profile) {
            setUser(profile);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata.full_name || 'User',
              subscriptionStatus: 'Active',
              usageCount: 0
            });
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      }
      setIsLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await dbService.getProfile(session.user.id);
        setUser(profile || {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || 'User',
          subscriptionStatus: 'Active',
          usageCount: 0
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error("Database not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error("Database not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY.");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    
    if (error) throw error;
    
    if (data.user) {
      setUser({
        id: data.user.id,
        email,
        name,
        subscriptionStatus: 'Active',
        usageCount: 0
      });
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isConfigured: isSupabaseConfigured, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
