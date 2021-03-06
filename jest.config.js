// Jest configuration was inspired by:
// https://medium.com/@sumn2u/configuring-different-testing-library-in-nwb-for-react-7cd2804b4f7c

module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    verbose: true,
    transform: {
        '^.+\\.js$': '<rootDir>/jest.transform.js',
    },
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.jsx?$',
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
    setupFiles: ['./setupTests'],
};
