import type { Request, Response } from 'express';
import * as supplierService from './supplier.service.js';

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

export async function listSuppliersController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const suppliers = await supplierService.listSuppliersService(pousadaId, userId);
    return res.status(200).json(suppliers);
  } catch (error) {
    return handleError(res, error, 'listar fornecedores');
  }
}

export async function getSupplierByIdController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { supplierId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const supplier = await supplierService.getSupplierByIdService(supplierId, userId);
    return res.status(200).json(supplier);
  } catch (error) {
    return handleError(res, error, 'buscar fornecedor');
  }
}

export async function createSupplierController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { pousadaId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const supplier = await supplierService.createSupplierService(req.body, pousadaId, userId);
    return res.status(201).json(supplier);
  } catch (error) {
    return handleError(res, error, 'criar fornecedor');
  }
}

export async function updateSupplierController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { supplierId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    const supplier = await supplierService.updateSupplierService(supplierId, req.body, userId);
    return res.status(200).json(supplier);
  } catch (error) {
    return handleError(res, error, 'atualizar fornecedor');
  }
}

export async function deleteSupplierController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { supplierId } = req.params;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    await supplierService.deleteSupplierService(supplierId, userId);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error, 'deletar fornecedor');
  }
}
