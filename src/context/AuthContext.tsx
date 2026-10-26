import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { memberService } from '../services/memberService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session, User as SupabaseAuthUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  workspaceName: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  authProvider?: 'gmail' | 'email' | 'demo' | 'google' | 'github' | 'azure';
}

export interface EmailValidationResult {
  isValid: boolean;
  isGmail: boolean;
  domain: string;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  connectionError: string | null;

  // Real Supabase Authentication operations
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  signup: (name: string, email: string, password?: string) => Promise<{ 
    success: boolean; 
    error?: string; 
    requiresVerification?: boolean;
    user?: User; 
  }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;

  // Passwordless Email OTP & Magic Link
  signInWithOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string; user?: User }>;

  // OAuth Integrations
  loginWithGoogle: (options?: { redirectTo?: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithGitHub: (options?: { redirectTo?: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithMicrosoft: (options?: { redirectTo?: string }) => Promise<{ success: boolean; error?: string }>;

  // Demo Workspace Sandbox (Explicit non-production guest session, no plaintext passwords)
  demoLogin: () => void;

  // Profile and Validation helpers
  validateEmail: (email: string) => EmailValidationResult;
  updateProfile: (updates: { name?: string; avatar?: string; workspaceName?: string }) => Promise<void>;

  // Backwards-compatible legacy helpers
  sendVerificationEmail: (email: string, name?: string, password?: string) => Promise<{
    success: boolean;
    code?: string;
    token?: string;
    directLink?: string;
    message: string;
    error?: string;
  }>;
  confirmEmailWithCode: (email: string, code: string) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
  confirmDirectMailAccess: (token: string, email?: string) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
}

const STORAGE_SESSION_CACHE = 'onedesk_auth_user_cache';

export const validateEmailAddress = (email: string): EmailValidationResult => {
  const trimmed = (email || '').trim().toLowerCase();
  if (!trimmed) {
    return { isValid: false, isGmail: false, domain: '', message: 'Email address is required' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { 
      isValid: false, 
      isGmail: false, 
      domain: '', 
      message: 'Please enter a valid email format (e.g., name@gmail.com)' 
    };
  }

  const parts = trimmed.split('@');
  const userPart = parts[0];
  const domainPart = parts[1];
  const isGmail = domainPart === 'gmail.com' || domainPart === 'googlemail.com';

  if (isGmail && userPart.length < 3) {
    return { 
      isValid: false, 
      isGmail: true, 
      domain: domainPart, 
      message: 'Gmail username must be at least 3 characters long' 
    };
  }

  return {
    isValid: true,
    isGmail,
    domain: domainPart,
    message: isGmail ? 'Valid Google Gmail address confirmed' : 'Valid email address domain confirmed'
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_SESSION_CACHE);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Helper to map Supabase Auth User + Optional DB Profile to OneDesk User
  const mapSupabaseUser = useCallback((sbUser: SupabaseAuthUser, profileData?: any): User => {
    const rawName = profileData?.name || 
      sbUser.user_metadata?.full_name || 
      sbUser.user_metadata?.name || 
      sbUser.email?.split('@')[0] || 
      'Workspace Member';
    const cleanName = rawName.trim();
    const email = sbUser.email || '';
    const avatar = profileData?.avatar_url || sbUser.user_metadata?.avatar_url || '';
    const role = profileData?.role || 'Workspace Owner';
    const workspaceName = profileData?.workspace_name || `${cleanName}'s Workspace`;
    const provider = (sbUser.app_metadata?.provider as any) || 
      (email.endsWith('@gmail.com') ? 'gmail' : 'email');

    return {
      id: sbUser.id,
      name: cleanName,
      email,
      avatar,
      role,
      workspaceName,
      emailVerified: Boolean(sbUser.email_confirmed_at),
      emailVerifiedAt: sbUser.email_confirmed_at,
      authProvider: provider
    };
  }, []);

  // Fetch optional profile record from public.profiles
  const fetchUserProfile = useCallback(async (sbUser: SupabaseAuthUser): Promise<User> => {
    if (!supabase) return mapSupabaseUser(sbUser);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      return mapSupabaseUser(sbUser, profile);
    } catch (err) {
      console.warn('[OneDesk Auth] Profiles table lookup skipped/deferred:', err);
      return mapSupabaseUser(sbUser);
    }
  }, [mapSupabaseUser]);

  // Sync state with memberService and safe session cache (NO passwords stored)
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_SESSION_CACHE, JSON.stringify(user));
        memberService.addWorkspaceMember({
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user.role as 'Owner' | 'Admin' | 'Member' | 'Guest') || 'Owner',
          status: 'Online',
          avatar: user.avatar,
          avatarBg: '#7c3aed',
          initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
          isYou: true
        });
      } catch (e) {
        console.error('Failed to sync memberService:', e);
      }
    } else {
      localStorage.removeItem(STORAGE_SESSION_CACHE);
    }
  }, [user]);

  // Initial Supabase Session Bootstrap & Realtime Listener
  useEffect(() => {
    // Purge any legacy mock storage with plaintext passwords from previous sessions
    try {
      localStorage.removeItem('clickjoy_pending_verifications');
      localStorage.removeItem('clickjoy_registered_users');
    } catch {}

    if (!isSupabaseConfigured || !supabase) {
      setConnectionError('Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Restore active session
    supabase.auth.getSession().then(async ({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('[OneDesk Auth] Session restoration error:', error);
        setConnectionError(error.message);
        setIsLoading(false);
        return;
      }

      setSession(initialSession);
      if (initialSession?.user) {
        const fullUser = await fetchUserProfile(initialSession.user);
        if (isMounted) setUser(fullUser);
      } else {
        // If no active session, ensure user is null unless demo user was active
        setUser(prev => (prev?.authProvider === 'demo' ? prev : null));
      }
      setIsLoading(false);
    }).catch(err => {
      if (!isMounted) return;
      console.error('[OneDesk Auth] Supabase unreachable:', err);
      setConnectionError('Failed to establish connection to Supabase Auth.');
      setIsLoading(false);
    });

    // 2. Listen to real-time auth state events (sign in, sign out, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;
      console.log(`[OneDesk Auth] Auth event: ${event}`);

      setSession(currentSession);
      if (currentSession?.user) {
        const fullUser = await fetchUserProfile(currentSession.user);
        if (isMounted) setUser(fullUser);
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Email Validation wrapper
  const validateEmail = (email: string): EmailValidationResult => {
    return validateEmailAddress(email);
  };

  // Real Supabase Login (Email + Password)
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    const val = validateEmailAddress(email);
    if (!val.isValid) {
      return { success: false, error: val.message };
    }

    if (!password) {
      return { success: false, error: 'Password is required to sign in.' };
    }

    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable. Please check your Supabase configuration.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Sign in succeeded but user object was not returned.' };
      }

      const fullUser = await fetchUserProfile(data.user);
      setUser(fullUser);
      return { success: true, user: fullUser };
    } catch (err: any) {
      return { success: false, error: err?.message || 'An unexpected error occurred during login.' };
    }
  };

  // Real Supabase Signup (Email + Password)
  const signup = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string; requiresVerification?: boolean; user?: User }> => {
    const val = validateEmailAddress(email);
    if (!val.isValid) {
      return { success: false, error: val.message };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable. Please check your Supabase configuration.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0] || 'Workspace Member').trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            name: cleanName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Sign up succeeded but user profile was not returned.' };
      }

      // If email confirmation is required and email not yet confirmed
      const requiresVerification = !data.session && !data.user.email_confirmed_at;
      const fullUser = await fetchUserProfile(data.user);

      if (data.session) {
        setUser(fullUser);
      }

      return {
        success: true,
        requiresVerification,
        user: fullUser
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'An unexpected error occurred during signup.' };
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setUser(null);
    setSession(null);
    try {
      localStorage.removeItem(STORAGE_SESSION_CACHE);
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('[OneDesk Auth] Sign out warning:', err);
    }
  };

  // Password Reset Request
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const val = validateEmailAddress(email);
    if (!val.isValid) {
      return { success: false, error: val.message };
    }

    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to dispatch password reset email.' };
    }
  };

  // Update Password (when user is authenticated via reset link or settings)
  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update password.' };
    }
  };

  // Passwordless Email OTP
  const signInWithOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const val = validateEmailAddress(email);
    if (!val.isValid) {
      return { success: false, error: val.message };
    }

    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable.' };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to dispatch one-time passcode.' };
    }
  };

  // Verify OTP
  const verifyOtp = async (
    email: string,
    token: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable.' };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: 'email'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const fullUser = await fetchUserProfile(data.user);
        setUser(fullUser);
        return { success: true, user: fullUser };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Invalid or expired passcode.' };
    }
  };

  // Google OAuth
  const loginWithGoogle = async (
    options?: { redirectTo?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`
        }
      });

      if (error) return { success: false, error: error.message };
      if (data?.url) {
        window.location.href = data.url;
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to initiate Google OAuth.' };
    }
  };

  // GitHub OAuth
  const loginWithGitHub = async (
    options?: { redirectTo?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`
        }
      });

      if (error) return { success: false, error: error.message };
      if (data?.url) {
        window.location.href = data.url;
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to initiate GitHub OAuth.' };
    }
  };

  // Microsoft OAuth (Azure provider)
  const loginWithMicrosoft = async (
    options?: { redirectTo?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Authentication service unavailable.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`,
          scopes: 'email openid profile'
        }
      });

      if (error) return { success: false, error: error.message };
      if (data?.url) {
        window.location.href = data.url;
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to initiate Microsoft OAuth.' };
    }
  };

  // Update Profile
  const updateProfile = async (updates: { name?: string; avatar?: string; workspaceName?: string }) => {
    if (!user) return;

    const cleanName = updates.name !== undefined && updates.name.trim() ? updates.name.trim() : user.name;
    const cleanAvatar = updates.avatar !== undefined ? updates.avatar : user.avatar;
    const cleanWorkspace = updates.workspaceName !== undefined && updates.workspaceName.trim() 
      ? updates.workspaceName.trim() 
      : user.workspaceName;

    const updatedUser: User = {
      ...user,
      name: cleanName,
      avatar: cleanAvatar,
      workspaceName: cleanWorkspace
    };

    try {
      localStorage.setItem(STORAGE_SESSION_CACHE, JSON.stringify(updatedUser));
      memberService.addWorkspaceMember({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: (updatedUser.role as any) || 'Owner',
        status: 'Online',
        avatar: updatedUser.avatar || '',
        avatarBg: '#176B50',
        initials: updatedUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
        isYou: true
      });
      window.dispatchEvent(new CustomEvent('onedesk_profile_updated', { detail: updatedUser }));
    } catch (e) {
      console.warn('[OneDesk Auth] Cache write error:', e);
    }

    setUser(updatedUser);

    if (supabase && session?.user) {
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: cleanName,
            name: cleanName,
            avatar_url: cleanAvatar,
            workspace_name: cleanWorkspace
          }
        });

        // Also update profiles table if exists
        await supabase.from('profiles').upsert({
          id: session.user.id,
          name: cleanName,
          avatar_url: cleanAvatar,
          workspace_name: cleanWorkspace,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('[OneDesk Auth] Profiles table update deferred:', err);
      }
    }
  };

  // Demo Workspace Access (Strictly isolated sandboxed session)
  const demoLogin = () => {
    const demoUser: User = {
      id: 'u_demo_' + Date.now(),
      name: 'Demo Member',
      email: 'demo@workspace.local',
      avatar: '',
      role: 'Workspace Member',
      workspaceName: 'Demo Workspace',
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      authProvider: 'demo'
    };
    setUser(demoUser);
  };

  // Backwards-compatible methods for existing modal components
  const sendVerificationEmail = async (
    email: string,
    name?: string,
    password?: string
  ): Promise<{
    success: boolean;
    code?: string;
    token?: string;
    directLink?: string;
    message: string;
    error?: string;
  }> => {
    const signupRes = await signup(name || '', email, password);
    if (!signupRes.success) {
      return { success: false, message: signupRes.error || 'Signup failed', error: signupRes.error };
    }

    return {
      success: true,
      code: 'SENT',
      message: 'Verification email has been dispatched by Supabase Auth.',
      directLink: `${window.location.origin}/verify-email?email=${encodeURIComponent(email)}`
    };
  };

  const confirmEmailWithCode = async (
    email: string,
    code: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    return verifyOtp(email, code);
  };

  const confirmDirectMailAccess = async (
    _token: string,
    email?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    if (user) return { success: true, user };
    if (email) {
      if (session?.user) {
        const u = await fetchUserProfile(session.user);
        return { success: true, user: u };
      }
    }
    return { success: false, error: 'Please sign in with your verified email account.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        isConfigured: isSupabaseConfigured,
        connectionError,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        signInWithOtp,
        verifyOtp,
        loginWithGoogle,
        loginWithGitHub,
        loginWithMicrosoft,
        demoLogin,
        validateEmail,
        updateProfile,
        sendVerificationEmail,
        confirmEmailWithCode,
        confirmDirectMailAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
