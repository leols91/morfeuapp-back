import type { Request, Response } from 'express';
import * as userConfigService from './user-config.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

export async function listUserConfigsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const configs = await userConfigService.listUserConfigsService(userId);
    return res.status(200).json(configs);
  } catch (error) {
    console.error('Erro ao listar configs de usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function upsertUserConfigController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const config = await userConfigService.upsertUserConfigService(req.body, userId);
    return res.status(200).json(config);
  } catch (error) {
    console.error('Erro ao salvar config de usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

