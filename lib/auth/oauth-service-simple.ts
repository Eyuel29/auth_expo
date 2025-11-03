/**
 * Simple OAuth Service for Mobile
 * Uses backend's mock mode for development
 * In production, would use platform-specific OAuth SDKs
 */

import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:8080';

export interface OAuthUser {
  id: number;
  email?: string;
  username: string;
  avatar_url?: string;
  oauth_provider: 'google' | 'wechat' | 'email';
  openid?: string;  // For WeChat
}

export interface OAuthResponse {
  token: string;
  user: OAuthUser;
}

/**
 * Google OAuth (Mock for Development)
 * In production, you'd use:
 * - iOS: expo-apple-authentication or Google Sign-In SDK
 * - Android: @react-native-google-signin/google-signin
 * - Web: expo-auth-session
 */
export async function signInWithGoogle(): Promise<OAuthResponse> {
  try {
    // Use backend's mock mode
    const mockCode = `mock_google_code_${Date.now()}`;
    
    const response = await axios.post(`${API_BASE_URL}/auth/google/token`, {
      code: mockCode,
      redirect_uri: 'http://localhost:8080/auth/google/callback'
    });

    return {
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to sign in with Google');
    }
    throw error;
  }
}

/**
 * WeChat OAuth (Mock for Development)
 * In production, you'd use:
 * - WeChat Mini Program SDK
 * - WeChat Open SDK for mobile apps
 */
export async function signInWithWeChat(): Promise<OAuthResponse> {
  try {
    // Use backend's mock mode
    const mockCode = `mock_wechat_code_${Date.now()}`;
    
    const response = await axios.post(`${API_BASE_URL}/auth/wechat/mini-program`, {
      code: mockCode,
    });

    return {
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to sign in with WeChat');
    }
    throw error;
  }
}

/**
 * Check OAuth availability
 */
export function isGoogleAvailable(): boolean {
  // In a real app, check if Google Play Services are available
  return true; // Mock mode always available
}

export function isWeChatAvailable(): boolean {
  // In a real app, check if WeChat app is installed
  return true; // Mock mode always available
}

