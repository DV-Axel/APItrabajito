import { Router } from 'express';
import { getAllUsers, signup, confirmEmail } from '../controllers/User.Controller.js'

export const router = Router();


router.get('/', getAllUsers);

// login
router.post('/signup', signup);
router.get('/confirmacion', confirmEmail );

export default router;


//router.get('/:id', getUsuarioById);
//router.post('/', createUser);
//router.put('/:id', updateUsuario);
//router.delete('/:id', deleteUsuario);