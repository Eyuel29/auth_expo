# Architecture Documentation

This document describes the system architecture, design patterns, and technical decisions for the Auth Expo application.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Authentication Flow](#authentication-flow)
- [Navigation Architecture](#navigation-architecture)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Testing Architecture](#testing-architecture)
- [Build & Deployment](#build--deployment)

---

## System Overview

Auth Expo is a cross-platform mobile application built with React Native and Expo, implementing a modern client-server architecture with JWT-based authentication.

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Mobile App<br/>iOS/Android]
        B[Web App<br/>Browser]
    end

    subgraph "API Layer"
        C[API Client<br/>Axios]
        D[Auth Service]
    end

    subgraph "Backend Services"
        E[Express.js API<br/>JWT Auth]
        F[Database<br/>User Data]
    end

    A --> C
    B --> C
    C --> D
    D --> E
    E --> F

    style A fill:#4A90E2
    style B fill:#4A90E2
    style C fill:#7B68EE
    style D fill:#7B68EE
    style E fill:#50C878
    style F fill:#50C878
```

### Technology Stack

| Layer          | Technology     | Purpose                    |
| -------------- | -------------- | -------------------------- |
| **Framework**  | Expo SDK 54    | Cross-platform development |
| **Language**   | TypeScript     | Type-safe development      |
| **UI Library** | React Native   | Native UI components       |
| **Styling**    | NativeWind     | Tailwind-based styling     |
| **Navigation** | Expo Router    | File-based routing         |
| **State**      | React Context  | Global state management    |
| **HTTP**       | Axios          | API communication          |
| **Storage**    | AsyncStorage   | Local data persistence     |
| **Testing**    | Jest + RTL     | Unit and integration tests |
| **CI/CD**      | GitHub Actions | Automated workflows        |

---

## Architecture Patterns

### 1. Feature-Based Architecture

The project follows a feature-based folder structure:

```
app/
├── (auth)/          # Authentication feature
├── (tabs)/          # Main app feature
api/                 # API integration
contexts/            # Global state
components/          # Shared UI
```

### 2. Clean Architecture Principles

```mermaid
graph LR
    subgraph "Presentation Layer"
        A[UI Components]
        B[Screens]
    end

    subgraph "Business Logic Layer"
        C[Context/Hooks]
        D[State Management]
    end

    subgraph "Data Layer"
        E[API Services]
        F[Local Storage]
    end

    A --> C
    B --> C
    C --> D
    D --> E
    D --> F

    style A fill:#FFB6C1
    style B fill:#FFB6C1
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
```

### 3. Separation of Concerns

- **UI Layer**: Pure presentational components
- **Business Logic**: Context providers and hooks
- **Data Layer**: API clients and storage utilities
- **Type Layer**: Shared type definitions

---

## Component Architecture

### Component Hierarchy

```mermaid
graph TD
    A[RootLayout] --> B[AuthProvider]
    B --> C{User Authenticated?}
    C -->|No| D[Auth Screens]
    C -->|Yes| E[Tab Navigator]

    D --> F[Sign In]
    D --> G[Sign Up]

    E --> H[Home]
    E --> I[Profile]
    E --> J[Settings]

    style A fill:#FF6B6B
    style B fill:#4ECDC4
    style C fill:#FFE66D
    style D fill:#95E1D3
    style E fill:#95E1D3
```

### Component Types

#### 1. Layout Components

- **Purpose**: Define screen structure and navigation
- **Examples**: `_layout.tsx`, `RootLayout`
- **Responsibilities**: Route protection, navigation setup

#### 2. Screen Components

- **Purpose**: Full-page views
- **Examples**: `sign-in.tsx`, `profile.tsx`
- **Responsibilities**: User interaction, data display

#### 3. UI Components

- **Purpose**: Reusable interface elements
- **Examples**: `Button`, `Input`, `Container`
- **Responsibilities**: Consistent UI, styling

#### 4. Context Providers

- **Purpose**: Global state management
- **Examples**: `AuthProvider`
- **Responsibilities**: State distribution, business logic

---

## Data Flow

### Unidirectional Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant Context
    participant API
    participant Backend

    User->>Component: Interaction (e.g., tap button)
    Component->>Context: Call action (e.g., login)
    Context->>API: HTTP Request
    API->>Backend: POST /auth/login
    Backend-->>API: Response + JWT
    API-->>Context: AuthResponse
    Context-->>Context: Update state
    Context-->>Component: New state
    Component-->>User: UI Update
```

### State Updates

1. **User Action**: Button press, form submission
2. **Context Action**: Async function called
3. **API Request**: HTTP call to backend
4. **Response Handling**: Success or error
5. **State Update**: Context state changed
6. **UI Re-render**: Components reflect new state

---

## Authentication Flow

### Registration Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant AuthContext
    participant API
    participant Backend
    participant Storage

    User->>App: Enter credentials
    User->>App: Submit form
    App->>AuthContext: register(email, password)
    AuthContext->>API: POST /auth/register
    API->>Backend: Create user
    Backend-->>API: {token, user}
    API-->>AuthContext: AuthResponse
    AuthContext->>Storage: Save token
    AuthContext->>Storage: Save user data
    AuthContext-->>App: isAuthenticated = true
    App-->>User: Navigate to dashboard
```

### Login Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant AuthContext
    participant API
    participant Backend
    participant Storage

    User->>App: Enter credentials
    App->>AuthContext: login(email, password)
    AuthContext->>API: POST /auth/login
    API->>Backend: Verify credentials
    Backend-->>API: {token, user}
    API-->>AuthContext: AuthResponse
    AuthContext->>Storage: Save token
    AuthContext->>Storage: Save user
    AuthContext-->>App: isAuthenticated = true
    App-->>User: Navigate to dashboard
```

### OAuth Flow

```mermaid
sequenceDiagram
    actor User
    participant App
    participant AuthContext
    participant OAuth
    participant Backend
    participant Storage

    User->>App: Tap "Sign in with Google"
    App->>OAuth: Open OAuth flow
    OAuth-->>User: Login prompt
    User->>OAuth: Grant permission
    OAuth-->>App: Auth code
    App->>Backend: POST /auth/google/token
    Backend-->>App: {token, user}
    App->>AuthContext: signInWithOAuth(token, user)
    AuthContext->>Storage: Save credentials
    AuthContext-->>App: isAuthenticated = true
    App-->>User: Navigate to dashboard
```

### Session Persistence

```mermaid
graph TD
    A[App Launch] --> B{Token exists?}
    B -->|Yes| C[Load from Storage]
    B -->|No| D[Show Auth Screens]
    C --> E{Token valid?}
    E -->|Yes| F[Restore Session]
    E -->|No| G[Clear Storage]
    F --> H[Show Dashboard]
    G --> D

    style A fill:#FFD93D
    style B fill:#6BCF7F
    style F fill:#4A90E2
    style H fill:#A78BFA
```

---

## Navigation Architecture

### Route Structure

```mermaid
graph TD
    A[index.tsx<br/>Entry Point] --> B[_layout.tsx<br/>Root Layout]
    B --> C{Auth Check}

    C -->|Not Authenticated| D["(auth)/_layout.tsx<br/>Auth Layout"]
    C -->|Authenticated| E["(tabs)/_layout.tsx<br/>Tab Layout"]

    D --> F[sign-in.tsx]
    D --> G[sign-up.tsx]

    E --> H[index.tsx<br/>Home]
    E --> I[profile.tsx]

    style A fill:#FF6B6B
    style B fill:#4ECDC4
    style C fill:#FFE66D
    style D fill:#95E1D3
    style E fill:#95E1D3
```

### Route Protection

Routes are protected at the layout level using the `NavigationProtection` component:

```typescript
// Simplified protection logic
if (!isAuthenticated && inProtectedRoute) {
  router.replace('/(auth)/sign-in');
}

if (isAuthenticated && inAuthRoute) {
  router.replace('/(tabs)');
}
```

---

## API Integration

### API Client Architecture

```mermaid
graph LR
    A[Components] --> B[API Services]
    B --> C[API Client<br/>Axios Instance]
    C --> D[Interceptors]
    D --> E[Backend API]

    E --> F[Response]
    F --> D
    D --> C
    C --> B
    B --> A

    style C fill:#4A90E2
    style D fill:#7B68EE
```

### Request/Response Flow

```mermaid
sequenceDiagram
    participant Service
    participant Client
    participant Interceptor
    participant Backend

    Service->>Client: API Call
    Client->>Interceptor: Request
    Interceptor->>Interceptor: Add JWT Token
    Interceptor->>Backend: HTTP Request
    Backend-->>Interceptor: Response
    Interceptor->>Interceptor: Check Status
    alt Status 401
        Interceptor->>Interceptor: Clear Auth
        Interceptor-->>Service: Redirect to Login
    else Status 2xx
        Interceptor-->>Client: Response Data
        Client-->>Service: Parsed Response
    end
```

### Error Handling

```mermaid
graph TD
    A[API Request] --> B{Response Status}
    B -->|2xx| C[Success]
    B -->|401| D[Unauthorized]
    B -->|4xx| E[Client Error]
    B -->|5xx| F[Server Error]
    B -->|Network| G[Network Error]

    C --> H[Return Data]
    D --> I[Clear Auth & Redirect]
    E --> J[Show Error Message]
    F --> J
    G --> J

    style C fill:#50C878
    style D fill:#FFB6C1
    style E fill:#FFA07A
    style F fill:#FF6B6B
    style G fill:#FF4500
```

---

## State Management

### Context-Based State

```mermaid
graph TD
    A[AuthProvider] --> B[useState]
    A --> C[useEffect]

    B --> D[user]
    B --> E[isAuthenticated]
    B --> F[isLoading]
    B --> G[error]

    C --> H[Initialize on Mount]
    C --> I[Cleanup on Unmount]

    D --> J[Components]
    E --> J
    F --> J
    G --> J

    style A fill:#4A90E2
    style J fill:#FFB6C1
```

### State Update Flow

```mermaid
stateDiagram-v2
    [*] --> Initializing: App Launch
    Initializing --> Loading: Check Storage
    Loading --> Authenticated: Token Found
    Loading --> Unauthenticated: No Token

    Authenticated --> Loading: Login/Register
    Unauthenticated --> Loading: Login/Register

    Loading --> Authenticated: Success
    Loading --> Unauthenticated: Failure

    Authenticated --> Unauthenticated: Logout
    Authenticated --> Error: API Error (401)
    Error --> Unauthenticated: Clear State
```

---

## Testing Architecture

### Testing Strategy

The project implements a comprehensive testing approach with multiple layers:

| Layer           | Tool       | Tests    | Coverage           |
| --------------- | ---------- | -------- | ------------------ |
| **E2E**         | Maestro    | 10 flows | Full user journeys |
| **Screen**      | Jest + RTL | 22+      | 70%+               |
| **Component**   | Jest + RTL | 21+      | 85%+               |
| **Integration** | Jest       | 9        | 98%                |
| **Unit**        | Jest       | 34+      | 75%+               |

**Total**: 96+ tests | Execution: ~4-10s (Jest), ~40-45min (Maestro)

### Test Structure

```mermaid
graph TD
    A[E2E Tests<br/>Maestro - 10 flows] --> B[Screen Tests<br/>Jest + RTL - 22+]
    B --> C[Component Tests<br/>Jest + RTL - 21+]
    C --> D[Unit Tests<br/>Jest - 34+]

    style A fill:#7c4dff
    style B fill:#03dac6
    style C fill:#bb86fc
    style D fill:#03dac6
```

**Mocking Strategy:**

- API Client: `__mocks__/api/client.ts`
- AsyncStorage: `@react-native-async-storage/async-storage/jest`
- Expo Modules: `jest.setup.js`

**See [TESTING.md](./TESTING.md) for complete testing guide.**

---

## Build & Deployment

### CI/CD Pipeline

```mermaid
graph TD
    A[Git Push] --> B{Branch?}

    B -->|Any Branch| C[CI Workflow]
    B -->|dev| D[Development Build]
    B -->|main| E[Production Build]
    B -->|PR| F[PR Checks]

    C --> G[Install Deps]
    G --> H[Lint]
    H --> I[Type Check]
    I --> J[Tests]
    J --> K{All Pass?}

    K -->|Yes| L[Success ✓]
    K -->|No| M[Fail ✗]

    D --> N[EAS Build<br/>Development Profile]
    E --> O[EAS Build<br/>Production Profile]

    N --> P[Internal Distribution]
    O --> Q[App Stores]

    style C fill:#4A90E2
    style D fill:#7B68EE
    style E fill:#50C878
    style F fill:#FFD93D
```

### Build Profiles

```mermaid
graph LR
    A[Source Code] --> B{Build Profile}

    B -->|Development| C[Dev Build]
    B -->|Preview| D[Staging Build]
    B -->|Production| E[Production Build]

    C --> F[Internal Testing<br/>Development Client]
    D --> G[UAT<br/>APK/Ad-hoc]
    E --> H[App Stores<br/>AAB/IPA]

    style C fill:#87CEEB
    style D fill:#FFB6C1
    style E fill:#90EE90
```

---

## Design Principles

### 1. Separation of Concerns

- **UI**: Pure presentational components
- **Logic**: Business logic in contexts/hooks
- **Data**: API and storage abstraction

### 2. Single Responsibility

- Each module has one clear purpose
- Components focus on rendering
- Services handle data operations

### 3. Dependency Injection

- Contexts provide dependencies
- Mock implementations for testing
- Loose coupling between layers

### 4. Type Safety

- TypeScript for all code
- Strict mode enabled
- Shared type definitions

### 5. Testability

- Unit tests for business logic
- Component tests for UI
- Integration tests for workflows
- Mocked dependencies

---

## Security Considerations

### Authentication Security

```mermaid
graph TD
    A[User Credentials] --> B[HTTPS Only]
    B --> C[JWT Token]
    C --> D[Secure Storage]
    D --> E[Request Headers]
    E --> F[Backend Validation]

    G[Token Expiry] --> H[401 Response]
    H --> I[Clear Auth State]
    I --> J[Redirect to Login]

    style B fill:#50C878
    style D fill:#50C878
    style F fill:#50C878
```

### Security Measures

1. **Transport Security**: HTTPS for all API calls
2. **Token Storage**: Encrypted AsyncStorage
3. **Token Transmission**: Authorization header only
4. **Auto-Logout**: On 401 responses
5. **Input Validation**: Client and server-side
6. **Environment Secrets**: Never committed to git

---

## Performance Optimizations

### 1. Code Splitting

- Lazy loading of screens
- Dynamic imports for large modules

### 2. Memoization

- `React.memo` for expensive components
- `useMemo` for computed values
- `useCallback` for stable callbacks

### 3. Caching

- API response caching
- Image caching with Expo
- AsyncStorage for persistence

### 4. Bundle Size

- Tree shaking unused code
- Minification in production
- Optimized imports

---

## Scalability Considerations

### Future Enhancements

1. **State Management**: Migrate to Redux/Zustand for complex state
2. **API Layer**: Implement React Query for caching
3. **Offline Support**: Add offline-first capabilities
4. **Analytics**: Integrate tracking and monitoring
5. **Error Tracking**: Add Sentry integration
6. **Push Notifications**: Implement notification system
7. **Deep Linking**: Support universal links

---

## References

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/react-native)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Last Updated**: November 5, 2025  
**Maintained By**: Development Team
