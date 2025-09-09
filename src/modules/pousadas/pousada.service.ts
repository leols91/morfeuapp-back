import { prisma } from '../../core/database/prisma.js';

/**
 * Lista todas as pousadas associadas a um determinado usuário.
 * @param userId - O ID do usuário logado.
 * @returns Uma lista de objetos de pousada.
 */
export async function listPousadasForUserService(userId: string) {
  // 1. Busca todos os registros na tabela de vínculo que pertencem ao usuário
  const userPousadaLinks = await prisma.usuarioPousada.findMany({
    where: {
      usuarioId: userId,
    },
    // 2. Para cada registro encontrado, inclui os dados completos da pousada relacionada
    include: {
      pousada: true,
    },
  });

  // 3. Extrai apenas os objetos 'pousada' da lista de vínculos e os retorna
  const pousadas = userPousadaLinks.map((link) => link.pousada);

  return pousadas;
}

/**
 * Cria uma nova pousada e a vincula ao usuário que a criou.
 * @param pousadaData - Dados da nova pousada (legalName, tradeName).
 * @param userId - O ID do usuário que está criando a pousada.
 * @returns O objeto da pousada recém-criada.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPousadaService(pousadaData: any, userId: string) {
  const novaPousada = await prisma.$transaction(async (tx) => {
    // 1. Criar a Pousada
    const pousada = await tx.pousada.create({
      data: {
        legalName: pousadaData.legalName,
        tradeName: pousadaData.tradeName,
      },
    });

    // 2. Criar o vínculo entre o usuário que criou e a nova pousada
    await tx.usuarioPousada.create({
      data: {
        pousadaId: pousada.id,
        usuarioId: userId,
        isDefault: true,
      },
    });

    // 3. Retornar a pousada criada
    return pousada;
  });

  return novaPousada;
}

