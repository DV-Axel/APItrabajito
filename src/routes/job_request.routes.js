import { Router } from "express";
import {
    cancelJobRequest,
    createJobRequest,
    getAllJobRequests,
    getJobRequestById,
    getJobRequestByServiceKey,
    getJobRequestByStatus,
    getJobRequestsByUserId,
    updateJobRequestStatus
} from "../controllers/job_request.controller.js";
import { uploadJobRequestPhotos } from '../middlewares/images/updateJobRequestPhotos.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { idSchema, statusIdSchema } from '../middlewares/validations/user.validation.js';

export const jobRequestRouter = Router();


jobRequestRouter.post('/', uploadJobRequestPhotos.array('photos'), createJobRequest);

// Para verificar todos los jobRequest, SOLO PRUEBA
jobRequestRouter.get("/", getAllJobRequests);

jobRequestRouter.get("/detalle/:id", validateSchema(idSchema, "params"), getJobRequestById);
jobRequestRouter.get("/status/:statusId", validateSchema(statusIdSchema, "params"), getJobRequestByStatus);
jobRequestRouter.get("/serviceKey/:serviceKey", getJobRequestByServiceKey);

jobRequestRouter.put("/status/:id", updateJobRequestStatus);
jobRequestRouter.put("/cancel/:id", cancelJobRequest);

jobRequestRouter.get("/:id", validateSchema(idSchema, "params"), getJobRequestsByUserId);