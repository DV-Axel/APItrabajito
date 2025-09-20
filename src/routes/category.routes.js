import { Router } from "express";
import { getAllCategories, getCategoriesByIds, getCategoryById } from "../controllers/category.controller.js";
import { validateSchema } from "../middlewares/validations/validateSchema.js";
import { idSchema } from "../middlewares/validations/user.validation.js";


export const categoryRouter = Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/by-ids', getCategoriesByIds);
categoryRouter.get('/:id', validateSchema(idSchema, "params"), getCategoryById);

export default categoryRouter;