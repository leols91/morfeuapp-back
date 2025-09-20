-- AlterTable
ALTER TABLE "morfeu"."reserva" ADD COLUMN     "channelId" TEXT;

-- CreateTable
CREATE TABLE "morfeu"."folio" (
    "id" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "reservaId" TEXT NOT NULL,

    CONSTRAINT "folio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."folio_entry" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "folioId" TEXT NOT NULL,
    "produtoId" TEXT,

    CONSTRAINT "folio_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."sales_channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "defaultCommissionPercent" DECIMAL(6,3) NOT NULL DEFAULT 0,
    "settlementModel" TEXT NOT NULL,
    "commissionScope" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "supplierId" TEXT,

    CONSTRAINT "sales_channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "folio_reservaId_key" ON "morfeu"."folio"("reservaId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_channel_pousadaId_code_key" ON "morfeu"."sales_channel"("pousadaId", "code");

-- AddForeignKey
ALTER TABLE "morfeu"."reserva" ADD CONSTRAINT "reserva_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "morfeu"."sales_channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."folio" ADD CONSTRAINT "folio_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "morfeu"."reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."folio_entry" ADD CONSTRAINT "folio_entry_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "morfeu"."folio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."folio_entry" ADD CONSTRAINT "folio_entry_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "morfeu"."produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."sales_channel" ADD CONSTRAINT "sales_channel_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."sales_channel" ADD CONSTRAINT "sales_channel_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "morfeu"."supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
