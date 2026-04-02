import { Router } from "express";
import { cargarFotosServicios } from '../middlewares/files/cargarFotosServicios.js';
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
    setCancelMutualAgreement,
    updateApplicationBudget,
    updateDateJobRequest,
    setFinalBudget,
    setConfirmJobRequestFinalized,
    setRateService,
    setChangeMethodPayment,
    getServicios,
    getPreguntasSerivicio,
    setPublicarServicio

} from "../controllers/job_request.controller.js";
import { uploadJobRequestPhotos } from '../middlewares/images/updateJobRequestPhotos.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { idSchema, statusIdSchema } from '../middlewares/validations/user.validation.js';

export const jobRequestRouter = Router();

//Rutas nuevas
jobRequestRouter.get("/servicios", getServicios); // Obtener todos los servicios disponibles para crear una solicitud de servicio
jobRequestRouter.get("/traer-preguntas/:id", getPreguntasSerivicio); // Obtener todos los servicios disponibles para crear una solicitud de servicio
jobRequestRouter.post("/publicar-servicio", cargarFotosServicios.array('fotos') ,setPublicarServicio); // Obtener todos los servicios disponibles para crear una solicitud de servicio





//rutas viejas
jobRequestRouter.post('/', uploadJobRequestPhotos.array('photos'), createJobRequest);
jobRequestRouter.get('/check-postulacion', checkPostulation);
jobRequestRouter.get("/detalle/:id", getJobRequestById); // Detalle de una solicitud de servicio
jobRequestRouter.post("/postularse", setPostulation);
jobRequestRouter.get("/postulaciones-workers/:id", getAplicationsByJobRequestId); // Obtener las postulaciones de una solicitud de servicio
jobRequestRouter.get("/postulacion-worker/:id", getAplicationById); // Obtener una postulacion por su id
jobRequestRouter.put("/acuerdo-mutuo/:id", setMutualAgreement); //Evalua la entidad que acepta el acuerdo y pone true la columna de agreement
jobRequestRouter.put("/cancelar-acuerdo-mutuo/:id", setCancelMutualAgreement); //Evalua la entidad que acepta el acuerdo y pone true la columna de agreement
jobRequestRouter.put("/cambiar-presupuesto-postulacion/:id", updateApplicationBudget);
jobRequestRouter.put("/cambiar-fecha-servicio/:id", updateDateJobRequest);
jobRequestRouter.put("/establecer-presupuesto-final/:id", setFinalBudget);
jobRequestRouter.put("/confirmar-servicio-finalizado/:id", setConfirmJobRequestFinalized);
jobRequestRouter.post("/calificar-servicio/:id", setRateService);
jobRequestRouter.put("/cambiar-metodo-pago/:id", setChangeMethodPayment);


jobRequestRouter.get("/:id", validateSchema(idSchema, "params"), getJobRequestsByUserId);


jobRequestRouter.get("/", getAllJobRequests); // Para verificar todos los jobRequest, SOLO PRUEBA
