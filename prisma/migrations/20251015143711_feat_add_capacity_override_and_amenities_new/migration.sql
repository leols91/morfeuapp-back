-- AlterTable
ALTER TABLE "morfeu"."quarto" ADD COLUMN     "baseOccupancy" INTEGER,
ADD COLUMN     "maxOccupancy" INTEGER;

-- CreateTable
CREATE TABLE "morfeu"."amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pousadaId" TEXT NOT NULL,

    CONSTRAINT "amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "morfeu"."room_type_amenity" (
    "roomTypeId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "room_type_amenity_pkey" PRIMARY KEY ("roomTypeId","amenityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "amenity_pousadaId_name_key" ON "morfeu"."amenity"("pousadaId", "name");

-- AddForeignKey
ALTER TABLE "morfeu"."amenity" ADD CONSTRAINT "amenity_pousadaId_fkey" FOREIGN KEY ("pousadaId") REFERENCES "morfeu"."pousada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."room_type_amenity" ADD CONSTRAINT "room_type_amenity_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "morfeu"."room_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "morfeu"."room_type_amenity" ADD CONSTRAINT "room_type_amenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "morfeu"."amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
