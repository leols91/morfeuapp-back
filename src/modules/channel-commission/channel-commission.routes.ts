import { Router } from 'express';
import { listChannelCommissionsController } from './channel-commission.controller.js';

const channelCommissionRoutes: Router = Router();

// Rota para listar as comissões provisionadas
channelCommissionRoutes.get(
  '/pousadas/:pousadaId/channel-commissions',
  listChannelCommissionsController,
);

export { channelCommissionRoutes };
