import { Router } from 'express';
import { resumenController } from '../controllers/resumenController.js';

export const resumenRouter = Router();

// Rutas REST para estadísticas, presupuesto y divisas
resumenRouter.get('/', resumenController.obtenerResumen);
resumenRouter.put('/presupuesto', resumenController.actualizarPresupuesto);
resumenRouter.get('/divisas', resumenController.obtenerCotizaciones);
