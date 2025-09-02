import { Router } from 'express';
import { getAllUsers } from '../controllers/User.Controller.js'

export const userRouter = Router();


userRouter.get('/', getAllUsers);


export default userRouter;


//router.get('/:id', getUsuarioById);
//router.post('/', createUser);
//router.put('/:id', updateUsuario);
//router.delete('/:id', deleteUsuario);