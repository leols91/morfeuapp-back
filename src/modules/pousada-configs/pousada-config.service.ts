import { prisma } from '../../core/database/prisma.js';

// Lista todas as configs de uma pousada
export async function listPousadaConfigsService(pousadaId: string, userId: string) {
  // --- DEBUGGING DEFINITIVO ---
  // Vamos imprimir os IDs que o serviço está recebendo para a verificação.
  console.log('--- Verificando Permissões ---');
  console.log('ID do Usuário (do token):', userId);
  console.log('ID da Pousada (da URL):', pousadaId);
  // --- FIM DO DEBUGGING ---

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });

  // --- DEBUGGING DEFINITIVO ---
  if (userHasAccess) {
    console.log('✅ Acesso Permitido: Vínculo encontrado no banco de dados.');
  } else {
    console.error('❌ Acesso Negado: Nenhum vínculo encontrado para esta combinação de usuário e pousada.');
  }
  // --- FIM DO DEBUGGING ---

  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.pousadaConfig.findMany({
    where: { pousadaId, deletedAt: null },
  });
}

// Cria ou atualiza uma config (Upsert)
export async function upsertPousadaConfigService(
  data: { configName: string; configValue: string },
  pousadaId: string,
  userId: string,
) {
  // --- DEBUGGING DEFINITIVO ---
  console.log('--- Verificando Permissões (Upsert) ---');
  console.log('ID do Usuário (do token):', userId);
  console.log('ID da Pousada (da URL):', pousadaId);
  // --- FIM DO DEBUGGING ---

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: pousadaId,
      },
    },
  });

  if (userHasAccess) {
    console.log('✅ Acesso Permitido (Upsert): Vínculo encontrado.');
  } else {
    console.error('❌ Acesso Negado (Upsert): Nenhum vínculo encontrado.');
  }

  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.pousadaConfig.upsert({
    where: {
      pousadaId_configName: {
        pousadaId: pousadaId,
        configName: data.configName,
      },
    },
    update: {
      configValue: data.configValue,
    },
    create: {
      pousadaId,
      configName: data.configName,
      configValue: data.configValue,
    },
  });
}

