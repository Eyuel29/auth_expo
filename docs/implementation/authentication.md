# Authentication Implementation Summary

## Overview
Custom JWT-based authentication system for the Expo mobile app that integrates with an Express.js backend. The implementation supports OAuth (Google, WeChat) and traditional email/password authentication.

## Architecture

### Backend Integration
- **Base URL**: Configured via `EXPO_PUBLIC_SERVER_URL` environment variable
- **Token Format**: JWT tokens stored in AsyncStorage
- **Authentication Flow**: Token-based authentication with automatic session restoration

### Core Components

#### 1. Auth Service (`lib/auth/auth-service.ts`)
Central service handling all authentication operations:
- User registration and login with email/password
- OAuth authentication
- Token management (store, retrieve, clear)
- HTTP client with automatic token injection
- Session restoration on app launch

#### 2. Auth Context (`contexts/auth-context.tsx`)
React Context providing global authentication state:
- Current user state
- Loading states
- Authentication methods (register, login, loginWithGoogle, loginWithWeChat, logout)
- Error handling

#### 3. OAuth Service (`lib/auth/oauth-service-simple.ts`)
Handles OAuth flows for Google and WeChat:
- Google OAuth via `/auth/google/token` endpoint
- WeChat OAuth via `/auth/wechat/mini-program` endpoint
- Uses backend's mock mode for development

## Authentication Flows

### Email/Password Registration
1. User submits email, password, and optional username
2. Backend endpoint: `POST /auth/register`
3. Backend returns JWT token and user object
4. Token stored in AsyncStorage
5. User redirected to home screen

### Email/Password Login
1. User submits email and password
2. Backend endpoint: `POST /auth/login`
3. Backend validates credentials and returns JWT token
4. Token stored in AsyncStorage
5. User redirected to home screen

### OAuth (Google/WeChat)
1. User taps OAuth button
2. Client sends mock code to backend
3. Backend endpoints:
   - Google: `POST /auth/google/token`
   - WeChat: `POST /auth/wechat/mini-program`
4. Backend returns JWT token and user profile
5. Token stored in AsyncStorage
6. User redirected to home screen

### Session Restoration
1. App launches
2. Auth service checks AsyncStorage for stored token
3. If token exists, user object is restored
4. User automatically logged in

### Logout
1. User confirms logout
2. Token and user data cleared from AsyncStorage
3. Auth state reset
4. User redirected to sign-in screen

## User Interface

### OAuth Sign-In Screen (`app/(auth)/oauth-sign-in.tsx`)
Primary authentication entry point:
- Google Sign-In button
- WeChat Sign-In button
- Link to email/password sign-in

### Email/Password Sign-In (`app/(auth)/sign-in.tsx`)
Traditional login form:
- Email input
- Password input
- Link to sign-up screen

### Sign-Up Screen (`app/(auth)/sign-up.tsx`)
New user registration:
- Email input
- Password input with confirmation
- Optional username
- Link to sign-in screen

### Protected Routes
- Home screen (`app/(tabs)/index.tsx`): Welcome dashboard
- Profile screen (`app/(tabs)/profile.tsx`): User info and logout

## Navigation Protection

Navigation guard in `app/_layout.tsx`:
- Unauthenticated users → Redirected to OAuth sign-in
- Authenticated users → Access to protected tabs
- Automatic redirect based on auth state

## Data Storage

**AsyncStorage** is used for persistent token storage:
- `@auth_token`: JWT token
- `@auth_user`: User object (serialized JSON)

## User Object Structure

```typescript
interface User {
  id: number;
  email?: string;          // Optional for WeChat users
  username: string;
  avatar_url?: string;     // OAuth profile picture
  oauth_provider?: 'google' | 'wechat' | 'email';
  openid?: string;         // WeChat identifier
}
```

## Configuration

### Environment Variables
- `EXPO_PUBLIC_SERVER_URL`: Backend API base URL (default: `http://localhost:8080`)

### Path Aliases
- `@/contexts/*`: Context providers
- `@/lib/*`: Services and utilities
- `@/components/*`: Reusable components

## Security Considerations

1. **Token Storage**: Tokens stored in AsyncStorage (secure on native platforms)
2. **HTTPS**: Use HTTPS in production
3. **Token Expiration**: Backend handles JWT expiration
4. **Error Handling**: User-friendly error messages without exposing implementation details

## Development vs Production

**Current State (Development)**:
- OAuth uses backend mock mode
- Email/password registration stores users in memory

**Production Requirements**:
- Implement real OAuth SDKs (expo-auth-session, native SDKs)
- Connect to production database
- Add password reset functionality
- Implement refresh token mechanism
- Add biometric authentication option

