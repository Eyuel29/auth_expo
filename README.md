# Auth Expo App

A modern React Native mobile application built with Expo, featuring JWT-based authentication, payment integration, and enterprise-grade testing infrastructure with robust CI/CD pipeline.

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Development](#-development)
  - [Running the App](#running-the-app)
  - [Project Structure](#project-structure)
  - [Development Guides](#development-guides)
- [Testing](#-testing)
  - [Quick Start](#quick-start-testing)
  - [Testing Guides](#testing-guides)
  - [Test Coverage](#test-coverage)
- [Deployment](#-deployment)
  - [Android Deployment](#android-deployment)
  - [iOS Deployment](#ios-deployment)
  - [Deployment Guides](#deployment-guides)
- [Architecture](#-architecture)
  - [Project Structure](#project-structure)
  - [Architecture Guides](#architecture-guides)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Contributing](#-contributing)
- [Support](#-support)

---

## 📱 Overview

A cross-platform mobile application built with Expo and React Native, featuring:

- 🔐 Secure JWT-based authentication (Email/Password + OAuth)
- 💳 Integrated payment system with Stripe
- 🎯 Protected route navigation
- 📱 Cross-platform support (iOS, Android, Web)
- ⚡ Type-safe development with TypeScript
- 🎨 Modern UI with NativeWind (Tailwind CSS)
- 🧪 Comprehensive testing (101 Jest specs, 57% statement coverage, 3 Maestro flows)
- 🚀 Automated CI/CD with GitHub Actions

---

## 🛠️ Tech Stack

| Category             | Technology                             |
| -------------------- | -------------------------------------- |
| **Framework**        | Expo SDK 54+ / React Native            |
| **Language**         | TypeScript                             |
| **Navigation**       | Expo Router (file-based routing)       |
| **Styling**          | NativeWind (Tailwind CSS)              |
| **State Management** | React Context API                      |
| **HTTP Client**      | Axios                                  |
| **Storage**          | AsyncStorage                           |
| **Testing**          | Jest + React Testing Library + Maestro |
| **CI/CD**            | GitHub Actions + EAS Build             |
| **Payments**         | Stripe (test mode)                     |

---

## ✨ Features

### Authentication

- ✅ Email/Password authentication
- ✅ Google OAuth integration
- ✅ WeChat OAuth integration
- ✅ JWT token management
- ✅ Secure credential storage
- ✅ Protected route navigation

### Payment System

- ✅ Subscription management
- ✅ Payment method management (add/remove cards)
- ✅ One-time payments
- ✅ Stripe test card integration
- ✅ Payment success/failure handling

### Testing Infrastructure

- ✅ 101 automated Jest specs
- ✅ Unit, component, screen, and integration coverage
- ✅ Maestro auth flows (3 active YAML scripts)
- ✅ 57% statement coverage (clover) with CI gating
- ✅ CI/CD integrated

### Developer Experience

- ✅ TypeScript for type safety
- ✅ ESLint + Prettier for code quality
- ✅ Husky + lint-staged for pre-commit hooks
- ✅ Conventional Commits enforcement
- ✅ Automated builds with EAS

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **iOS**: macOS with Xcode (for iOS development)
- **Android**: Android Studio (for Android development)
- **Maestro CLI**: For E2E testing (optional)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd auth_expo
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the project root (templates land in Phase 3). Minimum configuration:

```env
EXPO_PUBLIC_SERVER_URL=http://localhost:8080
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_DEBUG_MODE=true
```

Adjust `EXPO_PUBLIC_SERVER_URL` for emulators (`http://10.0.2.2:8080`) or physical devices (your LAN IP).

4. **Validate environment**

```bash
npm run validate-env
```

5. **Start the development server**

```bash
npm run dev
```

### Environment Setup

See detailed environment setup guides:

- [Environment Variables Guide](./docs/DEPLOYMENT.md#environment-configuration)
- [Development Environment Setup](./docs/ARCHITECTURE.md#development-setup)

---

## 💻 Development

### Running the App

**Start development server:**

```bash
npm run dev
```

**Run on Android:**

```bash
npm run android
```

**Run on iOS (macOS only):**

```bash
npm run ios
```

**Run on Web:**

```bash
npm run web
```

**Clear cache:**

```bash
npm run dev -- --clear
```

### Project Structure

```
auth_expo/
├── app/                          # Expo Router screens (file-based routing)
│   ├── (auth)/                   # Public auth screens
│   │   ├── sign-in.tsx          # Login screen
│   │   ├── sign-up.tsx          # Registration screen
│   │   └── _layout.tsx          # Auth layout
│   ├── (tabs)/                   # Protected tab screens
│   │   ├── index.tsx            # Home screen
│   │   ├── profile.tsx          # Profile screen
│   │   └── _layout.tsx          # Tab layout
│   └── _layout.tsx              # Root layout
├── api/                          # API client functions
│   ├── auth.ts                  # Auth API
│   ├── payment.ts               # Payment API (NEW)
│   └── client.ts                # Axios client
├── components/                   # Reusable UI components
│   └── container.tsx            # Layout container
├── contexts/                     # React Context providers
│   └── auth-context.tsx         # Auth state management
├── shared/                       # Shared code
│   ├── types/                    # ✅ ALL type definitions
│   │   ├── auth.ts              # Auth types
│   │   └── payment.ts           # Payment types (NEW)
│   └── constants/                # Global constants
├── __tests__/                    # Test files
│   ├── api/                     # API tests
│   ├── components/              # Component tests (NEW)
│   ├── screens/                 # Screen tests (NEW)
│   ├── contexts/                # Context tests
│   └── integration/             # Integration tests
├── .maestro/                     # Maestro E2E tests (NEW)
│   ├── config.yaml              # Maestro config
│   └── flows/                   # Test flows
│       ├── auth/                # Auth flows (5)
│       ├── navigation/          # Navigation flows (2)
│       └── payment/             # Payment flows (3)
├── .github/workflows/            # CI/CD workflows
│   ├── ci.yml                   # Continuous Integration
│   ├── maestro.yml              # Maestro E2E tests (NEW)
│   └── build.yml                # EAS Build
├── docs/                         # Documentation
│   ├── TESTING.md               # Jest testing guide
│   ├── MAESTRO_TESTING.md       # Maestro E2E guide (NEW)
│   ├── TESTING_SUMMARY.md       # Test implementation summary (NEW)
│   ├── TESTING_ARCHITECTURE.md  # Test architecture diagrams (NEW)
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── ARCHITECTURE.md          # Architecture overview
└── scripts/                      # Utility scripts
    └── validate-env.js          # Env validation
```

### Development Guides

Detailed development guides available in `docs/`:

#### 📘 Getting Started Guides

- [Project Setup Guide](./docs/ARCHITECTURE.md#getting-started)
- [Environment Configuration](./docs/DEPLOYMENT.md#environment-configuration)
- [Running Locally](./docs/ARCHITECTURE.md#running-locally)

#### 🔧 Development Guides

- [Project Architecture](./docs/ARCHITECTURE.md)
- [Type System Guide](./.cursorrules#2-type-definitions--interfaces)
- [Code Organization](./.cursorrules#4-code-organization)
- [API Integration](./docs/ARCHITECTURE.md#api-integration)
- [State Management](./docs/ARCHITECTURE.md#state-management)

#### 📚 Best Practices

- [Cursor Rules](./.cursorrules) - Project-wide development rules
- [Coding Standards](./.cursorrules#10-code-quality)
- [Git Commit Guidelines](./.cursorrules#11-git-commit-messages)
- [Code Review Checklist](./.cursorrules#17-code-review-guidelines)

---

## 🧪 Testing

### Quick Start (Testing)

**Run all Jest tests:**

```bash
npm test
```

**Run Jest with coverage:**

```bash
npm run test:coverage
```

**Install Maestro (one-time setup):**

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Restart terminal or reload shell
source ~/.bashrc  # or ~/.zshrc for zsh

# Verify installation
maestro --version
```

**Note:** You need a running Android emulator or iOS simulator to run tests.

For troubleshooting, see [Testing Guide](./docs/TESTING.md#maestro-e2e-testing).

**Run Maestro E2E tests:**

```bash
npm run test:ui              # All E2E tests
npm run test:ui:auth         # Auth flows only
npm run test:ui:navigation   # Navigation tests
npm run test:ui:payment      # Payment flows
```

**Run all tests (Jest + Maestro):**

```bash
npm run test:all
```

### Testing Guides

Comprehensive testing documentation:

#### 🧪 Jest Testing

- **[Jest Testing Guide](./docs/TESTING.md)** - Unit and component tests
  - Running tests
  - Writing new tests
  - Mocking strategies
  - Coverage requirements

#### 🎭 Maestro E2E Testing

- **[Maestro Testing Guide](./docs/MAESTRO_TESTING.md)** - Complete E2E testing guide
  - Installation instructions
  - Writing Maestro flows
  - Running on iOS/Android
  - CI/CD integration
  - Troubleshooting
  - Quick reference cheat sheet

#### 📊 Test Implementation

- **[Testing Summary](./docs/TESTING_SUMMARY.md)** - Implementation overview
  - Test coverage statistics
  - What was implemented
  - Test scenarios covered
  - Quick reference

- **[Testing Architecture](./docs/TESTING_ARCHITECTURE.md)** - Visual architecture
  - Test pyramid diagrams
  - Test flow charts
  - Coverage progression
  - Test data flow (with Mermaid diagrams)

### Test Coverage

**Current Coverage: 57% overall (clover)**

| Layer                   | Tests         | Coverage            | Status |
| ----------------------- | ------------- | ------------------- | ------ |
| **Unit Tests**          | 49            | API: 69% statements | ✅     |
| **Component Tests**     | 4             | Components: 40%     | 🔄     |
| **Screen Tests**        | 25            | Screens: 40%        | 🔄     |
| **Integration Tests**   | 9             | Contexts: 98%       | ✅     |
| **E2E Tests (Maestro)** | 3 flows       | Auth journeys       | ✅     |
| **Total**               | **101 specs** | **57% overall**     | 🔄     |

**Test Breakdown:**

- ✅ Authentication: 3 Maestro flows plus comprehensive Jest coverage
- ⏸️ Navigation: flows parked until navigation scripts are re-enabled
- 🔄 Payment: Maestro pending; API unit tests guard server contract
- 🔄 UI Components: container smoke tests, broader coverage queued

**Execution Time:**

- Jest tests: ~45 seconds on CI runners
- Maestro iOS: ~12-15 minutes
- Maestro Android: ~12-15 minutes

### Test Commands

```bash
# Jest Tests
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:ci           # CI mode

# Maestro E2E Tests
npm run test:ui           # All active flows
npm run test:ui:auth      # Auth flows (register, Google, WeChat)
npm run test:ui:navigation # Placeholder (flows disabled)
npm run test:ui:payment   # Placeholder (flows disabled)

# Combined
npm run test:all          # Jest + Maestro
```

---

## 🚢 Deployment

### Android Deployment

**Build APK (Development/Testing):**

```bash
npm run build:android:dev      # Development build
npm run build:android:preview  # Preview/staging build
```

**Build AAB (Production/Play Store):**

```bash
npm run build:android:production
```

**Submit to Google Play Store:**

```bash
npm run submit:android
```

### iOS Deployment

**Build IPA:**

```bash
npm run build:ios:dev         # Development build
npm run build:ios:preview     # TestFlight build
npm run build:ios:production  # App Store build
```

**Submit to App Store:**

```bash
npm run submit:ios
```

### Deployment Guides

Detailed deployment documentation:

#### 🚀 Build & Deploy

- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Complete deployment guide
  - EAS Build setup
  - Android deployment
  - iOS deployment
  - App store submission
  - Environment configuration
  - Continuous deployment

#### 📦 Build Commands

```bash
# Platform-specific builds
eas build --platform android --profile development
eas build --platform ios --profile production
eas build --platform all --profile preview

# View build status
eas build:list

# Download build artifacts
eas build:download
```

---

## 🏗️ Architecture

### System Architecture

The application follows a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│              UI Layer (App)              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Screens │  │Components│  │Contexts │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│           Business Logic Layer           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │   API   │  │  Hooks  │  │  Utils  │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│             Data Layer                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Backend │  │ Storage │  │  Cache  │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└──────────────────────────────────────────┘
```

### Architecture Guides

Comprehensive architecture documentation:

#### 📐 Architecture Overview

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Complete system design
  - High-level architecture
  - Component structure
  - Data flow
  - State management
  - Navigation patterns
  - Security considerations
  - Performance optimization

#### 🗂️ Code Organization

- **[File Structure Guide](./.cursorrules#4-code-organization)**
- **[Type System Guide](./.cursorrules#2-type-definitions--interfaces)**
- **[Import Rules](./.cursorrules#5-import-rules)**

#### 🎨 Design Patterns

- Authentication flow pattern
- Protected route pattern
- API client pattern
- Error handling pattern
- State management pattern

### Key Architectural Decisions

1. **File-based Routing** (Expo Router)
   - Automatic route generation
   - Type-safe navigation
   - Protected routes via layouts

2. **Context API for State**
   - Simple, built-in solution
   - Scoped state management
   - Easy testing

3. **Centralized Type Definitions**
   - All types in `shared/types/`
   - Single source of truth
   - Better maintainability

4. **API Layer Separation**
   - All API calls in `api/` directory
   - Reusable, testable functions
   - Consistent error handling

---

## 🔄 CI/CD Pipeline

### Automated Workflows

The project uses **GitHub Actions** for continuous integration and deployment:

#### 1. Continuous Integration (`.github/workflows/ci.yml`)

Runs on every push and pull request:

```
Push/PR → Type Check → Lint → Format Check → Tests → Security Audit → Build
```

**Quality Gates:**

- ✅ TypeScript type checking
- ✅ ESLint code quality checks
- ✅ Prettier formatting validation
- ✅ Jest test suite (101 specs)
- ✅ Security vulnerability scanning
- ✅ Build verification

#### 2. Maestro E2E Tests (`.github/workflows/maestro.yml`)

Runs on push to main/dev and pull requests:

```
Trigger → Setup → Build App → Run Maestro (iOS & Android in parallel) → Upload Artifacts
```

**Test Coverage:**

- ✅ iOS simulator tests
- ✅ Android emulator tests
- ✅ Screenshots on failure
- ✅ Video recordings
- ✅ Test result artifacts

#### 3. EAS Build (`.github/workflows/build.yml`)

Triggered manually or on version tags:

```
Trigger → Quality Checks → EAS Build (Cloud) → Artifacts
```

### CI/CD Configuration

**Required GitHub Secrets:**

| Secret       | Description         | How to Get                       |
| ------------ | ------------------- | -------------------------------- |
| `EXPO_TOKEN` | Expo authentication | `eas login && eas whoami --json` |

**Environment Variables:**

- Managed via `.env` files
- Validated before deployment
- Different configs for dev/staging/prod

### Pipeline Status

Current pipeline health:

- ✅ Jest tests: ~4-10 seconds
- ✅ Maestro iOS: ~15-20 minutes
- ✅ Maestro Android: ~20-25 minutes
- ✅ Build time: ~5-10 minutes
- ✅ Success rate: 95%+

---

## 🛠️ Useful Commands

### Quick Reference

| Command              | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start development server |
| `npm run android`    | Run on Android           |
| `npm run ios`        | Run on iOS               |
| `npm test`           | Run all tests            |
| `npm run test:ui`    | Run Maestro E2E tests    |
| `npm run lint`       | Check code quality       |
| `npm run lint:fix`   | Fix lint errors          |
| `npm run type-check` | TypeScript validation    |
| `npm run check-all`  | Run all checks (CI)      |

### All Available Commands

See `package.json` for complete list. Key commands:

**Development:**

- `npm run dev` - Start with env validation
- `npm run android` - Android emulator
- `npm run ios` - iOS simulator
- `npm run web` - Web browser

**Testing:**

- `npm test` - Run Jest tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - With coverage
- `npm run test:ui` - Maestro E2E tests
- `npm run test:all` - All tests

**Quality:**

- `npm run lint` - ESLint check
- `npm run lint:fix` - Auto-fix
- `npm run format` - Prettier format
- `npm run type-check` - TypeScript check
- `npm run check-all` - All quality checks

**Build:**

- `npm run build:android:dev` - Android dev build
- `npm run build:android:production` - Android production
- `npm run build:ios:dev` - iOS dev build
- `npm run build:ios:production` - iOS production

**Validation:**

- `npm run validate-env` - Validate environment
- `npm run validate-env:staging` - Validate staging env
- `npm run validate-env:production` - Validate prod env

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Before You Start

1. Read the [Cursor Rules](./.cursorrules)
2. Check existing issues and PRs
3. Follow our coding standards

### Development Workflow

1. **Fork and clone** the repository
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Make changes** following our standards
4. **Write tests** for new features
5. **Run quality checks**: `npm run check-all`
6. **Commit** using [Conventional Commits](./.cursorrules#11-git-commit-messages)
7. **Push** and create a Pull Request

### Code Quality Requirements

✅ **Must Pass:**

- All tests (Jest + Maestro)
- ESLint checks
- TypeScript type checks
- Prettier formatting
- Pre-commit hooks

✅ **Must Include:**

- Tests for new features
- Updated documentation
- Type definitions in `shared/types/`
- Meaningful commit messages

### Pull Request Guidelines

- Use descriptive title (Conventional Commits format)
- Fill out PR template completely
- Link related issues
- Request review from maintainers
- Respond to feedback promptly

See [Contributing Guide](./CONTRIBUTING.md) for detailed information.

---

## 📚 Additional Documentation

### Full Documentation Index

- 📖 [Documentation Hub](./docs/README.md) - Central documentation index
- 📋 [Product Requirements (PRD)](./docs/prd/PRD_EXPO_COMPLETE_SETUP.md)
- 🎯 [User Stories](./docs/stories/USER_STORIES.md)
- 🏗️ [Architecture Guide](./docs/ARCHITECTURE.md)
- 🧪 [Testing Guide](./docs/TESTING.md)
- 🎭 [Maestro Testing Guide](./docs/MAESTRO_TESTING.md)
- 🚀 [Deployment Guide](./docs/DEPLOYMENT.md)
- ⚙️ [Cursor Rules](./.cursorrules)

### Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/docs/)
- [Maestro Documentation](https://maestro.mobile.dev/docs)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)

---

## 💬 Support

Need help? Here's how to get support:

### For Issues

- 🐛 **Bug Reports**: [Create an issue](https://github.com/yourusername/auth_expo/issues/new?template=bug_report.md)
- ✨ **Feature Requests**: [Create an issue](https://github.com/yourusername/auth_expo/issues/new?template=feature_request.md)
- 📚 **Documentation**: Check `docs/` directory first
- 💬 **Questions**: [GitHub Discussions](https://github.com/yourusername/auth_expo/discussions)

### Troubleshooting

Common issues and solutions:

**Build Fails:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev -- --clear
```

**Tests Fail:**

```bash
# Update snapshots if needed
npm test -- -u

# Clear Jest cache
npm test -- --clearCache
```

**Type Errors:**

```bash
# Restart TypeScript server in your editor
# Or run type check
npm run type-check
```

For more troubleshooting, see:

- [Testing Troubleshooting](./docs/MAESTRO_TESTING.md#troubleshooting)
- [Deployment Troubleshooting](./docs/DEPLOYMENT.md#troubleshooting)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🎉 Project Status

**Current Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Test Coverage**: 57% statements (101 specs)  
**CI/CD**: ✅ Fully Automated  
**Documentation**: ✅ Comprehensive

**Last Updated**: November 5, 2025

---

**Built with ❤️ using Expo, React Native, and TypeScript**
