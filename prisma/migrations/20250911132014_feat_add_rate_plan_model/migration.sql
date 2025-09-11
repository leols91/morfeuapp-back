-- CreateTable
CREATE TABLE "morfeu"."rate_plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chargeScope" TEXT NOT NULL,
    "periodicity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "rate_plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "morfeu"."rate_plan" ADD CONSTRAINT "rate_plan_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;
