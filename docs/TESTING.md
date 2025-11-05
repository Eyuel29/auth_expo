# Testing Guide

## Overview

This document provides comprehensive information about the testing infrastructure for the auth_expo project. We use **Jest** as our primary testing framework, along with **React Testing Library** for component testing.

## Testing Stack

### Core Dependencies

- **jest** - JavaScript testing framework
- **jest-expo** - Expo-specific Jest preset and configuration
- **@testing-library/react-native** - Component testing utilities
- **@types/jest** - TypeScript type definitions for Jest

### Test Types

1. **Unit Tests** - Test individual functions and modules in isolation
2. **Component Tests** - Test React components and hooks
3. **Integration Tests** - Test complete workflows end-to-end

## Directory Structure

```
auth_expo/
├── __tests__/
│   ├── api/               # API/service unit tests
│   │   └── auth.test.ts
│   ├── contexts/          # Context/hook component tests
│   │   └── auth-context.test.tsx
│   ├── integration/       # End-to-end integration tests
│   │   └── auth-flow.test.tsx
│   └── utils/             # Test utilities and helpers
│       └── test-utils.tsx
├── __mocks__/             # Mock implementations
│   ├── api/
│   │   └── client.ts      # Mock API client
│   └── axios.ts           # Mock axios
├── jest.config.js         # Jest configuration
└── jest.setup.js          # Test environment setup
```

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (with coverage, optimized for CI)
npm run test:ci
```

### NPM Scripts

| Script          | Command                               | Description                    |
| --------------- | ------------------------------------- | ------------------------------ |
| `test`          | `jest`                                | Run all tests once             |
| `test:watch`    | `jest --watch`                        | Run tests in watch mode        |
| `test:coverage` | `jest --coverage`                     | Run tests with coverage report |
| `test:ci`       | `jest --ci --coverage --maxWorkers=2` | Run tests in CI environment    |

## Test Configuration

### Jest Configuration (`jest.config.js`)

Key settings:

- **Preset**: `jest-expo` for Expo compatibility
- **Test Environment**: `node` for faster execution
- **Module Mapping**: Matches TypeScript path aliases (`@/api/*`, `@/contexts/*`, etc.)
- **Coverage Threshold**: 60% for branches, functions, lines, and statements
- **Transform Ignore Patterns**: Configured to handle React Native and Expo modules

### Setup File (`jest.setup.js`)

Configures the test environment with:

- Expo polyfills (`__ExpoImportMetaRegistry`, `structuredClone`)
- AsyncStorage mock
- Expo Router mock
- Expo Linking mock
- Console warning suppression (optional)
- Automatic mock cleanup after each test

## Test Coverage

### Current Coverage (as of latest run)

```
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   42.29 |    12.82 |   42.42 |   42.42 |
api/               |   73.62 |    47.22 |   81.81 |   73.62 |
  auth.ts          |   73.03 |    47.22 |   81.81 |   73.03 |
  client.ts        |     100 |      100 |     100 |     100 |
contexts/          |   98.64 |    66.66 |     100 |   98.64 |
  auth-context.tsx |   98.64 |    66.66 |     100 |   98.64 |
```

### Coverage Goals

- ✅ **Core Auth Logic**: 73%+ coverage (API layer)
- ✅ **Context/Hooks**: 98%+ coverage
- ⏳ **UI Components**: 0% (not yet tested - future work)

## Writing Tests

### Unit Test Example

```typescript
import * as authApi from '@/api/auth';

describe('Auth API', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('should register a user successfully', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, email: 'test@example.com', username: 'testuser' },
    };

    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await authApi.register({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual(mockResponse);
  });
});
```

### Component Test Example

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

describe('AuthContext', () => {
  it('should register user successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.register({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

### Integration Test Example

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

describe('Complete Registration Flow', () => {
  it('should complete full workflow', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Register
    await result.current.register({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Verify persistence
    const savedToken = await AsyncStorage.getItem('@auth_token');
    expect(savedToken).toBeTruthy();
  });
});
```

## Test Utilities

### `test-utils.tsx`

Provides helper functions:

- **`renderWithProviders()`** - Render components with auth provider
- **`createMockUser()`** - Create mock user objects
- **`createMockAuthResponse()`** - Create mock API responses
- **`waitFor()`** - Wait for async operations (re-exported from RTL)

### Usage

```typescript
import {
  renderWithProviders,
  createMockUser,
} from '@/__tests__/utils/test-utils';

const mockUser = createMockUser({ email: 'custom@example.com' });
```

## Mocking Strategy

### AsyncStorage

Automatically mocked via `@react-native-async-storage/async-storage/jest/async-storage-mock`.

### API Client

Mocked in `__mocks__/api/client.ts`:

```typescript
export const apiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  // ... interceptors, etc.
};
```

### Axios

Mocked in `__mocks__/axios.ts` for broader axios usage.

### Expo Modules

Mocked in `jest.setup.js`:

- `expo-router`
- `expo-linking`
- `expo-constants`

## Best Practices

### 1. Always Clean Up

```typescript
beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});
```

### 2. Use `waitFor` for Async State Updates

```typescript
await waitFor(() => {
  expect(result.current.isAuthenticated).toBe(true);
});
```

### 3. Test User-Facing Behavior

Focus on what users interact with, not implementation details.

### 4. Isolate Tests

Each test should be independent and not rely on others.

### 5. Mock External Dependencies

Never make real API calls or access real storage in tests.

## Common Patterns

### Testing Hooks

```typescript
const { result } = renderHook(() => useAuth(), {
  wrapper: AuthProvider,
});
```

### Testing Async Operations

```typescript
await result.current.someAsyncFunction();

await waitFor(() => {
  expect(result.current.someState).toBe(expectedValue);
});
```

### Testing Error Handling

```typescript
await expect(
  result.current.register({
    /* invalid data */
  })
).rejects.toThrow('Expected error message');

await waitFor(() => {
  expect(result.current.error).toBeTruthy();
});
```

## Continuous Integration

Tests run automatically in GitHub Actions on:

- Every push to `main` or `develop`
- Every pull request

See `.github/workflows/ci.yml` for full CI configuration.

### CI Test Command

```bash
npm run test:ci
```

This command:

- Runs in CI mode (non-interactive)
- Generates coverage reports
- Uses 2 max workers for performance
- Fails if coverage thresholds are not met

## Troubleshooting

### Tests Timeout

Increase Jest timeout in individual tests:

```typescript
it('slow test', async () => {
  // ... test code
}, 10000); // 10 second timeout
```

### Module Not Found

Check `moduleNameMapper` in `jest.config.js` matches your TypeScript paths.

### Expo Import Errors

Ensure `jest.setup.js` has proper Expo polyfills:

```javascript
global.__ExpoImportMetaRegistry = new Map();
```

### Async State Issues

Always use `waitFor` when testing state changes:

```typescript
await waitFor(() => {
  expect(result.current.user).toBeDefined();
});
```

## Future Improvements

- [ ] Add E2E tests with Detox (optional)
- [ ] Increase UI component test coverage
- [ ] Add visual regression testing
- [ ] Add performance benchmarking
- [ ] Add mutation testing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react-native)
- [Jest Expo Documentation](https://docs.expo.dev/guides/testing-with-jest/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: November 5, 2025  
**Maintained By**: Development Team
