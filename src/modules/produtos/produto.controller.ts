import type { Request, Response } from 'express';
import * as produtoService from './produto.service.js';

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

export async function listProdutosController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const produtos = await produtoService.listProdutosService(pousadaId, userId);
    return res.status(200).json(produtos);
  } catch (error) {
    return handleError(res, error, 'listar produtos');
  }
}

export async function getProdutoByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { produtoId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const produto = await produtoService.getProdutoByIdService(produtoId, userId);
    return res.status(200).json(produto);
  } catch (error) {
    return handleError(res, error, 'buscar produto');
  }
}

export async function createProdutoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const produto = await produtoService.createProdutoService(req.body, pousadaId, userId);
    return res.status(201).json(produto);
  } catch (error) {
    return handleError(res, error, 'criar produto');
  }
}

export async function updateProdutoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { produtoId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const produto = await produtoService.updateProdutoService(produtoId, req.body, userId);
    return res.status(200).json(produto);
  } catch (error) {
    return handleError(res, error, 'atualizar produto');
  }
}

export async function deleteProdutoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { produtoId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await produtoService.deleteProdutoService(produtoId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar produto');
  }
}

