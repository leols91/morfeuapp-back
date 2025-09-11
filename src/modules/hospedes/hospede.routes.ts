import { Router } from 'express';
import {
  createHospedeController,
  deleteHospedeController,
  getHospedeByIdController,
  listHospedesController,
  updateHospedeController,
} from './hospede.controller.js';

const hospedeRoutes: Router = Router();

// Rotas aninhadas sob Pousada
hospedeRoutes.post('/pousadas/:pousadaId/hospedes', createHospedeController);
hospedeRoutes.get('/pousadas/:pousadaId/hospedes', listHospedesController);

// Rotas diretas para um Hóspede específico
hospedeRoutes.get('/hospedes/:hospedeId', getHospedeByIdController);
hospedeRoutes.patch('/hospedes/:hospedeId', updateHospedeController);
hospedeRoutes.delete('/hospedes/:hospedeId', deleteHospedeController);

export { hospedeRoutes };

