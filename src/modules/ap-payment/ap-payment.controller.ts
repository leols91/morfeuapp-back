import type { Request, Response } from 'express';
import * as apPaymentService from './ap-payment.service.js';

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
    if (error.message.includes('excede o saldo devedor')) {
      return res.status(400).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}


export async function createAPPaymentController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { apInvoiceId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const payment = await apPaymentService.createAPPaymentService(req.body, apInvoiceId, userId);
    return res.status(201).json(payment);
  } catch (error) {
    return handleError(res, error, 'criar pagamento de fatura');
  }
}

