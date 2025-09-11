import { Router } from 'express';
import {
  createRatePlanController,
  deleteRatePlanController,
  getRatePlanByIdController,
  listRatePlansController,
  updateRatePlanController,
} from './rate-plan.controller.js';

const ratePlanRoutes: Router = Router();

// Rotas aninhadas sob Pousada
ratePlanRoutes.post('/pousadas/:pousadaId/rate-plans', createRatePlanController);
ratePlanRoutes.get('/pousadas/:pousadaId/rate-plans', listRatePlansController);

// Rotas diretas por ID do RatePlan
ratePlanRoutes.get('/rate-plans/:ratePlanId', getRatePlanByIdController);
ratePlanRoutes.patch('/rate-plans/:ratePlanId', updateRatePlanController);
ratePlanRoutes.delete('/rate-plans/:ratePlanId', deleteRatePlanController);

export { ratePlanRoutes };

