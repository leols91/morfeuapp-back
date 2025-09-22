import { prisma } from '../../core/database/prisma.js';

// Lista os logs de auditoria de uma pousada
export async function listAuditLogsService(pousadaId: string, userId: string) {
  // CORREÇÃO APLICADA AQUI
  // A consulta foi ajustada para usar a estrutura correta da chave composta.
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.auditLog.findMany({
    where: { pousadaId },
    include: {
      usuario: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100, // Limita a busca aos 100 logs mais recentes para performance
  });
}

