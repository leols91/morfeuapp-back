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

// Cria uma nova fatura e seus itens, e atualiza o estoque se necessário
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAPInvoiceService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  const { supplierId, description, dueDate, items } = data;

  // Calcula o valor total da fatura a partir dos itens
  const totalAmount = items.reduce(
    (acc: Decimal, item: any) => acc.add(new Decimal(item.total)),
    new Decimal(0),
  );

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

    // 2. Criar os Itens da Fatura (APInvoiceItem)
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
            typeCode: 'in', // Entrada de estoque
            quantity: new Decimal(item.quantity),
            unitCost: new Decimal(item.unitCost),
            note: `Entrada via fatura #${invoice.id}`,
          },
        });
      }
    }

    return invoice;
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

