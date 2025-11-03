import { Redirect } from 'expo-router';

// This is the entry point - redirect to OAuth sign-in
// The actual routing logic is handled in _layout.tsx
export default function Index() {
  return <Redirect href="/(auth)/oauth-sign-in" />;
}
