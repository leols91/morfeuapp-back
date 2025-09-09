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

    CONSTRAINT "pousada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."room_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "occupancyMode" TEXT NOT NULL,
    "baseOccupancy" INTEGER NOT NULL,
    "maxOccupancy" INTEGER NOT NULL,
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "room_type_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."usuario_pousada" (
    "usuarioId" TEXT NOT NULL,
    "pousadaId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_pousada_pkey" PRIMARY KEY ("usuarioId","pousadaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_username_key" ON "morfeu"."usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "morfeu"."usuario"("email");

-- AddForeignKey
ALTER TABLE "morfeu"."room_type" ADD CONSTRAINT "room_type_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."usuario_pousada" ADD CONSTRAINT "usuario_pousada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "morfeu"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."usuario_pousada" ADD CONSTRAINT "usuario_pousada_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;
