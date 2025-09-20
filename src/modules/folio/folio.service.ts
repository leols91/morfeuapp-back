import { Prisma } from '@prisma/client';
import { prisma } from '../../core/database/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

// Helper de autorização para operações no Folio
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

// Busca um folio pelo ID da RESERVA
export async function getFolioByReservaIdService(reservaId: string, userId: string) {
  const reserva = await prisma.reserva.findFirst({
    where: { id: reservaId, deletedAt: null },
    include: {
      folio: {
        include: {
          entries: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' } },
        },
      },
    },
  });
  if (!reserva) throw new Error('Reserva não encontrada.');

  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: {
      usuarioId_pousadaId: {
        usuarioId: userId,
        pousadaId: reserva.pousadaId,
      },
    },
  });
  if (!userHasAccess) throw new Error('Acesso negado.');

  // Se o folio ainda não existe para esta reserva, ele é criado (lógica de check-in)
  if (!reserva.folio) {
    const newFolio = await prisma.folio.create({
      data: { reservaId: reservaId },
    });
    return { ...newFolio, entries: [] };
  }

  return reserva.folio;
}

// Adiciona uma nova entrada (lançamento) a um folio
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addFolioEntryService(data: any, folioId: string, userId: string) {
  const folio = await checkFolioPermissions(folioId, userId);

  const { kind, description, quantity, unitPrice, produtoId } = data;
  const total = new Decimal(quantity).mul(new Decimal(unitPrice));

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Criar a FolioEntry
    const newEntry = await tx.folioEntry.create({
      data: {
        folioId,
        kind,
        description,
        quantity: new Decimal(quantity),
        unitPrice: new Decimal(unitPrice),
        total,
        produtoId,
      },
    });

    // 2. Atualizar o saldo do Folio
    await tx.folio.update({
      where: { id: folioId },
      data: { balance: { increment: total } },
    });

    // 3. Se for um produto com controle de estoque, criar movimentação de saída
    if (kind === 'product' && produtoId) {
      const produto = await tx.produto.findUnique({ where: { id: produtoId } });
      if (produto?.stockControl) {
        await tx.stockMovement.create({
          data: {
            pousadaId: folio.reserva.pousadaId,
            produtoId,
            typeCode: 'out', // Saída de estoque
            quantity: new Decimal(quantity),
            unitCost: produto.costPrice,
            note: `Venda para a reserva #${folio.reservaId}`,
          },
        });
      }
    }

    return newEntry;
  });
}

// Atualiza um lançamento (simplificado, apenas descrição)
export async function updateFolioEntryService(entryId: string, data: { description: string }, userId: string) {
    const entry = await prisma.folioEntry.findFirst({ where: { id: entryId, deletedAt: null }, include: { folio: true }});
    if (!entry) throw new Error('Lançamento não encontrado.');

    // Usa o folioId do lançamento para checar as permissões
    await checkFolioPermissions(entry.folioId, userId);

    return prisma.folioEntry.update({
        where: { id: entryId },
        data: { description: data.description }
    });
}

// Exclui (soft delete) um lançamento do folio
export async function deleteFolioEntryService(entryId: string, userId: string) {
    const entry = await prisma.folioEntry.findFirst({ where: { id: entryId, deletedAt: null }, include: { folio: { include: { reserva: true } } }});
    if (!entry) throw new Error('Lançamento não encontrado.');

    // Usa o folioId do lançamento para checar as permissões
    await checkFolioPermissions(entry.folioId, userId);

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 1. Marcar o lançamento como excluído
        const deletedEntry = await tx.folioEntry.update({
            where: { id: entryId },
            data: { deletedAt: new Date() }
        });

        // 2. Abater o valor do saldo do folio (estornar o débito)
        await tx.folio.update({
            where: { id: entry.folioId },
            data: { balance: { decrement: deletedEntry.total } }
        });

        // 3. Se era um produto com controle de estoque, estornar o estoque (criar movimentação de entrada)
        if (deletedEntry.kind === 'product' && deletedEntry.produtoId) {
            const produto = await tx.produto.findUnique({ where: { id: deletedEntry.produtoId }});
            if (produto?.stockControl) {
                await tx.stockMovement.create({
                    data: {
                        pousadaId: entry.folio.reserva.pousadaId,
                        produtoId: deletedEntry.produtoId,
                        typeCode: 'in', // Entrada (estorno da saída)
                        quantity: deletedEntry.quantity,
                        unitCost: produto.costPrice,
                        note: `Estorno da venda da reserva #${entry.folio.reservaId}`
                    }
                });
            }
        }

        return deletedEntry;
    });
}

