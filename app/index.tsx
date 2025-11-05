import { Redirect } from 'expo-router';

// This is the entry point - redirect to the sign-in screen
// The actual routing logic is handled in _layout.tsx
export default function Index() {
  return <Redirect href="/(auth)/sign-in" />;
}
