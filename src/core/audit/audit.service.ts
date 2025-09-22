import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma.js';

interface AuditLogData {
  pousadaId?: string;
  usuarioId?: string;
  entity: string;
  entityId?: string;
  action: 'create' | 'update' | 'delete';
  diff?: any;
}

// Esta função será chamada internamente por outros serviços.
// Ela pode receber um cliente de transação (tx) para rodar dentro de uma transação existente.
export async function createAuditLog(
  data: AuditLogData,
  tx?: Prisma.TransactionClient,
) {
  const db = tx || prisma;

  return db.auditLog.create({
    data: {
      pousadaId: data.pousadaId,
      usuarioId: data.usuarioId,
      entity: data.entity,
      entityId: data.entityId,
      action: data.action,
      diff: data.diff,
    },
  });
}
