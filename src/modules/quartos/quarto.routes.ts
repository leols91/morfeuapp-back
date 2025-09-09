import { Router } from 'express';
import {
  createQuartoController,
  listQuartosController,
} from './quarto.controller.js';

const quartoRoutes: Router = Router();

// Rota para CRIAR um novo quarto em uma pousada
quartoRoutes.post('/pousadas/:pousadaId/quartos', createQuartoController);

// Rota para LISTAR todos os quartos de uma pousada
quartoRoutes.get('/pousadas/:pousadaId/quartos', listQuartosController);

export { quartoRoutes };

