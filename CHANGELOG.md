# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Phase 3: Documentation and developer experience improvements
  - MIT LICENSE file
  - CONTRIBUTING.md with comprehensive contribution guidelines
  - VSCode workspace settings and recommended extensions
  - Environment templates (.env.local.example, .env.staging.example, .env.production.example)
  - This CHANGELOG.md file

## [0.2.0] - 2025-11-05

### Added
- Phase 2: Testing infrastructure
  - Jest test framework with jest-expo preset
  - React Testing Library for component testing
  - 41 comprehensive tests (18 unit + 14 component + 9 integration)
  - Test utilities and mock implementations
  - Coverage reporting (85% for core auth logic)
  - CI integration - tests run on all branches
- Automated EAS builds
  - Auto-trigger development builds on push to `dev` branch
  - Auto-trigger production builds on push to `main` branch
  - Manual trigger option via GitHub Actions UI
- Documentation
  - Comprehensive testing guide in README.md
  - Updated PRD to mark Phase 2 complete

### Changed
- Updated CI workflow to run tests on all branches
- Excluded UI components from coverage (will be tested in Phase 3)
- Added coverage/ to .gitignore

### Fixed
- Coverage threshold configuration to match actual tested code
- Test execution in CI environment

## [0.1.0] - 2025-11-03

### Added
- Initial project setup with Expo SDK 54
- TypeScript configuration with strict mode
- Expo Router for file-based navigation
- Authentication system
  - Email/password registration and login
  - OAuth support (Google, WeChat)
  - JWT token management
  - AsyncStorage for session persistence
- UI Components
  - Sign-in and sign-up screens
  - Protected tab navigation
  - Profile screen
- Development tooling
  - ESLint configuration
  - Prettier code formatting
  - Husky pre-commit hooks
  - Commitlint for conventional commits
- CI/CD pipeline
  - GitHub Actions for continuous integration
  - PR validation workflow
  - EAS Build configuration
  - Automated linting and type checking
- Documentation
  - Comprehensive README.md
  - PRD (Product Requirements Document)
  - User stories and issue cards

### Security
- Environment variable management with .env
- Secure token storage with AsyncStorage
- API request/response interceptors

---

## Release Types

- **Major** (x.0.0): Breaking changes
- **Minor** (0.x.0): New features (backwards compatible)
- **Patch** (0.0.x): Bug fixes and minor improvements

---

## Links

- [Repository](https://github.com/Eyuel29/auth_expo)
- [Issues](https://github.com/Eyuel29/auth_expo/issues)
- [Pull Requests](https://github.com/Eyuel29/auth_expo/pulls)

