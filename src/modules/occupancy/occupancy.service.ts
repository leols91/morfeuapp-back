import { prisma } from '../../core/database/prisma.js';

// Lista os dados de ocupação para um período
export async function getOccupancyDataService(
  pousadaId: string,
  startDate: Date,
  endDate: Date,
  userId: string,
) {
  // 1. Verificação de Autorização
  const userHasAccess = await prisma.usuarioPousada.findUnique({
    where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
  });
  if (!userHasAccess) {
    throw new Error('Acesso negado.');
  }

  // 2. Busca pelas alocações que se sobrepõem com o período solicitado
  const alocacoes = await prisma.reservaAlocacao.findMany({
    where: {
      quarto: {
        pousadaId: pousadaId,
      },
      reserva: {
        deletedAt: null, // Apenas de reservas ativas
      },
      // Lógica de intersecção de datas:
      // A alocação começa antes do fim do período solicitado E
      // a alocação termina depois do início do período solicitado.
      checkinDate: { lt: endDate },
      checkoutDate: { gt: startDate },
    },
    include: {
      reserva: {
        include: {
          hospedes: {
            where: { isPrimary: true },
            include: {
              hospede: true,
            },
          },
        },
      },
      quarto: {
        include: {
          roomType: true,
        },
      },
      cama: true,
    },
    orderBy: {
      quarto: {
        code: 'asc',
      },
    },
  });

  // 3. Formata os dados para serem mais fáceis de usar no frontend
  const formattedData = alocacoes.map((aloc) => ({
    alocacaoId: aloc.id,
    reservaId: aloc.reservaId,
    quartoId: aloc.quartoId,
    quartoCode: aloc.quarto.code,
    quartoTipo: aloc.quarto.roomType.name,
    camaId: aloc.camaId,
    camaCode: aloc.cama?.code,
    checkinDate: aloc.checkinDate,
    checkoutDate: aloc.checkoutDate,
    hospedePrincipal:
      aloc.reserva.hospedes[0]?.hospede.fullName || 'Hóspede não definido',
  }));

  return formattedData;
}
