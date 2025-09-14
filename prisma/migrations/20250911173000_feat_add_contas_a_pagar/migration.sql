-- CreateTable
CREATE TABLE "morfeu"."ap_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "ap_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."ap_invoice" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,

    CONSTRAINT "ap_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."ap_invoice_item" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unitCost" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "apInvoiceId" TEXT NOT NULL,
    "apCategoryId" TEXT NOT NULL,
    "produtoId" TEXT,

    CONSTRAINT "ap_invoice_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "morfeu"."ap_category" ADD CONSTRAINT "ap_category_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_invoice" ADD CONSTRAINT "ap_invoice_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_invoice" ADD CONSTRAINT "ap_invoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "morfeu"."supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_invoice_item" ADD CONSTRAINT "ap_invoice_item_apInvoiceId_fkey" FOREIGN KEY ("apInvoiceId") REFERENCES "morfeu"."ap_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_invoice_item" ADD CONSTRAINT "ap_invoice_item_apCategoryId_fkey" FOREIGN KEY ("apCategoryId") REFERENCES "morfeu"."ap_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_invoice_item" ADD CONSTRAINT "ap_invoice_item_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "morfeu"."produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
