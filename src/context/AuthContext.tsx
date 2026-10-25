import React, { createContext, useContext, useState, useEffect } from 'react';
import { memberService } from '../services/memberService';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  workspaceName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => void;
  signup: (name: string, email: string, password?: string) => void;
  demoLogin: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'clickjoy_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      try {
        memberService.addWorkspaceMember({
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user.role as 'Owner' | 'Admin' | 'Member' | 'Guest') || 'Owner',
          status: 'Online',
          avatar: user.avatar,
          avatarBg: '#059669',
          initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
          isYou: true
        });
      } catch (e) {
        console.error('Failed to sync memberService:', e);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, _password?: string) => {
    const newUser: User = {
      id: 'u_' + Date.now(),
      name: email.split('@')[0] || 'ClickUp User',
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Workspace Admin',
      workspaceName: "My ClickUp Workspace"
    };
    setUser(newUser);
  };

  const signup = (name: string, email: string, _password?: string) => {
    const newUser: User = {
      id: 'u_' + Date.now(),
      name: name || email.split('@')[0] || 'ClickUp User',
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Workspace Owner',
      workspaceName: `${name || 'My'}'s Team Workspace`
    };
    setUser(newUser);
  };

  const demoLogin = () => {
    const demoUser: User = {
      id: 'u_joy_1',
      name: 'Joy Kumar Yuv',
      email: 'joy.kumar.yuv@clickup.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Workspace Owner',
      workspaceName: "Joy Kumar Yuv's Workspace"
    };
    setUser(demoUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      demoLogin,
      logout,
      isAuthenticated: !!user
    }}>
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
