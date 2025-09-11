import type { Request, Response } from 'express';
import {
  createPousadaService,
  listPousadasForUserService,
  getPousadaByIdService,
  updatePousadaService,
} from './pousada.service.js';

// Interface para garantir que 'req.user' existe
interface AuthRequest extends Request {
  user?: { id: string };
}

export async function listPousadasController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const pousadas = await listPousadasForUserService(userId);
    return res.status(200).json(pousadas);
  } catch (error) {
    console.error('Erro ao listar pousadas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function getPousadaByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const pousada = await getPousadaByIdService(pousadaId, userId);
    return res.status(200).json(pousada);
  } catch (error) {
    console.error('Erro ao buscar pousada:', error);
    if (error instanceof Error) {
      if (error.message.includes('Acesso negado')) {
        return res.status(403).json({ message: error.message }); // Forbidden
      }
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message }); // Not Found
      }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function createPousadaController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const pousada = await createPousadaService(req.body, userId);
    return res.status(201).json(pousada);
  } catch (error) {
    console.error('Erro ao criar pousada:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function updatePousadaController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const pousada = await updatePousadaService(pousadaId, req.body, userId);
    return res.status(200).json(pousada);
  } catch (error) {
    console.error('Erro ao atualizar pousada:', error);
    if (error instanceof Error) {
      if (error.message.includes('Acesso negado')) {
        return res.status(403).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

