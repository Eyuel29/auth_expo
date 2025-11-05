# Contributing to Auth Expo

Thank you for your interest in contributing to Auth Expo! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git**
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli` (for builds)

### Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/auth_expo.git
cd auth_expo
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your local backend URL
```

4. **Start development server**

```bash
npm run dev
```

5. **Run tests**

```bash
npm test
```

---

## Development Workflow

### Branch Strategy

We follow a simplified Git workflow:

- **`main`** - Production-ready code
- **`dev`** - Development branch (merge PRs here first)
- **`feature/*`** - New features
- **`fix/*`** - Bug fixes
- **`refactor/*`** - Code refactoring
- **`docs/*`** - Documentation updates

### Creating a Feature Branch

```bash
# Start from dev branch
git checkout dev
git pull origin dev

# Create your feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes
2. Write/update tests
3. Run tests: `npm test`
4. Run linter: `npm run lint:fix`
5. Format code: `npm run format`
6. Type check: `npm run type-check`

### Submitting Changes

```bash
# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat: add user profile feature"

# Push to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript

- Use **strict mode** (already configured)
- Define types for all function parameters and return values
- Avoid `any` type unless absolutely necessary
- Use interfaces for object shapes
- Use type aliases for unions/intersections

**Example:**

```typescript
// Good
interface User {
  id: number;
  email: string;
  username: string;
}

function getUser(id: number): Promise<User> {
  // ...
}

// Bad
function getUser(id: any): any {
  // ...
}
```

### React/React Native

- Use **functional components** with hooks
- Use **TypeScript** for all components
- Follow **React hooks rules**
- Use **memo** for expensive components
- Avoid inline functions in JSX when possible

**Example:**

```typescript
// Good
interface ButtonProps {
  onPress: () => void;
  title: string;
}

export function Button({ onPress, title }: ButtonProps) {
  return <Pressable onPress={onPress}>
    <Text>{title}</Text>
  </Pressable>;
}

// Bad
export function Button(props: any) {
  return <Pressable onPress={() => props.onClick()}>
    <Text>{props.text}</Text>
  </Pressable>;
}
```

### File Naming

- **Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase (`User.ts`, `AuthTypes.ts`)
- **Tests**: Same as source file + `.test.ts(x)` (`Button.test.tsx`)

### Code Organization

- One component per file
- Export components at the bottom of the file
- Group imports: React → Third-party → Local
- Use path aliases (`@/api`, `@/components`)

**Example:**

```typescript
// React imports
import { useState, useEffect } from 'react';

// Third-party imports
import { View, Text } from 'react-native';
import axios from 'axios';

// Local imports
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/auth-context';
import type { User } from '@/shared/types/auth';
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style/formatting (no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Build system changes
- **ci**: CI/CD changes
- **chore**: Other changes (dependencies, etc.)

### Examples

```bash
# Feature
git commit -m "feat(auth): add Google OAuth login"

# Bug fix
git commit -m "fix(profile): resolve logout navigation issue"

# Documentation
git commit -m "docs(readme): update setup instructions"

# Refactoring
git commit -m "refactor(api): simplify error handling logic"

# Testing
git commit -m "test(auth): add unit tests for registration flow"
```

### Scope

Common scopes in this project:

- `auth` - Authentication related
- `api` - API client changes
- `ui` - UI components
- `test` - Testing infrastructure
- `ci` - CI/CD pipeline
- `docs` - Documentation

---

## Pull Request Process

### Before Creating a PR

1. ✅ All tests pass (`npm test`)
2. ✅ No linting errors (`npm run lint`)
3. ✅ Code is formatted (`npm run format`)
4. ✅ Type check passes (`npm run type-check`)
5. ✅ Branch is up to date with `dev`

### PR Title

Follow the same format as commit messages:

```
feat(auth): add Google OAuth login
```

### PR Description

Use the PR template and include:

- Summary of changes
- Type of change (feature, fix, etc.)
- Related issues
- Testing performed
- Screenshots (if UI changes)

### Review Process

1. At least one approval required
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback addressed

### Merging

- **Squash and merge** for feature branches
- **Merge commit** for release branches
- Delete branch after merge

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Writing Tests

We use **Jest** and **React Testing Library**.

#### Unit Tests

Test individual functions in isolation:

```typescript
// api/auth.test.ts
import { register } from '@/api/auth';

describe('register', () => {
  it('should register a user successfully', async () => {
    const result = await register({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.user).toBeDefined();
    expect(result.token).toBeTruthy();
  });
});
```

#### Component Tests

Test React components and hooks:

```typescript
// contexts/auth-context.test.tsx
import { renderHook, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

it('should authenticate user', async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });

  await result.current.register({
    email: 'test@example.com',
    password: 'password123',
  });

  await waitFor(() => {
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

#### Integration Tests

Test complete workflows:

```typescript
// integration/auth-flow.test.tsx
it('should complete registration workflow', async () => {
  // Test multiple components working together
  // Register → Store token → Navigate to dashboard
});
```

### Test Coverage

- Maintain **70%+** coverage for core logic
- All new features must include tests
- Bug fixes must include regression tests

---

## Project Structure

```
auth_expo/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Public auth screens
│   └── (tabs)/            # Protected app screens
├── api/                   # API clients
│   ├── auth.ts           # Auth API
│   └── client.ts         # Axios client
├── components/            # Reusable UI components
├── contexts/              # React contexts
│   └── auth-context.tsx  # Auth state management
├── shared/                # Shared types and utilities
│   └── types/            # TypeScript types
├── __tests__/             # Test files
│   ├── api/              # Unit tests
│   ├── contexts/         # Component tests
│   └── integration/      # Integration tests
├── __mocks__/             # Mock implementations
├── .github/               # GitHub configuration
│   └── workflows/        # CI/CD pipelines
└── docs/                  # Documentation
```

---

## Questions or Issues?

- Check existing [Issues](https://github.com/Eyuel29/auth_expo/issues)
- Create a new issue with detailed description
- Join discussions in pull requests

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
