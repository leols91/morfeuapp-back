import type { Request, Response } from 'express';
import {
  createUser,
  updateUserService,
  listUsersService,
} from './user.service.js';

export async function createUserController(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);

    // Trata os dois erros de duplicidade
    if (
      error instanceof Error &&
      (error.message.includes('e-mail') ||
        error.message.includes('nome de usuário'))
    ) {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const { userId } = req.params; // Pega o ID da URL
    const updatedUser = await updateUserService(userId, req.body);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);

    if (error instanceof Error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ message: error.message }); // 404 Not Found
      }
      if (error.message.includes('já está em uso')) {
        return res.status(409).json({ message: error.message }); // 409 Conflict
      }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function listUsersController(req: Request, res: Response) {
  try {
    const users = await listUsersService();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

