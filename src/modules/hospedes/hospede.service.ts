import { prisma } from '../../core/database/prisma.js';

// Helper de autorização para evitar repetição de código
async function checkHospedePermissions(hospedeId: string, userId: string) {
  const hospede = await prisma.hospede.findFirst({
    where: { id: hospedeId, deletedAt: null },
  });

  if (!hospede) {
    throw new Error('Hóspede não encontrado.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: hospede.pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return hospede;
}

// Lista todos os hóspedes de uma pousada
export async function listHospedesService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.hospede.findMany({
    where: { pousadaId, deletedAt: null },
    orderBy: { fullName: 'asc' },
  });
}

// Busca um hóspede específico por ID
export async function getHospedeByIdService(hospedeId: string, userId: string) {
  const hospede = await checkHospedePermissions(hospedeId, userId);
  return hospede;
}

// Cria um novo hóspede
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createHospedeService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.hospede.create({
    data: {
      pousadaId,
      fullName: data.fullName,
      documentId: data.documentId,
      documentType: data.documentType,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      address: data.address,
      notes: data.notes,
      blacklisted: data.blacklisted,
    },
  });
}

// Atualiza um hóspede existente
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateHospedeService(hospedeId: string, data: any, userId: string) {
  await checkHospedePermissions(hospedeId, userId);

  return prisma.hospede.update({
    where: { id: hospedeId },
    data: {
      fullName: data.fullName,
      documentId: data.documentId,
      documentType: data.documentType,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      address: data.address,
      notes: data.notes,
      blacklisted: data.blacklisted,
    },
  });
}

// Exclui (soft delete) um hóspede
export async function deleteHospedeService(hospedeId: string, userId: string) {
  await checkHospedePermissions(hospedeId, userId);

  return prisma.hospede.update({
    where: { id: hospedeId },
    data: { deletedAt: new Date() },
  });
}
