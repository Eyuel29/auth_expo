# Auth Expo App

A modern React Native mobile application built with Expo, featuring JWT-based authentication and a robust CI/CD pipeline.

## 📱 Project Overview

### Description

This is a cross-platform mobile application built with Expo and React Native, featuring secure authentication, modern UI/UX, and automated build pipelines for iOS and Android.

### Tech Stack

- **Framework**: Expo SDK 54+ / React Native
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Backend**: Express.js with JWT authentication

### Features

- ✅ JWT-based authentication (Email/Password + OAuth)
- ✅ Protected route navigation
- ✅ Cross-platform support (iOS, Android, Web)
- ✅ Type-safe development with TypeScript
- ✅ Modern UI with NativeWind
- ✅ Automated CI/CD pipeline with GitHub Actions
- ✅ EAS Build integration for cloud builds

## 🚀 Project Setup

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (comes with Node.js)
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **iOS**: macOS with Xcode (for iOS development)
- **Android**: Android Studio or VS Code with SDK (for Android development)

### Installation Steps

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

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the environment variables:

```env
# Backend API URL
EXPO_PUBLIC_SERVER_URL=http://localhost:8080

# For Android Emulator, use:
# EXPO_PUBLIC_SERVER_URL=http://10.0.2.2:8080

# For Physical Devices, use your local IP:
# EXPO_PUBLIC_SERVER_URL=http://192.168.1.x:8080
```

4. **Start the backend server** (if running locally)

```bash
cd ../express
npm install
npm run dev
```

### Environment Variables

| Variable                 | Description          | Example                 |
| ------------------------ | -------------------- | ----------------------- |
| `EXPO_PUBLIC_SERVER_URL` | Backend API base URL | `http://localhost:8080` |

## 📂 Project Structure

```
auth_expo/
├── app/                          # Expo Router pages (file-based routing)
│   ├── (auth)/                   # Public authentication screens
│   │   ├── sign-in.tsx          # Email/password sign-in with OAuth options
│   │   ├── sign-up.tsx          # User registration with OAuth options
│   │   └── _layout.tsx          # Auth layout
│   ├── (tabs)/                   # Protected app screens with tab navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── profile.tsx          # User profile
│   │   └── _layout.tsx          # Tab layout
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry point
├── api/                          # API clients and services
│   ├── auth.ts                  # Auth + OAuth helpers
│   └── client.ts                # Shared Axios client
├── components/                   # Reusable UI components
├── contexts/                     # React Context providers
│   └── auth-context.tsx         # Authentication context
├── shared/                       # Shared types and utilities
│   └── types/                    # Type definitions
│       └── auth.ts              # Auth-related types
├── docs/                         # Documentation
│   ├── foundation/               # Foundation setup docs
│   ├── implementation/           # Implementation guides
│   ├── prd/                      # Product requirements
│   └── stories/                  # User stories
├── .github/                      # GitHub configuration
│   ├── workflows/                # GitHub Actions workflows
│   │   ├── ci.yml               # Continuous Integration
│   │   ├── pr-check.yml         # Pull Request validation
│   │   └── build.yml            # EAS Build workflow
│   ├── labeler.yml              # Auto-labeling configuration
│   ├── CODEOWNERS               # Code ownership
│   └── pull_request_template.md # PR template
├── .husky/                       # Git hooks
│   ├── pre-commit               # Pre-commit hook (lint-staged)
│   └── commit-msg               # Commit message validation
├── .env.example                  # Environment variables template
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── eslint.config.js             # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .commitlintrc.js             # Commitlint configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

### Key Directories

- **`app/`**: File-based routing (Expo Router) - each file becomes a route
- **`contexts/`**: Global state management with React Context
- **`lib/`**: Reusable business logic and utilities
- **`components/`**: Reusable UI components
- **`docs/`**: All project documentation

## 🏃 Running the App

### Development Server

Start the Expo development server:

```bash
npm run dev
```

This opens the Expo DevTools in your browser. From there:

### Run on Android Emulator

1. Start Android Studio or VS Code and launch an emulator
2. Press `a` in the terminal, or run:

```bash
npm run android
```

### Run on iOS Simulator (macOS only)

1. Ensure Xcode is installed
2. Press `i` in the terminal, or run:

```bash
npm run ios
```

### Run on Physical Device

1. Install **Expo Go** app from App Store or Play Store
2. Scan the QR code shown in the terminal or browser
3. Ensure your device and computer are on the same network

### Run on Web

```bash
npm run web
```

### Clear Cache

If you encounter issues:

```bash
npm run dev -- --clear
```

## 🔄 CI/CD Pipeline

### Overview

The project uses **GitHub Actions** for continuous integration and **EAS (Expo Application Services)** for building production apps.

### Tools Used

- **GitHub Actions**: Automated workflows for CI/CD
- **EAS Build**: Cloud-based builds for iOS and Android
- **EAS Submit**: Automated app store submissions
- **Husky**: Git hooks for pre-commit checks
- **Lint-staged**: Run linters on staged files
- **Commitlint**: Enforce conventional commit messages

### Workflow Steps

#### 1. **Continuous Integration (CI)** - `.github/workflows/ci.yml`

Runs on every push and pull request:

```
┌─────────────────┐
│   Push / PR     │
└────────┬────────┘
         ↓
