import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import alumnoRoutes from './routes/alumnoRoutes.js';
import { initializeDatabase } from './config/database.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/alumnos', alumnoRoutes);
app.use(errorHandler);

const startServer = async () => {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Proyecto 1 API REST disponible en http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});
