import { prisma } from '../../core/database/prisma.js';

// Lista as comissões provisionadas de uma pousada em um período
export async function listChannelCommissionsService(
  pousadaId: string,
  startDate: Date,
  endDate: Date,
  userId: string,
) {
  // CORREÇÃO APLICADA AQUI
  // A consulta de autorização foi ajustada para usar a estrutura correta
  // da chave composta (usuarioId_pousadaId) e o nome de campo 'usuarioId'.
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

  return prisma.channelCommissionAccrual.findMany({
    where: {
      pousadaId,
      deletedAt: null,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      channel: true,
      reserva: true,
      folioEntry: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}