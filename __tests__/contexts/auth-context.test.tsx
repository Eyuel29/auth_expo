/**
 * Component Tests for Auth Context
 * Tests the AuthProvider and useAuth hook
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import * as authApi from '@/api/auth';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import type { AuthUser } from '@/shared/types/auth';

// Mock the auth API
jest.mock('@/api/auth');

describe('AuthContext', () => {
  const mockUser: AuthUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
    oauth_provider: 'email',
  };

  const mockAuthResponse = {
    token: 'mock-token-123',
    user: mockUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('AuthProvider initialization', () => {
    it('should initialize with loading state', () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should restore user session on mount', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(true);
      (authApi.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle initialization errors gracefully', async () => {
      (authApi.initializeAuth as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(
        'Unable to restore your session. Please sign in again.'
      );
      expect(result.current.user).toBeNull();
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);
      (authApi.register as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const payload = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await result.current.register(payload);

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(authApi.register).toHaveBeenCalledWith(payload);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle registration errors', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);
      const errorMessage = 'Email already exists';
      (authApi.register as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const payload = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(result.current.register(payload)).rejects.toThrow(
        errorMessage
      );

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('login', () => {
    it('should handle login (currently throws error)', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);
      (authApi.login as jest.Mock).mockRejectedValueOnce(
        new Error(
          'Unable to sign in at this time. Please create a new account.'
        )
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const payload = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(result.current.login(payload)).rejects.toThrow(
        'Unable to sign in at this time. Please create a new account.'
      );

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('loginWithGoogle', () => {
    it('should login with Google successfully', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);
      (authApi.signInWithGoogle as jest.Mock).mockResolvedValueOnce(
        mockAuthResponse
      );
      (authApi.signInWithOAuth as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.loginWithGoogle();

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(authApi.signInWithGoogle).toHaveBeenCalled();
      expect(authApi.signInWithOAuth).toHaveBeenCalledWith(
        mockAuthResponse.token,
        mockAuthResponse.user
      );
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle Google login errors', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);
      const errorMessage = 'Google authentication failed';
      (authApi.signInWithGoogle as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.loginWithGoogle()).rejects.toThrow(
        errorMessage
      );

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });

  describe('loginWithWeChat', () => {
    it('should login with WeChat successfully', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);
      (authApi.signInWithWeChat as jest.Mock).mockResolvedValueOnce(
        mockAuthResponse
      );
      (authApi.signInWithOAuth as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.loginWithWeChat();

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(authApi.signInWithWeChat).toHaveBeenCalled();
      expect(authApi.signInWithOAuth).toHaveBeenCalledWith(
        mockAuthResponse.token,
        mockAuthResponse.user
      );
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle WeChat login errors', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);
      const errorMessage = 'WeChat authentication failed';
      (authApi.signInWithWeChat as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.loginWithWeChat()).rejects.toThrow(
        errorMessage
      );

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(true);
      (authApi.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
      (authApi.logout as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await result.current.logout();

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });

      expect(authApi.logout).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle logout errors', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(true);
      (authApi.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
      (authApi.logout as jest.Mock).mockRejectedValueOnce(
        new Error('Logout failed')
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await result.current.logout();

      await waitFor(() => {
        expect(result.current.error).toBe(
          'Unable to sign out. Please try again.'
        );
      });
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      (authApi.initializeAuth as jest.Mock).mockResolvedValueOnce(false);
      (authApi.register as jest.Mock).mockRejectedValueOnce(
        new Error('Test error')
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Trigger an error
      await expect(
        result.current.register({ email: 'test@test.com', password: 'pass' })
      ).rejects.toThrow();

      // Wait for error state to update
      await waitFor(() => {
        expect(result.current.error).toBe('Test error');
      });

      // Clear the error
      result.current.clearError();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });
});
