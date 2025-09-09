import { prisma } from '../../core/database/prisma.js';

// --- Função para LISTAR quartos de uma pousada ---
export async function listQuartosService(pousadaId: string, userId: string) {
  // 1. Verificação de Autorização: O usuário logado tem acesso a esta pousada?
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado. Você não tem permissão para visualizar esta pousada.');
  }

  // 2. Buscar todos os quartos que pertencem à pousada especificada
  const quartos = await prisma.quarto.findMany({
    where: {
      pousadaId: pousadaId,
    },
    // Para ser mais útil para o frontend, incluímos os dados do Tipo de Quarto
    include: {
      roomType: true,
      roomStatus: true,
      housekeepingStatus: true,
    },
    orderBy: {
      code: 'asc', // Ordena os quartos pelo código (ex: 101, 102, 201)
    }
  });

  return quartos;
}


// --- Função para CRIAR um quarto (código existente) ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createQuartoService(
  data: any,
  pousadaId: string,
  userId: string,
) {
  // 1. Verificação de Autorização
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

  // 2. Verificar se o Tipo de Quarto pertence à mesma Pousada
  const roomType = await prisma.roomType.findUnique({
    where: { id: data.roomTypeId },
  });

  if (!roomType || roomType.pousadaId !== pousadaId) {
    throw new Error('Tipo de Quarto inválido ou não pertence a esta pousada.');
  }

  // 3. Criar o Quarto
  const quarto = await prisma.quarto.create({
    data: {
      pousadaId: pousadaId,
      roomTypeId: data.roomTypeId,
      code: data.code,
      floor: data.floor,
      description: data.description,
      // Status padrão ao criar um novo quarto
      roomStatusCode: 'available',
      housekeepingStatusCode: 'clean',
    },
  });

  return quarto;
}

