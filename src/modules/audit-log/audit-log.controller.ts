import type { Request, Response } from 'express';
import { listAuditLogsService } from './audit-log.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

function handleError(res: Response, error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error);
  if (error instanceof Error) {
    if (error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listAuditLogsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const logs = await listAuditLogsService(pousadaId, userId);
    return res.status(200).json(logs);
  } catch (error) {
    return handleError(res, error, 'listar logs de auditoria');
  }
}
