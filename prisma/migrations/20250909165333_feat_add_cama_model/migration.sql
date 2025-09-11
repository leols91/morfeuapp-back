-- DropIndex
DROP INDEX "morfeu"."quarto_pousadaId_code_key";

-- CreateTable
CREATE TABLE "morfeu"."cama" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "quartoId" TEXT NOT NULL,

    CONSTRAINT "cama_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cama_quartoId_code_key" ON "morfeu"."cama"("quartoId", "code");

-- AddForeignKey
ALTER TABLE "morfeu"."cama" ADD CONSTRAINT "cama_quartoId_fkey" FOREIGN KEY ("quartoId") REFERENCES "morfeu"."quarto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
