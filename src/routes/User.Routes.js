import { Router } from 'express';
import { getAllUsers, getUserById, setRequestService } from '../controllers/User.Controller.js'

export const userRouter = Router();


userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/set-request-service', setRequestService);


export default userRouter;


//router.get('/:id', getUsuarioById);
//router.post('/', createUser);
//router.put('/:id', updateUsuario);
//router.delete('/:id', deleteUsuario);