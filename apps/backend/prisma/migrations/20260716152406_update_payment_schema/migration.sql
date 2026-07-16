-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Rent', 'Deposit', 'Penalty', 'Other');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BankTransfer', 'Cash', 'System');

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'Overdue';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "method" "PaymentMethod",
ADD COLUMN     "type" "PaymentType" NOT NULL DEFAULT 'Rent',
ALTER COLUMN "paymentDate" DROP NOT NULL,
ALTER COLUMN "paymentDate" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Payment_contractId_idx" ON "Payment"("contractId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
