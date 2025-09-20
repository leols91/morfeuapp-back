import { Prisma } from '@prisma/client';
import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização
async function checkFolioPermissions(folioId: string, userId: string) {
  const folio = await prisma.folio.findFirst({
    where: { id: folioId, deletedAt: null },
    include: { reserva: true },
  });
  if (!folio) throw new Error('Folio não encontrado.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: folio.reserva.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return folio;
}

// Lista todos os pagamentos de um folio
export async function listPaymentsService(folioId: string, userId: string) {
  await checkFolioPermissions(folioId, userId);
  return prisma.payment.findMany({
    where: { folioId, deletedAt: null },
    include: { method: true, account: true },
    orderBy: { createdAt: 'desc' },
  });
}

// Cria um novo pagamento
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPaymentService(data: any, folioId: string, userId: string) {
  const folio = await checkFolioPermissions(folioId, userId);

  const { accountId, methodCode, amount, reference } = data;
  const paymentAmount = new Decimal(amount);

  // Validação: a conta financeira existe e pertence à pousada?
  const account = await prisma.cashAccount.findFirst({
    where: { id: accountId, deletedAt: null, pousadaId: folio.reserva.pousadaId },
  });
  if (!account) throw new Error('Conta financeira não encontrada ou não pertence a esta pousada.');

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Criar o registro do Pagamento
    const payment = await tx.payment.create({
      data: {
        folioId,
        accountId,
        methodCode,
        amount: paymentAmount,
        reference,
      },
    });

    // 2. Criar o lançamento no livro caixa (crédito)
    await tx.cashLedger.create({
      data: {
        accountId,
        entryType: 'credit',
        amount: paymentAmount,
        reference: `Recebimento da reserva #${folio.reservaId}`,
      },
    });

    // 3. Atualizar (abater) o saldo do Folio
    await tx.folio.update({
      where: { id: folioId },
      data: {
        balance: {
          decrement: paymentAmount,
        },
      },
    });

    return payment;
  });
}

// Excluir (soft delete) um pagamento é uma operação complexa que exigiria estorno.
// Por enquanto, vamos implementar um delete simples.
export async function deletePaymentService(paymentId: string, userId: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { folio: true } });
  if (!payment) throw new Error('Pagamento não encontrado.');

  // Validação de permissão usando o folio do pagamento
  await checkFolioPermissions(payment.folioId, userId);

  // ATENÇÃO: Uma exclusão real deveria estornar o saldo do folio e o lançamento no caixa.
  return prisma.payment.update({
    where: { id: paymentId },
    data: { deletedAt: new Date() },
  });
}
