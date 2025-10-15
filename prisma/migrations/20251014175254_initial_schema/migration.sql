-- CreateTable
CREATE TABLE "morfeu"."pousada" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "phone" TEXT,
    "notes" TEXT,
    "monthlyProrationMode" TEXT NOT NULL DEFAULT 'actual_days',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pousada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."usuario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."pousada_config" (
    "id" TEXT NOT NULL,
    "configName" TEXT NOT NULL,
    "configValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "pousada_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."user_config" (
    "id" TEXT NOT NULL,
    "userConfigName" TEXT NOT NULL,
    "userConfigValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "user_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."audit_log" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "action" TEXT NOT NULL,
    "diff" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pousadaId" TEXT,
    "usuarioId" TEXT,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."sales_channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "defaultCommissionPercent" DECIMAL(6,3) NOT NULL DEFAULT 0,
    "settlementModel" TEXT NOT NULL,
    "commissionScope" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "supplierId" TEXT,

    CONSTRAINT "sales_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."supplier" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "documentId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "morfeu"."reserva" (
    "id" TEXT NOT NULL,
    "reservationType" TEXT NOT NULL,
    "reservationClass" TEXT NOT NULL,
    "checkinDate" TIMESTAMP(3) NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "channelId" TEXT,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."reserva_hospede" (
    "reservaId" TEXT NOT NULL,
    "hospedeId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reserva_hospede_pkey" PRIMARY KEY ("reservaId","hospedeId")
);

-- CreateTable
CREATE TABLE "morfeu"."reserva_alocacao" (
    "id" TEXT NOT NULL,
    "checkinDate" TIMESTAMP(3) NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL,
    "reservaId" TEXT NOT NULL,
    "quartoId" TEXT NOT NULL,
    "camaId" TEXT,

    CONSTRAINT "reserva_alocacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."folio" (
    "id" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "reservaId" TEXT NOT NULL,

    CONSTRAINT "folio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."folio_entry" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "folioId" TEXT NOT NULL,
    "produtoId" TEXT,

    CONSTRAINT "folio_entry_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "morfeu"."addon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "chargeUnit" TEXT NOT NULL,
    "whenToCharge" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."room_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "occupancyMode" TEXT NOT NULL,
    "baseOccupancy" INTEGER NOT NULL,
    "maxOccupancy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "room_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."quarto" (
    "id" TEXT NOT NULL,
    "pousadaId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "floor" TEXT,
    "description" TEXT,
    "roomStatusCode" TEXT NOT NULL,
    "housekeepingStatusCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "quarto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."cama" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "quartoId" TEXT NOT NULL,

    CONSTRAINT "cama_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."usuario_pousada" (
    "usuarioId" TEXT NOT NULL,
    "pousadaId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_pousada_pkey" PRIMARY KEY ("usuarioId","pousadaId")
);

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

-- CreateTable
CREATE TABLE "morfeu"."rate_rule" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "mon" BOOLEAN NOT NULL DEFAULT true,
    "tue" BOOLEAN NOT NULL DEFAULT true,
    "wed" BOOLEAN NOT NULL DEFAULT true,
    "thu" BOOLEAN NOT NULL DEFAULT true,
    "fri" BOOLEAN NOT NULL DEFAULT true,
    "sat" BOOLEAN NOT NULL DEFAULT true,
    "sun" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "ratePlanId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,

    CONSTRAINT "rate_rule_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "morfeu"."channel_statement" (
    "id" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "channel_statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."channel_commission_accrual" (
    "id" TEXT NOT NULL,
    "baseAmount" DECIMAL(12,2) NOT NULL,
    "commissionPercent" DECIMAL(6,3) NOT NULL,
    "commissionAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "folioEntryId" TEXT NOT NULL,
    "statementId" TEXT,

    CONSTRAINT "channel_commission_accrual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_username_key" ON "morfeu"."usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "morfeu"."usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pousada_config_pousadaId_configName_key" ON "morfeu"."pousada_config"("pousadaId", "configName");

-- CreateIndex
CREATE UNIQUE INDEX "user_config_usuarioId_userConfigName_key" ON "morfeu"."user_config"("usuarioId", "userConfigName");

-- CreateIndex
CREATE UNIQUE INDEX "sales_channel_pousadaId_code_key" ON "morfeu"."sales_channel"("pousadaId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "folio_reservaId_key" ON "morfeu"."folio"("reservaId");

-- CreateIndex
CREATE UNIQUE INDEX "cama_quartoId_code_key" ON "morfeu"."cama"("quartoId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "channel_commission_accrual_folioEntryId_key" ON "morfeu"."channel_commission_accrual"("folioEntryId");

-- AddForeignKey
ALTER TABLE "morfeu"."pousada_config" ADD CONSTRAINT "pousada_config_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."user_config" ADD CONSTRAINT "user_config_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "morfeu"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."audit_log" ADD CONSTRAINT "audit_log_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."audit_log" ADD CONSTRAINT "audit_log_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "morfeu"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."sales_channel" ADD CONSTRAINT "sales_channel_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."sales_channel" ADD CONSTRAINT "sales_channel_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "morfeu"."supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."supplier" ADD CONSTRAINT "supplier_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "morfeu"."cash_account" ADD CONSTRAINT "cash_account_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."cash_ledger" ADD CONSTRAINT "cash_ledger_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "morfeu"."cash_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_payment" ADD CONSTRAINT "ap_payment_apInvoiceId_fkey" FOREIGN KEY ("apInvoiceId") REFERENCES "morfeu"."ap_invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."ap_payment" ADD CONSTRAINT "ap_payment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "morfeu"."cash_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."product_category" ADD CONSTRAINT "product_category_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."produto" ADD CONSTRAINT "produto_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."produto" ADD CONSTRAINT "produto_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "morfeu"."product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."stock_movement" ADD CONSTRAINT "stock_movement_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."stock_movement" ADD CONSTRAINT "stock_movement_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "morfeu"."produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."stock_movement" ADD CONSTRAINT "stock_movement_typeCode_fkey" FOREIGN KEY ("typeCode") REFERENCES "morfeu"."stock_movement_type"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."hospede" ADD CONSTRAINT "hospede_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."reserva" ADD CONSTRAINT "reserva_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."reserva" ADD CONSTRAINT "reserva_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "morfeu"."sales_channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."reserva_hospede" ADD CONSTRAINT "reserva_hospede_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "morfeu"."reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."reserva_hospede" ADD CONSTRAINT "reserva_hospede_hospedeId_fkey" FOREIGN KEY ("hospedeId") REFERENCES "morfeu"."hospede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."reserva_alocacao" ADD CONSTRAINT "reserva_alocacao_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "morfeu"."reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."reserva_alocacao" ADD CONSTRAINT "reserva_alocacao_quartoId_fkey" FOREIGN KEY ("quartoId") REFERENCES "morfeu"."quarto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."reserva_alocacao" ADD CONSTRAINT "reserva_alocacao_camaId_fkey" FOREIGN KEY ("camaId") REFERENCES "morfeu"."cama"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."folio" ADD CONSTRAINT "folio_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "morfeu"."reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."folio_entry" ADD CONSTRAINT "folio_entry_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "morfeu"."folio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."folio_entry" ADD CONSTRAINT "folio_entry_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "morfeu"."produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."payment" ADD CONSTRAINT "payment_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "morfeu"."folio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."payment" ADD CONSTRAINT "payment_methodCode_fkey" FOREIGN KEY ("methodCode") REFERENCES "morfeu"."payment_method"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."payment" ADD CONSTRAINT "payment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "morfeu"."cash_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."addon" ADD CONSTRAINT "addon_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."room_type" ADD CONSTRAINT "room_type_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."quarto" ADD CONSTRAINT "quarto_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."quarto" ADD CONSTRAINT "quarto_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "morfeu"."room_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."quarto" ADD CONSTRAINT "quarto_roomStatusCode_fkey" FOREIGN KEY ("roomStatusCode") REFERENCES "morfeu"."room_status"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."quarto" ADD CONSTRAINT "quarto_housekeepingStatusCode_fkey" FOREIGN KEY ("housekeepingStatusCode") REFERENCES "morfeu"."housekeeping_status"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."cama" ADD CONSTRAINT "cama_quartoId_fkey" FOREIGN KEY ("quartoId") REFERENCES "morfeu"."quarto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."usuario_pousada" ADD CONSTRAINT "usuario_pousada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "morfeu"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."usuario_pousada" ADD CONSTRAINT "usuario_pousada_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."rate_plan" ADD CONSTRAINT "rate_plan_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."rate_rule" ADD CONSTRAINT "rate_rule_ratePlanId_fkey" FOREIGN KEY ("ratePlanId") REFERENCES "morfeu"."rate_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."rate_rule" ADD CONSTRAINT "rate_rule_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "morfeu"."room_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."child_pricing_policy" ADD CONSTRAINT "child_pricing_policy_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."child_pricing_band" ADD CONSTRAINT "child_pricing_band_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "morfeu"."child_pricing_policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_statement" ADD CONSTRAINT "channel_statement_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_statement" ADD CONSTRAINT "channel_statement_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "morfeu"."sales_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_commission_accrual" ADD CONSTRAINT "channel_commission_accrual_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "morfeu"."sales_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_commission_accrual" ADD CONSTRAINT "channel_commission_accrual_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "morfeu"."reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_commission_accrual" ADD CONSTRAINT "channel_commission_accrual_folioEntryId_fkey" FOREIGN KEY ("folioEntryId") REFERENCES "morfeu"."folio_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."channel_commission_accrual" ADD CONSTRAINT "channel_commission_accrual_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "morfeu"."channel_statement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
