import { Router } from 'express';
import * as UsuarioController from '../controllers/UsuarioController.js';

const router = Router();

router.post('/login', UsuarioController.getUsuarioLogin);

export default router;