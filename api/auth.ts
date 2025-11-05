import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { apiClient } from '@/api/client';
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  OAuthResponse,
  RegisterPayload,
} from '@/shared/types/auth';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

let authToken: string | null = null;
let authUser: AuthUser | null = null;
let interceptorsConfigured = false;

configureInterceptors();

export async function initializeAuth(): Promise<boolean> {
  try {
    const [token, userJson] = await Promise.all([
      getStorageItem(TOKEN_KEY),
      getStorageItem(USER_KEY),
    ]);

    if (token && userJson) {
      authToken = token;
      authUser = JSON.parse(userJson) as AuthUser;
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to initialize auth:', error);
    return false;
  }
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      payload
    );
    const { token, user } = response.data;

    await saveAuth(token, user);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw error;
  }
}

export async function login(_payload: LoginPayload): Promise<AuthResponse> {
  try {
    throw new Error(
      'Unable to sign in at this time. Please create a new account.'
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw error;
  }
}

export async function signInWithOAuth(
  token: string,
  user: AuthUser
): Promise<void> {
  await saveAuth(token, user);
}

export async function logout(): Promise<void> {
  await clearAuth();
}

export function getCurrentUser(): AuthUser | null {
  return authUser;
}

export async function getToken(): Promise<string | null> {
  if (!authToken) {
    authToken = await getStorageItem(TOKEN_KEY);
  }
  return authToken;
}

export function isAuthenticated(): boolean {
  return Boolean(authToken && authUser);
}

export async function signInWithGoogle(): Promise<OAuthResponse> {
  try {
    const mockCode = `mock_google_code_${Date.now()}`;
    const baseURL = apiClient.defaults.baseURL ?? '';

    const response = await apiClient.post<OAuthResponse>('/auth/google/token', {
      code: mockCode,
      redirect_uri: `${baseURL}/auth/google/callback`,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Unable to sign in with Google'
      );
    }
    throw error;
  }
}

export async function signInWithWeChat(): Promise<OAuthResponse> {
  try {
    const mockCode = `mock_wechat_code_${Date.now()}`;

    const response = await apiClient.post<OAuthResponse>(
      '/auth/wechat/mini-program',
      {
        code: mockCode,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Unable to sign in with WeChat'
      );
    }
    throw error;
  }
}

export function isGoogleAvailable(): boolean {
  return true;
}

export function isWeChatAvailable(): boolean {
  return true;
}

function configureInterceptors(): void {
  if (interceptorsConfigured) {
    return;
  }

  apiClient.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers = {
          ...(config.headers ?? {}),
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await clearAuth();
      }
      return Promise.reject(error);
    }
  );

  interceptorsConfigured = true;
}

async function saveAuth(token: string, user: AuthUser): Promise<void> {
  authToken = token;
  authUser = user;

  await Promise.all([
    setStorageItem(TOKEN_KEY, token),
    setStorageItem(USER_KEY, JSON.stringify(user)),
  ]);
}

async function clearAuth(): Promise<void> {
  authToken = null;
  authUser = null;

  await Promise.all([
    deleteStorageItem(TOKEN_KEY),
    deleteStorageItem(USER_KEY),
  ]);
}

async function getStorageItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Failed to get storage item:', error);
    return null;
  }
}

async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Failed to set storage item:', error);
    throw error;
  }
}

async function deleteStorageItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to delete storage item:', error);
    throw error;
  }
}
