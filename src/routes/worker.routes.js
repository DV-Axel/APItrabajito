import { Router } from 'express';
import {uploadWorkerPhoto} from '../middlewares/images/uploadWorkerPhoto.js';
import {createWorker} from '../controllers/worker.controller.js';

export const workerRouter = Router();

workerRouter.post('/', uploadWorkerPhoto, createWorker);

export default workerRouter