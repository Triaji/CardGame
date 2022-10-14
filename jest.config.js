module.exports = {
  testRegex: ['\\.test.tsx$'],
  preset: 'react-native',
  collectCoverage: true,
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@react-native|react-native)',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 90,
    },
  },
};
