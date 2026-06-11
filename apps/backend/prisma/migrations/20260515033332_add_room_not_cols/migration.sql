-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "note" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "room_number" INTEGER NOT NULL DEFAULT 1;
