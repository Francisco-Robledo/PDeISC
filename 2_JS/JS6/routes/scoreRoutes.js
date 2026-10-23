import { Router } from 'express';
import { guardarScore, listarTopScores } from '../controllers/scoreController.js';

const router = Router();

router.post('/', guardarScore);
router.post('/top', listarTopScores);

export default router;
