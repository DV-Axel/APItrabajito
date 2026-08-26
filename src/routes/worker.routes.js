import {Router} from 'express';
import {uploadWorkerPhoto} from '../middlewares/images/uploadWorkerPhoto.js';
import {
    registrarWorker,
    traerPerfilWorker,
    actualizarPerfilWorker,
    traerTrabajosDisponibles,
    aplicarSolicitud,
    traerTrabajosPostulado,
} from '../controllers/worker.controller.js';

export const workerRouter = Router();

workerRouter.post("/registrar-worker", uploadWorkerPhoto, registrarWorker);
workerRouter.get("/perfil-worker/:id", traerPerfilWorker)
workerRouter.put("/actualizar-perfil", actualizarPerfilWorker)
workerRouter.get("/trabajos-disponibles", traerTrabajosDisponibles)
workerRouter.get("/trabajos-postulado", traerTrabajosPostulado)
workerRouter.post("/postularse-solicitud", aplicarSolicitud)


export default workerRouter;
