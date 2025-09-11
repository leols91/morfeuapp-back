import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização para evitar repetição de código
async function checkProdutoPermissions(produtoId: string, userId: string) {
  const produto = await prisma.produto.findFirst({
    where: { id: produtoId, deletedAt: null },
  });

  if (!produto) {
    throw new Error('Produto não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: produto.pousadaId,
      },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return produto;
}

// Lista todos os produtos de uma pousada
export async function listProdutosService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.produto.findMany({
    where: { pousadaId: pousadaId, deletedAt: null },
    include: { category: true },
    orderBy: { name: 'asc' },
  });
}

// Busca um produto específico por ID
export async function getProdutoByIdService(produtoId: string, userId: string) {
  await checkProdutoPermissions(produtoId, userId);

  return prisma.produto.findUnique({
    where: { id: produtoId },
    include: { category: true },
  });
}

// Cria um novo produto
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProdutoService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.produto.create({
    data: {
      pousadaId: pousadaId,
      categoryId: data.categoryId,
      sku: data.sku,
      name: data.name,
      unit: data.unit,
      costPrice: data.costPrice ? new Decimal(data.costPrice) : null,
      salePrice: new Decimal(data.salePrice),
      stockControl: data.stockControl,
    },
  });
}

// Atualiza um produto existente
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProdutoService(produtoId: string, data: any, userId: string) {
  await checkProdutoPermissions(produtoId, userId);

  return prisma.produto.update({
    where: { id: produtoId },
    data: {
      categoryId: data.categoryId,
      sku: data.sku,
      name: data.name,
      unit: data.unit,
      costPrice: data.costPrice ? new Decimal(data.costPrice) : undefined,
      salePrice: data.salePrice ? new Decimal(data.salePrice) : undefined,
      stockControl: data.stockControl,
    },
  });
}

// Exclui (soft delete) um produto
export async function deleteProdutoService(produtoId: string, userId: string) {
  await checkProdutoPermissions(produtoId, userId);

  return prisma.produto.update({
    where: { id: produtoId },
    data: { deletedAt: new Date() },
  });
}

