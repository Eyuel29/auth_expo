/**
 * Unit Tests for Auth API
 * Tests authentication service functions in isolation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '@/api/auth';
import { apiClient } from '@/api/client';
import type { AuthResponse, AuthUser } from '@/shared/types/auth';

// Mock the API client
jest.mock('@/api/client');

describe('Auth API', () => {
  const mockUser: AuthUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
    oauth_provider: 'email',
  };

  const mockAuthResponse: AuthResponse = {
    token: 'mock-token-123',
    user: mockUser,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    // Reset the module to clear any cached state
    jest.resetModules();
  });

  describe('initializeAuth', () => {
    it('should return true when token and user exist in storage', async () => {
      await AsyncStorage.setItem('@auth_token', 'test-token');
      await AsyncStorage.setItem('@auth_user', JSON.stringify(mockUser));

      const result = await authApi.initializeAuth();

      expect(result).toBe(true);
    });

    it('should return false when token or user is missing', async () => {
      const result = await authApi.initializeAuth();

      expect(result).toBe(false);
    });

    it('should handle storage errors gracefully', async () => {
      jest
        .spyOn(AsyncStorage, 'getItem')
        .mockRejectedValueOnce(new Error('Storage error'));

      const result = await authApi.initializeAuth();

      expect(result).toBe(false);
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockAuthResponse,
      });

      const payload = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const result = await authApi.register(payload);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', payload);
      expect(result).toEqual(mockAuthResponse);

      // Verify token and user are saved
      const savedToken = await AsyncStorage.getItem('@auth_token');
      const savedUser = await AsyncStorage.getItem('@auth_user');
      expect(savedToken).toBe(mockAuthResponse.token);
      expect(savedUser).toBe(JSON.stringify(mockUser));
    });

    it('should throw error when registration fails', async () => {
      const errorMessage = 'Email already exists';
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            message: errorMessage,
          },
        },
      });

      const payload = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authApi.register(payload)).rejects.toThrow(errorMessage);
    });
  });

  describe('login', () => {
    it('should throw error (not implemented)', async () => {
      const payload = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authApi.login(payload)).rejects.toThrow(
        'Unable to sign in at this time. Please create a new account.'
      );
    });
  });

  describe('signInWithOAuth', () => {
    it('should save OAuth token and user', async () => {
      await authApi.signInWithOAuth(mockAuthResponse.token, mockUser);

      const savedToken = await AsyncStorage.getItem('@auth_token');
      const savedUser = await AsyncStorage.getItem('@auth_user');

      expect(savedToken).toBe(mockAuthResponse.token);
      expect(savedUser).toBe(JSON.stringify(mockUser));
    });
  });

  describe('signInWithGoogle', () => {
    it('should sign in with Google successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockAuthResponse,
      });

      const result = await authApi.signInWithGoogle();

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/google/token',
        expect.objectContaining({
          code: expect.stringContaining('mock_google_code_'),
          redirect_uri: expect.any(String),
        })
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle Google sign-in errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            message: 'Google authentication failed',
          },
        },
      });

      await expect(authApi.signInWithGoogle()).rejects.toThrow(
        'Google authentication failed'
      );
    });
  });

  describe('signInWithWeChat', () => {
    it('should sign in with WeChat successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockAuthResponse,
      });

      const result = await authApi.signInWithWeChat();

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/wechat/mini-program',
        expect.objectContaining({
          code: expect.stringContaining('mock_wechat_code_'),
        })
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle WeChat sign-in errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            message: 'WeChat authentication failed',
          },
        },
      });

      await expect(authApi.signInWithWeChat()).rejects.toThrow(
        'WeChat authentication failed'
      );
    });
  });

  describe('logout', () => {
    it('should clear auth data from storage', async () => {
      await AsyncStorage.setItem('@auth_token', 'test-token');
      await AsyncStorage.setItem('@auth_user', JSON.stringify(mockUser));

      await authApi.logout();

      const token = await AsyncStorage.getItem('@auth_token');
      const user = await AsyncStorage.getItem('@auth_user');

      expect(token).toBeNull();
      expect(user).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is authenticated', () => {
      const user = authApi.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return token from storage', async () => {
      await AsyncStorage.setItem('@auth_token', 'test-token');

      const token = await authApi.getToken();

      expect(token).toBe('test-token');
    });

    it('should return null when no token exists', async () => {
      // Clear any cached token state
      await AsyncStorage.clear();

      // Re-import to get fresh state
      jest.resetModules();
      const freshAuthApi = require('@/api/auth');

      const token = await freshAuthApi.getToken();

      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false initially', () => {
      const result = authApi.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('OAuth availability checks', () => {
    it('should return true for Google availability', () => {
      expect(authApi.isGoogleAvailable()).toBe(true);
    });

    it('should return true for WeChat availability', () => {
      expect(authApi.isWeChatAvailable()).toBe(true);
    });
  });
});
