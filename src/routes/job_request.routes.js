import { Router } from "express";
import {
    cancelJobRequest,
    createJobRequest,
    getAllJobRequests,
    getJobRequestById,
<<<<<<< HEAD
    getJobRequestByServiceKey,
    getJobRequestByStatus,
    getJobRequestsByUserId,
    updateJobRequestStatus
=======
    getJobRequestsByUserId,
    setPostulation
>>>>>>> c1f2e689e45db5e41388365d4bea5bb1b64dc8ab
} from "../controllers/job_request.controller.js";
import { uploadJobRequestPhotos } from '../middlewares/images/updateJobRequestPhotos.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { idSchema, statusIdSchema } from '../middlewares/validations/user.validation.js';

export const jobRequestRouter = Router();


jobRequestRouter.post('/', uploadJobRequestPhotos.array('photos'), createJobRequest);
<<<<<<< HEAD

// Para verificar todos los jobRequest, SOLO PRUEBA
jobRequestRouter.get("/", getAllJobRequests);

jobRequestRouter.get("/detalle/:id", validateSchema(idSchema, "params"), getJobRequestById);
jobRequestRouter.get("/status/:statusId", validateSchema(statusIdSchema, "params"), getJobRequestByStatus);
jobRequestRouter.get("/serviceKey/:serviceKey", getJobRequestByServiceKey);

jobRequestRouter.put("/status/:id", updateJobRequestStatus);
jobRequestRouter.put("/cancel/:id", cancelJobRequest);

jobRequestRouter.get("/:id", validateSchema(idSchema, "params"), getJobRequestsByUserId);
=======
jobRequestRouter.get("/:id", validateSchema(idSchema, "params"), getJobRequestsByUserId);
jobRequestRouter.get("/detalle/:id", getJobRequestById);
jobRequestRouter.post("/postularse", setPostulation);


jobRequestRouter.get("/", getAllJobRequests); // Para verificar todos los jobRequest, SOLO PRUEBA
>>>>>>> c1f2e689e45db5e41388365d4bea5bb1b64dc8ab
