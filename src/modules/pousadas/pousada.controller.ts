import type { Request, Response } from 'express';
import { createPousadaService, listPousadasForUserService } from './pousada.service.js';

// Interface para garantir que 'req.user' existe após o middleware de autenticação
interface AuthRequest extends Request {
  user?: { id: string };
}

/**
 * Controlador para listar as pousadas do usuário autenticado.
 */
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

/**
 * Controlador para criar uma nova pousada.
 */
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

