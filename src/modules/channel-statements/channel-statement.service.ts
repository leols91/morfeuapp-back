import { Prisma } from '@prisma/client';
import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização
async function checkStatementPermissions(statementId: string, userId: string) {
  const statement = await prisma.channelStatement.findFirst({
    where: { id: statementId, deletedAt: null },
    include: { channel: true },
  });
  if (!statement) throw new Error('Extrato não encontrado.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: statement.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return statement;
}

// Lista os extratos de um canal
export async function listStatementsService(channelId: string, userId: string) {
  const channel = await prisma.salesChannel.findFirst({ where: { id: channelId } });
  if (!channel) throw new Error('Canal de venda não encontrado.');

  // CORRIGIDO: Usando a estrutura correta para a chave composta
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: channel.pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.channelStatement.findMany({
    where: { channelId, deletedAt: null },
    orderBy: { periodEnd: 'desc' },
  });
}

// Cria um novo extrato, agrupando comissões de um período
export async function createStatementService(data: { periodStart: string, periodEnd: string, generateInvoice?: boolean }, channelId: string, userId: string) {
  const channel = await prisma.salesChannel.findFirst({
    where: { id: channelId },
  });
  if (!channel) throw new Error('Canal de venda não encontrado.');
  if (!channel.supplierId && data.generateInvoice) {
    throw new Error('Para gerar uma fatura, o canal de venda precisa estar associado a um fornecedor.');
  }

  // CORRIGIDO: Usando a estrutura correta para a chave composta
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: channel.pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  const startDate = new Date(data.periodStart);
  const endDate = new Date(data.periodEnd);

  // Encontra todas as comissões provisionadas no período que ainda não pertencem a um extrato
  const accrualsToProcess = await prisma.channelCommissionAccrual.findMany({
    where: {
      channelId,
      statementId: null,
      deletedAt: null,
      createdAt: { gte: startDate, lte: endDate },
    },
  });

  if (accrualsToProcess.length === 0) {
    throw new Error('Nenhuma comissão a ser processada para este período.');
  }

  const totalCommission = accrualsToProcess.reduce(
    (acc, item) => acc.add(item.commissionAmount),
    new Decimal(0),
  );

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Criar o Extrato (Statement)
    const statement = await tx.channelStatement.create({
      data: {
        pousadaId: channel.pousadaId,
        channelId,
        periodStart: startDate,
        periodEnd: endDate,
        status: 'closed',
      },
    });

    // 2. Vincular as comissões ao novo extrato
    await tx.channelCommissionAccrual.updateMany({
      where: {
        id: { in: accrualsToProcess.map((acc) => acc.id) },
      },
      data: {
        statementId: statement.id,
      },
    });

    // 3. (Opcional) Gerar a Fatura de Despesa para o fornecedor do canal
    if (data.generateInvoice && channel.supplierId) {
      await tx.aPInvoice.create({
        data: {
          pousadaId: channel.pousadaId,
          supplierId: channel.supplierId,
          description: `Comissão ${channel.name} - Período: ${startDate.toLocaleDateString()}-${endDate.toLocaleDateString()}`,
          amount: totalCommission,
          dueDate: new Date(), // Pode ser ajustado
          status: 'open',
        },
      });
    }

    return { ...statement, totalCommission: totalCommission.toFixed(2), processedItems: accrualsToProcess.length };
  });
}

