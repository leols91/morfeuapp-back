import { Router } from 'express';
import {
  createStockMovementController,
  deleteStockMovementController,
  listStockMovementsController,
  updateStockMovementController,
} from './stock-movement.controller.js';

const stockMovementRoutes: Router = Router();

// Rota para criar uma nova movimentação, aninhada sob Pousada
stockMovementRoutes.post(
  '/pousadas/:pousadaId/stock-movements',
  createStockMovementController,
);

// Rota para listar as movimentações de um produto específico
stockMovementRoutes.get(
  '/produtos/:produtoId/stock-movements',
  listStockMovementsController,
);

// Rotas diretas para uma movimentação específica
stockMovementRoutes.patch(
  '/stock-movements/:movementId',
  updateStockMovementController,
);
stockMovementRoutes.delete(
  '/stock-movements/:movementId',
  deleteStockMovementController,
);

export { stockMovementRoutes };

