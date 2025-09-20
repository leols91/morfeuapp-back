import { Router } from 'express';
import * as folioController from './folio.controller.js';

const folioRoutes: Router = Router();

// Rota para buscar um Folio (e criá-lo se não existir) a partir de uma Reserva
folioRoutes.get(
  '/reservas/:reservaId/folio',
  folioController.getFolioByReservaIdController,
);

// Rota para adicionar um novo lançamento (despesa) a um Folio existente
folioRoutes.post(
  '/folios/:folioId/entries',
  folioController.addFolioEntryController,
);

// Rotas diretas para um lançamento específico
folioRoutes.patch(
  '/folio-entries/:entryId',
  folioController.updateFolioEntryController,
);
folioRoutes.delete(
  '/folio-entries/:entryId',
  folioController.deleteFolioEntryController,
);

export { folioRoutes };

