import { Router } from 'express';
import * as categoryController from './product-category.controller.js';

const productCategoryRoutes: Router = Router();

// Rotas aninhadas sob Pousada para criar e listar categorias
productCategoryRoutes.post(
  '/pousadas/:pousadaId/product-categories',
  categoryController.createCategoryController,
);
productCategoryRoutes.get(
  '/pousadas/:pousadaId/product-categories',
  categoryController.listCategoriesController,
);

// Rotas diretas para uma Categoria específica para atualizar e deletar
productCategoryRoutes.patch(
  '/product-categories/:categoryId',
  categoryController.updateCategoryController,
);
productCategoryRoutes.delete(
  '/product-categories/:categoryId',
  categoryController.deleteCategoryController,
);

export { productCategoryRoutes };

