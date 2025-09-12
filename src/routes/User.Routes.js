import { Router } from 'express';
import {deleteUser, getAllUsers, getUserById, setRequestService, updateProfilePicture, updateUser} from '../controllers/User.Controller.js'
import { uploadProfilePictureMiddle } from '../middlewares/images/updateProfilePictureMiddle.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { updateUserSchema, userIdSchema } from '../validations/user.validation.js';

export const userRouter = Router();


userRouter.get('/', getAllUsers);
userRouter.get('/:id', validateSchema(userIdSchema, "params"), getUserById);
userRouter.put('/:id', validateSchema(userIdSchema, "params"), updateUser)
userRouter.delete('/:id', validateSchema(userIdSchema, "params"), validateSchema(updateUserSchema), deleteUser);

userRouter.put('/profile-picture/:id', uploadProfilePictureMiddle.single('profilePicture'), updateProfilePicture);

export default userRouter;

