import type { Request, Response } from 'express';
import {
  createChildPolicyService,
  deleteChildPolicyService,
  getChildPolicyByIdService,
  listChildPoliciesService,
  updateChildPolicyService,
} from './child-pricing-policy.service.js';

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
    if (error.message.includes('não encontrad')) { // Pega "encontrado" e "encontrada"
      return res.status(404).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listChildPoliciesController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const policies = await listChildPoliciesService(pousadaId, userId);
    return res.status(200).json(policies);
  } catch (error) {
    return handleError(res, error, 'listar políticas de crianças');
  }
}

export async function getChildPolicyByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { policyId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const policy = await getChildPolicyByIdService(policyId, userId);
    return res.status(200).json(policy);
  } catch (error) {
    return handleError(res, error, 'buscar política de crianças');
  }
}

export async function createChildPolicyController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const policy = await createChildPolicyService(req.body, pousadaId, userId);
    return res.status(201).json(policy);
  } catch (error) {
    return handleError(res, error, 'criar política de crianças');
  }
}

export async function updateChildPolicyController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { policyId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const policy = await updateChildPolicyService(policyId, req.body, userId);
    return res.status(200).json(policy);
  } catch (error) {
    return handleError(res, error, 'atualizar política de crianças');
  }
}

export async function deleteChildPolicyController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { policyId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await deleteChildPolicyService(policyId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar política de crianças');
  }
}
