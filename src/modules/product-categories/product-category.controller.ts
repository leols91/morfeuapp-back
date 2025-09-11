import type { Request, Response } from 'express';
import * as categoryService from './product-category.service.js';

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

export async function listCategoriesController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const categories = await categoryService.listCategoriesService(pousadaId, userId);
    return res.status(200).json(categories);
  } catch (error) {
    return handleError(res, error, 'listar categorias');
  }
}

export async function createCategoryController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const category = await categoryService.createCategoryService(req.body, pousadaId, userId);
    return res.status(201).json(category);
  } catch (error) {
    return handleError(res, error, 'criar categoria');
  }
}

export async function updateCategoryController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { categoryId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const category = await categoryService.updateCategoryService(categoryId, req.body, userId);
    return res.status(200).json(category);
  } catch (error) {
    return handleError(res, error, 'atualizar categoria');
  }
}

export async function deleteCategoryController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { categoryId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await categoryService.deleteCategoryService(categoryId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar categoria');
  }
}
