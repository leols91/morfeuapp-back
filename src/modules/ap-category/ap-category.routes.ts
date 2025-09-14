import { Router } from 'express';
import * as apCategoryController from './ap-category.controller.js';

const apCategoryRoutes: Router = Router();

// Rotas aninhadas sob Pousada
apCategoryRoutes.post('/pousadas/:pousadaId/ap-categories', apCategoryController.createAPCategoryController);
apCategoryRoutes.get('/pousadas/:pousadaId/ap-categories', apCategoryController.listAPCategoriesController);

// Rotas diretas para uma Categoria
apCategoryRoutes.patch('/ap-categories/:apCategoryId', apCategoryController.updateAPCategoryController);
apCategoryRoutes.delete('/ap-categories/:apCategoryId', apCategoryController.deleteAPCategoryController);

export { apCategoryRoutes };