┌─────────────────────────────┐
│  Type Check (TypeScript)    │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  Lint (ESLint)              │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  Format Check (Prettier)    │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  Secret Scan (TruffleHog)   │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  Dependency Audit           │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  Build Verification         │
└─────────────────────────────┘
```

#### 2. **Pull Request Validation** - `.github/workflows/pr-check.yml`

Validates PRs before merge:

- ✅ Validates PR title (Conventional Commits)
- ✅ Checks PR description
- ✅ Detects merge conflicts
- ✅ Auto-labels based on file changes

#### 3. **EAS Build** - `.github/workflows/build.yml`

Triggers cloud builds:

- **Manual**: Via GitHub Actions UI
- **Automatic**: On version tags (`v*.*.*`)

```
┌─────────────────┐
│  Trigger Build  │
└────────┬────────┘
         ↓
┌─────────────────────────────┐
│  Run Quality Checks         │
└────────┬────────────────────┘
         ↓
┌─────────────────────────────┐
│  EAS Build (Cloud)          │
│  - Android APK/AAB          │
│  - iOS IPA                  │
└─────────────────────────────┘
```

### Environment Secrets

Configure these secrets in **GitHub Settings > Secrets and Variables > Actions**:

| Secret       | Description               | How to Get                               |
| ------------ | ------------------------- | ---------------------------------------- |
| `EXPO_TOKEN` | Expo authentication token | Run `eas login` then `eas whoami --json` |

## 📦 Android Build & Deployment

### Generate APK (Internal Testing)

**Development build:**

```bash
npm run build:android:dev
```

**Preview build:**

```bash
npm run build:android:preview
```

### Generate AAB (Play Store Release)

**Production build:**

```bash
npm run build:android:production
```

### Signing Credentials

EAS automatically manages signing credentials. On first build:

1. EAS will prompt to generate credentials
2. Choose "Generate new keystore"
3. Credentials are stored securely in EAS

To manage credentials:

```bash
eas credentials
```

### Submitting to Play Store

1. **Build the production AAB:**

```bash
eas build --platform android --profile production
```

2. **Submit to Play Store:**

```bash
eas submit --platform android
```

3. Follow the prompts to complete submission

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

### End-to-End Tests

```bash
npm run test:e2e
```

> **Note**: Test infrastructure setup is planned for Phase 2.

## 🛠️ Useful Commands

### Expo Commands

| Command                  | Description              |
| ------------------------ | ------------------------ |
| `npm run dev`            | Start development server |
| `npm run start`          | Start development server |
| `npm run android`        | Run on Android emulator  |
| `npm run ios`            | Run on iOS simulator     |
| `npm run web`            | Run on web browser       |
| `npm run dev -- --clear` | Clear cache and start    |

### EAS Build Commands

| Command                            | Description               |
| ---------------------------------- | ------------------------- |
| `npm run build:android:dev`        | Build Android development |
| `npm run build:android:preview`    | Build Android preview     |
| `npm run build:android:production` | Build Android production  |
| `npm run build:ios:dev`            | Build iOS development     |
| `npm run build:ios:preview`        | Build iOS preview         |
| `npm run build:ios:production`     | Build iOS production      |
| `eas build --platform all`         | Build both platforms      |
| `eas submit --platform android`    | Submit to Play Store      |
| `eas submit --platform ios`        | Submit to App Store       |

### Linting / Formatting

| Command                | Description           |
| ---------------------- | --------------------- |
| `npm run lint`         | Run ESLint            |
| `npm run lint:fix`     | Fix ESLint errors     |
| `npm run format`       | Format with Prettier  |
| `npm run format:check` | Check formatting      |
| `npm run type-check`   | Run TypeScript checks |
| `npm run check-all`    | Run all checks (CI)   |

### Git Hooks

Git hooks are automatically run via Husky:

- **Pre-commit**: Runs `lint-staged` (lints and formats staged files)
- **Commit-msg**: Validates commit message format (Conventional Commits)

## 📌 Versioning & Releases

### Versioning Strategy

This project follows **Semantic Versioning** (SemVer):

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─ Bug fixes
  │     └─────── New features (backwards compatible)
  └───────────── Breaking changes
```

**Example**: `1.2.3` → `1.2.4` (patch), `1.3.0` (minor), `2.0.0` (major)

### Release Process

1. **Update version in `package.json` and `app.json`**

```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

2. **Create a git tag**

```bash
git tag v1.0.0
git push origin v1.0.0
```

3. **Trigger EAS Build** (automatic on version tags)

### Changelog Guidelines

Follow **Conventional Commits** format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

**Examples:**

```bash
git commit -m "feat(auth): add Google OAuth login"
git commit -m "fix(profile): resolve logout navigation issue on web"
git commit -m "docs(readme): update setup instructions"
```

### Release Notes

When creating a new release:

1. Go to **GitHub Releases**
2. Click **"Draft a new release"**
3. Tag the version (e.g., `v1.0.0`)
4. Auto-generate release notes or write custom notes
5. Publish release

## 📖 Documentation

For detailed documentation, see:

- **[Documentation Index](./docs/README.md)** - Central hub for all documentation
- **[PRD](./docs/prd/PRD_EXPO_COMPLETE_SETUP.md)** - Product requirements
- **[User Stories](./docs/stories/USER_STORIES.md)** - Feature user stories
- **[Issue Cards](./docs/cards/ISSUE_CARDS.md)** - Development tasks

## 💬 Support

For issues and questions:

- Check existing [GitHub Issues](https://github.com/Eyuel29/auth_expo/issues)
- Create a new issue with detailed description
- Contact the development team
