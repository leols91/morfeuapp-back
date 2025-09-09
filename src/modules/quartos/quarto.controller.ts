import type { Request, Response } from 'express';
import { createQuartoService, listQuartosService } from './quarto.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

// --- Função para LISTAR quartos ---
export async function listQuartosController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const quartos = await listQuartosService(pousadaId, userId);
    return res.status(200).json(quartos);
  } catch (error) {
    console.error('Erro ao listar quartos:', error);

    if (error instanceof Error && error.message.includes('Acesso negado')) {
      return res.status(403).json({ message: error.message }); // 403 Forbidden
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}


// --- Função para CRIAR um quarto (código existente) ---
export async function createQuartoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const quarto = await createQuartoService(req.body, pousadaId, userId);
    return res.status(201).json(quarto);
  } catch (error) {
    console.error('Erro ao criar quarto:', error);

    if (error instanceof Error) {
      if (error.message.includes('Acesso negado')) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes('Tipo de Quarto inválido')) {
        return res.status(400).json({ message: error.message });
      }
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

