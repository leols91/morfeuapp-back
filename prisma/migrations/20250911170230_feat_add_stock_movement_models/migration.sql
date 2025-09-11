-- CreateTable
CREATE TABLE "morfeu"."stock_movement_type" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "stock_movement_type_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "morfeu"."stock_movement" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unitCost" DECIMAL(12,2),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "typeCode" TEXT NOT NULL,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "morfeu"."stock_movement" ADD CONSTRAINT "stock_movement_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."stock_movement" ADD CONSTRAINT "stock_movement_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "morfeu"."produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."stock_movement" ADD CONSTRAINT "stock_movement_typeCode_fkey" FOREIGN KEY ("typeCode") REFERENCES "morfeu"."stock_movement_type"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
