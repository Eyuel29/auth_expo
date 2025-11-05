# Deployment Guide

This guide covers the complete deployment process for the Auth Expo application, including building with EAS (Expo Application Services) and submitting to app stores.

## Table of Contents

- [Prerequisites](#prerequisites)
- [EAS Build Setup](#eas-build-setup)
- [Build Profiles](#build-profiles)
- [Building for iOS](#building-for-ios)
- [Building for Android](#building-for-android)
- [Automated Builds (CI/CD)](#automated-builds-cicd)
- [App Store Submission](#app-store-submission)
- [Environment Management](#environment-management)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

1. **Node.js** 18+ and npm 9+
2. **Expo CLI**: `npm install -g expo-cli`
3. **EAS CLI**: `npm install -g eas-cli`
4. **Expo Account**: Sign up at [expo.dev](https://expo.dev)

### Required Accounts

- **Expo Account**: For EAS Build and updates
- **Apple Developer Account** ($99/year): For iOS distribution
- **Google Play Developer Account** ($25 one-time): For Android distribution

### Initial Setup

```bash
# Login to Expo
eas login

# Configure EAS for your project (if not already done)
eas build:configure
```

---

## EAS Build Setup

### Build Configuration

Our project uses [`eas.json`](../eas.json) with three build profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": { "simulator": false }
    }
  }
}
```

---

## Build Profiles

### 1. Development Profile

**Purpose**: Internal testing with development features enabled

**Features**:

- Development client included
- Hot reload enabled
- Debug mode enabled
- Internal distribution only

**Usage**:

```bash
npm run build:development
# or
eas build --profile development --platform all
```

**When to use**:

- Testing new features
- Debugging issues
- Internal QA

---

### 2. Preview Profile

**Purpose**: Staging/testing builds for stakeholders

**Features**:

- Production-like environment
- APK for Android (faster to build and install)
- Internal distribution
- Can be shared via QR code or link

**Usage**:

```bash
npm run build:preview
# or
eas build --profile preview --platform all
```

**When to use**:

- Stakeholder demos
- User acceptance testing (UAT)
- Pre-release testing

---

### 3. Production Profile

**Purpose**: App store release builds

**Features**:

- Full optimization
- App Bundle for Android (required for Play Store)
- IPA for iOS (for App Store)
- Smallest file size
- Maximum performance

**Usage**:

```bash
npm run build:production
# or
eas build --profile production --platform all
```

**When to use**:

- App store submissions
- Public releases
- Production updates

---

## Building for iOS

### Prerequisites

1. **Apple Developer Account** membership
2. **App Store Connect** access
3. **Bundle Identifier** registered in Apple Developer Portal
4. **Provisioning Profile** and **Certificate** (EAS can manage these automatically)

### Manual Build

```bash
# Build for iOS only
eas build --platform ios --profile production

# Build and submit to TestFlight
eas build --platform ios --profile production --auto-submit
```

### Credentials Management

EAS can automatically manage your iOS credentials:

```bash
# Let EAS manage credentials (recommended)
eas build --platform ios --profile production

# Or manage credentials manually
eas credentials
```

### App Store Connect Setup

1. Create app in **App Store Connect**
2. Configure app metadata:
   - App name
   - Category
   - Screenshots
   - Description
   - Privacy policy URL
3. Set pricing and availability
4. Submit for review

---

## Building for Android

### Prerequisites

1. **Google Play Console** account
2. **Application ID** (package name)
3. **Keystore** (EAS can generate and manage this automatically)

### Manual Build

```bash
# Build for Android only
eas build --platform android --profile production

# Build APK for testing
eas build --platform android --profile preview
```

### Keystore Management

EAS automatically manages your Android keystore:

```bash
# View stored credentials
eas credentials

# Download keystore backup (recommended)
eas credentials --platform android
```

**⚠️ Important**:

- Backup your keystore - you cannot publish updates without it
- Never share your keystore publicly
- Store it securely (e.g., 1Password, encrypted backup)

### Google Play Console Setup

1. Create app in **Google Play Console**
2. Complete store listing:
   - App name
   - Short description
   - Full description
   - Screenshots (phone, tablet)
   - Feature graphic
3. Set up content rating
4. Configure pricing and distribution
5. Create a release in **Internal testing** or **Closed testing** track

---

## Automated Builds (CI/CD)

Our project uses GitHub Actions for automated builds. See [`.github/workflows/build.yml`](../.github/workflows/build.yml).

### Automatic Triggers

Builds are automatically triggered on:

| Branch | Profile     | Purpose            |
| ------ | ----------- | ------------------ |
| `dev`  | Development | Internal testing   |
| `main` | Production  | App store releases |

### Manual Triggers

You can also trigger builds manually from GitHub:

1. Go to **Actions** tab
2. Select **EAS Build** workflow
3. Click **Run workflow**
4. Choose:
   - Platform (iOS, Android, or both)
   - Build profile
   - Branch

### Setup GitHub Secrets

Required secrets in your GitHub repository:

```bash
EXPO_TOKEN=<your-expo-access-token>
```

To get your Expo token:

```bash
eas whoami
# Then create a token at: https://expo.dev/accounts/[username]/settings/access-tokens
```

---

## App Store Submission

### iOS Submission (TestFlight & App Store)

#### Method 1: Automatic Submission

```bash
# Build and auto-submit to TestFlight
eas build --platform ios --profile production --auto-submit

# Or use submit command after build
eas submit --platform ios
```

#### Method 2: Manual Submission

1. Download IPA from EAS build page
2. Upload to App Store Connect via **Transporter** app
3. Submit for TestFlight or App Store review

#### TestFlight Testing

TestFlight allows up to 10,000 external testers:

```bash
# Submit to TestFlight
eas submit --platform ios --latest
```

Testers will receive an email invitation to test via the TestFlight app.

---

### Android Submission (Google Play)

#### Method 1: Automatic Submission

```bash
# Build and auto-submit
eas build --platform android --profile production --auto-submit

# Or submit existing build
eas submit --platform android
```

You'll need:

- **Service Account JSON key** from Google Play Console
- Configure in `eas.json`:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

#### Method 2: Manual Submission

1. Download AAB from EAS build page
2. Upload to **Google Play Console**
3. Choose release track:
   - Internal testing (up to 100 testers)
   - Closed testing (custom tester lists)
   - Open testing (public beta)
   - Production

---

## Environment Management

### Environment Variables

Use environment-specific `.env` files:

```bash
# Development
.env.development

# Staging
.env.staging

# Production
.env.production
```

### Validation

Always validate environment variables before building:

```bash
# Validate development environment
npm run validate-env

# Validate staging
npm run validate-env:staging

# Validate production
npm run validate-env:production
```

### Setting Environment Variables

Environment variables are set in `eas.json` per profile:

```json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

For sensitive variables, use **EAS Secrets**:

```bash
# Set a secret
eas secret:create --name STRIPE_KEY --value pk_live_xxx --scope project

# List secrets
eas secret:list

# Delete a secret
eas secret:delete --name STRIPE_KEY
```

---

## Troubleshooting

### Common Issues

#### 1. Build Fails with "Module not found"

**Solution**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. iOS Build Fails with Provisioning Error

**Solution**:

```bash
# Reset credentials and let EAS regenerate
eas credentials --platform ios
# Select "Remove all credentials" then rebuild
```

#### 3. Android Build Fails with Keystore Error

**Solution**:

```bash
# Check credentials
eas credentials --platform android
# If corrupted, generate new keystore (requires new app submission)
```

#### 4. Submission Rejected - Missing Privacy Policy

**Solution**:

- Add privacy policy URL in App Store Connect / Play Console
- Update app.json with privacy policy:

```json
{
  "expo": {
    "privacy": "https://yourapp.com/privacy-policy"
  }
}
```

#### 5. Build Takes Too Long

**Solution**:

- Use `--non-interactive` flag for faster builds
- Build platforms separately if needed
- Check EAS build queue status at [expo.dev](https://expo.dev)

---

## Build Checklist

Before submitting to app stores:

### Pre-Build

- [ ] Update version in `app.json`
- [ ] Update `CHANGELOG.md`
- [ ] Run all tests: `npm run test:ci`
- [ ] Validate environment: `npm run validate-env:production`
- [ ] Check no `console.log` statements in production code
- [ ] Test on physical devices (iOS and Android)

### Build

- [ ] Build with production profile
- [ ] Test the build locally before submission
- [ ] Verify app icons and splash screens
- [ ] Check app size is reasonable (<50MB ideal)

### Store Submission

- [ ] Update app metadata (if changed)
- [ ] Prepare screenshots (if new features)
- [ ] Write release notes
- [ ] Set correct version number
- [ ] Submit for review

### Post-Submission

- [ ] Monitor crash reports (Sentry, if enabled)
- [ ] Respond to review feedback within 24 hours
- [ ] Test published app after approval
- [ ] Update documentation
- [ ] Announce release to users

---

## Useful Commands

```bash
# View build status
eas build:list

# View build details
eas build:view [build-id]

# Cancel a build
eas build:cancel

# Download build artifact
eas build:download --id [build-id]

# Check project configuration
eas build:inspect --profile production --platform ios

# View credentials
eas credentials

# View secrets
eas secret:list
```

---

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Expo EAS Pricing](https://expo.dev/pricing)

---

**Last Updated**: November 5, 2025  
**Maintained By**: Development Team
