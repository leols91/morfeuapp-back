import { prisma } from '../../core/database/prisma.js';

/**
 * Lista todas as pousadas associadas a um usuário específico.
 * @param userId O ID do usuário logado.
 */
export async function listPousadasForUserService(userId: string) {
  const userPousadaLinks = await prisma.usuarioPousada.findMany({
    where: {
      usuarioId: userId,
    },
    include: {
      pousada: true,
    },
  });

  const pousadas = userPousadaLinks.map((link) => link.pousada);
  return pousadas;
}

/**
 * Busca os detalhes de uma única pousada, verificando o acesso do usuário.
 * @param pousadaId O ID da pousada a ser buscada.
 * @param userId O ID do usuário logado para verificação de permissão.
 */
export async function getPousadaByIdService(pousadaId: string, userId: string) {
  // 1. Verificação de Autorização: O usuário logado pertence a esta pousada?
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      pousadaId: pousadaId,
      usuarioId: userId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado. Você não tem permissão para visualizar esta pousada.');
  }

  // 2. Buscar a Pousada
  const pousada = await prisma.pousada.findUnique({
    where: { id: pousadaId },
  });

  if (!pousada) {
    throw new Error('Pousada não encontrada.');
  }

  return pousada;
}

/**
 * Cria uma nova pousada e a vincula ao usuário que a criou.
 * @param pousadaData Os dados da nova pousada.
 * @param userId O ID do usuário que está criando a pousada.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPousadaService(pousadaData: any, userId: string) {
  const novaPousada = await prisma.$transaction(async (tx) => {
    const pousada = await tx.pousada.create({
      data: {
        legalName: pousadaData.legalName,
        tradeName: pousadaData.tradeName,
        phone: pousadaData.phone,
      },
    });

    await tx.usuarioPousada.create({
      data: {
        pousadaId: pousada.id,
        usuarioId: userId,
        isDefault: true,
      },
    });
    return pousada;
  });
  return novaPousada;
}

/**
 * Atualiza os dados de uma pousada existente, verificando o acesso do usuário.
 * @param pousadaId O ID da pousada a ser atualizada.
 * @param data Os novos dados para a pousada.
 * @param userId O ID do usuário logado para verificação de permissão.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePousadaService(pousadaId: string, data: any, userId: string) {
  // 1. Verificação de Autorização
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      pousadaId: pousadaId,
      usuarioId: userId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado. Você não tem permissão para modificar esta pousada.');
  }

  // 2. Atualizar a Pousada
  const updatedPousada = await prisma.pousada.update({
    where: { id: pousadaId },
    data: {
      legalName: data.legalName,
      tradeName: data.tradeName,
      phone: data.phone,
      monthlyProrationMode: data.monthlyProrationMode,
    },
  });

  return updatedPousada;
}