// src/modules/users/user.controller.ts
import type { Request, Response } from 'express';
import { createUser } from './user.service.js';

export async function createUserController(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);

    // Trata os dois erros de duplicidade
    if (error instanceof Error && (error.message.includes('e-mail') || error.message.includes('nome de usuário'))) {
      return res.status(409).json({ message: error.message });
    }
    
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}