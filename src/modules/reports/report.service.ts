    import { prisma } from '../../core/database/prisma.js';
    import { Decimal } from '@prisma/client/runtime/library';

    // Gera o relatório de receita diária
    export async function getDailyRevenueReportService(
      pousadaId: string,
      startDate: Date,
      endDate: Date,
      userId: string,
    ) {
      const userHasAccess = await prisma.usuarioPousada.findUnique({
        where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
      });
      if (!userHasAccess) {
        throw new Error('Acesso negado.');
      }

      const dailyTotals = await prisma.folioEntry.groupBy({
        by: ['createdAt'],
        where: {
          folio: { reserva: { pousadaId: pousadaId } },
          deletedAt: null,
          createdAt: { gte: startDate, lte: endDate },
          kind: { not: 'adjustment' },
        },
        _sum: { total: true },
        orderBy: { createdAt: 'asc' },
      });

      return dailyTotals.map((item) => ({
        date: item.createdAt.toISOString().split('T')[0],
        totalRevenue: item._sum.total?.toFixed(2) || '0.00',
      }));
    }

    // --- NOVA FUNÇÃO ---
    // Gera o relatório de saldo de estoque
    export async function getStockBalanceReportService(pousadaId: string, userId: string) {
      // 1. Verificação de Autorização
      const userHasAccess = await prisma.usuarioPousada.findUnique({
        where: { usuarioId_pousadaId: { usuarioId: userId, pousadaId: pousadaId } },
      });
      if (!userHasAccess) {
        throw new Error('Acesso negado.');
      }

      // 2. Busca todos os produtos ativos da pousada
      const produtos = await prisma.produto.findMany({
        where: { pousadaId, deletedAt: null, stockControl: true },
        select: { id: true, name: true, sku: true, unit: true },
      });

      // 3. Busca todas as movimentações de estoque para esses produtos
      const movements = await prisma.stockMovement.groupBy({
        by: ['produtoId', 'typeCode'],
        where: {
          produtoId: { in: produtos.map((p) => p.id) },
          deletedAt: null,
        },
        _sum: {
          quantity: true,
        },
      });

      // 4. Processa os dados para calcular o saldo final
      const report = produtos.map((produto) => {
        const ins =
          movements.find((m) => m.produtoId === produto.id && m.typeCode === 'in')?._sum
            .quantity || new Decimal(0);
        const outs =
          movements.find((m) => m.produtoId === produto.id && m.typeCode === 'out')?._sum
            .quantity || new Decimal(0);
        const adjusts =
          movements.find((m) => m.produtoId === produto.id && m.typeCode === 'adjust')
            ?._sum.quantity || new Decimal(0);

        const balance = ins.minus(outs).add(adjusts);

        return {
          ...produto,
          balance: balance.toFixed(3),
        };
      });

      return report;
    }
    

