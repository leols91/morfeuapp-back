import { Router } from 'express';
import {
  createChildPolicyController,
  deleteChildPolicyController,
  getChildPolicyByIdController,
  listChildPoliciesController,
  updateChildPolicyController,
} from './child-pricing-policy.controller.js';

const childPolicyRoutes: Router = Router();

// Rotas aninhadas sob Pousadas
childPolicyRoutes.post('/pousadas/:pousadaId/child-policies', createChildPolicyController);
childPolicyRoutes.get('/pousadas/:pousadaId/child-policies', listChildPoliciesController);

// Rotas diretas por ID da Política
childPolicyRoutes.get('/child-policies/:policyId', getChildPolicyByIdController);
childPolicyRoutes.patch('/child-policies/:policyId', updateChildPolicyController);
childPolicyRoutes.delete('/child-policies/:policyId', deleteChildPolicyController);

export { childPolicyRoutes };
