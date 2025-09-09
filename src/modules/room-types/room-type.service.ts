import { prisma } from '../../core/database/prisma.js';

// No futuro, usaremos Zod para validar os dados
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRoomTypeService(
  data: any,
  pousadaId: string,
  userId: string,
) {
  // 1. Verificação de Autorização: O usuário logado pertence a esta pousada?
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado. Você não tem permissão para modificar esta pousada.');
  }

  // 2. Criar o Tipo de Quarto, associando-o à pousada correta
  const roomType = await prisma.roomType.create({
    data: {
      pousadaId: pousadaId,
      name: data.name,
      description: data.description,
      occupancyMode: data.occupancyMode, // 'private' ou 'shared'
      baseOccupancy: data.baseOccupancy,
      maxOccupancy: data.maxOccupancy,
    },
  });

  return roomType;
}
