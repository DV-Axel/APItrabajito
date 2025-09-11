import { Router } from 'express';
import {getAllUsers, getUserById, setRequestService, updateProfilePicture} from '../controllers/User.Controller.js'
import { uploadProfilePicture } from '../middlewares/updateProfilePicture.js';

export const userRouter = Router();


userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.put('/profile-picture/:id', uploadProfilePicture.single('profilePicture'), updateProfilePicture);

export default userRouter;


//router.get('/:id', getUsuarioById);
//router.post('/', createUser);
//router.put('/:id', updateUsuario);
//router.delete('/:id', deleteUsuario);