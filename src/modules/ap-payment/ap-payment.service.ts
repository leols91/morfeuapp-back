import { Prisma } from '@prisma/client';
import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAPPaymentService(data: any, apInvoiceId: string, userId: string) {
  // 1. Verificar permissões e existência da fatura e da conta
  const invoice = await prisma.aPInvoice.findFirst({
    where: { id: apInvoiceId, deletedAt: null },
    include: { payments: true },
  });
  if (!invoice) throw new Error('Fatura não encontrada.');

  const account = await prisma.cashAccount.findFirst({
    where: { id: data.accountId, deletedAt: null, pousadaId: invoice.pousadaId },
  });
  if (!account) throw new Error('Conta financeira não encontrada ou não pertence a esta pousada.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: invoice.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  const paymentAmount = new Decimal(data.amount);

  // 2. Verificar se o pagamento não excede o saldo devedor
  const totalPaid = invoice.payments.reduce(
    (acc, p) => acc.add(p.amount),
    new Decimal(0),
  );
  const balanceDue = invoice.amount.sub(totalPaid);

  if (paymentAmount.greaterThan(balanceDue.add(new Decimal(0.01)))) { // Adiciona margem para arredondamento
    throw new Error(`Valor do pagamento (R$ ${paymentAmount}) excede o saldo devedor (R$ ${balanceDue}).`);
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 3. Criar o registro de pagamento (APPayment)
    const payment = await tx.aPPayment.create({
      data: {
        apInvoiceId,
        accountId: data.accountId,
        amount: paymentAmount,
        paidAt: new Date(data.paidAt),
      },
    });

    // 4. Criar o lançamento no livro caixa (CashLedger)
    await tx.cashLedger.create({
      data: {
        accountId: data.accountId,
        entryType: 'debit',
        amount: paymentAmount,
        reference: `Pagamento da fatura #${invoice.id}`,
      },
    });

    // 5. Atualizar o status da fatura (paga/parcialmente paga)
    const newTotalPaid = totalPaid.add(paymentAmount);
    let newStatus = invoice.status;
    if (newTotalPaid.greaterThanOrEqualTo(invoice.amount)) {
      newStatus = 'paid';
    } else if (newTotalPaid.greaterThan(0)) {
      newStatus = 'partially_paid';
    }

    await tx.aPInvoice.update({
      where: { id: apInvoiceId },
      data: { status: newStatus },
    });

    return payment;
  });
}

