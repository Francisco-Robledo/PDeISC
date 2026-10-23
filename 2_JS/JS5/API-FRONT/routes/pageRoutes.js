import { Router } from 'express';
import { getClientConfig } from '../controllers/pageController.js';

const router = Router();

router.get('/config', getClientConfig);

export default router;
