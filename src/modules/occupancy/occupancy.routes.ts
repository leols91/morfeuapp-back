import { Router } from 'express';
import { getOccupancyDataController } from './occupancy.controller.js';

const occupancyRoutes: Router = Router();

// Rota para buscar os dados de ocupação de uma pousada
occupancyRoutes.get(
  '/pousadas/:pousadaId/occupancy',
  getOccupancyDataController,
);

export { occupancyRoutes };
