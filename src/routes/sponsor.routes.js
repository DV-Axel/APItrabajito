import { Router } from 'express';
import {registrarSponsor} from '../controllers/sponsor.controller.js';
import {uploadSponsorFiles} from '../middlewares/files/uploadSponsorFiles.js';


export const sponsorRouter = Router();

sponsorRouter.post('/registrar-sponsor', uploadSponsorFiles, registrarSponsor);

export default sponsorRouter