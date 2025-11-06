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

## Maestro E2E Testing

### What is Maestro?

Maestro is a mobile UI testing framework that allows you to write E2E tests using simple YAML syntax.

**Key Features:**

- Simple YAML syntax - no complex programming
- Cross-platform - same tests for iOS and Android
- Fast setup - minutes, not hours
- Screenshots & videos - automatic capture
- CI/CD ready - GitHub Actions integration

### Installation

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Restart terminal or reload shell
source ~/.bashrc  # or ~/.zshrc for zsh

# Verify installation
maestro --version
```

**Prerequisites:**

- Android Studio (for Android testing)
- Xcode (for iOS testing, macOS only)
- Running emulator or simulator

### Running Maestro Tests

```bash
# Run all E2E tests
npm run test:ui

# Run specific suites
npm run test:ui:auth          # Auth flows
npm run test:ui:navigation    # Navigation tests
npm run test:ui:payment       # Payment flows

# Run single flow
maestro test .maestro/flows/auth/login.yaml
```

### Test Structure

```
.maestro/
├── config.yaml              # Global configuration
└── flows/
    ├── auth/                # Authentication tests (5 flows)
    ├── navigation/          # Navigation tests (2 flows)
    └── payment/             # Payment tests (3 flows)
```

### Writing Maestro Tests

**Basic flow structure:**

```yaml
appId: com.joel.authexpo
---
- launchApp
- assertVisible: 'Welcome'
- tapOn: 'Login'
- inputText: 'test@example.com'
- takeScreenshot: login-step
```

**Common commands:**

- `launchApp` - Launch the app
- `assertVisible: "Text"` - Check element is visible
- `tapOn: "Button"` - Tap on element
- `inputText: "Text"` - Type text
- `scrollUntilVisible` - Scroll to find element
- `takeScreenshot: name` - Capture screenshot
- `waitForAnimationToEnd` - Wait for animations

### Environment Variables

Define in `.maestro/config.yaml`:

```yaml
env:
  TEST_EMAIL: test@example.com
  TEST_PASSWORD: password123
```

Use in tests:

```yaml
- inputText: '${TEST_EMAIL}'
```

### Test Coverage

| Category       | Tests        | Status |
| -------------- | ------------ | ------ |
| Authentication | 5 flows      | ✅     |
| Navigation     | 2 flows      | ✅     |
| Payment        | 3 flows      | ✅     |
| **Total**      | **10 flows** | ✅     |

### CI/CD Integration

Maestro tests run automatically via GitHub Actions (`.github/workflows/maestro.yml`):

- On push to `main`/`dev`
- On pull requests
- Manual workflow dispatch

### Troubleshooting

**Element not found:**

- Add timeout or use `scrollUntilVisible`
- Verify text matches exactly
- Use `optional: true` for optional elements

**Tests fail in CI:**

- Add longer timeouts for slower CI environment
- Ensure app is properly installed
- Check environment variables are set

## Test Statistics

### Overall Coverage

- **Unit Tests**: 34+ (API + Utils)
- **Component Tests**: 21+ (React components)
- **Screen Tests**: 22+ (UI screens)
- **Integration Tests**: 9 (workflows)
- **E2E Tests**: 10 flows (Maestro)
- **Total**: **96+ tests**

### Coverage Metrics

| Layer      | Coverage | Status |
| ---------- | -------- | ------ |
| API        | 75%+     | ✅     |
| Contexts   | 98%      | ✅     |
| Components | 85%+     | ✅     |
| Screens    | 70%+     | ✅     |

### Execution Time

- Jest tests: 4-10 seconds
- Maestro E2E: 15-25 minutes (per platform)
- Total: ~40-45 minutes (parallel)

## Future Improvements

- [ ] Increase UI component test coverage
- [ ] Add visual regression testing
- [ ] Add performance benchmarking
- [ ] Add mutation testing
- [ ] Expand Maestro test scenarios

## Resources

### Jest & React Testing Library

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react-native)
- [Jest Expo Documentation](https://docs.expo.dev/guides/testing-with-jest/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Maestro

- [Maestro Documentation](https://maestro.mobile.dev/docs)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
- [Maestro Command Reference](https://maestro.mobile.dev/reference/commands)

---

**Last Updated**: November 5, 2025  
**Maintained By**: Development Team
