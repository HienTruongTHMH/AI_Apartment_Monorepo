-- AlterTable
ALTER TABLE "RentalRequest" ALTER COLUMN "message" DROP NOT NULL,
ADD CONSTRAINT "RentalRequest_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "RentalRequest_id_key";

-- CreateIndex
CREATE INDEX "RentalRequest_accountId_idx" ON "RentalRequest"("accountId");

-- CreateIndex
CREATE INDEX "RentalRequest_apartmentId_idx" ON "RentalRequest"("apartmentId");
