import { Router } from 'express';
import {
  // --- CORREÇÃO AQUI ---
  listAllStockMovementsController, // Importa o novo nome
  listStockMovementsByProductController, // Importa o novo nome
  // --- FIM DA CORREÇÃO ---
  createStockMovementController,
  updateStockMovementController,
  deleteStockMovementController,
} from './stock-movement.controller.js';
// Importe seu middleware de autenticação (ex: checkAuth)
// import { checkAuth } from '../middleware/auth.middleware.js';

const router = Router();

// --- Rotas de Movimentação de Estoque ---
// Aplicar middleware de autenticação em todas as rotas
// router.use(checkAuth); // Descomente quando tiver o middleware

/**
 * GET /api/stock/pousada/:pousadaId
 * Lista todas as movimentações de uma pousada.
 * Query opcional: ?typeCode=in&produtoId=...
 */
router.get('/pousada/:pousadaId', listAllStockMovementsController); // Corrigido

/**
 * POST /api/stock/pousada/:pousadaId
 * Cria uma nova movimentação para uma pousada.
 */
router.post('/pousada/:pousadaId', createStockMovementController);

/**
 * GET /api/stock/product/:produtoId
 * Lista todas as movimentações de um produto específico.
 */
router.get('/product/:produtoId', listStockMovementsByProductController); // Corrigido

/**
 * PUT /api/stock/movement/:movementId
 * Atualiza uma movimentação específica.
 */
router.put('/movement/:movementId', updateStockMovementController);

/**
 * DELETE /api/stock/movement/:movementId
 * Deleta (soft delete) uma movimentação específica.
 */
router.delete('/movement/:movementId', deleteStockMovementController);


export { router as stockMovementRoutes };
