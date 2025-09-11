import type { Request, Response } from 'express';
import {
  createReservaService,
  deleteReservaService,
  getReservaByIdService,
  listReservasService,
  updateReservaService,
} from './reserva.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Função genérica para tratar erros e evitar repetição
function handleError(res: Response, error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error);
  if (error instanceof Error) {
    if (error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('não encontrad')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Conflito de datas')) {
      return res.status(409).json({ message: error.message }); // 409 Conflict
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listReservasController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const reservas = await listReservasService(pousadaId, userId);
    return res.status(200).json(reservas);
  } catch (error) {
    return handleError(res, error, 'listar reservas');
  }
}

export async function getReservaByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { reservaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const reserva = await getReservaByIdService(reservaId, userId);
    return res.status(200).json(reserva);
  } catch (error) {
    return handleError(res, error, 'buscar reserva');
  }
}

export async function createReservaController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const reserva = await createReservaService(req.body, pousadaId, userId);
    return res.status(201).json(reserva);
  } catch (error) {
    return handleError(res, error, 'criar reserva');
  }
}

export async function updateReservaController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { reservaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const reserva = await updateReservaService(reservaId, req.body, userId);
    return res.status(200).json(reserva);
  } catch (error) {
    return handleError(res, error, 'atualizar reserva');
  }
}

export async function deleteReservaController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { reservaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await deleteReservaService(reservaId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar reserva');
  }
}

