import '../global.css';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

// Navigation protection component
function NavigationProtection() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to sign-in if not authenticated
      // Use push for better web compatibility
      setTimeout(() => {
        router.push('/(auth)/sign-in');
      }, 100);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and in auth screens
      setTimeout(() => {
        router.push('/(tabs)');
      }, 100);
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationProtection />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
