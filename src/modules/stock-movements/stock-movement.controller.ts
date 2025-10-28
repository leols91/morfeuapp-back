import type { Request, Response } from 'express';
import {
  createStockMovementService,
  deleteStockMovementService,
  listAllStockMovementsService, // Importado corretamente
  listStockMovementsByProductService, // Importado corretamente
  updateStockMovementService,
} from './stock-movement.service.js';

// Interface para garantir que req.user exista
interface AuthRequest extends Request {
  user?: { id: string };
}

// Sua função de helper para tratar erros (mantida)
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

/**
 * (NOVO) Lista TODAS as movimentações de uma pousada, com filtros.
 * Rota: GET /pousada/:pousadaId
 * Query Params: ?typeCode=in&produtoId=...
 */
export async function listAllStockMovementsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    
    // Pega os filtros da query string (ex: /url?typeCode=in&produtoId=abc)
    const filters = {
      typeCode: req.query.typeCode as string | undefined,
      produtoId: req.query.produtoId as string | undefined,
    };

    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });
    if (!pousadaId) return res.status(400).json({ message: 'ID da Pousada é obrigatório.' });

    const movements = await listAllStockMovementsService(pousadaId, userId, filters);
    return res.status(200).json(movements);
  } catch (error) {
    return handleError(res, error, 'listar todas as movimentações');
  }
}

/**
 * (NOVO - Antiga listStockMovementsController) 
 * Lista movimentações de um produto específico.
 * Rota: GET /product/:produtoId
 */
export async function listStockMovementsByProductController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { produtoId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });
    if (!produtoId) return res.status(400).json({ message: 'ID do Produto é obrigatório.' });

    // Corrigido para chamar o service correto
    const movements = await listStockMovementsByProductService(produtoId, userId);
    return res.status(200).json(movements);
  } catch (error) {
    return handleError(res, error, 'listar movimentações por produto');
  }
}

/**
 * Cria uma nova movimentação de estoque.
 * Rota: POST /pousada/:pousadaId
 */
export async function createStockMovementController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    // Validação básica do body (idealmente feita com Zod)
    const { productId, typeCode, quantity } = req.body;
    if (!productId || !typeCode || !quantity) {
      return res.status(400).json({ message: 'productId, typeCode e quantity são obrigatórios.'});
    }

    const movement = await createStockMovementService(req.body, pousadaId, userId);
    return res.status(201).json(movement);
  } catch (error) {
    return handleError(res, error, 'criar movimentação de estoque');
  }
}

/**
 * Atualiza uma movimentação (ex: corrigir nota ou quantidade).
 * Rota: PUT /movement/:movementId
 */
export async function updateStockMovementController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { movementId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });
    if (!movementId) return res.status(400).json({ message: 'ID da Movimentação é obrigatório.' });

    const movement = await updateStockMovementService(movementId, req.body, userId);
    return res.status(200).json(movement);
  } catch (error) {
    return handleError(res, error, 'atualizar movimentação de estoque');
  }
}

/**
 * Exclui (soft delete) uma movimentação.
 * Rota: DELETE /movement/:movementId
 */
export async function deleteStockMovementController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { movementId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });
    if (!movementId) return res.status(400).json({ message: 'ID da Movimentação é obrigatório.' });

    await deleteStockMovementService(movementId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar movimentação de estoque');
  }
}
