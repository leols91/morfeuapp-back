import { Router } from 'express';
import { getDailyRevenueReportController } from './report.controller.js';

const reportRoutes: Router = Router();

// Rota para buscar o relatório de receita diária
reportRoutes.get(
  '/pousadas/:pousadaId/reports/daily-revenue',
  getDailyRevenueReportController,
);

export { reportRoutes };

