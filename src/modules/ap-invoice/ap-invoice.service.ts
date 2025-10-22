import { Prisma } from '@prisma/client';
import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização
async function checkInvoicePermissions(apInvoiceId: string, userId: string) {
  const invoice = await prisma.aPInvoice.findFirst({
    where: { id: apInvoiceId, deletedAt: null },
  });
  if (!invoice) throw new Error('Fatura não encontrada.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: invoice.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return invoice;
}

// Lista as faturas de uma pousada
export async function listAPInvoicesService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  return prisma.aPInvoice.findMany({
    where: { pousadaId, deletedAt: null },
    include: { supplier: true, items: true },
    orderBy: { dueDate: 'asc' },
  });
}

// O Update e Delete de faturas pode ser complexo (estornar estoque, etc.)
// Vamos mantê-los simples por enquanto.

export async function deleteAPInvoiceService(apInvoiceId: string, userId: string) {
  await checkInvoicePermissions(apInvoiceId, userId);
  // ATENÇÃO: Um soft delete real aqui deveria estornar o estoque.
  return prisma.aPInvoice.update({
    where: { id: apInvoiceId },
    data: { deletedAt: new Date() },
  });
}

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export async function createAPInvoiceService(data: any, pousadaId: string, userId: string) {
      const userHasAccess = await prisma.usuarioPousada.findUnique({
        where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
      });
      if (!userHasAccess) throw new Error('Acesso negado.');

      const { supplierId, description, dueDate, items } = data;

      // Validação: Garante que há itens na fatura
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('A fatura deve conter pelo menos um item.');
      }

      // Calcula o valor total da fatura a partir da soma dos itens
      const totalAmount = items.reduce(
        (acc: Decimal, item: any) => acc.add(new Decimal(item.total)),
        new Decimal(0),
      );

      // Usa uma transação para garantir que todas as operações sejam atômicas
      return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 1. Criar a Fatura (APInvoice)
        const invoice = await tx.aPInvoice.create({
          data: {
            pousadaId,
            supplierId,
            description,
            amount: totalAmount,
            dueDate: new Date(dueDate),
          },
        });

        // 2. Iterar sobre os itens e criá-los
        for (const item of items) {
          await tx.aPInvoiceItem.create({
            data: {
              apInvoiceId: invoice.id,
              apCategoryId: item.apCategoryId,
              produtoId: item.produtoId,
              description: item.description,
              quantity: new Decimal(item.quantity),
              unitCost: new Decimal(item.unitCost),
              total: new Decimal(item.total),
            },
          });

          // 3. Se o item estiver vinculado a um produto, criar a movimentação de estoque
          if (item.produtoId) {
            await tx.stockMovement.create({
              data: {
                pousadaId,
                produtoId: item.produtoId,
                typeCode: 'in', // Tipo "Entrada"
                quantity: new Decimal(item.quantity),
                unitCost: new Decimal(item.unitCost),
                note: `Entrada via fatura de compra. Fatura ID: ${invoice.id}`,
              },
            });
          }
        }

        // Retorna a fatura completa com seus itens
        return tx.aPInvoice.findUnique({
          where: { id: invoice.id },
          include: { items: true },
        });
      });
    }