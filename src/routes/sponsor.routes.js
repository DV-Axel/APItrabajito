import { Router } from 'express';
import {registrarSponsor, reenviarConfirmacion,confirmarCuenta} from '../controllers/sponsor.controller.js';
import {uploadSponsorFiles} from '../middlewares/files/uploadSponsorFiles.js';


export const sponsorRouter = Router();

sponsorRouter.post('/registrar-sponsor', uploadSponsorFiles, registrarSponsor);
sponsorRouter.post('/reenviar-confirmacion',  reenviarConfirmacion);
sponsorRouter.get('/confirmar-cuenta', confirmarCuenta)

export default sponsorRouter