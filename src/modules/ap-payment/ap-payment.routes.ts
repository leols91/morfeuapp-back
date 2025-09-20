import { Router } from 'express';
import * as apPaymentController from './ap-payment.controller.js';

const apPaymentRoutes: Router = Router();

// Rota aninhada para criar um pagamento para uma fatura específica
apPaymentRoutes.post('/ap-invoices/:apInvoiceId/payments', apPaymentController.createAPPaymentController);

export { apPaymentRoutes };

