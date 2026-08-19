// jest.config.mjs
/** @type {import('jest').Config} */
const base = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  // ts-jest options belong in the transform tuple. Configuring them under
  // `globals` is deprecated and printed a warning on every worker, on every
  // run -- six copies of it before any test output.
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: ['/node_modules/'],
};

export default {
  projects: [
    // UNIT
    {
      ...base,
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/**/*.(test|spec).ts', '!**/*.int.test.ts'],
    },

    // INTEGRATION
    {
      ...base,
      displayName: 'integration',
      modulePaths: ['<rootDir>/dist'],
      testMatch: ['<rootDir>/tests/integration/**/*.int.test.ts'],
      testTimeout: 30000,
    },
  ],
};
