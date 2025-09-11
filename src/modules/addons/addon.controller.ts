import type { Request, Response } from 'express';
import {
  createAddonService,
  deleteAddonService,
  getAddonByIdService,
  listAddonsService,
  updateAddonService,
} from './addon.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Funções genéricas de tratamento de erro
function handleError(res: Response, error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error);
  if (error instanceof Error) {
    if (error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('não encontrad')) {
      return res.status(404).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listAddonsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const addons = await listAddonsService(pousadaId, userId);
    return res.status(200).json(addons);
  } catch (error) {
    return handleError(res, error, 'listar addons');
  }
}

export async function getAddonByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { addonId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const addon = await getAddonByIdService(addonId, userId);
    return res.status(200).json(addon);
  } catch (error) {
    return handleError(res, error, 'buscar addon');
  }
}

export async function createAddonController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const addon = await createAddonService(req.body, pousadaId, userId);
    return res.status(201).json(addon);
  } catch (error) {
    return handleError(res, error, 'criar addon');
  }
}

export async function updateAddonController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { addonId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const addon = await updateAddonService(addonId, req.body, userId);
    return res.status(200).json(addon);
  } catch (error) {
    return handleError(res, error, 'atualizar addon');
  }
}

export async function deleteAddonController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { addonId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await deleteAddonService(addonId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar addon');
  }
}

