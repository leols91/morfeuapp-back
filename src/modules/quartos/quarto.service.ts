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

// Busca um quarto por ID
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
        camas: true,
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
      floor: data.floor,
      description: data.description,
      // --- LÓGICA DE OVERRIDE ADICIONADA ---
      baseOccupancy: data.baseOccupancy, // Será salvo se enviado, senão null
      maxOccupancy: data.maxOccupancy,   // Será salvo se enviado, senão null
      // --- FIM DA LÓGICA ---
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
      floor: data.floor,
      description: data.description,
      // --- LÓGICA DE OVERRIDE ADICIONADA ---
      baseOccupancy: data.baseOccupancy,
      maxOccupancy: data.maxOccupancy,
      // --- FIM DA LÓGICA ---
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

