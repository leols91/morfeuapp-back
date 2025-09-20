import type { Request, Response } from 'express';
import * as paymentService from './payment.service.js';

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

export async function listPaymentsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { folioId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const payments = await paymentService.listPaymentsService(folioId, userId);
    return res.status(200).json(payments);
  } catch (error) {
    return handleError(res, error, 'listar pagamentos');
  }
}

export async function createPaymentController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { folioId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const payment = await paymentService.createPaymentService(req.body, folioId, userId);
    return res.status(201).json(payment);
  } catch (error) {
    return handleError(res, error, 'criar pagamento');
  }
}

export async function deletePaymentController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { paymentId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await paymentService.deletePaymentService(paymentId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar pagamento');
  }
}
