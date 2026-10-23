import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { gastosRouter } from './routes/gastosRoutes.js';
import { resumenRouter } from './routes/resumenRoutes.js';

// Configuración de rutas para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar la aplicación de Node.js con Express
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors()); // Habilitar CORS para peticiones cliente-servidor
app.use(morgan('dev')); // Registro de peticiones HTTP en consola
app.use(express.json()); // Parser de peticiones con payload JSON
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del Frontend (HTML, CSS, JS módulos)
app.use(express.static(path.join(__dirname, 'public')));

// --- ENRUTAMIENTO DE LA API REST ---
app.use('/api/gastos', gastosRouter);
app.use('/api/resumen', resumenRouter);

// Endpoint de prueba de salud (Healthcheck) con respuesta elaborada
app.get('/api/estado', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Servidor Node.js activo y respondiendo correctamente.',
    uptime: process.uptime(),
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas API no encontradas (404)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `El recurso solicitado '${req.originalUrl}' no existe en este servidor.`,
    timestamp: new Date().toISOString()
  });
});

// Ruta comodín para SPA / Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware global de captura de errores del servidor (500)
app.use((err, req, res, next) => {
  console.error('Error no controlado en el servidor:', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Ha ocurrido un error inesperado en el servidor.',
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Servidor Node.js ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Proyecto: Gestor de Gastos Personales (Tema 1)`);
  console.log(`⚡ Temas aplicados: Node.js, Clases, Vectores, Get/Set,`);
  console.log(`   Import/Export, Fetch & Axios, Eventos y Respuestas.`);
  console.log('====================================================');
});
