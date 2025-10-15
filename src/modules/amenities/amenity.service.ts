import { prisma } from '../../core/database/prisma.js';

// Helper de autorização
async function checkAmenityPermissions(amenityId: string, userId: string) {
  const amenity = await prisma.amenity.findFirst({
    where: { id: amenityId, deletedAt: null },
  });
  if (!amenity) throw new Error('Comodidade não encontrada.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: amenity.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return amenity;
}

// Lista todas as comodidades de uma pousada
export async function listAmenitiesService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.amenity.findMany({
    where: { pousadaId, deletedAt: null },
    orderBy: { name: 'asc' },
  });
}

// Cria uma nova comodidade
export async function createAmenityService(data: { name: string }, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.amenity.create({
    data: {
      pousadaId,
      name: data.name,
    },
  });
}

// Atualiza uma comodidade
export async function updateAmenityService(amenityId: string, data: { name: string }, userId: string) {
  await checkAmenityPermissions(amenityId, userId);
  return prisma.amenity.update({
    where: { id: amenityId },
    data: { name: data.name },
  });
}

// Exclui (soft delete) uma comodidade
export async function deleteAmenityService(amenityId: string, userId: string) {
  await checkAmenityPermissions(amenityId, userId);
  return prisma.amenity.update({
    where: { id: amenityId },
    data: { deletedAt: new Date() },
  });
}
