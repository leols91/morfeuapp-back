import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização para evitar repetição
async function checkRateRulePermissions(rateRuleId: string, userId: string) {
  const rateRule = await prisma.rateRule.findFirst({
    where: { id: rateRuleId, deletedAt: null },
    include: { ratePlan: true },
  });

  if (!rateRule) {
    throw new Error('Regra de tarifa não encontrada.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: rateRule.ratePlan.pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return rateRule;
}

// Lista todas as regras de um plano de tarifas
export async function listRateRulesService(ratePlanId: string, userId: string) {
  const ratePlan = await prisma.ratePlan.findFirst({
    where: { id: ratePlanId, deletedAt: null },
  });

  if (!ratePlan) {
    throw new Error('Plano de tarifas não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: ratePlan.pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.rateRule.findMany({
    where: { ratePlanId, deletedAt: null },
    orderBy: { startDate: 'asc' },
  });
}

// Busca uma regra específica por ID
export async function getRateRuleByIdService(rateRuleId: string, userId: string) {
  return checkRateRulePermissions(rateRuleId, userId);
}

// Cria uma nova regra de tarifa
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRateRuleService(data: any, ratePlanId: string, userId: string) {
  const ratePlan = await prisma.ratePlan.findFirst({
    where: { id: ratePlanId, deletedAt: null },
  });

  if (!ratePlan) {
    throw new Error('Plano de tarifas não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: ratePlan.pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.rateRule.create({
    data: {
      ratePlanId,
      roomTypeId: data.roomTypeId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      price: new Decimal(data.price),
      mon: data.mon,
      tue: data.tue,
      wed: data.wed,
      thu: data.thu,
      fri: data.fri,
      sat: data.sat,
      sun: data.sun,
    },
  });
}

// Atualiza uma regra de tarifa
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateRateRuleService(rateRuleId: string, data: any, userId: string) {
  await checkRateRulePermissions(rateRuleId, userId);

  return prisma.rateRule.update({
    where: { id: rateRuleId },
    data: {
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      price: data.price ? new Decimal(data.price) : undefined,
      mon: data.mon,
      tue: data.tue,
      wed: data.wed,
      thu: data.thu,
      fri: data.fri,
      sat: data.sat,
      sun: data.sun,
    },
  });
}

// Exclui (soft delete) uma regra de tarifa
export async function deleteRateRuleService(rateRuleId: string, userId: string) {
  await checkRateRulePermissions(rateRuleId, userId);

  await prisma.rateRule.update({
    where: { id: rateRuleId },
    data: { deletedAt: new Date() },
  });
}
