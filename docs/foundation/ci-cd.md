# CI/CD Setup Documentation

## Overview

This project uses **GitHub Actions** for Continuous Integration and Continuous Deployment (CI/CD), along with **Expo Application Services (EAS)** for building and distributing mobile applications.

---

## 🎯 What CI/CD Does

### Automatic Checks on Every Push/PR

- ✅ **Type checking** - Catches TypeScript errors
- ✅ **Linting** - Enforces code quality standards
- ✅ **Formatting** - Validates Prettier formatting
- ✅ **Secret scanning** - Prevents committing sensitive data
- ✅ **Dependency audit** - Checks for security vulnerabilities
- ✅ **Build verification** - Ensures app can build

---

## 📁 CI/CD Files

### GitHub Actions Workflows

| File                             | Purpose          | Triggers                 |
| -------------------------------- | ---------------- | ------------------------ |
| `.github/workflows/ci.yml`       | Main CI pipeline | Every push, every PR     |
| `.github/workflows/pr-check.yml` | PR validation    | PR opened/updated        |
| `.github/workflows/build.yml`    | EAS builds       | Tags (v*.*.\*) or manual |

### GitHub Templates

| File                               | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `.github/CODEOWNERS`               | Auto-assign reviewers           |
| `.github/pull_request_template.md` | PR description template         |
| `.github/labeler.yml`              | Auto-label PRs by files changed |

### Build Configuration

| File       | Purpose                                       |
| ---------- | --------------------------------------------- |
| `eas.json` | EAS build profiles (dev, preview, production) |

---

## 🔄 CI Pipeline Details

### 1. Main CI Workflow (ci.yml)

**Runs on:**

- Every push to `main`, `develop`, or `project-foundation`
- Every pull request to `main` or `develop`

**Jobs:**

#### Job 1: Code Quality Check

```yaml
✅ Checkout code
✅ Setup Node.js 18
✅ Install dependencies
✅ Run TypeScript check
✅ Run ESLint
✅ Run Prettier check
✅ Scan for secrets (TruffleHog)
```

#### Job 2: Dependency Check

```yaml
✅ Run npm audit
✅ Check outdated dependencies
```

#### Job 3: Build Verification

```yaml
✅ Export for web (build check)
✅ Verify Expo installation
```

#### Job 4: Status Check

```yaml
✅ Verify all jobs passed
✅ Fail if any job failed
```

**Result:**

- ✅ All checks pass → PR can be merged
- ❌ Any check fails → PR blocked

---

### 2. PR Check Workflow (pr-check.yml)

**Runs on:**

- PR opened, synchronized, reopened, or edited

**Validations:**

#### PR Title Format

