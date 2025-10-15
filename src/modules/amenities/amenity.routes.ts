import { Router } from 'express';
import * as amenityController from './amenity.controller.js';

const amenityRoutes: Router = Router();

// Rotas aninhadas sob Pousada
amenityRoutes.post('/pousadas/:pousadaId/amenities', amenityController.createAmenityController);
amenityRoutes.get('/pousadas/:pousadaId/amenities', amenityController.listAmenitiesController);

// Rotas diretas para uma Comodidade
amenityRoutes.patch('/amenities/:amenityId', amenityController.updateAmenityController);
amenityRoutes.delete('/amenities/:amenityId', amenityController.deleteAmenityController);

export { amenityRoutes };
