import { Router } from 'express';
import { uploadWorkerPhoto } from '../middlewares/images/uploadWorkerPhoto.js';
import {
    createWorker,
    getServicesByCategory,
    getWorkerById,
    getJobRequestsAppliedByWorkerId,
    registrarWorker
} from '../controllers/worker.controller.js';

export const workerRouter = Router();

workerRouter.post("/registrar-worker", uploadWorkerPhoto, registrarWorker);









//RUTAS VIEJAS
workerRouter.post('/', uploadWorkerPhoto, createWorker);
workerRouter.post('/solicitudes-rubro/:id', getServicesByCategory);
workerRouter.get('/traer-worker/:id', getWorkerById);
workerRouter.get('/postulaciones-idWorker/:id', getJobRequestsAppliedByWorkerId); //Trae los trabajos a los que se postulo el worker


export default workerRouter;
