import { Router } from 'express';
import { 
  signup, 
  login, 
  confirmEmail, 
  resendConfirmation, 
  forgotPassword, 
  resetPassword 
} from "../controllers/auth.controller.js";

export const authRouter = Router();


// Registro y login
authRouter.post("/signup", signup);
authRouter.post("/login", login);

// Confirmación de email
authRouter.get("/confirm", confirmEmail);
authRouter.post("/resend-confirmation", resendConfirmation);

// Recuperación de contraseña
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;