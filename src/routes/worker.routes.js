import { Router } from 'express';
import { uploadProfilePictureWorkerMiddle } from '../middlewares/images/uploadWorkerPhoto.js';
import { createWorker, getServicesByCategory } from '../controllers/worker.controller.js';

export const workerRouter = Router();

workerRouter.post('/', uploadProfilePictureWorkerMiddle.single('photo'), createWorker);
workerRouter.post('/solicitudes-rubro/:id', getServicesByCategory);


export default workerRouter;
