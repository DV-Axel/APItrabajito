import { Router } from 'express';
import {
  registrarUsuario,
  login,
  confirmarCuenta,
  contraseñaOlvidada,
  cambiarContrasenia,
  reenviarConfirmacion,
} from "../controllers/auth.controller.js";
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { createUserSchema, loginSchema } from '../middlewares/validations/user.validation.js';


export const authRouter = Router();

// Login
authRouter.post("/login", validateSchema(loginSchema), login);
// Registro 
authRouter.post("/registrarUsuario", validateSchema(createUserSchema) ,registrarUsuario);
// Recuperación de contraseña
authRouter.post("/contrasenia-olvidada", contraseñaOlvidada);
// Reenvío de confirmación
authRouter.post("/reenviar-confirmacion", reenviarConfirmacion);
// Confirmación de email
authRouter.get("/confirmar-cuenta", confirmarCuenta);
// Cambio de contraseña
authRouter.post("/cambiar-contrasenia", cambiarContrasenia);


export default authRouter;