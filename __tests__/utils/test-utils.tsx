/**
 * Test Utilities
 * Provides helper functions and wrappers for testing components
 */

import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { AuthProvider } from '@/contexts/auth-context';

/**
 * Custom render function that wraps components with necessary providers
 */
interface AllTheProvidersProps {
  children: React.ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}

/**
 * Custom render with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Wait for async operations
 */
export const waitFor = (
  callback: () => void,
  options?: { timeout?: number }
) => {
  return new Promise((resolve) => {
    const timeout = options?.timeout || 1000;
    setTimeout(() => {
      callback();
      resolve(undefined);
    }, timeout);
  });
};

/**
 * Create mock auth user
 */
export function createMockUser(overrides = {}) {
  return {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
    oauth_provider: 'email' as const,
    ...overrides,
  };
}

/**
 * Create mock auth response
 */
export function createMockAuthResponse(overrides = {}) {
  return {
    token: 'mock-token-123',
    user: createMockUser(),
    ...overrides,
  };
}

// Re-export everything from RTL
export * from '@testing-library/react-native';
