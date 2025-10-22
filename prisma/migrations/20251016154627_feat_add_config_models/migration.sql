-- CreateTable
CREATE TABLE "morfeu"."quarto_amenity" (
    "quartoId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "quarto_amenity_pkey" PRIMARY KEY ("quartoId","amenityId")
);

-- AddForeignKey
ALTER TABLE "morfeu"."quarto_amenity" ADD CONSTRAINT "quarto_amenity_quartoId_fkey" FOREIGN KEY ("quartoId") REFERENCES "morfeu"."quarto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."quarto_amenity" ADD CONSTRAINT "quarto_amenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "morfeu"."amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
