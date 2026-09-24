import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { discordCallbackGet } from './controllers/authController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Endpoint de estado del servidor y BBDD SQL normalizada (3FN)
app.get('/api/health', (req, res) => {
  try {
    const check = db.prepare('SELECT 1 as alive').get();
    return res.status(200).json({
      status: 'online',
      database: check.alive === 1 ? 'SQL Database Connected (SQLite 3FN)' : 'Error',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      database: 'Database Error: ' + error.message
    });
  }
});

// Rutas de la API
app.get('/callback', discordCallbackGet);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Ocurrió un error inesperado en el servidor.',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API con BBDD SQL (3FN) iniciado exitosamente en http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponibles en /api/auth y /api/users`);
});

export default app;
