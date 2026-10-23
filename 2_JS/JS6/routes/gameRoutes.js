import { Router } from 'express';
import { agregarPalabra, listarPalabras, obtenerPalabra } from '../controllers/gameController.js';

const router = Router();

router.post('/word', obtenerPalabra);
router.post('/words', listarPalabras);
router.post('/words/add', agregarPalabra);

export default router;
