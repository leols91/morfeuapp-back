import { prisma } from '../../core/database/prisma.js';

// --- LISTAGEM ---

// Lista todos os planos de tarifas de uma pousada
export async function listRatePlansService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.ratePlan.findMany({
    where: {
      pousadaId,
      deletedAt: null,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

// Busca um plano de tarifas específico por ID
export async function getRatePlanByIdService(ratePlanId: string, userId: string) {
  const ratePlan = await prisma.ratePlan.findFirst({
    where: {
      id: ratePlanId,
      deletedAt: null,
    },
  });

  if (!ratePlan) {
    throw new Error('Plano de tarifas não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: ratePlan.pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return ratePlan;
}

// --- CRIAÇÃO ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRatePlanService(
  data: any,
  pousadaId: string,
  userId: string,
) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId },
      pousada: { deletedAt: null },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado. Você não tem permissão para modificar esta pousada.');
  }

  return prisma.ratePlan.create({
    data: {
      pousadaId: pousadaId,
      name: data.name,
      chargeScope: data.chargeScope,
      periodicity: data.periodicity,
    },
  });
}

// --- ATUALIZAÇÃO ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateRatePlanService(
  ratePlanId: string,
  data: any,
  userId: string,
) {
  const ratePlan = await prisma.ratePlan.findFirst({
    where: { id: ratePlanId, deletedAt: null },
  });

  if (!ratePlan) {
    throw new Error('Plano de tarifas não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: ratePlan.pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.ratePlan.update({
    where: { id: ratePlanId },
    data: {
      name: data.name,
      chargeScope: data.chargeScope,
      periodicity: data.periodicity,
    },
  });
}

// --- EXCLUSÃO (SOFT DELETE) ---

export async function deleteRatePlanService(ratePlanId: string, userId: string) {
  const ratePlan = await prisma.ratePlan.findFirst({
    where: { id: ratePlanId, deletedAt: null },
  });

  if (!ratePlan) {
    throw new Error('Plano de tarifas não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: ratePlan.pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  await prisma.ratePlan.update({
    where: { id: ratePlanId },
    data: {
      deletedAt: new Date(),
    },
  });
}

