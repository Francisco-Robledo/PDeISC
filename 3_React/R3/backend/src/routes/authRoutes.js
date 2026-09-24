import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida de perfil actual
router.get('/me', verifyToken, authController.getMe);

export default router;
