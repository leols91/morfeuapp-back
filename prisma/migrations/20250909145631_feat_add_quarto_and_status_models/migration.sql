-- CreateTable
CREATE TABLE "morfeu"."room_status" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "room_status_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "morfeu"."housekeeping_status" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "housekeeping_status_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "morfeu"."quarto" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "floor" TEXT,
    "description" TEXT,
    "pousadaId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "roomStatusCode" TEXT NOT NULL,
    "housekeepingStatusCode" TEXT NOT NULL,

    CONSTRAINT "quarto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quarto_pousadaId_code_key" ON "morfeu"."quarto"("pousadaId", "code");

-- AddForeignKey
ALTER TABLE "morfeu"."quarto" ADD CONSTRAINT "quarto_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."quarto" ADD CONSTRAINT "quarto_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "morfeu"."room_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."quarto" ADD CONSTRAINT "quarto_roomStatusCode_fkey" FOREIGN KEY ("roomStatusCode") REFERENCES "morfeu"."room_status"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."quarto" ADD CONSTRAINT "quarto_housekeepingStatusCode_fkey" FOREIGN KEY ("housekeepingStatusCode") REFERENCES "morfeu"."housekeeping_status"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
