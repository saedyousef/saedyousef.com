module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^\.\/main.js$': '<rootDir>/ts/main.ts'
  }
};
