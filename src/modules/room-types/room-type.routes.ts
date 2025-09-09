import { Router } from 'express';
import { createRoomTypeController } from './room-type.controller.js';

const roomTypeRoutes: Router = Router();

// A rota é aninhada sob /pousadas/:pousadaId
// Ex: POST /api/pousadas/uuid-da-pousada/room-types
roomTypeRoutes.post('/pousadas/:pousadaId/room-types', createRoomTypeController);

export { roomTypeRoutes };
