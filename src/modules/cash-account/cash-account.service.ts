import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização
async function checkAccountPermissions(accountId: string, userId: string) {
  const account = await prisma.cashAccount.findFirst({
    where: { id: accountId, deletedAt: null },
  });
  if (!account) throw new Error('Conta financeira não encontrada.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: account.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return account;
}

// Lista todas as contas de uma pousada
export async function listCashAccountsService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.cashAccount.findMany({
    where: { pousadaId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
}

// Cria uma nova conta financeira
export async function createCashAccountService(data: { name: string, typeCode: string, openingBalance?: string }, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.cashAccount.create({
    data: {
      pousadaId,
      name: data.name,
      typeCode: data.typeCode,
      openingBalance: data.openingBalance ? new Decimal(data.openingBalance) : 0,
    },
  });
}

// Atualiza uma conta
export async function updateCashAccountService(accountId: string, data: { name: string, typeCode: string }, userId: string) {
  await checkAccountPermissions(accountId, userId);
  return prisma.cashAccount.update({
    where: { id: accountId },
    data: {
      name: data.name,
      typeCode: data.typeCode,
    },
  });
}

// Exclui (soft delete) uma conta
export async function deleteCashAccountService(accountId: string, userId: string) {
  await checkAccountPermissions(accountId, userId);
  return prisma.cashAccount.update({
    where: { id: accountId },
    data: { deletedAt: new Date() },
  });
}

