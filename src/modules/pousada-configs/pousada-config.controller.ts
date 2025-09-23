import type { Request, Response } from 'express';
import * as pousadaConfigService from './pousada-config.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

function handleError(res: Response, error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error);
  if (error instanceof Error && error.message.includes('Acesso negado')) {
    return res.status(403).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listPousadaConfigsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const configs = await pousadaConfigService.listPousadaConfigsService(pousadaId, userId);
    return res.status(200).json(configs);
  } catch (error) {
    return handleError(res, error, 'listar configs da pousada');
  }
}

export async function upsertPousadaConfigController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const config = await pousadaConfigService.upsertPousadaConfigService(req.body, pousadaId, userId);
    return res.status(200).json(config);
  } catch (error) {
    return handleError(res, error, 'salvar config da pousada');
  }
}

