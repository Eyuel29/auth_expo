export type OAuthProvider = 'google' | 'wechat' | 'email';

export interface AuthUser {
  id: number;
  email?: string;
  username: string;
  avatar_url?: string;
  oauth_provider?: OAuthProvider;
  openid?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export type OAuthResponse = AuthResponse;

export interface RegisterPayload {
  email: string;
  password: string;
  username?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
