import { Router } from 'express';
import {
  createQuartoController,
  deleteQuartoController,
  getQuartoByIdController,
  listQuartosController,
  updateQuartoController,
  addAmenityToQuartoController,
  removeAmenityFromQuartoController,
} from './quarto.controller.js';

const quartoRoutes: Router = Router();

// Rotas aninhadas sob Pousada
quartoRoutes.post('/pousadas/:pousadaId/quartos', createQuartoController);
quartoRoutes.get('/pousadas/:pousadaId/quartos', listQuartosController);

// Rotas diretas para um Quarto específico
quartoRoutes.get('/quartos/:quartoId', getQuartoByIdController);
quartoRoutes.patch('/quartos/:quartoId', updateQuartoController);
quartoRoutes.delete('/quartos/:quartoId', deleteQuartoController);

// --- NOVAS ROTAS ---
// Rotas para gerenciar Comodidades de um Quarto específico
quartoRoutes.post('/quartos/:quartoId/amenities', addAmenityToQuartoController);
quartoRoutes.delete(
  '/quartos/:quartoId/amenities/:amenityId',
  removeAmenityFromQuartoController,
);

export { quartoRoutes };

