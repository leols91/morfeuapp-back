-- CreateTable
CREATE TABLE "morfeu"."payment_method" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "morfeu"."payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "folioId" TEXT NOT NULL,
    "methodCode" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "morfeu"."payment" ADD CONSTRAINT "payment_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "morfeu"."folio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."payment" ADD CONSTRAINT "payment_methodCode_fkey" FOREIGN KEY ("methodCode") REFERENCES "morfeu"."payment_method"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."payment" ADD CONSTRAINT "payment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "morfeu"."cash_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
