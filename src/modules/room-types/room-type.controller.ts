import type { Request, Response } from 'express';
import {
  createRoomTypeService,
  listRoomTypesService,
  getRoomTypeByIdService,
  updateRoomTypeService,
} from './room-type.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Lista os tipos de quarto de uma pousada
export async function listRoomTypesController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const roomTypes = await listRoomTypesService(pousadaId, userId);
    return res.status(200).json(roomTypes);
  } catch (error) {
    console.error('Erro ao listar tipos de quarto:', error);
    if (error instanceof Error && error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

// Busca um tipo de quarto específico pelo ID
export async function getRoomTypeByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { roomTypeId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const roomType = await getRoomTypeByIdService(roomTypeId, userId);
    return res.status(200).json(roomType);
  } catch (error) {
    console.error('Erro ao buscar tipo de quarto:', error);
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

// Cria um novo tipo de quarto
export async function createRoomTypeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const roomType = await createRoomTypeService(req.body, pousadaId, userId);
    return res.status(201).json(roomType);
  } catch (error) {
    console.error('Erro ao criar tipo de quarto:', error);
    if (error instanceof Error && error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

// Atualiza um tipo de quarto existente
export async function updateRoomTypeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { roomTypeId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const roomType = await updateRoomTypeService(roomTypeId, req.body, userId);
    return res.status(200).json(roomType);
  } catch (error) {
    console.error('Erro ao atualizar tipo de quarto:', error);
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

