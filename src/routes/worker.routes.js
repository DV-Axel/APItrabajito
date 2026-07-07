import {Router} from 'express';
import {uploadWorkerPhoto} from '../middlewares/images/uploadWorkerPhoto.js';
import {
    registrarWorker,
    traerPerfilWorker
} from '../controllers/worker.controller.js';

export const workerRouter = Router();

workerRouter.post("/registrar-worker", uploadWorkerPhoto, registrarWorker);
workerRouter.get("/perfil-worker/:id", traerPerfilWorker)


export default workerRouter;
