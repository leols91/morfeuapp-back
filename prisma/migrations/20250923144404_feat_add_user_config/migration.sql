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

-- CreateIndex
CREATE UNIQUE INDEX "pousada_config_pousadaId_configName_key" ON "morfeu"."pousada_config"("pousadaId", "configName");

-- CreateIndex
CREATE UNIQUE INDEX "user_config_usuarioId_userConfigName_key" ON "morfeu"."user_config"("usuarioId", "userConfigName");

-- AddForeignKey
ALTER TABLE "morfeu"."pousada_config" ADD CONSTRAINT "pousada_config_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."user_config" ADD CONSTRAINT "user_config_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "morfeu"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
