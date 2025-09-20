import { Router } from 'express';
import {
  getDailyRevenueReportController,
  getStockBalanceReportController,
} from './report.controller.js';

const reportRoutes: Router = Router();

// Rota para buscar o relatório de receita diária
reportRoutes.get(
  '/pousadas/:pousadaId/reports/daily-revenue',
  getDailyRevenueReportController,
);

// Rota para buscar o relatório de saldo de estoque
reportRoutes.get(
  '/pousadas/:pousadaId/reports/stock-balance',
  getStockBalanceReportController,
);

export { reportRoutes };

