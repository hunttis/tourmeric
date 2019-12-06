module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>test-setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\config': '<rootDir>/src/__mocks__/config.js',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};