- Must follow [Conventional Commits](https://www.conventionalcommits.org/)
- Format: `type(scope): description`
- Examples:
  - ✅ `feat(auth): add OAuth login`
  - ✅ `fix(ui): resolve button alignment`
  - ❌ `Fixed stuff` (rejected)

#### PR Description

- Must be at least 10 characters
- Should explain what/why/how

#### WIP Check

- Blocks PRs with "WIP" in title
- Remove "WIP" when ready for review

#### PR Size Warning

- Warns if PR > 1000 lines changed
- Suggests breaking into smaller PRs

#### Conflict Detection

- Checks for merge conflicts
- Prevents merging conflicted PRs

#### Auto-labeling

- Labels PR based on files changed
- Examples: `documentation`, `authentication`, `ci/cd`

---

### 3. EAS Build Workflow (build.yml)

**Triggers:**

1. **Automatic** - When you push a version tag:

   ```bash
   git tag v1.0.0
   git push --tags
   ```

2. **Manual** - Via GitHub Actions UI:
   - Choose platform (iOS/Android/All)
   - Choose profile (development/preview/production)

**What it does:**

```yaml
✅ Run all quality checks
✅ Trigger EAS build
✅ Comment on commit with build link
```

**Build Profiles:**

| Profile       | Purpose                     | Distribution |
| ------------- | --------------------------- | ------------ |
| `development` | Dev builds with debug tools | Internal     |
| `preview`     | Staging/testing builds      | Internal     |
| `production`  | Production releases         | App stores   |

---

## 🚀 Setup Instructions

### 1. Prerequisites

**Install EAS CLI:**

```bash
npm install -g eas-cli
```

**Login to Expo:**

```bash
eas login
```

### 2. Configure EAS Project

**First-time setup:**

```bash
cd /home/eyuel/synque/auth_expo
eas build:configure
```

This will:

- Link project to your Expo account
- Generate `projectId` in `app.json`
- Prompt for bundle identifiers (iOS/Android)

**Example prompts:**

```
? What is your bundle identifier? → com.yourcompany.authexpo
? Generate a new Android Keystore? → Yes
```

### 3. Add GitHub Secret

**Get your Expo token:**

```bash
# Visit: https://expo.dev/accounts/[username]/settings/access-tokens
# Create a new token
# Copy the token value
```

**Add to GitHub:**

1. Go to: `https://github.com/[username]/auth_expo/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `EXPO_TOKEN`
4. Value: [paste your token]
5. Click "Add secret"

### 4. Update CODEOWNERS

Edit `.github/CODEOWNERS` and replace `@eyuel` with your GitHub username:

```bash
# Quick update
sed -i 's/@eyuel/@your-github-username/g' .github/CODEOWNERS
```

### 5. Update eas.json (Optional)

For production builds, update the submit configuration:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-email@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCDE12345"
    }
  }
}
```

---

## 📝 Usage Examples

### Running CI Checks Locally

**Before pushing, test what CI will run:**

```bash
# Run all checks (same as CI)
npm run check-all

# Individual checks
npm run type-check
npm run lint
npm run format:check

# Fix issues automatically
npm run lint:fix
npm run format
```

### Creating a PR

1. **Create branch:**

   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make changes and commit:**

   ```bash
   git add .
   git commit -m "feat(auth): add OAuth support"
   # Pre-commit hook runs automatically
   ```

3. **Push and create PR:**

   ```bash
   git push origin feat/my-feature
   # Go to GitHub and create PR
   ```

4. **CI runs automatically:**
   - ✅ All checks pass → Ready for review
   - ❌ Checks fail → Fix issues and push again

### Triggering a Build

**Option 1: Tag-based (Automatic)**

```bash
# Create and push a version tag
git tag v1.0.0
git push --tags

# EAS build starts automatically
```

**Option 2: Manual (GitHub UI)**

1. Go to: `Actions` tab on GitHub
2. Select "EAS Build" workflow
3. Click "Run workflow"
4. Choose platform and profile
5. Click "Run workflow"

### Checking Build Status

**Via GitHub:**

- Go to `Actions` tab
- Click on the running workflow
- See real-time logs

**Via EAS:**

```bash
eas build:list
```

Or visit: https://expo.dev/accounts/[username]/projects/[project]/builds

---

## 🎯 Branch Protection Rules (Recommended)

### Setup on GitHub:

1. Go to: `Settings` → `Branches`
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks that are required:
     - `Code Quality & Type Check`
     - `PR Validation`
     - `Build Verification`
   - ✅ Do not allow bypassing the above settings

**Result:**

- Cannot push directly to `main`
- Must create PR
- Must pass all CI checks
- Must get approval (optional)

---

## 🔍 Troubleshooting

### CI Fails with "npm audit"

**Issue:** Known vulnerabilities in dependencies

**Fix:**

```bash
# Check vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# If manual fixes needed, update specific packages
npm update [package-name]
```

### Secret Scanning Fails

**Issue:** Committed API keys, tokens, or credentials

**Fix:**

1. Remove the secret from code
2. Add to `.env` or environment variables
3. Update `.gitignore` to exclude sensitive files
4. Revoke the exposed credential
5. Generate new credential

### Build Verification Fails

**Issue:** Web export fails

**Check:**

```bash
# Test locally
npm run build:web

# Check for errors in logs
```

### EAS Build Fails

**Common issues:**

1. **Missing EXPO_TOKEN:**
   - Check GitHub Secrets
   - Regenerate token if expired

2. **Invalid bundle identifier:**
   - Must be unique
   - Format: `com.company.appname`

3. **Missing credentials:**
   - Run: `eas credentials`
   - Configure iOS/Android signing

---

## 📊 Monitoring CI/CD

### GitHub Actions Dashboard

**View all runs:**

```
https://github.com/[username]/auth_expo/actions
```

**Metrics to track:**

- ✅ Success rate (aim for > 95%)
- ⏱️ Average run time (aim for < 10 min)
- 🔄 Frequency of runs

### EAS Build Dashboard

**View all builds:**

```
https://expo.dev/accounts/[username]/projects/[project]/builds
```

**Metrics:**

- Build success rate
- Build duration
- Distribution stats

---

## 🎨 PR Labels (Auto-applied)

| Label            | Triggered By                         |
| ---------------- | ------------------------------------ |
| `documentation`  | Changes to `*.md`, `docs/`           |
| `dependencies`   | Changes to `package.json`            |
| `ci/cd`          | Changes to `.github/`                |
| `configuration`  | Changes to `*.config.js`, `app.json` |
| `authentication` | Changes to auth files                |
| `ui`             | Changes to `app/` components         |
| `code-quality`   | Changes to linter/formatter configs  |

---

## 🔐 Security Best Practices

### Secrets Management

**✅ DO:**

- Store secrets in GitHub Secrets
- Use environment variables
- Add `.env` to `.gitignore`
- Rotate credentials regularly

**❌ DON'T:**

- Commit API keys
- Hardcode credentials
- Share secrets in PR comments
- Push `.env` files

### Secret Scanning

**Automatic detection of:**

- API keys
- OAuth tokens
- Private keys
- Database passwords
- AWS credentials

**If secret detected:**

1. CI fails immediately
2. PR blocked
3. Must remove secret
4. Revoke and regenerate credential

---

## 📈 Next Steps

### Phase 2: Add Testing

Once testing infrastructure is set up, CI will automatically:

- Run unit tests
- Run integration tests
- Generate coverage reports
- Block PRs if coverage drops

### Phase 3: Advanced Builds

- Automatic version bumping
- Changelog generation
- App store submission
- Beta distribution

---

## 🆘 Support

### Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Getting Help

1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check EAS build logs
4. Search Expo forums
5. Ask in team chat

---

## ✅ Quick Checklist

Before merging to `main`:

- [ ] All CI checks passing
- [ ] PR title follows conventional format
- [ ] PR description filled out
- [ ] No merge conflicts
- [ ] Code reviewed and approved
- [ ] Local tests pass (`npm run check-all`)
- [ ] Documentation updated (if needed)

---

**Last Updated:** November 3, 2025  
**Maintained By:** Development Team  
**CI/CD Status:** ✅ Active and Operational
