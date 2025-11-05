// jest.config.js

// Importe le chemin absolu vers ts-jest
const tsJestPath = require.resolve('ts-jest');

module.exports = {
  rootDir: '.', 
  testRegex: 'src/.*\\.test\\.ts$', 
  
  transform: {
    // Utilise le chemin absolu pour garantir que Jest trouve le transformateur
    '^.+\\.(t|j)s$': tsJestPath,
  },
  
  // ... (le reste de votre configuration)
  collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
};