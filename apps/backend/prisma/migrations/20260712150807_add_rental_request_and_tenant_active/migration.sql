/*
  Warnings:

  - Added the required column `deposit` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentPrice` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RentalRequestStatus" AS ENUM ('Pending', 'Accepted', 'Rejected', 'Cancelled');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContractStatus" ADD VALUE 'TerminationRequested';
ALTER TYPE "ContractStatus" ADD VALUE 'RejectedByTenant';

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "deposit" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "rentPrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "signAt" TIMESTAMP(3),
ADD COLUMN     "terminateAt" TIMESTAMP(3),
ADD COLUMN     "terminationReason" TEXT,
ADD COLUMN     "terms" TEXT;

-- AlterTable
ALTER TABLE "TenantProfile" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "RentalRequest" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "RentalRequestStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RentalRequest_id_key" ON "RentalRequest"("id");

-- AddForeignKey
ALTER TABLE "RentalRequest" ADD CONSTRAINT "RentalRequest_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalRequest" ADD CONSTRAINT "RentalRequest_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
