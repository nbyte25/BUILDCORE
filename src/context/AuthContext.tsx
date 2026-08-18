import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { Profile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { db } from '../lib/database';
import { useToast } from './ToastContext';

interface SignUpMetadata {
  full_name: string;
  company_name?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  role: UserRole;
  isAdmin: boolean;
  isManager: boolean;
  isCustomer: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null }>;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<{ user: User | null; session: Session | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const LOCAL_AUTH_KEYS = {
  USER: 'buildcore_auth_user_v1',
  PROFILE: 'buildcore_auth_profile_v1',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const fetchProfile = async (userId: string, emailFallback?: string): Promise<Profile | null> => {
    try {
      const prof = await db.getProfileById(userId);
      if (prof) {
        setProfile(prof);
        return prof;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile from database:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting Supabase auth session:', error);
          }
          if (isMounted && initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchProfile(initialSession.user.id, initialSession.user.email);
          }
        } catch (err) {
          console.error('Unexpected error loading auth session:', err);
        }
      } else {
        // Local storage session fallback for development/demo mode
        try {
          const storedUser = localStorage.getItem(LOCAL_AUTH_KEYS.USER);
          const storedProfile = localStorage.getItem(LOCAL_AUTH_KEYS.PROFILE);
          if (storedUser && isMounted) {
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
            if (storedProfile) {
              setProfile(JSON.parse(storedProfile) as Profile);
            } else {
              await fetchProfile(parsedUser.id, parsedUser.email);
            }
          }
        } catch (err) {
          console.error('Error loading local mock auth session:', err);
        }
      }

      if (isMounted) setLoading(false);
    }

    initializeAuth();

    let authSubscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id, newSession.user.email);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      authSubscription = subscription;
    }

    return () => {
      isMounted = false;
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  // 1. Sign In
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Local fallback auth
      const cleanEmail = email.trim().toLowerCase();
      let role: UserRole = 'customer';
      let name = cleanEmail.split('@')[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);

      if (cleanEmail.includes('admin')) {
        role = 'admin';
        name = 'Principal Engineer (Admin)';
      } else if (cleanEmail.includes('manager')) {
        role = 'manager';
        name = 'Project Manager';
      }

      const mockId = 'usr-' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
      const mockUser = {
        id: mockId,
        app_metadata: {},
        user_metadata: { full_name: name },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: cleanEmail,
        phone: '',
        role: 'authenticated'
      } as unknown as User;

      const mockProfile: Profile = {
        id: mockId,
        full_name: name,
        email: cleanEmail,
        role: role,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(LOCAL_AUTH_KEYS.USER, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_AUTH_KEYS.PROFILE, JSON.stringify(mockProfile));

      // Also ensure profile exists in db
      await db.updateProfile(mockId, mockProfile);

      setUser(mockUser);
      setProfile(mockProfile);
      setSession(null);

      return { user: mockUser, session: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      showToast('Authentication Error', error.message, 'error');
      throw error;
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id, data.user.email);
    }

    return data;
  };

  // 2. Sign Up
  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    if (!isSupabaseConfigured) {
      const cleanEmail = email.trim().toLowerCase();
      const mockId = 'usr-' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
      const mockUser = {
        id: mockId,
        app_metadata: {},
        user_metadata: {
          full_name: metadata.full_name,
          company_name: metadata.company_name,
          phone: metadata.phone
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: cleanEmail,
        phone: metadata.phone || '',
        role: 'authenticated'
      } as unknown as User;

      const mockProfile: Profile = {
        id: mockId,
        full_name: metadata.full_name,
        company_name: metadata.company_name,
        phone: metadata.phone,
        email: cleanEmail,
        role: 'customer',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(LOCAL_AUTH_KEYS.USER, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_AUTH_KEYS.PROFILE, JSON.stringify(mockProfile));

      await db.updateProfile(mockId, mockProfile);

      setUser(mockUser);
      setProfile(mockProfile);
      setSession(null);

      return { user: mockUser, session: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          company_name: metadata.company_name || '',
          phone: metadata.phone || ''
        }
      }
    });

    if (error) {
      showToast('Registration Error', error.message, 'error');
      throw error;
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id, data.user.email);
    }

    return data;
  };

  // 3. Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during Supabase sign out:', err);
      }
    } else {
      localStorage.removeItem(LOCAL_AUTH_KEYS.USER);
      localStorage.removeItem(LOCAL_AUTH_KEYS.PROFILE);
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    showToast('Signed Out', 'You have been signed out successfully.', 'info');
  };

  // 4. Password Reset
  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      showToast('Password Reset Dispatched', `[Demo Mode] Password reset instructions simulated for ${email}`, 'success');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`
    });

    if (error) {
      showToast('Password Reset Failed', error.message, 'error');
      throw error;
    }

    showToast('Password Reset Dispatched', `Instructions have been sent to ${email}`, 'success');
  };

  // 5. Update Profile
  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      throw new Error('User must be authenticated to update profile.');
    }

    const safeUpdates = { ...updates };
    delete (safeUpdates as any).role;

    const updated = await db.updateProfile(user.id, safeUpdates);
    setProfile(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem(LOCAL_AUTH_KEYS.PROFILE, JSON.stringify(updated));
    }
    showToast('Profile Saved', 'Your profile details have been updated.', 'success');
  };

  // Database-enforced role derivation
  const role: UserRole = profile?.role || 'customer';
  const isAdmin = role === 'admin';
  const isManager = role === 'manager' || role === 'admin';
  const isCustomer = role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        role,
        isAdmin,
        isManager,
        isCustomer,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateUserProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
