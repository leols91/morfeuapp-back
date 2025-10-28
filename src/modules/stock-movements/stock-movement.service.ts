import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização para evitar repetição
async function checkStockMovementPermissions(movementId: string, userId: string) {
  const movement = await prisma.stockMovement.findFirst({
    where: { id: movementId, deletedAt: null },
  });
  if (!movement) throw new Error('Movimentação de estoque não encontrada.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: movement.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return movement;
}

// --- NOVA FUNÇÃO ---
// Lista TODAS as movimentações de uma pousada, com filtros
export async function listAllStockMovementsService(
  pousadaId: string,
  userId: string,
  // Aceitamos filtros pela query da URL
  filters: { typeCode?: string; produtoId?: string },
) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.stockMovement.findMany({
    where: {
      pousadaId,
      deletedAt: null,
      typeCode: filters.typeCode || undefined, // Filtra por tipo (in, out, adjust)
      produtoId: filters.produtoId || undefined, // Filtra por produto
    },
    include: {
      type: true,
      produto: {
        select: { name: true, sku: true }, // Inclui o nome do produto
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100, // Limita a 100 resultados por performance
  });
}

// Lista todas as movimentações de um produto específico
export async function listStockMovementsByProductService(produtoId: string, userId: string) {
  const produto = await prisma.produto.findFirst({
    where: { id: produtoId, deletedAt: null },
  });
  if (!produto) throw new Error('Produto não encontrado.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: produto.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.stockMovement.findMany({
    where: { produtoId: produtoId, deletedAt: null },
    include: { type: true },
    orderBy: { createdAt: 'desc' },
  });
}

// Cria uma nova movimentação de estoque
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createStockMovementService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  // Valida se o produto pertence à mesma pousada
  const produto = await prisma.produto.findFirst({
    where: { id: data.productId, pousadaId: pousadaId },
  });
  if (!produto) {
    throw new Error('Produto não encontrado ou não pertence a esta pousada.');
  }

  return prisma.stockMovement.create({
    data: {
      pousadaId: pousadaId,
      produtoId: data.productId,
      typeCode: data.typeCode, // "in", "out", ou "adjust"
      quantity: new Decimal(data.quantity),
      unitCost: data.unitCost ? new Decimal(data.unitCost) : null,
      note: data.note,
    },
  });
}

// Atualiza uma movimentação (geralmente usado para corrigir notas)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateStockMovementService(
  movementId: string,
  data: any,
  userId: string,
) {
  await checkStockMovementPermissions(movementId, userId);

  return prisma.stockMovement.update({
    where: { id: movementId },
    data: {
      quantity: data.quantity ? new Decimal(data.quantity) : undefined,
      unitCost: data.unitCost ? new Decimal(data.unitCost) : undefined,
      note: data.note,
    },
  });
}

// Exclui (soft delete) uma movimentação de estoque
export async function deleteStockMovementService(movementId: string, userId: string) {
  await checkStockMovementPermissions(movementId, userId);

  return prisma.stockMovement.update({
    where: { id: movementId },
    data: { deletedAt: new Date() },
  });
}

