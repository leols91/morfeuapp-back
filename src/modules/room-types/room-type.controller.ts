import type { Request, Response } from 'express';
import {
  createRoomTypeService,
  deleteRoomTypeService,
  getRoomTypeByIdService,
  listRoomTypesService,
  updateRoomTypeService,
  addAmenityToRoomTypeService,
  removeAmenityFromRoomTypeService,
} from './room-type.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

function handleError(res: Response, error: unknown, context: string) {
  console.error(`Erro em ${context}:`, error);
  if (error instanceof Error) {
    if (error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('não encontrad')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('não pertence')) {
        return res.status(400).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listRoomTypesController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const roomTypes = await listRoomTypesService(pousadaId, userId);
    return res.status(200).json(roomTypes);
  } catch (error) {
    return handleError(res, error, 'listar tipos de quarto');
  }
}

export async function getRoomTypeByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { roomTypeId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const roomType = await getRoomTypeByIdService(roomTypeId, userId);
    return res.status(200).json(roomType);
  } catch (error) {
    return handleError(res, error, 'buscar tipo de quarto');
  }
}

export async function createRoomTypeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const roomType = await createRoomTypeService(req.body, pousadaId, userId);
    return res.status(201).json(roomType);
  } catch (error) {
    return handleError(res, error, 'criar tipo de quarto');
  }
}

export async function updateRoomTypeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { roomTypeId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const roomType = await updateRoomTypeService(roomTypeId, req.body, userId);
    return res.status(200).json(roomType);
  } catch (error) {
    return handleError(res, error, 'atualizar tipo de quarto');
  }
}

export async function deleteRoomTypeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { roomTypeId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await deleteRoomTypeService(roomTypeId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar tipo de quarto');
  }
}

// --- NOVAS FUNÇÕES ---

export async function addAmenityToRoomTypeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { roomTypeId } = req.params;
    const { amenityId } = req.body;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await addAmenityToRoomTypeService(roomTypeId, amenityId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'associar comodidade');
  }
}

export async function removeAmenityFromRoomTypeController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { roomTypeId, amenityId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await removeAmenityFromRoomTypeService(roomTypeId, amenityId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'remover associação de comodidade');
  }
}

