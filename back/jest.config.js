import 'dotenv/config'; // Charge les variables d'environnement depuis .env

export default {
  setupFiles: ['dotenv/config'], // Charge automatiquement .env
  testEnvironment: 'node',        // Utilise un environnement Node.js
  transform: {
    '^.+\\.js$': 'babel-jest',  // Utilise babel-jest pour transformer les fichiers JS
  },
  rootDir: './',                 // Spécifie la racine des tests
};
