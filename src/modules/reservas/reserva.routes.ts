import { Router } from 'express';
import {
  createReservaController,
  deleteReservaController,
  getReservaByIdController,
  listReservasController,
  updateReservaController,
} from './reserva.controller.js';

const reservaRoutes: Router = Router();

// Rotas aninhadas sob Pousada
reservaRoutes.post('/pousadas/:pousadaId/reservas', createReservaController);
reservaRoutes.get('/pousadas/:pousadaId/reservas', listReservasController);

// Rotas diretas para uma Reserva específica
reservaRoutes.get('/reservas/:reservaId', getReservaByIdController);
reservaRoutes.patch('/reservas/:reservaId', updateReservaController);
reservaRoutes.delete('/reservas/:reservaId', deleteReservaController);

export { reservaRoutes };

