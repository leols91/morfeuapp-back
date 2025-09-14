import { Router } from 'express';
import * as apInvoiceController from './ap-invoice.controller.js';

const apInvoiceRoutes: Router = Router();

// Rotas aninhadas sob Pousada
apInvoiceRoutes.post('/pousadas/:pousadaId/ap-invoices', apInvoiceController.createAPInvoiceController);
apInvoiceRoutes.get('/pousadas/:pousadaId/ap-invoices', apInvoiceController.listAPInvoicesController);

// Rotas diretas para uma Fatura
apInvoiceRoutes.delete('/ap-invoices/:apInvoiceId', apInvoiceController.deleteAPInvoiceController);

export { apInvoiceRoutes };
