/**
 * Authentication Context
 * Provides authentication state and methods to the entire app
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  authService,
  type User,
  type RegisterPayload,
  type LoginPayload,
} from '@/lib/auth/auth-service';
import {
  signInWithGoogle,
  signInWithWeChat,
  type OAuthResponse,
} from '@/lib/auth/oauth-service-simple';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithWeChat: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const hasAuth = await authService.initialize();

      if (hasAuth) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError('Unable to restore your session. Please sign in again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.register(payload);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to create your account';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login(payload);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response: OAuthResponse = await signInWithGoogle();
      await authService.signInWithOAuth(response.token, response.user);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to sign in with Google';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWeChat = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response: OAuthResponse = await signInWithWeChat();
      await authService.signInWithOAuth(response.token, response.user);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to sign in with WeChat';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Unable to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    loginWithGoogle,
    loginWithWeChat,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
