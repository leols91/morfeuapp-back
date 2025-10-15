import { Router } from 'express';
import {
  createRoomTypeController,
  deleteRoomTypeController,
  getRoomTypeByIdController,
  listRoomTypesController,
  updateRoomTypeController,
  addAmenityToRoomTypeController,
  removeAmenityFromRoomTypeController,
} from './room-type.controller.js';

const roomTypeRoutes: Router = Router();

// Rotas aninhadas sob Pousada
roomTypeRoutes.post('/pousadas/:pousadaId/room-types', createRoomTypeController);
roomTypeRoutes.get('/pousadas/:pousadaId/room-types', listRoomTypesController);

// Rotas diretas para um Tipo de Quarto
roomTypeRoutes.get('/room-types/:roomTypeId', getRoomTypeByIdController);
roomTypeRoutes.patch('/room-types/:roomTypeId', updateRoomTypeController);
roomTypeRoutes.delete('/room-types/:roomTypeId', deleteRoomTypeController);

// Rotas para gerenciar Comodidades de um Tipo de Quarto
roomTypeRoutes.post('/room-types/:roomTypeId/amenities', addAmenityToRoomTypeController);
roomTypeRoutes.delete('/room-types/:roomTypeId/amenities/:amenityId', removeAmenityFromRoomTypeController);

export { roomTypeRoutes };

