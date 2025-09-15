import { Router } from "express";
import { createJobRequest, getAllJobRequests, getJobRequestsByUserId } from "../controllers/job_request.controller.js";
import { uploadJobRequestPhotos } from '../middlewares/images/updateJobRequestPhotos.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { userIdSchema } from '../validations/user.validation.js';

export const jobRequestRouter = Router();


jobRequestRouter.post('/', uploadJobRequestPhotos.array('photos'), createJobRequest);
// Para verificar todos los jobRequest, SOLO PRUEBA
jobRequestRouter.get("/", getAllJobRequests);

jobRequestRouter.get("/:id", validateSchema(userIdSchema, "params"), getJobRequestsByUserId);