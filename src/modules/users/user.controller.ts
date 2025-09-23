import type { Request, Response } from 'express';
import {
  createUserService,
  deleteUserService,
  getMeService,
  inviteUserService,
  listUsersService,
  updatePasswordService,
  updateUserService,
} from './user.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Função genérica para tratar erros e evitar repetição
function handleError(res: Response, error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error);
  if (error instanceof Error) {
    if (error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('não encontrad')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('incorreta') || error.message.includes('em uso')) {
      return res.status(409).json({ message: error.message }); // 409 Conflict para dados duplicados
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

// --- CRUD Padrão e Funções Públicas ---

export async function createUserController(req: Request, res: Response) {
  try {
    const user = await createUserService(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return handleError(res, error, 'criar usuário');
  }
}

export async function listUsersController(req: AuthRequest, res: Response) {
  try {
    const users = await listUsersService();
    return res.status(200).json(users);
  } catch (error) {
    return handleError(res, error, 'listar usuários');
  }
}

export async function updateUserController(req: AuthRequest, res: Response) {
  try {
    const { userId } = req.params;
    const user = await updateUserService(userId, req.body);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error, 'atualizar usuário');
  }
}

export async function deleteUserController(req: AuthRequest, res: Response) {
  try {
    const { userId } = req.params;
    await deleteUserService(userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar usuário');
  }
}

// --- Funções Específicas e Protegidas ---

export async function getMeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const userProfile = await getMeService(userId);
    return res.status(200).json({ user: userProfile });
  } catch (error) {
    return handleError(res, error, 'buscar perfil');
  }
}

export async function updatePasswordController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await updatePasswordService(userId, req.body);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'atualizar senha');
  }
}

export async function inviteUserController(req: AuthRequest, res: Response) {
  try {
    const inviterId = req.user?.id;
    const { pousadaId } = req.params;
    if (!inviterId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const newUser = await inviteUserService(req.body, pousadaId, inviterId);
    return res.status(201).json(newUser);
  } catch (error) {
    return handleError(res, error, 'convidar usuário');
  }
}

