import { Router } from "express";
import { getAll } from "../controllers/category.controller.js";


export const categoryRouter = Router();

categoryRouter.get('/', getAll);

export default categoryRouter;