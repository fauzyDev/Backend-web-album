import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' }); // Memuat variabel lingkungan dari .env.test

export default {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Gunakan babel-jest untuk mentransformasi file JS
  },
  testEnvironment: 'node', // Set environment ke 'node'
};
