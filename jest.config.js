module.exports = {
  clearMocks: true,
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['lcov'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts(x)?'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[tj]s?(x)'],
  testTimeout: 1000 * 50
}
