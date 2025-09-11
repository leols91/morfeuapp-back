import { Router } from 'express';
import {
  createRateRuleController,
  deleteRateRuleController,
  getRateRuleByIdController,
  listRateRulesController,
  updateRateRuleController,
} from './rate-rule.controller.js';

const rateRuleRoutes: Router = Router();

// Rotas aninhadas sob Planos de Tarifa
rateRuleRoutes.post('/rate-plans/:ratePlanId/rate-rules', createRateRuleController);
rateRuleRoutes.get('/rate-plans/:ratePlanId/rate-rules', listRateRulesController);

// Rotas diretas por ID da Regra de Tarifa
rateRuleRoutes.get('/rate-rules/:rateRuleId', getRateRuleByIdController);
rateRuleRoutes.patch('/rate-rules/:rateRuleId', updateRateRuleController);
rateRuleRoutes.delete('/rate-rules/:rateRuleId', deleteRateRuleController);

export { rateRuleRoutes };
