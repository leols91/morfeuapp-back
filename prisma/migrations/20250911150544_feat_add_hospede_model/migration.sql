-- CreateTable
CREATE TABLE "morfeu"."hospede" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "documentId" TEXT,
    "documentType" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "address" JSONB,
    "notes" TEXT,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "hospede_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "morfeu"."hospede" ADD CONSTRAINT "hospede_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;
