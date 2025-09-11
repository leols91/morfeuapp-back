import { prisma } from '../../core/database/prisma.js';

// Helper de autorização para evitar repetição
async function checkReservaPermissions(reservaId: string, userId: string) {
  const reserva = await prisma.reserva.findFirst({
    where: { id: reservaId, deletedAt: null },
    select: { pousadaId: true },
  });

  if (!reserva) {
    throw new Error('Reserva não encontrada.');
  }

  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: {
      usuarioId: userId,
      pousadaId: reserva.pousadaId,
    },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return reserva;
}

// Lista todas as reservas de uma pousada
export async function listReservasService(pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  return prisma.reserva.findMany({
    where: { pousadaId, deletedAt: null },
    include: {
      hospedes: { include: { hospede: true } },
      alocacoes: { include: { quarto: true, cama: true } },
    },
    orderBy: { checkinDate: 'asc' },
  });
}

// Busca uma reserva específica por ID
export async function getReservaByIdService(reservaId: string, userId: string) {
  await checkReservaPermissions(reservaId, userId);
  return prisma.reserva.findUnique({
    where: { id: reservaId },
    include: {
      hospedes: { include: { hospede: true } },
      alocacoes: { include: { quarto: true, cama: true } },
    },
  });
}

// Cria uma nova reserva
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createReservaService(data: any, pousadaId: string, userId: string) {
  const userHasAccess = await prisma.usuarioPousada.findFirst({
    where: { usuarioId: userId, pousadaId: pousadaId },
  });

  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  const { hospedeId, quartoId, checkinDate, checkoutDate } = data;

  // Lógica de Prevenção de Overbooking
  const conflictingAllocation = await prisma.reservaAlocacao.findFirst({
    where: {
      quartoId: quartoId,
      // camaId: data.camaId, // Para reservas compartilhadas
      reserva: { deletedAt: null }, // Apenas considera alocações de reservas ativas
      // Lógica de intersecção de datas:
      // A nova reserva começa antes que uma existente termine E
      // a nova reserva termina depois que a existente começa.
      checkinDate: { lt: new Date(checkoutDate) },
      checkoutDate: { gt: new Date(checkinDate) },
    },
  });

  if (conflictingAllocation) {
    throw new Error('Conflito de datas. O quarto já está reservado para este período.');
  }

  // Usamos uma transação para garantir que tudo seja criado junto
  return prisma.$transaction(async (tx) => {
    // 1. Criar a Reserva
    const novaReserva = await tx.reserva.create({
      data: {
        pousadaId: pousadaId,
        reservationType: data.reservationType || 'nightly',
        reservationClass: data.reservationClass || 'private',
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        adults: data.adults,
        children: data.children,
      },
    });

    // 2. Vincular o Hóspede Principal
    await tx.reservaHospede.create({
      data: {
        reservaId: novaReserva.id,
        hospedeId: hospedeId,
        isPrimary: true,
      },
    });

    // 3. Criar a Alocação (ocupar o quarto)
    await tx.reservaAlocacao.create({
      data: {
        reservaId: novaReserva.id,
        quartoId: quartoId,
        // camaId: data.camaId, // Para reservas compartilhadas
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
      },
    });

    return novaReserva;
  });
}

// Atualiza uma reserva (simplificado, pode ser expandido)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateReservaService(reservaId: string, data: any, userId: string) {
  await checkReservaPermissions(reservaId, userId);
  // ATENÇÃO: Uma atualização real exigiria revalidar o overbooking
  // e ajustar as alocações, o que é uma lógica complexa.
  // Esta é uma versão simplificada para atualizar dados básicos.
  return prisma.reserva.update({
    where: { id: reservaId },
    data: {
      adults: data.adults,
      children: data.children,
    },
  });
}

// Exclui (soft delete) uma reserva
export async function deleteReservaService(reservaId: string, userId: string) {
  await checkReservaPermissions(reservaId, userId);
  return prisma.reserva.update({
    where: { id: reservaId },
    data: { deletedAt: new Date() },
  });
}
