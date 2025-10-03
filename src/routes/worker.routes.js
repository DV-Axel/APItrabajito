import { Router } from 'express';
import { uploadWorkerPhoto } from '../middlewares/images/uploadWorkerPhoto.js';
import { createWorker, getServicesByCategory } from '../controllers/worker.controller.js';

export const workerRouter = Router();

workerRouter.post('/', uploadWorkerPhoto, createWorker);
workerRouter.post('/solicitudes-rubro/:id', getServicesByCategory);

export default workerRouter;
