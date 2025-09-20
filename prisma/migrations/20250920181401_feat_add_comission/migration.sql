-- CreateTable
CREATE TABLE "morfeu"."channel_statement" (
    "id" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "channel_statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."channel_commission_accrual" (
    "id" TEXT NOT NULL,
    "baseAmount" DECIMAL(12,2) NOT NULL,
    "commissionPercent" DECIMAL(6,3) NOT NULL,
    "commissionAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "folioEntryId" TEXT NOT NULL,
    "statementId" TEXT,

    CONSTRAINT "channel_commission_accrual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_commission_accrual_folioEntryId_key" ON "morfeu"."channel_commission_accrual"("folioEntryId");

-- AddForeignKey
ALTER TABLE "morfeu"."channel_statement" ADD CONSTRAINT "channel_statement_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_statement" ADD CONSTRAINT "channel_statement_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "morfeu"."sales_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_commission_accrual" ADD CONSTRAINT "channel_commission_accrual_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "morfeu"."sales_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_commission_accrual" ADD CONSTRAINT "channel_commission_accrual_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "morfeu"."reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_commission_accrual" ADD CONSTRAINT "channel_commission_accrual_folioEntryId_fkey" FOREIGN KEY ("folioEntryId") REFERENCES "morfeu"."folio_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_commission_accrual" ADD CONSTRAINT "channel_commission_accrual_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "morfeu"."channel_statement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
