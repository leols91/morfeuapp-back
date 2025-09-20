import type { Request, Response } from 'express';
import * as folioService from './folio.service.js';

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

export async function getFolioByReservaIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { reservaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const folio = await folioService.getFolioByReservaIdService(reservaId, userId);
    return res.status(200).json(folio);
  } catch (error) {
    return handleError(res, error, 'buscar folio');
  }
}

export async function addFolioEntryController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { folioId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const entry = await folioService.addFolioEntryService(req.body, folioId, userId);
    return res.status(201).json(entry);
  } catch (error) {
    return handleError(res, error, 'adicionar lançamento ao folio');
  }
}

export async function updateFolioEntryController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        const { entryId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        const entry = await folioService.updateFolioEntryService(entryId, req.body, userId);
        return res.status(200).json(entry);
    } catch (error) {
        return handleError(res, error, 'atualizar lançamento do folio');
    }
}

export async function deleteFolioEntryController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        const { entryId } = req.params;
        if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

        await folioService.deleteFolioEntryService(entryId, userId);
        return res.status(204).send();
    } catch (error) {
        return handleError(res, error, 'deletar lançamento do folio');
    }
}

