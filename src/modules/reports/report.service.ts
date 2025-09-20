    import { prisma } from '../../core/database/prisma.js';

    // Gera o relatório de receita diária
    export async function getDailyRevenueReportService(
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

      // 2. Usamos a função de agregação do Prisma para somar os totais
      const dailyTotals = await prisma.folioEntry.groupBy({
        by: ['createdAt'], // Agrupar por data de criação do lançamento
        where: {
          folio: {
            reserva: {
              pousadaId: pousadaId,
            },
          },
          deletedAt: null,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          // Excluímos ajustes negativos para não contar como receita
          kind: { not: 'adjustment' },
        },
        _sum: {
          total: true, // Somar a coluna 'total'
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // 3. Formata os dados para um formato mais amigável
      const report = dailyTotals.map((item) => ({
        date: item.createdAt.toISOString().split('T')[0], // Formata a data para YYYY-MM-DD
        totalRevenue: item._sum.total?.toFixed(2) || '0.00',
      }));

      return report;
    }
    