import { Router } from 'express';
import {
  createAlumno,
  deleteAlumno,
  getAlumnoById,
  getAlumnos,
  updateAlumno
} from '../controllers/alumnoController.js';
import { validateAlumno, validateAlumnoId } from '../middlewares/validateAlumno.js';

const router = Router();

router.get('/', getAlumnos);
router.get('/:id', validateAlumnoId, getAlumnoById);
router.post('/', validateAlumno, createAlumno);
router.put('/:id', validateAlumnoId, validateAlumno, updateAlumno);
router.delete('/:id', validateAlumnoId, deleteAlumno);

export default router;
