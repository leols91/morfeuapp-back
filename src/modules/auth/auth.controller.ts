// src/modules/auth/auth.controller.ts
import type { Request, Response } from 'express';
import { loginService } from './auth.service.js';

export async function loginController(req: Request, res: Response) {
  try {
    const { token } = await loginService(req.body);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erro no login:', error);

    // Se o erro for de credenciais inválidas, retornamos 401 Unauthorized
    if (error instanceof Error && error.message.includes('inválidos')) {
      return res.status(401).json({ message: error.message });
    }
    
    // Para qualquer outro erro inesperado
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}