import { prisma } from '../../core/database/prisma.js';

/**
 * Helper function to check if a user has access to a specific pousada.
 * Throws an error if access is denied.
 * @param pousadaId The ID of the pousada to check.
 * @param userId The ID of the logged-in user.
 */
async function checkPousadaAccess(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado. Você não tem permissão para acessar recursos desta pousada.');
  }
}

/**
 * Lists all room types for a specific pousada.
 * @param pousadaId The ID of the pousada.
 * @param userId The ID of the logged-in user for permission checking.
 */
export async function listRoomTypesService(pousadaId: string, userId: string) {
  await checkPousadaAccess(pousadaId, userId);

  return await prisma.roomType.findMany({
    where: { pousadaId },
    orderBy: { name: 'asc' },
  });
}

/**
 * Gets a single room type by its ID, checking user access.
 * @param roomTypeId The ID of the room type to fetch.
 * @param userId The ID of the logged-in user.
 */
export async function getRoomTypeByIdService(roomTypeId: string, userId: string) {
  const roomType = await prisma.roomType.findUnique({
    where: { id: roomTypeId },
  });

  if (!roomType) {
    throw new Error('Tipo de Quarto não encontrado.');
  }

  // Permission check is based on the pousada of the found room type
  await checkPousadaAccess(roomType.pousadaId, userId);
  return roomType;
}

/**
 * Creates a new room type for a pousada.
 * @param data The data for the new room type.
 * @param pousadaId The ID of the pousada.
 * @param userId The ID of the logged-in user.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRoomTypeService(data: any, pousadaId: string, userId: string) {
  await checkPousadaAccess(pousadaId, userId);

  const roomType = await prisma.roomType.create({
    data: {
      pousadaId: pousadaId,
      name: data.name,
      description: data.description,
      occupancyMode: data.occupancyMode,
      baseOccupancy: data.baseOccupancy,
      maxOccupancy: data.maxOccupancy,
    },
  });

  return roomType;
}

/**
 * Updates an existing room type.
 * @param roomTypeId The ID of the room type to update.
 * @param data The new data for the room type.
 * @param userId The ID of the logged-in user.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateRoomTypeService(roomTypeId: string, data: any, userId: string) {
  const roomTypeToUpdate = await prisma.roomType.findUnique({
    where: { id: roomTypeId },
  });

  if (!roomTypeToUpdate) {
    throw new Error('Tipo de Quarto não encontrado.');
  }

  await checkPousadaAccess(roomTypeToUpdate.pousadaId, userId);

  return await prisma.roomType.update({
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

