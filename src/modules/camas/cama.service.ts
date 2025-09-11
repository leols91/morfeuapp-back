import { prisma } from '../../core/database/prisma.js';

/**
 * Helper function to check user access to the pousada a quarto belongs to.
 * @param quartoId The ID of the quarto.
 * @param userId The ID of the logged-in user.
 * @returns The quarto object if access is granted.
 * @throws An error if access is denied or the quarto is not found.
 */
async function checkQuartoAccess(quartoId: string, userId: string) {
  const quarto = await prisma.quarto.findUnique({
    where: { id: quartoId },
    include: { roomType: true }, // Include roomType for business logic checks
  });

  if (!quarto) {
    throw new Error('Quarto não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: quarto.pousadaId,
      },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado. Você não tem permissão para modificar este quarto.');
  }

  return quarto;
}

/**
 * Gets a specific cama by its ID.
 * @param camaId The ID of the cama to retrieve.
 * @param userId The ID of the logged-in user for permission checking.
 */
export async function getCamaByIdService(camaId: string, userId: string) {
  const cama = await prisma.cama.findUnique({
    where: { id: camaId },
    include: { quarto: true },
  });

  if (!cama) {
    throw new Error('Cama não encontrada.');
  }

  // Check if the user has access to the pousada this cama belongs to
  await checkQuartoAccess(cama.quartoId, userId);

  return cama;
}


/**
 * Lists all camas for a specific quarto.
 * @param quartoId The ID of the quarto.
 * @param userId The ID of the logged-in user for permission checking.
 */
export async function listCamasService(quartoId: string, userId: string) {
  // Checks if the quarto exists and if the user has access to its pousada
  await checkQuartoAccess(quartoId, userId);

  return await prisma.cama.findMany({
    where: { quartoId },
    orderBy: { code: 'asc' },
  });
}


/**
 * Creates a new cama in a quarto.
 * @param data The data for the new cama.
 * @param quartoId The ID of the quarto.
 * @param userId The ID of the logged-in user.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCamaService(data: any, quartoId: string, userId: string) {
  const quarto = await checkQuartoAccess(quartoId, userId);

  // Business logic check: Only shared rooms can have camas
  if (quarto.roomType.occupancyMode !== 'shared') {
    throw new Error('Não é possível adicionar camas a um quarto privado.');
  }

  const cama = await prisma.cama.create({
    data: {
      quartoId: quartoId,
      code: data.code,
      description: data.description,
    },
  });

  return cama;
}

/**
 * Updates an existing cama.
 * @param camaId The ID of the cama to update.
 * @param data The new data for the cama.
 * @param userId The ID of the logged-in user.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateCamaService(camaId: string, data: any, userId: string) {
  const camaToUpdate = await prisma.cama.findUnique({
    where: { id: camaId },
    include: { quarto: true }, // Include quarto to get its pousadaId
  });

  if (!camaToUpdate) {
    throw new Error('Cama não encontrada.');
  }

  // Check user access based on the cama's pousada
  await checkQuartoAccess(camaToUpdate.quartoId, userId);

  return await prisma.cama.update({
    where: { id: camaId },
    data: {
      code: data.code,
      description: data.description,
    },
  });
}

