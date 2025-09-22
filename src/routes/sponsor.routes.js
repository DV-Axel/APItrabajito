import { Router } from 'express';
import {createSponsor, getSponsorFromFormWorker} from '../controllers/sponsor.controller.js';
import {uploadSponsorFiles} from '../middlewares/files/uploadSponsorFiles.js';


export const sponsorRouter = Router();

sponsorRouter.post('/', uploadSponsorFiles, createSponsor);
sponsorRouter.post('/getSponsorFromFormWorker', getSponsorFromFormWorker)

export default sponsorRouter