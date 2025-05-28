// src/contexts/AuthContext.tsx - Fixed with proper session management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignupData } from '../types/auth';
import { 
  findUserByCredentials, 
  addNewUser, 
  saveCurrentUserSession, 
  loadCurrentUserSession, 
  clearCurrentUserSession,
  validateAllUserData,
  initializeUsers
} from '../utils/csvUtils';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize and validate data on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[AuthProvider] Initializing authentication...');
        
        // Initialize users database
        initializeUsers();
        
        // Validate data integrity
        const validation = validateAllUserData();
        if (!validation.isValid) {
          console.warn('[AuthProvider] Data validation issues:', validation.errors);
        }
        
        // Try to restore session
        const storedUser = loadCurrentUserSession();
        if (storedUser) {
          console.log('[AuthProvider] Restoring session for user:', storedUser.username);
          setAuthState({
            user: storedUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('[AuthProvider] No existing session found');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('[AuthProvider] Initialization error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('[AuthProvider] Attempting login for:', credentials.username);
      
      if (!credentials.username || !credentials.password) {
        return { success: false, error: 'Username and password are required' };
      }

      const user = findUserByCredentials(credentials.username, credentials.password);

      if (user) {
        // Save session
        if (!saveCurrentUserSession(user)) {
          console.error('[AuthProvider] Failed to save user session');
          return { success: false, error: 'Failed to save session' };
        }

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log('[AuthProvider] Login successful for:', user.username);
        return { success: true };
      } else {
        console.log('[AuthProvider] Login failed - invalid credentials');
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      console.error('[AuthProvider] Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('[AuthProvider] Attempting signup for:', data.username);

      // Validation
      if (!data.username || !data.password || !data.confirmPassword) {
        return { success: false, error: 'All fields are required' };
      }

      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      if (data.username.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters long' };
      }

      const newUser = addNewUser({
        username: data.username,
        password: data.password,
        role: 'user',
        createdAt: new Date().toISOString(),
      });

      if (!newUser) {
        return { success: false, error: 'Username already exists or signup failed' };
      }

      // Save session for new user
      if (!saveCurrentUserSession(newUser)) {
        console.error('[AuthProvider] Failed to save new user session');
        return { success: false, error: 'Account created but failed to login' };
      }

      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('[AuthProvider] Signup successful for:', newUser.username);
      return { success: true };
    } catch (error) {
      console.error('[AuthProvider] Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    try {
      console.log('[AuthProvider] Logging out user:', authState.user?.username);
      
      clearCurrentUserSession();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log('[AuthProvider] Logout successful');
    } catch (error) {
      console.error('[AuthProvider] Logout error:', error);
    }
  };

  const refreshSession = () => {
    try {
      console.log('[AuthProvider] Refreshing session...');
      const storedUser = loadCurrentUserSession();
      
      if (storedUser) {
        setAuthState({
          user: storedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        console.log('[AuthProvider] Session refreshed for:', storedUser.username);
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        console.log('[AuthProvider] No session to refresh');
      }
    } catch (error) {
      console.error('[AuthProvider] Session refresh error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  // Listen for storage changes (for cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'agentic-current-user-session') {
        console.log('[AuthProvider] Storage change detected, refreshing session...');
        refreshSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Periodic session validation (every 30 seconds)
  useEffect(() => {
    const validateSession = () => {
      if (authState.isAuthenticated && authState.user) {
        const storedUser = loadCurrentUserSession();
        if (!storedUser || storedUser.id !== authState.user.id) {
          console.log('[AuthProvider] Session validation failed, logging out');
          logout();
        }
      }
    };

    const interval = setInterval(validateSession, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [authState.isAuthenticated, authState.user]);

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};