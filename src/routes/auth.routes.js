// javascript
import {Router} from 'express';
import {
    registrarUsuario,
    login,
    confirmarCuenta,
    contraseñaOlvidada,
    cambiarContrasenia,
    reenviarConfirmacion,
    extraerDatosUsuario,
    authGoogle
} from "../controllers/auth.controller.js";
import {validateSchema} from "../middlewares/validations/validateSchema.js";
import {createUserSchema, loginSchema} from "../middlewares/validations/user.validation.js";
import {uploadProfilePictureMiddle} from "../middlewares/images/updateProfilePictureMiddle.js";

export const authRouter = Router();

// Login
authRouter.post("/login", validateSchema(loginSchema), login);

// Registro 
authRouter.post(
    "/registrarUsuario",
    uploadProfilePictureMiddle.single("fotoPerfilUsuario"),
    validateSchema(createUserSchema),
    registrarUsuario
);

authRouter.post("/contrasenia-olvidada", contraseñaOlvidada); // Recuperación de contraseña
authRouter.post("/reenviar-confirmacion", reenviarConfirmacion); // Reenvío de confirmación
authRouter.get("/confirmar-cuenta", confirmarCuenta); // Confirmación de email
authRouter.post("/cambiar-contrasenia", cambiarContrasenia); // Cambio de contraseña
authRouter.post("/provider/google", authGoogle); //auth con providers


//Cookie
authRouter.get('/me', extraerDatosUsuario)


export default authRouter;
