module.exports = {
  preset: 'jest-expo',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Transform files
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  
  // Module paths - match tsconfig.json paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/api/(.*)$': '<rootDir>/api/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
    // Mock CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'api/**/*.{ts,tsx}',
    'contexts/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',     // ✅ Include components
    'app/**/*.{ts,tsx}',            // ✅ Include screens
    'hooks/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    // Exclude specific files
    '!app/_layout.tsx',             // Exclude root layout (complex setup)
    '!app/+not-found.tsx',          // Exclude error pages
    '!shared/types/**',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],
  
  // Temporarily disabled test thresholds
  // coverageThreshold: {
  //   global: {
  //     branches: 50,
  //     functions: 80,
  //     lines: 70,
  //     statements: 70,
  //   },
  // },
  
  // Test environment
  testEnvironment: 'node',
  
  // Verbose output
  verbose: true,
};

