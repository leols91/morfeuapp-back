import type { Request, Response } from 'express';
import * as apInvoiceService from './ap-invoice.service.js';

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

export async function listAPInvoicesController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const invoices = await apInvoiceService.listAPInvoicesService(pousadaId, userId);
    return res.status(200).json(invoices);
  } catch (error) {
    return handleError(res, error, 'listar faturas');
  }
}

export async function createAPInvoiceController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const invoice = await apInvoiceService.createAPInvoiceService(req.body, pousadaId, userId);
    return res.status(201).json(invoice);
  } catch (error) {
    return handleError(res, error, 'criar fatura');
  }
}

export async function deleteAPInvoiceController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { apInvoiceId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await apInvoiceService.deleteAPInvoiceService(apInvoiceId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar fatura');
  }
}
