import type { Request, Response } from 'express';
import {
  createQuartoService,
  deleteQuartoService,
  getQuartoByIdService,
  listQuartosService,
  updateQuartoService,
  addAmenityToQuartoService,
  removeAmenityFromQuartoService,
} from './quarto.service.js';

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

export async function listQuartosController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const quartos = await listQuartosService(pousadaId, userId);
    return res.status(200).json(quartos);
  } catch (error) {
    return handleError(res, error, 'listar quartos');
  }
}

export async function getQuartoByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { quartoId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const quarto = await getQuartoByIdService(quartoId, userId);
    return res.status(200).json(quarto);
  } catch (error) {
    return handleError(res, error, 'buscar quarto');
  }
}

export async function createQuartoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const quarto = await createQuartoService(req.body, pousadaId, userId);
    return res.status(201).json(quarto);
  } catch (error) {
    return handleError(res, error, 'criar quarto');
  }
}

export async function updateQuartoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { quartoId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const quarto = await updateQuartoService(quartoId, req.body, userId);
    return res.status(200).json(quarto);
  } catch (error) {
    return handleError(res, error, 'atualizar quarto');
  }
}

export async function deleteQuartoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { quartoId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await deleteQuartoService(quartoId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar quarto');
  }
}

// --- NOVOS CONTROLLERS ---
export async function addAmenityToQuartoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { quartoId } = req.params;
    const { amenityId } = req.body;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await addAmenityToQuartoService(quartoId, amenityId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'associar comodidade ao quarto');
  }
}

export async function removeAmenityFromQuartoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { quartoId, amenityId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await removeAmenityFromQuartoService(quartoId, amenityId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'remover associação de comodidade do quarto');
  }
}

