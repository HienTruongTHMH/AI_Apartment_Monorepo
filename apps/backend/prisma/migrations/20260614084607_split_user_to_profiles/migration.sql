/*
  Warnings:

  - The values [Faild] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('Pending', 'Paid', 'Failed');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- DropForeignKey
ALTER TABLE "Apartment" DROP CONSTRAINT "Apartment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewApartment" DROP CONSTRAINT "ReviewApartment_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewTenant" DROP CONSTRAINT "ReviewTenant_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewTenant" DROP CONSTRAINT "ReviewTenant_tenantId_fkey";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantProfile" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "identityCard" TEXT,
    "job" TEXT,

    CONSTRAINT "TenantProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerProfile" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "taxCode" TEXT,
    "bankAccount" TEXT,

    CONSTRAINT "OwnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TenantProfile_accountId_key" ON "TenantProfile"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantProfile_identityCard_key" ON "TenantProfile"("identityCard");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerProfile_accountId_key" ON "OwnerProfile"("accountId");

-- 1. Bơm dữ liệu cốt lõi từ User sang Account
INSERT INTO "Account" ("id", "email", "hashedPassword", "phone", "isActive", "createdAt", "updatedAt")
SELECT "id", "email", "hashedPassword", "phone", true, "createdAt", "updatedAt"
FROM "User";

-- 2. Lọc những người là Tenant (hoặc Viewer) để tạo TenantProfile
-- Hàm gen_random_uuid() của PostgreSQL sẽ tự động sinh ID mới cho Profile
INSERT INTO "TenantProfile" ("id", "accountId", "fullName")
SELECT gen_random_uuid(), "id", "name"
FROM "User"
WHERE "role" IN ('Tenant', 'Viewer');

-- 3. Lọc những người là Owner để tạo OwnerProfile
INSERT INTO "OwnerProfile" ("id", "accountId", "fullName")
SELECT gen_random_uuid(), "id", "name"
FROM "User"
WHERE "role" = 'Owner';

-- 4. BƯỚC QUAN TRỌNG NHẤT: Nối lại Khóa Ngoại (Foreign Keys)
-- Hiện tại bảng Apartment đang lưu ownerId là ID của User (nay là Account ID).
-- Ta phải UPDATE nó thành ID của bảng OwnerProfile vừa được tạo ở bước 3.
UPDATE "Apartment"
SET "ownerId" = op."id"
FROM "OwnerProfile" op
WHERE "Apartment"."ownerId" = op."accountId";

-- Tương tự cho bảng Contract: Cập nhật lại ID cho cả Tenant và Owner
UPDATE "Contract"
SET "ownerId" = op."id"
FROM "OwnerProfile" op
WHERE "Contract"."ownerId" = op."accountId";

UPDATE "Contract"
SET "tenantId" = tp."id"
FROM "TenantProfile" tp
WHERE "Contract"."tenantId" = tp."accountId";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Roles";

-- AddForeignKey
ALTER TABLE "TenantProfile" ADD CONSTRAINT "TenantProfile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerProfile" ADD CONSTRAINT "OwnerProfile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "OwnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "OwnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewApartment" ADD CONSTRAINT "ReviewApartment_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "TenantProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewTenant" ADD CONSTRAINT "ReviewTenant_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "OwnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewTenant" ADD CONSTRAINT "ReviewTenant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "TenantProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
