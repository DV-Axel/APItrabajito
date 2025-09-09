import { Router } from "express";
import { createJobRequest } from "../controllers/job_request.controller.js";

export const jobRequestRouter = Router();

jobRequestRouter.post('/', createJobRequest);