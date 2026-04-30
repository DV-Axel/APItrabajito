import { Router } from 'express';
import {registrarSponsor, reenviarConfirmacion,confirmarCuenta, contraseñaOlvidada} from '../controllers/sponsor.controller.js';
import {uploadSponsorFiles} from '../middlewares/files/uploadSponsorFiles.js';
import {} from "../controllers/auth.controller.js";

export const sponsorRouter = Router();

sponsorRouter.post('/registrar-sponsor', uploadSponsorFiles, registrarSponsor);
sponsorRouter.post('/reenviar-confirmacion',  reenviarConfirmacion);
sponsorRouter.get('/confirmar-cuenta', confirmarCuenta)
sponsorRouter.post('/contrasenia-olvidada',contraseñaOlvidada)
export default sponsorRouter