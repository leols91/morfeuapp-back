import { prisma } from '../../core/database/prisma.js';

// Helper de autorização para evitar repetição de código
async function checkCategoryPermissions(categoryId: string, userId: string) {
  const category = await prisma.productCategory.findFirst({
    where: { id: categoryId, deletedAt: null },
  });

  if (!category) {
    throw new Error('Categoria de produto não encontrada.');
  }

  // CORRIGIDO: Usando findUnique com a chave composta correta
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: category.pousadaId,
      },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return category;
}

// Lista todas as categorias de uma pousada
export async function listCategoriesService(pousadaId: string, userId: string) {
  // CORRIGIDO: Usando findUnique com a chave composta correta
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.productCategory.findMany({
    where: { pousadaId: pousadaId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
}

// Cria uma nova categoria de produto
export async function createCategoryService(
  data: { name: string },
  pousadaId: string,
  userId: string,
) {
  // CORRIGIDO: Usando findUnique com a chave composta correta
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.productCategory.create({
    data: {
      pousadaId: pousadaId,
      name: data.name,
    },
  });
}

// Atualiza uma categoria de produto
export async function updateCategoryService(
  categoryId: string,
  data: { name: string },
  userId: string,
) {
  await checkCategoryPermissions(categoryId, userId);

  return prisma.productCategory.update({
    where: { id: categoryId },
    data: {
      name: data.name,
    },
  });
}

// Exclui (soft delete) uma categoria de produto
export async function deleteCategoryService(categoryId: string, userId: string) {
  await checkCategoryPermissions(categoryId, userId);

  return prisma.productCategory.update({
    where: { id: categoryId },
    data: { deletedAt: new Date() },
  });
}

