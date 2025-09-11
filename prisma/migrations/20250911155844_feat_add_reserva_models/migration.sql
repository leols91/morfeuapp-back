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

-- AddForeignKey
ALTER TABLE "morfeu"."reserva" ADD CONSTRAINT "reserva_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
