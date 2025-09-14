-- CreateTable
CREATE TABLE "morfeu"."cash_account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeCode" TEXT NOT NULL,
    "openingBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "cash_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."cash_ledger" (
    "id" TEXT NOT NULL,
    "entryType" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "cash_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."ap_payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "apInvoiceId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "ap_payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "morfeu"."cash_account" ADD CONSTRAINT "cash_account_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."cash_ledger" ADD CONSTRAINT "cash_ledger_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "morfeu"."cash_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_payment" ADD CONSTRAINT "ap_payment_apInvoiceId_fkey" FOREIGN KEY ("apInvoiceId") REFERENCES "morfeu"."ap_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_payment" ADD CONSTRAINT "ap_payment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "morfeu"."cash_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
