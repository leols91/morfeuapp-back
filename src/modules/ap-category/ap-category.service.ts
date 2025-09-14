import { prisma } from '../../core/database/prisma.js';

// Helper de autorização
async function checkCategoryPermissions(apCategoryId: string, userId: string) {
  const category = await prisma.aPCategory.findFirst({
    where: { id: apCategoryId, deletedAt: null },
  });
  if (!category) throw new Error('Categoria de despesa não encontrada.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: category.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return category;
}

// Lista todas as categorias de despesa de uma pousada
export async function listAPCategoriesService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    // CORRIGIDO: Usando a estrutura correta para a chave composta
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.aPCategory.findMany({
    where: { pousadaId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
}

// Cria uma nova categoria de despesa
export async function createAPCategoryService(data: { name: string, description?: string }, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    // CORRIGIDO: Usando a estrutura correta para a chave composta
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.aPCategory.create({
    data: {
      pousadaId,
      name: data.name,
      description: data.description,
    },
  });
}

// Atualiza uma categoria de despesa
export async function updateAPCategoryService(apCategoryId: string, data: { name: string, description?: string }, userId: string) {
  await checkCategoryPermissions(apCategoryId, userId);
  return prisma.aPCategory.update({
    where: { id: apCategoryId },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

// Deleta (soft delete) uma categoria de despesa
export async function deleteAPCategoryService(apCategoryId: string, userId: string) {
  await checkCategoryPermissions(apCategoryId, userId);
  return prisma.aPCategory.update({
    where: { id: apCategoryId },
    data: { deletedAt: new Date() },
  });
}

