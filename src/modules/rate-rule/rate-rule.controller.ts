import type { Request, Response } from 'express';
import {
  createRateRuleService,
  deleteRateRuleService,
  getRateRuleByIdService,
  listRateRulesService,
  updateRateRuleService,
} from './rate-rule.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Funções genéricas de tratamento de erro para evitar repetição
function handleError(res: Response, error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error);
  if (error instanceof Error) {
    if (error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listRateRulesController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { ratePlanId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const rateRules = await listRateRulesService(ratePlanId, userId);
    return res.status(200).json(rateRules);
  } catch (error) {
    return handleError(res, error, 'listar regras de tarifa');
  }
}

export async function getRateRuleByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { rateRuleId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const rateRule = await getRateRuleByIdService(rateRuleId, userId);
    return res.status(200).json(rateRule);
  } catch (error) {
    return handleError(res, error, 'buscar regra de tarifa');
  }
}

export async function createRateRuleController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { ratePlanId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const rateRule = await createRateRuleService(req.body, ratePlanId, userId);
    return res.status(201).json(rateRule);
  } catch (error) {
    return handleError(res, error, 'criar regra de tarifa');
  }
}

export async function updateRateRuleController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { rateRuleId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const rateRule = await updateRateRuleService(rateRuleId, req.body, userId);
    return res.status(200).json(rateRule);
  } catch (error) {
    return handleError(res, error, 'atualizar regra de tarifa');
  }
}

export async function deleteRateRuleController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { rateRuleId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await deleteRateRuleService(rateRuleId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar regra de tarifa');
  }
}
