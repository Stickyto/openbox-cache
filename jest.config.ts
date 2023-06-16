import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@src/(.*)$': '<rootDir>/src/$1',
    '@tests/(.*)$': '<rootDir>/tests/$1',
  },
  coverageReporters: ['text'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/index.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
export default config
