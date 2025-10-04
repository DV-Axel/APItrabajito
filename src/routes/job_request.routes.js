import { Router } from "express";
import {
    createJobRequest,
    getAllJobRequests,
    getJobRequestById,
    getJobRequestsByUserId,
    setPostulation
} from "../controllers/job_request.controller.js";
import { uploadJobRequestPhotos } from '../middlewares/images/updateJobRequestPhotos.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { idSchema } from '../middlewares/validations/user.validation.js';

export const jobRequestRouter = Router();


jobRequestRouter.post('/', uploadJobRequestPhotos.array('photos'), createJobRequest);
jobRequestRouter.get("/:id", validateSchema(idSchema, "params"), getJobRequestsByUserId);
jobRequestRouter.get("/detalle/:id", getJobRequestById);
jobRequestRouter.post("/postularse", setPostulation);


jobRequestRouter.get("/", getAllJobRequests); // Para verificar todos los jobRequest, SOLO PRUEBA
