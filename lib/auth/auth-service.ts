/**
 * Authentication Service
 * Handles user authentication with the Express backend using JWT tokens
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:8080';
const API_PREFIX = '/';
const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export interface User {
  id: number;
  email?: string; // Optional for WeChat users
  username: string;
  avatar_url?: string;
  oauth_provider?: 'google' | 'wechat' | 'email';
  openid?: string; // For WeChat users
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

class AuthService {
  private api: AxiosInstance;
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}${API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Add request interceptor to include JWT token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear auth state
          await this.clearAuth();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Initialize auth service - load token and user from storage
   */
  async initialize(): Promise<boolean> {
    try {
      const token = await this.getStorageItem(TOKEN_KEY);
      const userJson = await this.getStorageItem(USER_KEY);

      if (token && userJson) {
        this.token = token;
        this.user = JSON.parse(userJson);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      return false;
    }
  }

  /**
   * Register a new user
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>(
        '/auth/register',
        payload
      );
      const { token, user } = response.data;

      await this.saveAuth(token, user);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  /**
   * Login with email and password
   * Note: Backend doesn't have a login endpoint yet, only register
   * This is a placeholder for when backend adds login endpoint
   */
  async login(_payload: LoginPayload): Promise<AuthResponse> {
    try {
      // TODO: Backend needs to implement POST /auth/login endpoint
      // For now, we'll throw an error
      throw new Error(
        'Login endpoint not implemented on backend yet. Please use register.'
      );

      // When backend is ready, uncomment this:
      // const response = await this.api.post<AuthResponse>('/auth/login', payload);
      // const { token, user } = response.data;
      // await this.saveAuth(token, user);
      // return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  /**
   * OAuth Sign In - Google or WeChat
   */
  async signInWithOAuth(token: string, user: User): Promise<void> {
    await this.saveAuth(token, user);
  }

  /**
   * Logout - clear auth state
   */
  async logout(): Promise<void> {
    await this.clearAuth();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * Get auth token
   */
  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await this.getStorageItem(TOKEN_KEY);
    }
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.token && this.user);
  }

  /**
   * Save authentication data
   */
  private async saveAuth(token: string, user: User): Promise<void> {
    this.token = token;
    this.user = user;

    await Promise.all([
      this.setStorageItem(TOKEN_KEY, token),
      this.setStorageItem(USER_KEY, JSON.stringify(user)),
    ]);
  }

  /**
   * Clear authentication data
   */
  private async clearAuth(): Promise<void> {
    this.token = null;
    this.user = null;

    await Promise.all([
      this.deleteStorageItem(TOKEN_KEY),
      this.deleteStorageItem(USER_KEY),
    ]);
  }

  /**
   * Persistent storage using AsyncStorage
   * Tokens will persist across app restarts
   */
  private async getStorageItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get storage item:', error);
      return null;
    }
  }

  private async setStorageItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to set storage item:', error);
      throw error;
    }
  }

  private async deleteStorageItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to delete storage item:', error);
      throw error;
    }
  }

  /**
   * Get axios instance for making authenticated requests
   */
  getApiClient(): AxiosInstance {
    return this.api;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
