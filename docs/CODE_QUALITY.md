# Code Quality Standards

## Overview

This project enforces code quality through automated tools that run on every commit. This ensures consistent code style, catches errors early, and maintains a high-quality codebase.

## Tools

### 1. Prettier - Code Formatting

**Purpose**: Automatic code formatting for consistent style

**Configuration**: `.prettierrc`

**Usage**:

```bash
# Format all files
npm run format

# Check if files are formatted
npm run format:check
```

**IDE Integration**:

- Install Prettier extension in VSCode
- Enable "Format on Save" in settings
- Files will auto-format when you save

### 2. ESLint - Code Linting

**Purpose**: Catch errors and enforce code quality rules

**Configuration**: `eslint.config.js`

**Usage**:

```bash
# Lint all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

**Key Rules**:

- No explicit `any` types
- No unused variables
- React Hooks rules enforced
- Import ordering enforced
- No console.log (use console.warn/error)

### 3. TypeScript - Type Checking

**Purpose**: Type safety and compile-time error catching

**Configuration**: `tsconfig.json` (strict mode enabled)

**Usage**:

```bash
# Type check without building
npm run type-check
```

**Strict Mode Features**:

- All strict TypeScript checks enabled
- No unchecked indexed access
- No unused locals/parameters
- No fallthrough cases in switch

### 4. Husky - Git Hooks

**Purpose**: Run checks before commits

**Configuration**: `.husky/`

**Hooks**:

- **pre-commit**: Runs lint-staged (format + lint staged files)
- **commit-msg**: Validates commit message format

### 5. Commitlint - Commit Messages

**Purpose**: Enforce conventional commit format

**Configuration**: `.commitlintrc.js`

**Format**:

```
<type>(<scope>): <subject>
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting)
- `refactor`: Code restructure
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `build`: Build system changes
- `ci`: CI changes
- `chore`: Other changes
- `revert`: Revert commit

**Examples**:

```bash
# Good commits ✅
git commit -m "feat(auth): add biometric login"
git commit -m "fix(api): resolve timeout issue"
git commit -m "docs(readme): update setup guide"

# Bad commits ❌
git commit -m "Fix bug"  # No type
git commit -m "FEAT: add feature"  # Wrong case
git commit -m "feat: fixed the thing."  # Don't end with period
```

### 6. EditorConfig - Editor Consistency

**Purpose**: Consistent editor settings across IDEs

**Configuration**: `.editorconfig`

**Settings**:

- UTF-8 charset
- LF line endings
- 2 space indentation
- Trim trailing whitespace
- Insert final newline

## Automated Quality Checks

### On Every Commit (Pre-commit Hook)

1. Staged files are formatted with Prettier
2. Staged files are linted with ESLint
3. Auto-fixable issues are corrected
4. Commit blocked if issues remain

### On Commit Message (Commit-msg Hook)

1. Commit message format validated
2. Commit blocked if format incorrect

### Before Push (Recommended)

```bash
# Run all checks
npm run check-all
```

This runs:

- Type checking
- Linting
- Format checking

## Common Workflows

### Starting Work

1. Pull latest code
2. Create feature branch
3. Make changes
4. Files auto-format on save (if VSCode configured)

### Before Committing

1. Stage your changes: `git add .`
2. Commit with conventional format:
   ```bash
   git commit -m "feat(component): add new feature"
   ```
3. Pre-commit hook runs automatically
4. If issues found, fix them and commit again

### If Pre-commit Fails

1. Review the error messages
2. Fix the issues manually
3. Stage the fixes: `git add .`
4. Commit again

### Manual Checks

```bash
# Format all files
npm run format

# Lint and auto-fix
npm run lint:fix

# Type check
npm run type-check

# Run all checks
npm run check-all
```

## Common Issues & Solutions

### Issue: "Expected property shorthand"

**Problem**: Object property not using shorthand

**Bad**:

```typescript
const name = 'John';
const obj = { name: name };
```

**Good**:

```typescript
const name = 'John';
const obj = { name };
```

### Issue: "Unexpected any"

**Problem**: Using `any` type

**Bad**:

```typescript
const data: any = fetchData();
```

**Good**:

```typescript
const data: UserData = fetchData();
// or
const data: unknown = fetchData();
```

### Issue: "React Hook has missing dependency"

**Problem**: useEffect missing dependency

**Bad**:

```typescript
useEffect(() => {
  fetchData(id);
}, []); // Missing 'id'
```

**Good**:

```typescript
useEffect(() => {
  fetchData(id);
}, [id]); // Include all dependencies
```

### Issue: "Import order incorrect"

**Problem**: Imports not ordered correctly

**Good Order**:

```typescript
// 1. React
import React, { useState } from 'react';
// 2. React Native
import { View, Text } from 'react-native';
// 3. External libraries
import axios from 'axios';
// 4. Internal (@/ imports)
import { useAuth } from '@/contexts/auth-context';
// 5. Relative imports
import { helper } from './helper';
```

### Issue: "Unused variable"

**Solution**: Use underscore prefix for intentionally unused variables

```typescript
// Catch block where error is unused
try {
  doSomething();
} catch (_err) {
  // Prefixing with _ tells ESLint it's intentionally unused
  Alert.alert('Error', 'Something went wrong');
}
```

## VSCode Setup (Recommended)

### Extensions

Install these extensions:

- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Disabling Rules (When Necessary)

### Disable ESLint for a line

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = legacyAPI();
```

### Disable ESLint for a file

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// File content
```

### Ignore files in Prettier

Add to `.prettierignore`

⚠️ **Warning**: Only disable rules when absolutely necessary and document why.

## Benefits

1. **Consistency**: Same code style across the team
2. **Early Error Detection**: Catch issues before code review
3. **Reduced Code Review Time**: Focus on logic, not style
4. **Better Collaboration**: Everyone follows same standards
5. **Professional Codebase**: Industry-standard practices

## Troubleshooting

### Pre-commit hook not running

```bash
# Reinstall hooks
npm run prepare
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### ESLint errors in node_modules

**Solution**: node_modules is ignored by default. If you see errors, restart your IDE.

### Prettier and ESLint conflicts

**Solution**: Our config uses `eslint-config-prettier` which disables conflicting rules. If you see conflicts, report them as an issue.

### Slow pre-commit hook

**Solution**: Only staged files are checked (via lint-staged), not the entire codebase. If still slow, check the number of staged files.

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)

## Questions?

If you have questions about code quality standards:

1. Check this document
2. Ask in team chat
3. Create an issue for clarification
