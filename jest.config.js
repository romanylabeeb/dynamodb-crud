const config =   module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  setupFiles: [
      'dotenv/config'
  ],
  setupFilesAfterEnv: [
      'jest-extended'
  ],
  roots: [
      '<rootDir>/src/',
      // NOTE: we need to make sure typescript gets access to the types published by jest-extended
      '<rootDir>/node_modules/jest-extended/types',
  ]
};

// jest thinks `db.ts` is a unit test (it's not); for now, we'll ensure it's excluded
config.coveragePathIgnorePatterns = [
    '/node_modules/',
    '/.serverless_plugins/'
];
config.testPathIgnorePatterns = [
    '/node_modules/',
    '/.serverless_plugins/'
];
module.exports = config;


