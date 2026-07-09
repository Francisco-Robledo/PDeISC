import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api'
};
