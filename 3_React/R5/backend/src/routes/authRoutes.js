import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/social', authController.socialLogin);
router.post('/discord', authController.discordLogin);
router.get('/discord/callback', authController.discordCallbackGet);
router.post('/x', authController.xLogin);
router.post('/github', authController.githubLogin);

// Ruta protegida de perfil actual
router.get('/me', verifyToken, authController.getMe);

export default router;
