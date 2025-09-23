import { prisma } from '../../core/database/prisma.js';

// Lista as configs do usuário logado
export async function listUserConfigsService(userId: string) {
  return prisma.userConfig.findMany({
    where: { usuarioId: userId, deletedAt: null },
  });
}

// Cria ou atualiza uma config do usuário (Upsert)
export async function upsertUserConfigService(
  data: { userConfigName: string; userConfigValue: string },
  userId: string,
) {
  return prisma.userConfig.upsert({
    where: {
      usuarioId_userConfigName: {
        usuarioId: userId,
        userConfigName: data.userConfigName,
      },
    },
    update: {
      userConfigValue: data.userConfigValue,
    },
    create: {
      usuarioId: userId,
      userConfigName: data.userConfigName,
      userConfigValue: data.userConfigValue,
    },
  });
}

