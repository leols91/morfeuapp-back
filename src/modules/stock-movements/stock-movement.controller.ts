import type { Request, Response } from 'express';
import {
  createStockMovementService,
  deleteStockMovementService,
  listStockMovementsService,
  updateStockMovementService,
} from './stock-movement.service.js';

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
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listStockMovementsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { produtoId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const movements = await listStockMovementsService(produtoId, userId);
    return res.status(200).json(movements);
  } catch (error) {
    return handleError(res, error, 'listar movimentações de estoque');
  }
}

export async function createStockMovementController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const movement = await createStockMovementService(req.body, pousadaId, userId);
    return res.status(201).json(movement);
  } catch (error) {
    return handleError(res, error, 'criar movimentação de estoque');
  }
}

export async function updateStockMovementController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { movementId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const movement = await updateStockMovementService(movementId, req.body, userId);
    return res.status(200).json(movement);
  } catch (error) {
    return handleError(res, error, 'atualizar movimentação de estoque');
  }
}

export async function deleteStockMovementController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { movementId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await deleteStockMovementService(movementId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar movimentação de estoque');
  }
}

