import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização para evitar repetição
async function checkAddonPermissions(addonId: string, userId: string) {
  const addon = await prisma.addon.findFirst({
    where: { id: addonId, deletedAt: null },
  });

  if (!addon) {
    throw new Error('Add-on não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: addon.pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return addon;
}

// Lista todos os addons de uma pousada
export async function listAddonsService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.addon.findMany({
    where: { pousadaId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
}

// Busca um addon específico por ID
export async function getAddonByIdService(addonId: string, userId: string) {
  await checkAddonPermissions(addonId, userId);
  return prisma.addon.findUnique({
    where: { id: addonId },
  });
}

// Cria um novo addon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAddonService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.addon.create({
    data: {
      pousadaId,
      name: data.name,
      description: data.description,
      price: new Decimal(data.price),
      chargeUnit: data.chargeUnit,
      whenToCharge: data.whenToCharge,
    },
  });
}

// Atualiza um addon existente
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateAddonService(addonId: string, data: any, userId: string) {
  await checkAddonPermissions(addonId, userId);

  return prisma.addon.update({
    where: { id: addonId },
    data: {
      name: data.name,
      description: data.description,
      price: data.price ? new Decimal(data.price) : undefined,
      chargeUnit: data.chargeUnit,
      whenToCharge: data.whenToCharge,
    },
  });
}

// Exclui (soft delete) um addon
export async function deleteAddonService(addonId: string, userId: string) {
  await checkAddonPermissions(addonId, userId);

  return prisma.addon.update({
    where: { id: addonId },
    data: { deletedAt: new Date() },
  });
}

