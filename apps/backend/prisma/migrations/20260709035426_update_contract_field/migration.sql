-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('Draft', 'PendingTenantSignature', 'Active', 'Expired', 'Terminated');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "contractStatus" "ContractStatus" NOT NULL DEFAULT 'Draft';
