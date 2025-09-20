import { Router } from 'express';
import * as paymentController from './payment.controller.js';

const paymentRoutes: Router = Router();

// Rotas aninhadas sob Folio
paymentRoutes.post('/folios/:folioId/payments', paymentController.createPaymentController);
paymentRoutes.get('/folios/:folioId/payments', paymentController.listPaymentsController);

// Rota direta para deletar um pagamento específico
paymentRoutes.delete('/payments/:paymentId', paymentController.deletePaymentController);

export { paymentRoutes };
