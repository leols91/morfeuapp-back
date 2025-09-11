import { Router } from 'express';
import {
  createCamaController,
  getCamaByIdController,
  listCamasController,
  updateCamaController,
} from './cama.controller.js';

const camaRoutes: Router = Router();

// --- Rotas aninhadas sob Quarto (para criação e listagem) ---
// Ex: GET /api/quartos/uuid-do-quarto/camas
camaRoutes.get('/quartos/:quartoId/camas', listCamasController);
camaRoutes.post('/quartos/:quartoId/camas', createCamaController);

// --- Rotas diretas para Cama (para busca por ID e update) ---
// Ex: GET /api/camas/uuid-da-cama
camaRoutes.get('/camas/:camaId', getCamaByIdController);
camaRoutes.patch('/camas/:camaId', updateCamaController);

export { camaRoutes };

