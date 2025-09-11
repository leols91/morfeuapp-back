import { prisma } from '../../core/database/prisma.js';

// Helper de autorização
async function checkSupplierPermissions(supplierId: string, userId: string) {
  const supplier = await prisma.supplier.findFirst({
    where: { id: supplierId, deletedAt: null },
  });
  if (!supplier) throw new Error('Fornecedor não encontrado.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: supplier.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return supplier;
}

// Lista todos os fornecedores de uma pousada
export async function listSuppliersService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.supplier.findMany({
    where: { pousadaId, deletedAt: null },
    orderBy: { legalName: 'asc' },
  });
}

// Busca um fornecedor por ID
export async function getSupplierByIdService(supplierId: string, userId: string) {
  const supplier = await checkSupplierPermissions(supplierId, userId);
  return supplier; // A verificação já retorna o fornecedor
}

// Cria um novo fornecedor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createSupplierService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.supplier.create({
    data: {
      pousadaId,
      legalName: data.legalName,
      documentId: data.documentId,
      email: data.email,
      phone: data.phone,
    },
  });
}

// Atualiza um fornecedor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSupplierService(supplierId: string, data: any, userId: string) {
  await checkSupplierPermissions(supplierId, userId);

  return prisma.supplier.update({
    where: { id: supplierId },
    data: {
      legalName: data.legalName,
      documentId: data.documentId,
      email: data.email,
      phone: data.phone,
    },
  });
}

// Exclui (soft delete) um fornecedor
export async function deleteSupplierService(supplierId: string, userId: string) {
  await checkSupplierPermissions(supplierId, userId);

  return prisma.supplier.update({
    where: { id: supplierId },
    data: { deletedAt: new Date() },
  });
}
