

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
    include: { folio: { include: { entries: true } } },
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

  // Se o folio ainda não existe para esta reserva, podemos criá-lo aqui (lógica de check-in)
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
      data: {
        balance: {
          increment: total,
        },
      },
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
            unitCost: produto.costPrice, // Opcional: registrar custo da venda
            note: `Venda para a reserva #${folio.reservaId}`,
          },
        });
      }
    }

    return newEntry;
  });
}
