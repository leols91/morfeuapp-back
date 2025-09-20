import type { Request, Response } from 'express';
import {
  getDailyRevenueReportService,
  getStockBalanceReportService,
} from './report.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

function handleError(res: Response, error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error);
  if (error instanceof Error) {
    if (error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('obrigatórias')) {
      return res.status(400).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function getDailyRevenueReportController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    if (!startDate || !endDate) {
      throw new Error('As datas de início e fim (startDate, endDate) são obrigatórias.');
    }

    const report = await getDailyRevenueReportService(
      pousadaId,
      new Date(startDate as string),
      new Date(endDate as string),
      userId,
    );
    return res.status(200).json(report);
  } catch (error) {
    return handleError(res, error, 'gerar relatório de receita diária');
  }
}

// --- NOVA FUNÇÃO ---
export async function getStockBalanceReportController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;

    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const report = await getStockBalanceReportService(pousadaId, userId);
    return res.status(200).json(report);
  } catch (error) {
    return handleError(res, error, 'gerar relatório de saldo de estoque');
  }
}

