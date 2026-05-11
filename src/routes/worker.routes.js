import {Router} from 'express';
import {uploadWorkerPhoto} from '../middlewares/images/uploadWorkerPhoto.js';
import {
    registrarWorker
} from '../controllers/worker.controller.js';

export const workerRouter = Router();

workerRouter.post("/registrar-worker", uploadWorkerPhoto, registrarWorker);


export default workerRouter;
