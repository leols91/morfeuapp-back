import { Router } from 'express';
import { createPousadaController, listPousadasController } from './pousada.controller.js';

const pousadaRoutes: Router = Router();

// Rota para CRIAR uma pousada
// POST /api/pousadas
pousadaRoutes.post('/pousadas', createPousadaController);

// Rota para LISTAR as pousadas do usuário logado
// GET /api/pousadas
pousadaRoutes.get('/pousadas', listPousadasController);

export { pousadaRoutes };

