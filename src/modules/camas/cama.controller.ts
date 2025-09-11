import type { Request, Response } from 'express';
import {
  createCamaService,
  getCamaByIdService,
  listCamasService,
  updateCamaService,
} from './cama.service.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Busca uma cama específica por ID
export async function getCamaByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { camaId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const cama = await getCamaByIdService(camaId, userId);
    return res.status(200).json(cama);
  } catch (error) {
    console.error('Erro ao buscar cama por ID:', error);
    if (error instanceof Error) {
      if (error.message.includes('Acesso negado')) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

// Lista as camas de um quarto
export async function listCamasController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { quartoId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const camas = await listCamasService(quartoId, userId);
    return res.status(200).json(camas);
  } catch (error) {
    console.error('Erro ao listar camas:', error);
    if (error instanceof Error) {
      if (error.message.includes('Acesso negado')) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes('Quarto não encontrado')) {
        return res.status(404).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

// Cria uma nova cama
export async function createCamaController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { quartoId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const cama = await createCamaService(req.body, quartoId, userId);
    return res.status(201).json(cama);
  } catch (error) {
    console.error('Erro ao criar cama:', error);
    if (error instanceof Error) {
      if (error.message.includes('Acesso negado')) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes('Quarto não encontrado') || error.message.includes('quarto privado')) {
        return res.status(400).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

// Atualiza uma cama existente
export async function updateCamaController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { camaId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const cama = await updateCamaService(camaId, req.body, userId);
    return res.status(200).json(cama);
  } catch (error) {
    console.error('Erro ao atualizar cama:', error);
    if (error instanceof Error) {
      if (error.message.includes('Acesso negado')) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

