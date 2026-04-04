// src/routes/job_request.routes.js
import { Router } from 'express';
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
    setPublicarServicio,
    getSolcitudesByUsuarioId,
    getSolicitudBySolcitudId,
    setCancelarSolicitud
} from '../controllers/job_request.controller.js';
import { uploadJobRequestPhotos } from '../middlewares/images/updateJobRequestPhotos.js';
import { validateSchema } from '../middlewares/validations/validateSchema.js';
import { idSchema } from '../middlewares/validations/user.validation.js';

export const jobRequestRouter = Router();

// Rutas nuevas
jobRequestRouter.get('/servicios', getServicios);
jobRequestRouter.get('/traer-preguntas/:id', getPreguntasSerivicio);
jobRequestRouter.post('/publicar-servicio', cargarFotosServicios.array('fotos'), setPublicarServicio);
jobRequestRouter.get('/solicitudes-usuario/:id', getSolcitudesByUsuarioId);
jobRequestRouter.get('/detalle/:id', getSolicitudBySolcitudId);
jobRequestRouter.post('/cancelar-solicitud/:id', setCancelarSolicitud);









// Rutas viejas
jobRequestRouter.post('/', uploadJobRequestPhotos.array('photos'), createJobRequest);
jobRequestRouter.get('/check-postulacion', checkPostulation);
// \*\*OJO\*\*: cambiamos la ruta vieja de detalle para que no choque
jobRequestRouter.get('/detalle-job-request/:id', getJobRequestById);
jobRequestRouter.post('/postularse', setPostulation);
jobRequestRouter.get('/postulaciones-workers/:id', getAplicationsByJobRequestId);
jobRequestRouter.get('/postulacion-worker/:id', getAplicationById);
jobRequestRouter.put('/acuerdo-mutuo/:id', setMutualAgreement);
jobRequestRouter.put('/cancelar-acuerdo-mutuo/:id', setCancelMutualAgreement);
jobRequestRouter.put('/cambiar-presupuesto-postulacion/:id', updateApplicationBudget);
jobRequestRouter.put('/cambiar-fecha-servicio/:id', updateDateJobRequest);
jobRequestRouter.put('/establecer-presupuesto-final/:id', setFinalBudget);
jobRequestRouter.put('/confirmar-servicio-finalizado/:id', setConfirmJobRequestFinalized);
jobRequestRouter.post('/calificar-servicio/:id', setRateService);
jobRequestRouter.put('/cambiar-metodo-pago/:id', setChangeMethodPayment);

jobRequestRouter.get('/:id', validateSchema(idSchema, 'params'), getJobRequestsByUserId);

jobRequestRouter.get('/', getAllJobRequests);