import { Router } from 'express';
import * as cashAccountController from './cash-account.controller.js';

const cashAccountRoutes: Router = Router();

// Rotas aninhadas sob Pousada
cashAccountRoutes.post('/pousadas/:pousadaId/cash-accounts', cashAccountController.createCashAccountController);
cashAccountRoutes.get('/pousadas/:pousadaId/cash-accounts', cashAccountController.listCashAccountsController);

// Rotas diretas para uma Conta
cashAccountRoutes.patch('/cash-accounts/:accountId', cashAccountController.updateCashAccountController);
cashAccountRoutes.delete('/cash-accounts/:accountId', cashAccountController.deleteCashAccountController);

export { cashAccountRoutes };

