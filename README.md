# Auth Expo App

A modern React Native mobile application built with Expo, featuring custom JWT-based authentication that integrates with an Express backend.

## Features

- ✅ **Custom JWT Authentication** - No native modules required
- ✅ **Email/Password Registration** - Secure user registration
- ✅ **Token-based Auth** - JWT tokens with AsyncStorage persistence
- ✅ **Protected Routes** - Automatic navigation based on auth state
- ✅ **Clean UI** - Modern, responsive design with Tailwind CSS (NativeWind)
- ✅ **Type-Safe** - Full TypeScript support

## Tech Stack

- **Framework**: Expo 54+ / React Native
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage (for JWT tokens)
- **Backend**: Express.js with custom JWT authentication

## Prerequisites

- Node.js 18+ and npm/yarn/bun
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for emulators)
- Backend server running (see backend setup below)

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the backend URL:

```env
EXPO_PUBLIC_SERVER_URL=http://localhost:8080
```

**Important**:

- For iOS Simulator: Use `http://localhost:8080`
- For Android Emulator: Use `http://10.0.2.2:8080`
- For Physical Devices: Use your computer's local IP (e.g., `http://192.168.1.x:8080`)

### 3. Start the Backend Server

Make sure your Express backend is running on port 8080:

```bash
cd ../express
npm run dev
```

The backend should be accessible at `http://localhost:8080`

### 4. Start the Expo App

```bash
npm run dev
```

This will start the Expo development server. You can then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
auth_expo/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens (public)
│   │   ├── sign-in.tsx          # Sign in screen
│   │   ├── sign-up.tsx          # Sign up screen
│   │   └── _layout.tsx          # Auth layout
│   ├── (tabs)/                   # Main app screens (protected)
│   │   ├── index.tsx            # Home screen
│   │   ├── profile.tsx          # Profile screen
│   │   └── _layout.tsx          # Tabs layout
│   ├── _layout.tsx              # Root layout with AuthProvider
│   └── index.tsx                # Entry point
├── lib/                          # Core libraries
│   └── auth/                     # Authentication
│       ├── auth-service.ts      # API service for auth
│       └── auth-context.tsx     # React context for auth state
├── components/                   # Reusable components
├── .env.example                  # Environment variables template
└── package.json
```

## Authentication Flow

### Registration Flow

1. User fills out registration form (email, password, optional username)
2. App sends `POST /api/v1/auth/register` to backend
3. Backend creates user and returns JWT token + user data
4. App stores token in AsyncStorage
5. User is automatically logged in and redirected to home

### Login Flow (Backend TODO)

⚠️ **Note**: The backend doesn't have a login endpoint yet. Currently, only registration is supported.

When implemented, the flow will be:

1. User enters email and password
2. App sends `POST /api/v1/auth/login` to backend
3. Backend validates credentials and returns JWT token
4. App stores token and redirects to home

### Protected Routes

The app automatically handles route protection:

- **Unauthenticated users** → Redirected to sign-in
- **Authenticated users** → Can access main app
- **On app launch** → Checks AsyncStorage for saved token
- **On 401 error** → Automatically logs out user

## Backend Integration

### Authentication Endpoints

The app expects these endpoints from your Express backend:

#### Register User

```typescript
POST /api/v1/auth/register
Body: {
  email: string,
  password: string,
  username?: string
}
Response: {
  token: string,
  user: {
    id: number,
    email: string,
    username?: string
  }
}
```

#### Login User (TODO on backend)

```typescript
POST /api/v1/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string,
  user: {
    id: number,
    email: string,
    username?: string
  }
}
```

### JWT Token Format

The backend should generate JWT tokens with this payload:

```typescript
{
  id: number,      // User ID
  email: string,   // User email
  iat: number,     // Issued at
  exp: number      // Expiration (7 days)
}
```

### Making Authenticated Requests

The auth service automatically adds the `Authorization: Bearer <token>` header to all requests:

```typescript
import { authService } from '@/lib/auth/auth-service';

// Get the configured axios instance
const api = authService.getApiClient();

// Make authenticated requests
const response = await api.get('/some-protected-endpoint');
```

## Development

### Running on Different Platforms

**iOS**:

```bash
npm run ios
```

**Android**:

```bash
npm run android
```

**Web** (experimental):

```bash
npm run web
```

### Clearing Cache

If you encounter issues, try clearing the cache:

```bash
npm run dev -- --clear
```

## Common Issues

### 1. Network Connection Issues

**Problem**: Can't connect to backend from mobile device

**Solutions**:

- For physical devices, use your computer's local IP address
- For Android emulator, use `10.0.2.2` instead of `localhost`
- Ensure backend server is running and accessible
- Check firewall settings

### 2. AsyncStorage Warnings

**Problem**: Warnings about AsyncStorage in development

**Solution**: These are usually safe to ignore in development. AsyncStorage is a core React Native module and doesn't require additional setup.

### 3. Token Expiration

**Problem**: User gets logged out unexpectedly

**Solution**: Tokens expire after 7 days (configured on backend). The app automatically clears auth state on 401 responses. Consider implementing token refresh if needed.

## Next Steps

- [ ] Implement login endpoint on backend
- [ ] Add password reset functionality
- [ ] Add profile editing
- [ ] Implement token refresh mechanism
- [ ] Add biometric authentication
- [ ] Add remember me functionality
- [ ] Implement social auth (OAuth)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Documentation

### Getting Started

- [Setup Guide](./SETUP_GUIDE.md) - Quick start guide

### Implementation Details

- [Authentication](./docs/implementation/authentication.md) - Auth system implementation
- [Implementation Index](./docs/implementation/README.md) - All implementation docs

### Planning

- [PRD](./docs/prd/PRD_EXPO_COMPLETE_SETUP.md) - Product Requirements Document
- [User Stories](./docs/stories/USER_STORIES.md) - Feature user stories

## Support

For issues and questions:

- Check existing issues on GitHub
- Create a new issue with detailed description
- Contact the development team
