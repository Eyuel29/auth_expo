# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Express backend running (default: `http://localhost:8080`)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run on specific platform
npm run web      # Web browser
npm run android  # Android device/emulator
npm run ios      # iOS device/simulator (macOS only)
```

## Environment Configuration

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SERVER_URL=http://localhost:8080
```

For production, update this to your production API URL.

## Project Structure

```
auth_expo/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   │   ├── oauth-sign-in.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   └── (tabs)/            # Protected screens
│       ├── index.tsx
│       └── profile.tsx
├── contexts/              # React contexts
│   └── auth-context.tsx
├── lib/                   # Services and utilities
│   └── auth/
│       ├── auth-service.ts
│       └── oauth-service-simple.ts
└── components/            # Reusable components
```

## Authentication Setup

The app uses a custom JWT-based authentication system that integrates with your Express backend.

### Backend Endpoints Required

1. **Email/Password Registration**
   - `POST /auth/register`
   - Body: `{ email, password, username? }`
   - Returns: `{ token, user }`

2. **Email/Password Login**
   - `POST /auth/login`
   - Body: `{ email, password }`
   - Returns: `{ token, user }`

3. **Google OAuth**
   - `POST /auth/google/token`
   - Body: `{ code, redirect_uri }`
   - Returns: `{ token, user }`

4. **WeChat OAuth**
   - `POST /auth/wechat/mini-program`
   - Body: `{ code }`
   - Returns: `{ token, user }`

## Development

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { useAuth } from '@/contexts/auth-context';
import { authService } from '@/lib/auth/auth-service';
import { Button } from '@/components/button';
```

### Running Type Checks

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint  # If configured
```

## Troubleshooting

### "Cannot connect to backend"

1. Ensure your Express backend is running
2. Check `EXPO_PUBLIC_SERVER_URL` is set correctly
3. On Android emulator, use `http://10.0.2.2:8080` instead of `localhost`
4. On physical devices, use your computer's local IP address

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

### TypeScript errors

```bash
# Restart TypeScript server in your editor
# In VS Code: Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

## Next Steps

1. **Production Setup**
   - Configure production API URL
   - Implement real OAuth SDKs (replace mock mode)
   - Set up proper database for user storage
   - Add password reset functionality
   - Implement refresh token mechanism

2. **Enhanced Security**
   - Add biometric authentication
   - Implement certificate pinning
   - Add rate limiting on backend
   - Use expo-secure-store for sensitive data

3. **User Experience**
   - Add "Remember Me" functionality
   - Implement social login (Facebook, Apple)
   - Add profile picture upload
   - Create onboarding flow

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://expo.github.io/router/docs/)
- [React Native Documentation](https://reactnative.dev/)
- [Authentication Implementation](./docs/implementation/authentication.md) - Detailed authentication architecture
- [All Implementation Docs](./docs/implementation/README.md) - Complete implementation documentation
