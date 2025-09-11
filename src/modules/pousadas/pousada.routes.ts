import { Router } from 'express';
import {
  createPousadaController,
  listPousadasController,
  getPousadaByIdController,
  updatePousadaController,
} from './pousada.controller.js';

const pousadaRoutes: Router = Router();

// Rota para CRIAR uma pousada
pousadaRoutes.post('/pousadas', createPousadaController);

// Rota para LISTAR as pousadas do usuário logado
pousadaRoutes.get('/pousadas', listPousadasController);

// Rota para BUSCAR uma pousada específica pelo ID
pousadaRoutes.get('/pousadas/:pousadaId', getPousadaByIdController);

// Rota para ATUALIZAR uma pousada específica pelo ID
pousadaRoutes.patch('/pousadas/:pousadaId', updatePousadaController);

export { pousadaRoutes };

