#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 *
 * This script validates that all required environment variables are properly set
 * and provides helpful error messages when configuration is missing or invalid.
 *
 * Usage:
 *   node scripts/validate-env.js [--env=development|staging|production]
 *
 * Libraries used:
 *   - envalid: Robust environment variable validation
 *   - dotenv: Load environment variables from .env files
 *   - dotenv-expand: Support variable expansion (e.g., ${VAR})
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { cleanEnv, str, num, bool, makeValidator } = require('envalid');

// Parse command line arguments
const args = process.argv.slice(2);
const envArg = args.find((arg) => arg.startsWith('--env='));
const environment = envArg ? envArg.split('=')[1] : 'development';

// Determine which .env file to load
const envFiles = [
  `.env.${environment}.local`,
  `.env.${environment}`,
  '.env.local',
  '.env',
];

// Load environment variables from the first file that exists
let envLoaded = false;
for (const envFile of envFiles) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    console.log(`📄 Loading environment from: ${envFile}`);
    const myEnv = dotenv.config({ path: envPath });
    dotenvExpand.expand(myEnv);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn(
    '⚠️  No .env file found. Using system environment variables only.'
  );
}

// Custom validator for Expo public variables
const expoPublicUrl = makeValidator((input) => {
  if (!input) {
    throw new Error('URL is required');
  }

  // Allow localhost URLs for development
  if (
    input.startsWith('http://localhost') ||
    input.startsWith('http://127.0.0.1')
  ) {
    return input;
  }

  // Validate as proper URL for other environments
  try {
    const urlObj = new URL(input);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('URL must use http or https protocol');
    }
    return input;
  } catch (err) {
    throw new Error(`Invalid URL: ${err.message}`);
  }
});

// Define validation schema
const validators = {
  // Required in all environments
  EXPO_PUBLIC_SERVER_URL: expoPublicUrl({
    desc: 'Backend API base URL',
    example: 'http://localhost:8080 or https://api.example.com',
  }),

  // Optional but recommended
  EXPO_PUBLIC_API_TIMEOUT: num({
    desc: 'API request timeout in milliseconds',
    default: 10000,
    example: '10000',
  }),

  EXPO_PUBLIC_DEBUG_MODE: bool({
    desc: 'Enable debug mode',
    default: false,
    example: 'true',
  }),

  // Production/staging environment variables (optional)
  EXPO_PUBLIC_SENTRY_DSN: str({
    desc: 'Sentry DSN for error tracking',
    default: '',
    example: 'https://xxx@xxx.ingest.sentry.io/xxx',
  }),

  EXPO_PUBLIC_ANALYTICS_KEY: str({
    desc: 'Analytics service API key',
    default: '',
    example: 'your-analytics-key',
  }),

  EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: str({
    desc: 'Stripe publishable key for payments',
    default: '',
    example: 'pk_test_xxx or pk_live_xxx',
  }),
};

// Validate environment variables
try {
  console.log(`\n🔍 Validating environment variables for: ${environment}\n`);

  const env = cleanEnv(process.env, validators, {
    reporter: ({ errors, env }) => {
      if (Object.keys(errors).length > 0) {
        const errorMessages = ['❌ Environment validation failed:\n'];

        for (const [key, error] of Object.entries(errors)) {
          const validator = validators[key];
          errorMessages.push(`  ${key}:`);
          errorMessages.push(`    Error: ${error.message || error}`);
          if (validator._desc) {
            errorMessages.push(`    Description: ${validator._desc}`);
          }
          if (validator._example) {
            errorMessages.push(`    Example: ${validator._example}`);
          }
          errorMessages.push('');
        }

        errorMessages.push('💡 Tips:');
        errorMessages.push(
          '  1. Copy .env.example to .env and fill in the values'
        );
        errorMessages.push('  2. Make sure all required variables are set');
        errorMessages.push('  3. Check for typos in variable names\n');

        console.error(errorMessages.join('\n'));
      }
    },
  });

  // Build configuration summary
  const summary = [
    '✅ Environment validation passed!\n',
    '📋 Configuration summary:',
    `  Environment: ${environment}`,
    `  API URL: ${env.EXPO_PUBLIC_SERVER_URL}`,
    `  API Timeout: ${env.EXPO_PUBLIC_API_TIMEOUT}ms`,
    `  Debug Mode: ${env.EXPO_PUBLIC_DEBUG_MODE}`,
  ];

  if (env.EXPO_PUBLIC_SENTRY_DSN) {
    summary.push('  Sentry: Enabled');
  }

  if (env.EXPO_PUBLIC_ANALYTICS_KEY) {
    summary.push('  Analytics: Enabled');
  }

  if (env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    const keyType = env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live')
      ? 'Production'
      : 'Test';
    summary.push(`  Stripe: Enabled (${keyType} mode)`);
  }

  summary.push('\n✨ Ready to start development!\n');

  console.log(summary.join('\n'));

  process.exit(0);
} catch (error) {
  console.error(`\n❌ Fatal error during validation:\n${error.message}\n`);
  process.exit(1);
}
