import { Router } from 'express';
import { gastosController } from '../controllers/gastosController.js';

export const gastosRouter = Router();

// Rutas REST para gestión del Vector de Gastos
gastosRouter.get('/', gastosController.listarGastos);
gastosRouter.get('/eventos', gastosController.obtenerHistorialEventos);
gastosRouter.get('/:id', gastosController.obtenerPorId);
gastosRouter.post('/', gastosController.crearGasto);
gastosRouter.put('/:id', gastosController.actualizarGasto);
gastosRouter.delete('/:id', gastosController.eliminarGasto);
