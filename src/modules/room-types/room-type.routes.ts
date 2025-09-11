import { Router } from 'express';
import {
  createRoomTypeController,
  listRoomTypesController,
  getRoomTypeByIdController,
  updateRoomTypeController,
} from './room-type.controller.js';

const roomTypeRoutes: Router = Router();

// --- Rotas aninhadas sob Pousada (para criação e listagem) ---
// Ex: GET /api/pousadas/uuid-da-pousada/room-types
roomTypeRoutes.get('/pousadas/:pousadaId/room-types', listRoomTypesController);
roomTypeRoutes.post('/pousadas/:pousadaId/room-types', createRoomTypeController);


// --- Rotas diretas para RoomType (para get by ID e update) ---
// Ex: GET /api/room-types/uuid-do-tipo-de-quarto
roomTypeRoutes.get('/room-types/:roomTypeId', getRoomTypeByIdController);
roomTypeRoutes.patch('/room-types/:roomTypeId', updateRoomTypeController);


export { roomTypeRoutes };

