import { Router } from 'express';
import { uploadWorkerPhoto } from '../middlewares/images/uploadWorkerPhoto.js';
import { createWorker, getServicesByCategory, getWorkerById, getApplicationsByWorkerId } from '../controllers/worker.controller.js';

export const workerRouter = Router();

workerRouter.post('/', uploadWorkerPhoto, createWorker);
workerRouter.post('/solicitudes-rubro/:id', getServicesByCategory);
workerRouter.get('/traer-worker/:id', getWorkerById);
workerRouter.get('/postulaciones-idWorker/:id', getApplicationsByWorkerId); //Trae los trabajos a los que se postulo el worker


export default workerRouter;
