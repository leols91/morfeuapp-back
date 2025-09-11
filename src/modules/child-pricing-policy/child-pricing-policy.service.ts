import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização para evitar repetição
async function checkChildPolicyPermissions(policyId: string, userId: string) {
  const policy = await prisma.childPricingPolicy.findFirst({
    where: { id: policyId, deletedAt: null },
  });

  if (!policy) {
    throw new Error('Política de crianças não encontrada.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: policy.pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return policy;
}

// Lista todas as políticas de uma pousada
export async function listChildPoliciesService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.childPricingPolicy.findMany({
    where: { pousadaId, deletedAt: null },
    include: { bands: { where: { deletedAt: null }, orderBy: { minAge: 'asc' } } },
    orderBy: { name: 'asc' },
  });
}

// Busca uma política específica por ID
export async function getChildPolicyByIdService(policyId: string, userId: string) {
  await checkChildPolicyPermissions(policyId, userId);
  return prisma.childPricingPolicy.findUnique({
    where: { id: policyId },
    include: { bands: { where: { deletedAt: null }, orderBy: { minAge: 'asc' } } },
  });
}

// Cria uma nova política de crianças e suas faixas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createChildPolicyService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  // Cria a política e suas faixas em uma única transação
  return prisma.childPricingPolicy.create({
    data: {
      pousadaId: pousadaId,
      name: data.name,
      allowInShared: data.allowInShared,
      bands: {
        create: data.bands?.map((band: any) => ({
          minAge: band.minAge,
          maxAge: band.maxAge,
          chargeMode: band.chargeMode,
          percentValue: band.percentValue ? new Decimal(band.percentValue) : null,
          fixedAmount: band.fixedAmount ? new Decimal(band.fixedAmount) : null,
        })),
      },
    },
    include: {
      bands: true,
    },
  });
}

// Atualiza uma política de crianças (NOTA: para simplicidade, não atualizamos as faixas aqui)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateChildPolicyService(policyId: string, data: any, userId: string) {
  await checkChildPolicyPermissions(policyId, userId);

  return prisma.childPricingPolicy.update({
    where: { id: policyId },
    data: {
      name: data.name,
      allowInShared: data.allowInShared,
    },
  });
}

// Exclui (soft delete) uma política de crianças
export async function deleteChildPolicyService(policyId: string, userId: string) {
  await checkChildPolicyPermissions(policyId, userId);

  // Deleta a política e suas faixas em uma transação
  return prisma.$transaction([
    prisma.childPricingBand.updateMany({
      where: { policyId: policyId },
      data: { deletedAt: new Date() },
    }),
    prisma.childPricingPolicy.update({
      where: { id: policyId },
      data: { deletedAt: new Date() },
    }),
  ]);
}
