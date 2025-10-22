import { prisma } from '../../core/database/prisma.js';

// Helper de autorização
async function checkQuartoPermissions(quartoId: string, userId: string) {
  const quarto = await prisma.quarto.findFirst({
    where: { id: quartoId, deletedAt: null },
  });
  if (!quarto) throw new Error('Quarto não encontrado.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: quarto.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return quarto;
}

// Lista os quartos de uma pousada
export async function listQuartosService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.quarto.findMany({
    where: { pousadaId, deletedAt: null },
    include: {
      roomType: true,
      roomStatus: true,
      housekeepingStatus: true,
    },
    orderBy: { code: 'asc' },
  });
}

// Busca um quarto por ID, incluindo suas comodidades herdadas e próprias
export async function getQuartoByIdService(quartoId: string, userId: string) {
  await checkQuartoPermissions(quartoId, userId);
  return prisma.quarto.findUnique({
    where: { id: quartoId },
    include: {
        roomType: {
            include: {
                amenities: {
                    include: {
                        amenity: true
                    }
                }
            }
        },
        amenities: { // Inclui as comodidades específicas do quarto
          include: {
            amenity: true,
          },
        },
        camas: { where: { deletedAt: null } },
    }
  });
}

// Cria um novo Quarto
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createQuartoService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.quarto.create({
    data: {
      pousadaId,
      roomTypeId: data.roomTypeId,
      code: data.code,
      name: data.name, // --- CAMPO ADICIONADO ---
      floor: data.floor,
      description: data.description,
      baseOccupancy: data.baseOccupancy,
      maxOccupancy: data.maxOccupancy,
      roomStatusCode: 'available',
      housekeepingStatusCode: 'clean',
    },
  });
}

// Atualiza um quarto existente
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateQuartoService(quartoId: string, data: any, userId: string) {
  await checkQuartoPermissions(quartoId, userId);

  return prisma.quarto.update({
    where: { id: quartoId },
    data: {
      roomTypeId: data.roomTypeId,
      code: data.code,
      name: data.name, // --- CAMPO ADICIONADO ---
      floor: data.floor,
      description: data.description,
      baseOccupancy: data.baseOccupancy,
      maxOccupancy: data.maxOccupancy,
      roomStatusCode: data.roomStatusCode,
      housekeepingStatusCode: data.housekeepingStatusCode,
    },
  });
}

// Deleta (soft delete) um quarto
export async function deleteQuartoService(quartoId: string, userId: string) {
  await checkQuartoPermissions(quartoId, userId);
  return prisma.quarto.update({
    where: { id: quartoId },
    data: { deletedAt: new Date() },
  });
}

// --- Funções para gerenciar comodidades específicas do quarto ---

// Associa uma comodidade diretamente a um quarto
export async function addAmenityToQuartoService(quartoId: string, amenityId: string, userId: string) {
  const quarto = await checkQuartoPermissions(quartoId, userId);

  const amenity = await prisma.amenity.findFirst({ where: { id: amenityId, deletedAt: null } });
  if (!amenity) throw new Error('Comodidade não encontrada.');
  if (amenity.pousadaId !== quarto.pousadaId) {
    throw new Error('Comodidade não pertence à mesma pousada do quarto.');
  }

  return prisma.quartoAmenity.create({
    data: {
      quartoId,
      amenityId,
    },
  });
}

// Remove a associação de uma comodidade de um quarto
export async function removeAmenityFromQuartoService(quartoId: string, amenityId: string, userId: string) {
  await checkQuartoPermissions(quartoId, userId);

  return prisma.quartoAmenity.delete({
    where: {
      quartoId_amenityId: {
        quartoId,
        amenityId,
      },
    },
  });
}

