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


// Registro 
authRouter.post("/signup", signup);
// Confirmación de email
authRouter.get("/confirm", confirmEmail);
// Login
authRouter.post("/login", login);

authRouter.post("/resend-confirmation", resendConfirmation);

// Recuperación de contraseña
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;