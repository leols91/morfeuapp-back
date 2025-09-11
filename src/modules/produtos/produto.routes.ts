import { Router } from 'express';
import * as produtoController from './produto.controller.js';

const produtoRoutes: Router = Router();

// Rotas aninhadas sob Pousada para criar e listar produtos
produtoRoutes.post(
  '/pousadas/:pousadaId/produtos',
  produtoController.createProdutoController,
);
produtoRoutes.get(
  '/pousadas/:pousadaId/produtos',
  produtoController.listProdutosController,
);

// Rotas diretas para um Produto específico
produtoRoutes.get(
  '/produtos/:produtoId',
  produtoController.getProdutoByIdController,
);
produtoRoutes.patch(
  '/produtos/:produtoId',
  produtoController.updateProdutoController,
);
produtoRoutes.delete(
  '/produtos/:produtoId',
  produtoController.deleteProdutoController,
);

export { produtoRoutes };

