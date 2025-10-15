import { prisma } from '../../core/database/prisma.js';

// Helper de autorização
async function checkRoomTypePermissions(roomTypeId: string, userId: string) {
  const roomType = await prisma.roomType.findFirst({
    where: { id: roomTypeId, deletedAt: null },
  });
  if (!roomType) throw new Error('Tipo de quarto não encontrado.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: roomType.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return roomType;
}

// Lista os tipos de quarto de uma pousada
export async function listRoomTypesService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    // CORRIGIDO: Usando a estrutura correta para a chave composta
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.roomType.findMany({
    where: { pousadaId, deletedAt: null },
    include: {
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

// Busca um tipo de quarto por ID
export async function getRoomTypeByIdService(roomTypeId: string, userId: string) {
  await checkRoomTypePermissions(roomTypeId, userId);
  return prisma.roomType.findUnique({
    where: { id: roomTypeId },
    include: {
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  });
}

// Cria um novo tipo de quarto
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRoomTypeService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    // CORRIGIDO: Usando a estrutura correta para a chave composta
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.roomType.create({
    data: {
      pousadaId,
      name: data.name,
      description: data.description,
      occupancyMode: data.occupancyMode,
      baseOccupancy: data.baseOccupancy,
      maxOccupancy: data.maxOccupancy,
    },
  });
}

// Atualiza um tipo de quarto
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateRoomTypeService(roomTypeId: string, data: any, userId: string) {
  await checkRoomTypePermissions(roomTypeId, userId);
  return prisma.roomType.update({
    where: { id: roomTypeId },
    data: {
      name: data.name,
      description: data.description,
      occupancyMode: data.occupancyMode,
      baseOccupancy: data.baseOccupancy,
      maxOccupancy: data.maxOccupancy,
    },
  });
}

// Deleta (soft delete) um tipo de quarto
export async function deleteRoomTypeService(roomTypeId: string, userId: string) {
  await checkRoomTypePermissions(roomTypeId, userId);
  return prisma.roomType.update({
    where: { id: roomTypeId },
    data: { deletedAt: new Date() },
  });
}

// --- NOVAS FUNÇÕES ---

// Associa uma comodidade a um tipo de quarto
export async function addAmenityToRoomTypeService(roomTypeId: string, amenityId: string, userId: string) {
  const roomType = await checkRoomTypePermissions(roomTypeId, userId);

  const amenity = await prisma.amenity.findFirst({ where: { id: amenityId, deletedAt: null } });
  if (!amenity) throw new Error('Comodidade não encontrada.');
  if (amenity.pousadaId !== roomType.pousadaId) {
    throw new Error('Comodidade não pertence à mesma pousada do tipo de quarto.');
  }

  // Cria o vínculo na tabela de junção
  return prisma.roomTypeAmenity.create({
    data: {
      roomTypeId,
      amenityId,
    },
  });
}

// Remove a associação de uma comodidade de um tipo de quarto
export async function removeAmenityFromRoomTypeService(roomTypeId: string, amenityId: string, userId: string) {
    await checkRoomTypePermissions(roomTypeId, userId);

    return prisma.roomTypeAmenity.delete({
        where: {
            roomTypeId_amenityId: {
                roomTypeId,
                amenityId,
            }
        }
    });
}

