import { Router } from 'express';
import {deleteUser, getAllUsers, getUserById, setRequestService, updateProfilePicture, updateUser, selectWorker} from './../controllers/User.Controller.js'
import { uploadProfilePictureMiddle } from '../middlewares/images/updateProfilePictureMiddle.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { updateUserSchema, idSchema } from '../middlewares/validations/user.validation.js';

export const userRouter = Router();


userRouter.get('/', getAllUsers);
userRouter.get('/:id', validateSchema(idSchema, "params"), getUserById);
userRouter.put('/:id', validateSchema(idSchema, "params"), updateUser)
userRouter.delete('/:id', validateSchema(idSchema, "params"), validateSchema(updateUserSchema), deleteUser);
userRouter.post('/seleccionar-worker', selectWorker);


userRouter.put('/profile-picture/:id', uploadProfilePictureMiddle.single('profilePicture'), updateProfilePicture);

export default userRouter;

