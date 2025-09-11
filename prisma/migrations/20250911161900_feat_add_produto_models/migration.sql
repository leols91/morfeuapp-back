-- CreateTable
CREATE TABLE "morfeu"."product_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."produto" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "costPrice" DECIMAL(12,2),
    "salePrice" DECIMAL(12,2) NOT NULL,
    "stockControl" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "morfeu"."product_category" ADD CONSTRAINT "product_category_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."produto" ADD CONSTRAINT "produto_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."produto" ADD CONSTRAINT "produto_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "morfeu"."product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
