-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "district" TEXT NOT NULL DEFAULT 'Update_Later',
ADD COLUMN     "fullAddress" TEXT NOT NULL DEFAULT 'Update_Later';
