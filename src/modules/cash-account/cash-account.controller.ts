import type { Request, Response } from 'express';
import * as cashAccountService from './cash-account.service.js';

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

export async function listCashAccountsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const accounts = await cashAccountService.listCashAccountsService(pousadaId, userId);
    return res.status(200).json(accounts);
  } catch (error) {
    return handleError(res, error, 'listar contas financeiras');
  }
}

export async function createCashAccountController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const account = await cashAccountService.createCashAccountService(req.body, pousadaId, userId);
    return res.status(201).json(account);
  } catch (error) {
    return handleError(res, error, 'criar conta financeira');
  }
}

export async function updateCashAccountController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { accountId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const account = await cashAccountService.updateCashAccountService(accountId, req.body, userId);
    return res.status(200).json(account);
  } catch (error) {
    return handleError(res, error, 'atualizar conta financeira');
  }
}

export async function deleteCashAccountController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { accountId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await cashAccountService.deleteCashAccountService(accountId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar conta financeira');
  }
}

