import { Router } from 'express';
import {
  createQuartoController,
  listQuartosController,
  getQuartoByIdController,
  updateQuartoController,
} from './quarto.controller.js';

const quartoRoutes: Router = Router();

// --- Rotas aninhadas sob Pousada ---
// Ex: GET /api/pousadas/uuid-da-pousada/quartos
quartoRoutes.get('/pousadas/:pousadaId/quartos', listQuartosController);
quartoRoutes.post('/pousadas/:pousadaId/quartos', createQuartoController);

// --- Rotas diretas para Quarto ---
// Ex: GET /api/quartos/uuid-do-quarto
quartoRoutes.get('/quartos/:quartoId', getQuartoByIdController);
quartoRoutes.patch('/quartos/:quartoId', updateQuartoController);

export { quartoRoutes };

