import { Router } from 'express';
import {createSponsor} from '../controllers/sponsor.controller.js';
import {uploadSponsorFiles} from '../middlewares/files/uploadSponsorFiles.js';


export const sponsorRouter = Router();

sponsorRouter.post('/', uploadSponsorFiles, createSponsor);

export default sponsorRouter