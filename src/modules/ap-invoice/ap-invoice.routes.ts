import { Router } from 'express';
import {
  createAPInvoiceController,
  deleteAPInvoiceController,
  listAPInvoicesController,
} from './ap-invoice.controller.js';

const apInvoiceRoutes: Router = Router();

// Rotas aninhadas sob Pousada para criar e listar faturas
apInvoiceRoutes.post(
  '/pousadas/:pousadaId/ap-invoices',
  createAPInvoiceController,
);
apInvoiceRoutes.get(
  '/pousadas/:pousadaId/ap-invoices',
  listAPInvoicesController,
);

// Rota direta para deletar uma Fatura específica
apInvoiceRoutes.delete(
  '/ap-invoices/:apInvoiceId',
  deleteAPInvoiceController,
);

export { apInvoiceRoutes };

