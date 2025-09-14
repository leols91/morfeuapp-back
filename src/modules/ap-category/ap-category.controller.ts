import type { Request, Response } from 'express';
import * as apCategoryService from './ap-category.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

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

export async function listAPCategoriesController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const categories = await apCategoryService.listAPCategoriesService(pousadaId, userId);
    return res.status(200).json(categories);
  } catch (error) {
    return handleError(res, error, 'listar categorias de despesa');
  }
}

export async function createAPCategoryController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const category = await apCategoryService.createAPCategoryService(req.body, pousadaId, userId);
    return res.status(201).json(category);
  } catch (error) {
    return handleError(res, error, 'criar categoria de despesa');
  }
}

export async function updateAPCategoryController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { apCategoryId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const category = await apCategoryService.updateAPCategoryService(apCategoryId, req.body, userId);
    return res.status(200).json(category);
  } catch (error) {
    return handleError(res, error, 'atualizar categoria de despesa');
  }
}

export async function deleteAPCategoryController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { apCategoryId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await apCategoryService.deleteAPCategoryService(apCategoryId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar categoria de despesa');
  }
}
