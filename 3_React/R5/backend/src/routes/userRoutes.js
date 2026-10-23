import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas de usuarios requieren verificación de token JWT (Protección de datos)
router.use(verifyToken);

router.get('/stats', userController.getDatabaseStats);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Endpoints exclusivos de Rango Administrador
router.post('/', requireRoles('admin'), userController.createUser);
router.delete('/:id', requireRoles('admin'), userController.deleteUser);

// Edición: Permitido a administradores (todos) o usuarios sobre su propio perfil
router.put('/:id', userController.updateUser);

export default router;
