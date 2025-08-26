import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/User.Controller.js';

const router = Router();

router.get('/', getAllUsers);
//router.get('/:id', getUsuarioById);
router.post('/', createUser);
//router.put('/:id', updateUsuario);
//router.delete('/:id', deleteUsuario);

export default router;
