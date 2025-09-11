import { Router } from "express";
import { createJobRequest } from "../controllers/job_request.controller.js";
import { uploadJobRequestPhotos } from '../middlewares/updateJobRequestPhotos.js';

export const jobRequestRouter = Router();


jobRequestRouter.post('/', uploadJobRequestPhotos.array('photos'), createJobRequest);