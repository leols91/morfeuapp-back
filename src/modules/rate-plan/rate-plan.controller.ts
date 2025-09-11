import type { Request, Response } from 'express';
import {
  createRatePlanService,
  deleteRatePlanService,
  getRatePlanByIdService,
  listRatePlansService,
  updateRatePlanService,
} from './rate-plan.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

export async function listRatePlansController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const ratePlans = await listRatePlansService(pousadaId, userId);
    return res.status(200).json(ratePlans);
  } catch (error) {
    console.error('Erro ao listar planos de tarifas:', error);
    if (error instanceof Error && error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function getRatePlanByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { ratePlanId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const ratePlan = await getRatePlanByIdService(ratePlanId, userId);
    return res.status(200).json(ratePlan);
  } catch (error) {
    console.error('Erro ao buscar plano de tarifas:', error);
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
}

export async function createRatePlanController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const ratePlan = await createRatePlanService(req.body, pousadaId, userId);
    return res.status(201).json(ratePlan);
  } catch (error) {
    console.error('Erro ao criar plano de tarifas:', error);
    if (error instanceof Error && error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function updateRatePlanController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { ratePlanId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const ratePlan = await updateRatePlanService(ratePlanId, req.body, userId);
    return res.status(200).json(ratePlan);
  } catch (error) {
    console.error('Erro ao atualizar plano de tarifas:', error);
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
}

export async function deleteRatePlanController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { ratePlanId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    await deleteRatePlanService(ratePlanId, userId);
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar plano de tarifas:', error);
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
}

