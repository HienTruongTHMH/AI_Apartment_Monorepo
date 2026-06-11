-- CreateEnum
CREATE TYPE "ApartmentTypes" AS ENUM ('Normal', 'Studio', 'Officetel', 'Shophouse', 'Penthouse', 'Duplex', 'SkyVilla');

-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "bathroom" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "bedroom" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "kitchen" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "livingroom" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "type" "ApartmentTypes" NOT NULL DEFAULT 'Normal';
