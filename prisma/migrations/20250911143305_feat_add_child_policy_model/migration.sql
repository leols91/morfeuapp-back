-- CreateTable
CREATE TABLE "morfeu"."child_pricing_policy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "allowInShared" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "child_pricing_policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."child_pricing_band" (
    "id" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "chargeMode" TEXT NOT NULL,
    "percentValue" DECIMAL(6,3),
    "fixedAmount" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "policyId" TEXT NOT NULL,

    CONSTRAINT "child_pricing_band_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "morfeu"."child_pricing_policy" ADD CONSTRAINT "child_pricing_policy_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."child_pricing_band" ADD CONSTRAINT "child_pricing_band_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "morfeu"."child_pricing_policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
