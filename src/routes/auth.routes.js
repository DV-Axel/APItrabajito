import { Router } from 'express';
import { 
  signup, 
  login, 
  confirmEmail, 
  resendConfirmation, 
  forgotPassword, 
  resetPassword 
} from "../controllers/auth.controller.js";
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { createUserSchema } from '../validations/user.validation.js';


export const authRouter = Router();


// Registro 
authRouter.post("/signup", validateSchema(createUserSchema) ,signup);
// Confirmación de email
authRouter.get("/confirm", confirmEmail);
// Login
authRouter.post("/login", login);

authRouter.post("/resend-confirmation", resendConfirmation);

// Recuperación de contraseña
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;