import { Router } from 'express';
import * as pousadaConfigController from './pousada-config.controller.js';

const pousadaConfigRoutes: Router = Router();

pousadaConfigRoutes.get(
  '/pousadas/:pousadaId/configs',
  pousadaConfigController.listPousadaConfigsController,
);
pousadaConfigRoutes.post(
  '/pousadas/:pousadaId/configs',
  pousadaConfigController.upsertPousadaConfigController,
);

export { pousadaConfigRoutes };

