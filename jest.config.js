module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>test-setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '^.+\\.tsx|.ts?$': 'ts-jest',
  },
};
