import { Router } from 'express';
import { listAuditLogsController } from './audit-log.controller.js';

const auditLogRoutes: Router = Router();

// Rota para listar os logs de auditoria de uma pousada
auditLogRoutes.get(
  '/pousadas/:pousadaId/audit-logs',
  listAuditLogsController,
);

export { auditLogRoutes };
