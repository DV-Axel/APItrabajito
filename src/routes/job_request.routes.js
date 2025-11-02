import { Router } from "express";
import {
    createJobRequest,
    getAllJobRequests,
    getJobRequestById,
    getJobRequestsByUserId,
    setPostulation,
    checkPostulation,
    getAplicationsByJobRequestId,
    getAplicationById,
    setMutualAgreement,
    setCancelMutualAgreement

} from "../controllers/job_request.controller.js";
import { uploadJobRequestPhotos } from '../middlewares/images/updateJobRequestPhotos.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { idSchema, statusIdSchema } from '../middlewares/validations/user.validation.js';

export const jobRequestRouter = Router();


jobRequestRouter.post('/', uploadJobRequestPhotos.array('photos'), createJobRequest);
jobRequestRouter.get('/check-postulacion', checkPostulation);
jobRequestRouter.get("/detalle/:id", getJobRequestById); // Detalle de una solicitud de servicio
jobRequestRouter.post("/postularse", setPostulation);
jobRequestRouter.get("/postulaciones-workers/:id", getAplicationsByJobRequestId); // Obtener las postulaciones de una solicitud de servicio
jobRequestRouter.get("/postulacion-worker/:id", getAplicationById); // Obtener una postulacion por su id
jobRequestRouter.put("/acuerdo-mutuo/:id", setMutualAgreement); //Evalua la entidad que acepta el acuerdo y pone true la columna de agreement
jobRequestRouter.put("/cancelar-acuerdo-mutuo/:id", setCancelMutualAgreement); //Evalua la entidad que acepta el acuerdo y pone true la columna de agreement
jobRequestRouter.get("/:id", validateSchema(idSchema, "params"), getJobRequestsByUserId);



jobRequestRouter.get("/", getAllJobRequests); // Para verificar todos los jobRequest, SOLO PRUEBA
