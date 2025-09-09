import type { Request, Response } from 'express';
import { createRoomTypeService } from './room-type.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

export async function createRoomTypeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params; // Extrai o ID da pousada da URL

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const roomType = await createRoomTypeService(req.body, pousadaId, userId);
    return res.status(201).json(roomType);
  } catch (error) {
    console.error('Erro ao criar tipo de quarto:', error);

    if (error instanceof Error && error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message }); // 403 Forbidden
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
