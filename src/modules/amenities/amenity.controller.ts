import type { Request, Response } from 'express';
import * as amenityService from './amenity.service.js';

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
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

export async function listAmenitiesController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const amenities = await amenityService.listAmenitiesService(pousadaId, userId);
    return res.status(200).json(amenities);
  } catch (error) {
    return handleError(res, error, 'listar comodidades');
  }
}

export async function createAmenityController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const amenity = await amenityService.createAmenityService(req.body, pousadaId, userId);
    return res.status(201).json(amenity);
  } catch (error) {
    return handleError(res, error, 'criar comodidade');
  }
}

export async function updateAmenityController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { amenityId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const amenity = await amenityService.updateAmenityService(amenityId, req.body, userId);
    return res.status(200).json(amenity);
  } catch (error) {
    return handleError(res, error, 'atualizar comodidade');
  }
}

export async function deleteAmenityController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { amenityId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await amenityService.deleteAmenityService(amenityId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar comodidade');
  }
}
