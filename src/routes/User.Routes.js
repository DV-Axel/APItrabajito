import { Router } from 'express';
import {getAllUsers, getUserById, setRequestService, updateProfilePicture} from '../controllers/User.Controller.js'
import { uploadProfilePictureMiddle } from '../middlewares/images/updateProfilePictureMiddle.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { userIdSchema } from '../validations/user.validation.js';

export const userRouter = Router();


userRouter.get('/', getAllUsers);
userRouter.get('/:id', validateSchema(userIdSchema, "params") ,getUserById);


userRouter.put('/profile-picture/:id', uploadProfilePictureMiddle.single('profilePicture'), updateProfilePicture);

export default userRouter;











//router.get('/:id', getUsuarioById);
//router.post('/', createUser);
//router.put('/:id', updateUsuario);
//router.delete('/:id', deleteUsuario);