import { prisma } from '../../core/database/prisma.js';

/**
 * Verifica se o usuário tem acesso a uma pousada específica.
 * Lança um erro se o acesso for negado.
 * @param pousadaId O ID da pousada a ser verificada.
 * @param userId O ID do usuário logado.
 */
async function checkPousadaAccess(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      pousadaId: pousadaId,
      usuarioId: userId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado. Você não tem permissão para acessar recursos desta pousada.');
  }
}

/**
 * Lista todos os quartos de uma pousada específica.
 * @param pousadaId O ID da pousada.
 * @param userId O ID do usuário logado para verificação de permissão.
 */
export async function listQuartosService(pousadaId: string, userId: string) {
  await checkPousadaAccess(pousadaId, userId);

  return await prisma.quarto.findMany({
    where: { pousadaId },
    include: {
      roomType: true,
      roomStatus: true,
      housekeepingStatus: true,
    },
    orderBy: {
      code: 'asc',
    },
  });
}

/**
 * Busca os detalhes de um único quarto, verificando o acesso do usuário.
 * @param quartoId O ID do quarto a ser buscado.
 * @param userId O ID do usuário logado.
 */
export async function getQuartoByIdService(quartoId: string, userId: string) {
  const quarto = await prisma.quarto.findUnique({
    where: { id: quartoId },
    include: {
      roomType: true,
      roomStatus: true,
      housekeepingStatus: true,
    },
  });

  if (!quarto) {
    throw new Error('Quarto não encontrado.');
  }

  // A verificação de acesso é feita com base na pousada do quarto encontrado
  await checkPousadaAccess(quarto.pousadaId, userId);

  return quarto;
}

/**
 * Cria um novo quarto dentro de uma pousada.
 * @param data Os dados do novo quarto.
 * @param pousadaId O ID da pousada onde o quarto será criado.
 * @param userId O ID do usuário logado.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createQuartoService(data: any, pousadaId: string, userId: string) {
  await checkPousadaAccess(pousadaId, userId);

  // 1. Validação de Regra de Negócio: O roomTypeId pertence a esta pousada?
  const roomType = await prisma.roomType.findFirst({
    where: {
      id: data.roomTypeId,
      pousadaId: pousadaId,
    },
  });
  if (!roomType) {
    throw new Error('Tipo de Quarto inválido ou não pertence a esta pousada.');
  }

  // 2. Criar o Quarto
  const quarto = await prisma.quarto.create({
    data: {
      pousadaId: pousadaId,
      roomTypeId: data.roomTypeId,
      code: data.code,
      floor: data.floor,
      description: data.description,
      roomStatusCode: 'available', // Default
      housekeepingStatusCode: 'clean', // Default
    },
  });
  return quarto;
}

/**
 * Atualiza os dados de um quarto existente.
 * @param quartoId O ID do quarto a ser atualizado.
 * @param data Os novos dados para o quarto.
 * @param userId O ID do usuário logado.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateQuartoService(quartoId: string, data: any, userId: string) {
  // Para atualizar, primeiro precisamos buscar o quarto para saber a qual pousada ele pertence
  const quartoToUpdate = await prisma.quarto.findUnique({
    where: { id: quartoId },
  });

  if (!quartoToUpdate) {
    throw new Error('Quarto não encontrado.');
  }

  // Agora verificamos se o usuário tem acesso à pousada do quarto
  await checkPousadaAccess(quartoToUpdate.pousadaId, userId);

  // Atualizar o Quarto
  const updatedQuarto = await prisma.quarto.update({
    where: { id: quartoId },
    data: {
      code: data.code,
      floor: data.floor,
      description: data.description,
      roomStatusCode: data.roomStatusCode,
      housekeepingStatusCode: data.housekeepingStatusCode,
    },
  });
  return updatedQuarto;
}

