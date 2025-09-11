import { Router } from 'express';
import {
  createAddonController,
  deleteAddonController,
  getAddonByIdController,
  listAddonsController,
  updateAddonController,
} from './addon.controller.js';

const addonRoutes: Router = Router();

// Rotas aninhadas sob Pousada
addonRoutes.post('/pousadas/:pousadaId/addons', createAddonController);
addonRoutes.get('/pousadas/:pousadaId/addons', listAddonsController);

// Rotas diretas para um Addon específico
addonRoutes.get('/addons/:addonId', getAddonByIdController);
addonRoutes.patch('/addons/:addonId', updateAddonController);
addonRoutes.delete('/addons/:addonId', deleteAddonController);

export { addonRoutes };

